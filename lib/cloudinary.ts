import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured(): boolean {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return false;
  if (!configured) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return true;
}

export interface UploadResult {
  url: string;
  width?: number;
  height?: number;
}

export async function uploadMedia(buffer: Buffer, folder = "azeel-news"): Promise<UploadResult> {
  if (!ensureConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error ?? new Error("Cloudinary upload returned no result"));
      resolve({ url: result.secure_url, width: result.width, height: result.height });
    });
    stream.end(buffer);
  });
}
