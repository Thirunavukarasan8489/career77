import { NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || "career77/resumes";
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateUploadSignature(timestamp, folder);

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
