import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configurar cliente S3 para Cloudflare R2
const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || 'auto',
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
  },
});

export async function uploadImage(base64: string): Promise<string | null> {
  try {
    // Validar que el storage esté habilitado y configurado
    if (process.env.ENABLE_STORAGE !== 'true') {
      console.error('Storage is disabled');
      return null;
    }

    if (
      !process.env.STORAGE_ENDPOINT ||
      !process.env.STORAGE_ACCESS_KEY ||
      !process.env.STORAGE_SECRET_KEY ||
      !process.env.STORAGE_BUCKET ||
      !process.env.STORAGE_PUBLIC_URL
    ) {
      console.error('R2 credentials not configured');
      return null;
    }

    // Extraer el tipo de imagen y los datos base64
    const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      console.error('Invalid base64 format');
      return null;
    }

    const imageType = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, 'base64');

    // Validar tamaño máximo (5MB para avatares)
    const maxSize = parseInt(process.env.UPLOAD_MAX_SIZE_AVATAR || '5242880');
    if (buffer.length > maxSize) {
      console.error(`Image size exceeds maximum allowed: ${maxSize} bytes`);
      return null;
    }

    // Validar extensión permitida
    const allowedImages = process.env.UPLOAD_ALLOWED_IMAGES || 'jpg|jpeg|png|webp|gif';
    const allowedExtensions = allowedImages.split('|');
    if (!allowedExtensions.includes(imageType.toLowerCase())) {
      console.error(`Image type not allowed: ${imageType}`);
      return null;
    }

    // Generar nombre único para el archivo usando PROJECT_NAME
    const projectName = process.env.PROJECT_NAME || 'nb-company';
    const fileName = `${projectName}/clients/${Date.now()}-${Math.random().toString(36).substring(7)}.${imageType}`;

    // Subir a R2
    const command = new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: `image/${imageType}`,
    });

    await s3Client.send(command);

    // Retornar la URL pública
    const publicUrl = `${process.env.STORAGE_PUBLIC_URL}/${fileName}`;
    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image to R2:', error);
    return null;
  }
}
