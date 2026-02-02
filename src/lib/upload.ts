export async function uploadImage(base64: string): Promise<string | null> {
  try {
    const apiUrl = process.env.UPLOAD_IMAGE_API_URL;
    if (!apiUrl) {
      return null;
    }

    // Convert base64 to Blob
    const response = await fetch(base64);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('image', blob, 'upload.jpg');

    const uploadResponse = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      return null;
    }

    const data = await uploadResponse.json();
    return data.url || data.imageUrl || data.data?.url || null;
  } catch {
    return null;
  }
}
