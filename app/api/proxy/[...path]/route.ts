import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";

const BASE_URL = BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = "/" + path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BASE_URL}${endpoint}${searchParams ? `?${searchParams}` : ""}`;

  console.log("[v0] Proxy GET:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        Accept: "application/json",
      },
    });

    console.log("[v0] Proxy response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[v0] Proxy error:", errorText);
      return NextResponse.json(
        { error: errorText || `API Error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log("[v0] Proxy fetch error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = "/" + path.join("/");
  const url = `${BASE_URL}${endpoint}`;

  const authHeader = request.headers.get("Authorization");
  const contentType = request.headers.get("Content-Type") || "";

  console.log("[v0] Proxy POST:", url);

  try {
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    let body: BodyInit | undefined;

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      headers["Content-Type"] = "application/json";
      body = await request.text();
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    console.log("[v0] Proxy POST response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[v0] Proxy POST error:", errorText);
      return NextResponse.json(
        { error: errorText || `API Error: ${response.status}` },
        { status: response.status },
      );
    }

    const text = await response.text();
    if (!text) {
      return NextResponse.json({});
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ message: text });
    }
  } catch (error) {
    console.log("[v0] Proxy POST fetch error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = "/" + path.join("/");
  const url = `${BASE_URL}${endpoint}`;

  const authHeader = request.headers.get("Authorization");
  const contentType = request.headers.get("Content-Type") || "";

  console.log("[v0] Proxy PUT:", url);

  try {
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    let body: BodyInit | undefined;

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      headers["Content-Type"] = "application/json";
      body = await request.text();
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    console.log("[v0] Proxy PUT response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[v0] Proxy PUT error:", errorText);
      return NextResponse.json(
        { error: errorText || `API Error: ${response.status}` },
        { status: response.status },
      );
    }

    const text = await response.text();
    if (!text) {
      return NextResponse.json({});
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ message: text });
    }
  } catch (error) {
    console.log("[v0] Proxy PUT fetch error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = "/" + path.join("/");
  const url = `${BASE_URL}${endpoint}`;

  const authHeader = request.headers.get("Authorization");

  console.log("[v0] Proxy DELETE:", url);

  try {
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    console.log("[v0] Proxy DELETE response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[v0] Proxy DELETE error:", errorText);
      return NextResponse.json(
        { error: errorText || `API Error: ${response.status}` },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[v0] Proxy DELETE fetch error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 },
    );
  }
}
