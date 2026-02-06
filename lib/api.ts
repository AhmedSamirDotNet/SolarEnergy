import { BACKEND_URL } from "./constants";

const PROXY_URL = BACKEND_URL;

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  isFormData?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, token, isFormData = false } = options;

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  const data = await response.json().catch(() => ({}));
  return data as T;
}

// Auth
export async function login(username: string, password: string) {
  return apiRequest<{ token: string }>("/api/Account/login", {
    method: "POST",
    body: { username, password },
  });
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
  return {
    ...product,
    images: product.images?.map((img: any) => ({
      id: img.id,
      url: img.url ?? img.relativePath ?? "", // Map relativePath to url if missing
      productId: img.productId
    })) || []
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
) {
  const searchParams = new URLSearchParams();
  if (params.sectionId)
    searchParams.append("sectionId", params.sectionId.toString());
  if (params.pageNumber)
    searchParams.append("pageNumber", params.pageNumber.toString());
  if (params.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  searchParams.append("lang", params.lang || "en");

  const response = await apiRequest<ProductListResponse>(
    `/api/Product?${searchParams.toString()}`,
  );

  // Normalize images in the response
  if (response && response.items) {
    response.items = response.items.map(normalizeProduct);
  }

  return response;
}

export async function getProductById(id: number, lang: string = "en") {
  const product = await apiRequest<Product>(`/api/Product/${id}?lang=${lang}`);
  return normalizeProduct(product);
}

export async function getProductFull(id: number, token?: string) {
  const product = await apiRequest<ProductFull>(`/api/Product/full/${id}`, {
    token,
  });
  if (product) {
    // Normalize images for full product details
    return {
      ...product,
      images: product.images?.map((img: any) => ({
        id: img.id,
        url: img.url ?? img.relativePath ?? "",
        productId: img.productId
      })) || []
    };
  }
  return product;
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
      body: data,
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
    body: data,
    token,
  });
}

export async function updateAdminRole(data: UpdateAdminRoleDto, token: string) {
  return apiRequest<void>("/api/Admin/UpdateRole", {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deleteAdmin(id: number, token: string) {
  return apiRequest<void>(`/api/Admin/${id}`, {
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
}

export interface UpdateAdminRoleDto {
  id: number;
  role: string;
}

export interface ProductTranslationDto {
  id?: number;
  languageCode: string;
  name: string;
  mainDesc?: string;
  subDesc?: string;
  productId?: number;
}
