import cloudinary from '@/lib/cloudinary';

export class StorageService {
  async uploadFile(file: File, folder: string) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto',
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      filename: file.name,
    };
  }
}
