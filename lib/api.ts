import { BACKEND_URL } from "./constants";

const PROXY_URL = BACKEND_URL;

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  isFormData?: boolean;
}

type ApiWrapper = {
  success?: boolean;
  message?: string;
  data?: unknown;
  errors?: unknown;
};

function getRoleFromJwt(token: string): string {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return "";

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    let decoded = "";
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      decoded = window.atob(padded);
    } else {
      decoded = Buffer.from(padded, "base64").toString("utf-8");
    }

    const payload = JSON.parse(decoded) as Record<string, unknown>;
    const role =
      (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string) ||
      (payload["role"] as string) ||
      "";

    return typeof role === "string" ? role : "";
  } catch {
    return "";
  }
}

function resolveAuthToken(explicitToken?: string): string {
  const candidate = (explicitToken || "").trim();
  if (candidate && candidate !== "undefined" && candidate !== "null") {
    return candidate.replace(/^Bearer\s+/i, "").trim();
  }

  if (typeof window !== "undefined") {
    const stored = (window.localStorage.getItem("auth_token") || "").trim();
    if (stored && stored !== "undefined" && stored !== "null") {
      return stored.replace(/^Bearer\s+/i, "").trim();
    }
  }

  return "";
}

function unwrapApiResponse<T>(payload: unknown): T {
  if (payload && typeof payload === "object") {
    const wrapper = payload as ApiWrapper;
    const hasWrapperShape =
      "success" in wrapper || "message" in wrapper || "data" in wrapper || "errors" in wrapper;

    if (hasWrapperShape) {
      if (wrapper.success === false) {
        throw new Error(
          wrapper.message ||
          (wrapper.errors ? JSON.stringify(wrapper.errors) : "API returned an unsuccessful response"),
        );
      }

      if (wrapper.data !== undefined) {
        return wrapper.data as T;
      }
    }
  }

  return payload as T;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, token, isFormData = false } = options;
  const authToken = resolveAuthToken(token);

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  } else if (endpoint.includes("/api/Admin") || method !== "GET") {
    console.warn(`[v0] No token provided for protected endpoint: ${endpoint}`);
  }

  if (!isFormData && body) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  // Route through our local proxy to avoid CORS issues
  const response = await fetch(`${PROXY_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    const tokenRole = authToken ? getRoleFromJwt(authToken) : "";

    if (response.status === 401) {
      errorMessage = "Unauthorized: your session is invalid or expired. Please login again.";
    }

    if (response.status === 403) {
      errorMessage = tokenRole
        ? `Forbidden: your role (${tokenRole}) is not allowed to perform this action.`
        : "Forbidden: you do not have permission to perform this action.";
    }

    try {
      const errorText = await response.text();
      // Debug logs for 403
      if (response.status === 403) {
        console.error(`[API Debug] 403 Forbidden: ${method} ${PROXY_URL}${endpoint}`);
        console.error(`[API Debug] Token used: ${authToken ? `${authToken.substring(0, 10)}...` : "NONE"}`);
        console.error(`[API Debug] Raw error body: ${errorText}`);
      }

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || (errorData.errors ? JSON.stringify(errorData.errors) : errorMessage);
      } catch {
        errorMessage = errorText || errorMessage;
      }
    } catch {
      // Failed to read text
    }
    throw new Error(errorMessage);
  }

  // Handle successful responses (JSON, text, or empty)
  const contentType = response.headers.get("Content-Type") || "";
  const text = await response.text();

  if (contentType.includes("application/json") || text.trim().startsWith("{") || text.trim().startsWith("[")) {
    if (!text) return {} as T;
    try {
      return unwrapApiResponse<T>(JSON.parse(text));
    } catch (e) {
      return text as unknown as T;
    }
  } else {
    try {
      return unwrapApiResponse<T>(JSON.parse(text));
    } catch {
      return text as unknown as T;
    }
  }
}

// Auth
export async function login(username: string, password: string) {
  // Use strictly what Swagger requires: lowercase username/password
  const data = await apiRequest<any>("/api/Account/login", {
    method: "POST",
    body: { username, password },
  });

  // Handle various token response shapes robustly
  let token = "";
  if (typeof data === "string") {
    token = data;
  } else if (data) {
    // Check all possible common token property names, including wrapped 'data' property
    token = data.token ||
      data.Token ||
      data.accessToken ||
      data.AccessToken ||
      data.data?.token ||
      data.data?.Token ||
      data.jwt ||
      data.JWT ||
      (typeof data.data === "string" ? data.data : "");
  }

  // Sanitize token: remove "Bearer " prefix if present and trim
  if (token && typeof token === "string") {
    token = token.replace(/^Bearer\s+/i, "").trim();
  }

  if (token && token !== "undefined" && token !== "null") {
    console.log(`[API] Login successful. Captured token length: ${token.length}`);
  } else {
    console.warn(`[API] Login response parsed but no token found in keys. Content keys:`, Object.keys(data || {}));
    token = "";
  }

  return { token };
}

// Sections
export async function getSections(lang: string = "en") {
  return apiRequest<Section[]>(`/api/Section?lang=${lang}`);
}

export async function getSectionById(id: number, lang: string = "en") {
  return apiRequest<Section>(`/api/Section/${id}?lang=${lang}`);
}

export async function createSection(data: CreateSectionPayload, token: string) {
  // Backend expects "Translations" (capitalized) in some configurations, or sticking to interface.
  // Let's ensure the payload key matches backend expectation. 
  // If the backend uses default binding, it might be case-insensitive, but let's be sure.
  return apiRequest<Section>("/api/Section", {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateSection(data: UpdateSectionPayload, token: string) {
  return apiRequest<Section>("/api/Section", {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deleteSection(id: number, token: string) {
  return apiRequest<void>(`/api/Section/${id}`, {
    method: "DELETE",
    token,
  });
}

// Products

// Helper to normalize product images
function normalizeProduct(product: any): Product {
  const rawImages = product?.images ?? product?.Images ?? []

  return {
    id: product?.id ?? product?.Id ?? 0,
    name: product?.name ?? product?.Name ?? "",
    mainDesc: product?.mainDesc ?? product?.MainDesc ?? "",
    subDesc: product?.subDesc ?? product?.SubDesc ?? "",
    price: product?.price ?? product?.Price ?? 0,
    sectionId: product?.sectionId ?? product?.SectionId ?? 0,
    sectionName: product?.sectionName ?? product?.SectionName ?? undefined,
    images: rawImages.map((img: any) => ({
      id: img?.id ?? img?.Id ?? 0,
      url: img?.url ?? img?.relativePath ?? img?.RelativePath ?? "",
      productId: img?.productId ?? img?.ProductId ?? 0,
    })),
  };
}

// Products
export async function getProducts(
  params: {
    sectionId?: number;
    pageNumber?: number;
    pageSize?: number;
    lang?: string;
  } = {},
  token?: string,
) {
  const searchParams = new URLSearchParams();
  if (params.sectionId)
    searchParams.append("sectionId", params.sectionId.toString());
  if (params.pageNumber)
    searchParams.append("pageNumber", params.pageNumber.toString());
  if (params.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  searchParams.append("lang", params.lang || "en");

  const response = await apiRequest<any>(
    `/api/Product?${searchParams.toString()}`,
    {
      token,
    },
  );

  if (Array.isArray(response)) {
    const items = response.map(normalizeProduct)
    return {
      items,
      totalCount: items.length,
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || items.length,
      totalPages: items.length > 0 ? 1 : 0,
    } as ProductListResponse
  }

  const rawItems = response?.items ?? response?.Items ?? []
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeProduct) : []

  return {
    items,
    totalCount: response?.totalCount ?? response?.TotalCount ?? items.length,
    pageNumber: response?.pageNumber ?? response?.PageNumber ?? (params.pageNumber || 1),
    pageSize: response?.pageSize ?? response?.PageSize ?? (params.pageSize || items.length),
    totalPages:
      response?.totalPages ??
      response?.TotalPages ??
      (items.length > 0 ? 1 : 0),
  } as ProductListResponse
}

export async function getProductById(id: number, lang: string = "en") {
  const product = await apiRequest<Product>(`/api/Product/${id}?lang=${lang}`);
  return normalizeProduct(product);
}

export async function getProductFull(id: number, token?: string) {
  const product = await apiRequest<any>(`/api/Product/full/${id}`, {
    token,
  });

  return {
    id: product?.id ?? product?.Id ?? 0,
    price: product?.price ?? product?.Price ?? 0,
    sectionId: product?.sectionId ?? product?.SectionId ?? 0,
    translations: (product?.translations ?? product?.Translations ?? []).map((tr: any) => ({
      id: tr?.id ?? tr?.Id ?? 0,
      languageCode: tr?.languageCode ?? tr?.LanguageCode ?? "",
      name: tr?.name ?? tr?.Name ?? "",
      mainDesc: tr?.mainDesc ?? tr?.MainDesc ?? "",
      subDesc: tr?.subDesc ?? tr?.SubDesc ?? "",
      productId: tr?.productId ?? tr?.ProductId ?? 0,
    })),
    images: (product?.images ?? product?.Images ?? []).map((img: any) => ({
      id: img?.id ?? img?.Id ?? 0,
      url: img?.url ?? img?.relativePath ?? img?.RelativePath ?? "",
      productId: img?.productId ?? img?.ProductId ?? 0,
    })),
  } as ProductFull
}

export async function createProduct(formData: FormData, token: string) {
  return apiRequest<Product>("/api/Product", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}

export async function updateProduct(formData: FormData, token: string) {
  return apiRequest<Product>("/api/Product", {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
}

export async function deleteProduct(id: number, token: string) {
  return apiRequest<void>(`/api/Product/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function deleteProductImage(imageId: number, token: string) {
  return apiRequest<void>(`/api/Product/DeleteImage/${imageId}`, {
    method: "DELETE",
    token,
  });
}

// Product Translations
export async function addProductTranslation(
  productId: number,
  data: ProductTranslationDto,
  token: string,
) {
  return apiRequest<ProductTranslation>(
    `/api/Product/${productId}/translation`,
    {
      method: "POST",
      body: {
        ...data,
        productId,
      },
      token,
    },
  );
}

export async function updateProductTranslation(
  data: ProductTranslationDto,
  token: string,
) {
  return apiRequest<ProductTranslation>("/api/Product/translation", {
    method: "PUT",
    body: data,
    token,
  });
}

// Admins
export async function getAdmins(token: string) {
  return apiRequest<Admin[]>("/api/Admin", {
    token,
  });
}

export async function registerAdmin(data: CreateAdminDto, token: string) {
  return apiRequest<Admin>("/api/Admin/Register", {
    method: "POST",
    body: {
      username: data.username,
      password: data.password,
      role: 1,
    },
    token,
  });
}

export async function updateAdminRole(data: UpdateAdminRoleDto, token: string) {
  return apiRequest<void>("/api/Admin/UpdateRole", {
    method: "PUT",
    body: {
      id: data.id,
      role: data.role
    },
    token,
  });
}

export async function deleteAdmin(id: number, token: string) {
  return apiRequest<void>(`/api/Admin/${id}`, {
    method: "DELETE",
    token,
  });
}

// ProjectCards
export async function getProjectCards(lang: string = "en") {
  return apiRequest<ProjectCard[]>(`/api/ProjectCards?lang=${lang}`);
}

export async function getProjectCardById(id: number, lang: string = "en") {
  return apiRequest<ProjectCard>(`/api/ProjectCards/${id}?lang=${lang}`);
}

export async function createProjectCard(formData: FormData, token: string) {
  return apiRequest<ProjectCard>("/api/ProjectCards", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}

export async function updateProjectCard(formData: FormData, token: string) {
  return apiRequest<ProjectCard>("/api/ProjectCards", {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
}

export async function deleteProjectCard(id: number, token: string) {
  return apiRequest<void>(`/api/ProjectCards/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function getProjectCardFull(id: number, token?: string) {
  return apiRequest<ProjectCardFull>(`/api/ProjectCards/full/${id}`, {
    token,
  });
}

// Customers
export async function getCustomers(lang: string = "en") {
  const data = await apiRequest<any[]>(`/api/Customer?lang=${lang}`);
  return (data || []).map(normalizeCustomer);
}

export async function getCustomerById(id: number, lang: string = "en") {
  const data = await apiRequest<any>(`/api/Customer/${id}?lang=${lang}`);
  return normalizeCustomer(data);
}

export async function createCustomer(data: CreateCustomerDto, token: string) {
  const created = await apiRequest<any>("/api/Customer", {
    method: "POST",
    body: data,
    token,
  });
  return normalizeCustomer(created);
}

export async function updateCustomer(data: UpdateCustomerDto, token: string) {
  const updated = await apiRequest<any>("/api/Customer", {
    method: "PUT",
    body: data,
    token,
  });
  return normalizeCustomer(updated);
}

export async function deleteCustomer(id: number, token: string) {
  return apiRequest<void>(`/api/Customer/${id}`, {
    method: "DELETE",
    token,
  });
}

// Customer Feedback
export async function getCustomerFeedbacks(lang: string = "en") {
  const data = await apiRequest<any[]>(`/api/CustomerFeedback?lang=${lang}`);
  return (data || []).map(normalizeCustomerFeedback);
}

export async function getCustomerFeedbackById(id: number, lang: string = "en") {
  const data = await apiRequest<any>(`/api/CustomerFeedback/${id}?lang=${lang}`);
  return normalizeCustomerFeedback(data);
}

export async function createCustomerFeedback(data: CreateCustomerFeedbackDto, token: string) {
  const created = await apiRequest<any>("/api/CustomerFeedback", {
    method: "POST",
    body: data,
    token,
  });
  return normalizeCustomerFeedback(created);
}

export async function updateCustomerFeedback(data: UpdateCustomerFeedbackDto, token: string) {
  const updated = await apiRequest<any>("/api/CustomerFeedback", {
    method: "PUT",
    body: data,
    token,
  });
  return normalizeCustomerFeedback(updated);
}

export async function deleteCustomerFeedback(id: number, token: string) {
  return apiRequest<void>(`/api/CustomerFeedback/${id}`, {
    method: "DELETE",
    token,
  });
}

// Types
export interface Section {
  id: number;
  name: string;
  translations?: SectionTranslation[];
}

export interface SectionTranslation {
  id: number;
  languageCode: string;
  name: string;
  sectionId: number;
}


export interface CreateSectionPayload {
  nameEn: string;
  nameAr: string;
}

export interface UpdateSectionPayload {
  id: number;
  nameEn: string;
  nameAr: string;
}

export interface Product {
  id: number;
  name: string;
  mainDesc?: string;
  subDesc?: string;
  price: number;
  sectionId: number;
  sectionName?: string;
  images?: ProductImage[];
}

export interface ProductFull {
  id: number;
  price: number;
  sectionId: number;
  translations: ProductTranslation[];
  images: ProductImage[];
}

export interface ProductTranslation {
  id: number;
  languageCode: string;
  name: string;
  mainDesc?: string;
  subDesc?: string;
  productId: number;
}

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

export interface ProductListResponse {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Admin Types
export interface Admin {
  id: number;
  username: string;
  role?: string;
}

export interface CreateAdminDto {
  username: string;
  password: string;
  role?: number;
}

export interface UpdateAdminRoleDto {
  id: number;
  role: "MasterAdmin" | "CreateDeleteAdmin" | "ViewAdmin";
}

export interface ProjectCard {
  id: number;
  imageRelativePath: string;
  title: string;
  location: string;
}

export interface ProjectCardFull {
  id: number;
  imageRelativePath: string;
  translations: ProjectCardTranslation[];
}

export interface ProjectCardTranslation {
  languageCode: string;
  title: string;
  location: string;
}

export interface ProductTranslationDto {
  id?: number;
  languageCode: string;
  name: string;
  mainDesc?: string;
  subDesc?: string;
  productId?: number;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string") {
      return value;
    }
  }
  return "";
}

function pickNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }
  return 0;
}

function normalizeCustomer(raw: any): Customer {
  return {
    id: pickNumber(raw?.id, raw?.Id, raw?.customerId, raw?.CustomerId),
    customerName: pickString(
      raw?.customerName,
      raw?.CustomerName,
      raw?.name,
      raw?.Name,
      raw?.nameEn,
      raw?.NameEn,
      raw?.nameAr,
      raw?.NameAr,
    ),
    customerJob: pickString(
      raw?.customerJob,
      raw?.CustomerJob,
      raw?.job,
      raw?.Job,
      raw?.jobEn,
      raw?.JobEn,
      raw?.jobAr,
      raw?.JobAr,
    ) || undefined,
  };
}

function normalizeCustomerFeedback(raw: any): CustomerFeedback {
  const customerId = pickNumber(
    raw?.customerId,
    raw?.CustomerId,
    raw?.customer?.id,
    raw?.Customer?.Id,
  );

  return {
    id: pickNumber(raw?.id, raw?.Id),
    customerId,
    feedBack: pickString(
      raw?.feedBack,
      raw?.FeedBack,
      raw?.feedback,
      raw?.Feedback,
    ),
    customerName: pickString(
      raw?.customerName,
      raw?.CustomerName,
      raw?.customer?.customerName,
      raw?.customer?.name,
      raw?.customer?.Name,
    ) || undefined,
    customerJob: pickString(
      raw?.customerJob,
      raw?.CustomerJob,
      raw?.customer?.customerJob,
      raw?.customer?.job,
      raw?.customer?.Job,
    ) || undefined,
  };
}

// Customer Types
export interface Customer {
  id: number;
  customerName: string;
  customerJob?: string;
}

export interface CreateCustomerDto {
  nameEn: string;
  jobEn?: string;
  nameAr: string;
  jobAr?: string;
}

export interface UpdateCustomerDto {
  id: number;
  nameEn: string;
  jobEn?: string;
  nameAr: string;
  jobAr?: string;
}

// Customer Feedback Types
export interface CustomerFeedback {
  id: number;
  feedBack: string;
  customerId: number;
  customerName?: string;
  customerJob?: string;
}

export interface CreateCustomerFeedbackDto {
  customerId: number;
  feedbackEn: string;
  feedbackAr: string;
}

export interface UpdateCustomerFeedbackDto {
  id: number;
  customerId: number;
  feedbackEn: string;
  feedbackAr: string;
}
