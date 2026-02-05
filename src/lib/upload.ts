export async function uploadImage(base64: string): Promise<string | null> {
  try {
    const apiUrl = process.env.UPLOAD_IMAGE_API_URL;
    if (!apiUrl) {
      console.error('UPLOAD_IMAGE_API_URL no está configurada');
      return null;
    }

    // Convertir base64 a File (no Blob)
    const base64Data = base64.split(',')[1];
    const mimeType = base64.split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg';

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Crear un File desde el Blob
    const fileName = `client-${Date.now()}.jpg`;
    const file = new File([blob], fileName, { type: mimeType });

    const formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('folder', 'clients'); // Carpeta para organizar las imágenes de clientes

    console.log('Subiendo imagen a:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al subir imagen:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // La API responde con JSON: { url, key }
    const result = await response.json();
    console.log('Respuesta del servidor:', result);

    if (!result.url) {
      throw new Error('No se recibió URL del archivo subido');
    }

    // Corregir URL decodificando %2F a /
    let correctedUrl = result.url.replace(/%2F/g, '/');

    // Asegurar que la estructura de la URL sea correcta
    if (correctedUrl.includes('/r2-appwise/') && !correctedUrl.includes('/r2-appwise/clients/')) {
      correctedUrl = correctedUrl.replace('/r2-appwise/', '/r2-appwise/clients/');
    }

    console.log('URL corregida:', correctedUrl);
    return correctedUrl;
  } catch (error) {
    console.error('Error en uploadImage:', error);
    return null;
  }
}
