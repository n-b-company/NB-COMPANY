import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.AUTH_SECRET || 'fallback-secret-key-12345';
const key = new TextEncoder().encode(secretKey);

// Generar token de compartir con vencimiento (24 horas por defecto)
export async function generateShareToken(clientId: string, expiresInHours = 24) {
  const payload = {
    clientId,
    type: 'share',
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiresInHours}h`)
    .sign(key);
}

// Verificar y decodificar token de compartir
export async function verifyShareToken(token: string): Promise<{
  valid: boolean;
  clientId?: string;
  expired?: boolean;
  error?: string;
}> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    if (payload.type !== 'share') {
      return { valid: false, error: 'Token inválido' };
    }

    return {
      valid: true,
      clientId: payload.clientId as string,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Token expirado
      if (error.message.includes('exp')) {
        return { valid: false, expired: true, error: 'Token expirado' };
      }
      return { valid: false, error: 'Token inválido' };
    }
    return { valid: false, error: 'Error al verificar token' };
  }
}
