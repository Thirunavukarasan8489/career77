import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generates a SHA-1 signature for a signed direct upload to Cloudinary.
 * The client will upload the file directly, passing the signature, api_key, and timestamp.
 */
export function generateUploadSignature(timestamp: number, folder: string) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET environment variable is missing");
  }

  // We sort params alphabetically to calculate signature
  const params = {
    folder,
    timestamp,
  };

  return cloudinary.utils.api_sign_request(params, apiSecret);
}

export { cloudinary };
export default cloudinary;
