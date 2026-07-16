import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new Response("Missing file URL", { status: 400 });
  }

  try {
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) {
      const errText = await fileRes.text().catch(() => "");
      return new Response(`Failed to fetch file from storage: Status ${fileRes.status} (${fileRes.statusText}). Cloudinary response: ${errText}`, { status: 500 });
    }

    // Capture the original content type or default to PDF
    let contentType = fileRes.headers.get("content-type") || "application/pdf";
    
    // Cloudinary raw uploads might return application/octet-stream. Override for PDFs
    if (fileUrl.toLowerCase().endsWith(".pdf")) {
      contentType = "application/pdf";
    }

    const fileBuffer = await fileRes.arrayBuffer();

    return new Response(fileBuffer, {
      headers: {
        "Content-Disposition": "inline",
        "Content-Type": contentType,
      },
    });
  } catch (error: any) {
    return new Response(error.message || "Failed to view file", { status: 500 });
  }
}
