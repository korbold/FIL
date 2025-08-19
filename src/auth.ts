import axios from 'axios';
import qs from 'qs';
import 'dotenv/config';
import { config } from './config';

// Variable global para almacenar el token actual
let currentToken: string | null = null;
let tokenExpiry: number | null = null;

// Interfaz para el payload del JWT
interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

// Función para decodificar JWT (sin verificar firma)
function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error decodificando JWT:', error);
    return null;
  }
}

// Función para obtener la expiración real del token desde el JWT
function getTokenExpirationFromJWT(token: string): number | null {
  const payload = decodeJWT(token);
  if (payload && payload.exp) {
    // exp está en segundos, convertir a milisegundos
    return payload.exp * 1000;
  }
  return null;
}

// Función para formatear timestamp a fecha legible
function formatExpirationDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('es-EC', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Obtener token usando el flujo client_credentials
export async function getToken(): Promise<string> {
  // Si ya tenemos un token válido, lo retornamos
  if (currentToken && tokenExpiry && Date.now() < tokenExpiry) {
    return currentToken;
  }

  const data = qs.stringify({
    grant_type: 'password',
    client_id: config.auth.clientId,
    username: config.auth.username,
    password: config.auth.password,
  });

  const requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: config.auth.url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'sid=311235d0-320c-448e-8473-62895860c244'
    },
    data,
    timeout: config.api.timeout.default
  } as const;

  try {
    console.log('🔄 Obteniendo nuevo token de autenticación...');
    const response = await axios.request(requestConfig);
    if (response.status === 200 && response.data && response.data.access_token) {
      currentToken = response.data.access_token;
      
      // Obtener expiración real desde el JWT
      const realExpiry = getTokenExpirationFromJWT(currentToken!);
      if (realExpiry) {
        tokenExpiry = realExpiry - config.auth.tokenRefreshThreshold;
        console.log(`✅ Token obtenido exitosamente`);
        console.log(`⏰ Expira: ${formatExpirationDate(realExpiry)}`);
        console.log(`🔄 Se renovará: ${formatExpirationDate(tokenExpiry)}`);
      } else {
        // Fallback si no se puede decodificar el JWT
        const expiresIn = response.data.expires_in || 300;
        tokenExpiry = Date.now() + (expiresIn * 1000) - config.auth.tokenRefreshThreshold;
        console.log('✅ Token obtenido exitosamente (fallback)');
      }
      
      return currentToken!;
    }
    throw new Error('No se pudo obtener el token');
  } catch (error) {
    console.error('❌ Error obteniendo el token:', error);
    throw error;
  }
}

// Función para renovar el token cuando sea necesario
export async function refreshTokenIfNeeded(): Promise<string> {
  const token = await getToken();
  if (!token) {
    throw new Error('No se pudo obtener el token');
  }
  return token;
}

// Función para limpiar el token actual (útil para forzar renovación)
export function clearToken(): void {
  currentToken = null;
  tokenExpiry = null;
  console.log('🗑️ Token limpiado');
}

// Función para verificar si el token está próximo a expirar
export function isTokenExpiringSoon(): boolean {
  if (!currentToken) return true;
  
  // Obtener la expiración real del JWT
  const realExpiry = getTokenExpirationFromJWT(currentToken);
  if (realExpiry) {
    // Considerar que expira pronto si faltan menos de 2 minutos
    return Date.now() > (realExpiry - 120000);
  }
  
  // Fallback: usar tokenExpiry si no se puede decodificar el JWT
  if (tokenExpiry) {
    return Date.now() > (tokenExpiry - 120000);
  }
  
  return true;
}

// Función para obtener información del token actual
export function getTokenInfo(): { hasToken: boolean; expiresAt: Date | null; isExpiringSoon: boolean; timeUntilExpiry: string | null; realExpiresAt: Date | null } {
  if (!currentToken) {
    return {
      hasToken: false,
      expiresAt: null,
      isExpiringSoon: true,
      timeUntilExpiry: null,
      realExpiresAt: null
    };
  }

  // Obtener la expiración real del JWT
  const realExpiry = getTokenExpirationFromJWT(currentToken);
  const realExpiresAt = realExpiry ? new Date(realExpiry) : null;
  
  // Calcular tiempo restante basado en la expiración real
  let timeLeft = 0;
  let timeUntilExpiry = 'Expirado';
  
  if (realExpiry) {
    timeLeft = realExpiry - Date.now();
    if (timeLeft > 0) {
      const minutesLeft = Math.floor(timeLeft / 60000);
      const hoursLeft = Math.floor(minutesLeft / 60);
      const daysLeft = Math.floor(hoursLeft / 24);
      
      if (daysLeft > 0) {
        timeUntilExpiry = `${daysLeft} días, ${hoursLeft % 24} horas, ${minutesLeft % 60} minutos`;
      } else if (hoursLeft > 0) {
        timeUntilExpiry = `${hoursLeft} horas, ${minutesLeft % 60} minutos`;
      } else {
        timeUntilExpiry = `${minutesLeft} minutos`;
      }
    }
  } else if (tokenExpiry) {
    // Fallback si no se puede decodificar el JWT
    timeLeft = tokenExpiry - Date.now();
    timeUntilExpiry = timeLeft > 0 ? `${Math.floor(timeLeft / 60000)} minutos` : 'Expirado';
  }

  return {
    hasToken: true,
    expiresAt: tokenExpiry ? new Date(tokenExpiry) : null, // Cuándo se renovará
    realExpiresAt, // Cuándo realmente expira el JWT
    isExpiringSoon: isTokenExpiringSoon(),
    timeUntilExpiry
  };
}

// Función para validar si el token actual es válido
export function isTokenValid(): boolean {
  if (!currentToken) return false;
  
  // Obtener la expiración real del JWT
  const realExpiry = getTokenExpirationFromJWT(currentToken);
  if (realExpiry) {
    // Comparar contra la expiración real del JWT
    return Date.now() < realExpiry;
  }
  
  // Fallback: usar tokenExpiry si no se puede decodificar el JWT
  if (tokenExpiry) {
    return Date.now() < tokenExpiry;
  }
  
  return false;
}

// Función para obtener información detallada del JWT
export function getJWTInfo(token: string): { payload: JWTPayload | null; isValid: boolean; expiresAt: Date | null } {
  const payload = decodeJWT(token);
  if (!payload) {
    return { payload: null, isValid: false, expiresAt: null };
  }

  const now = Date.now();
  const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
  const isValid = payload.exp ? (payload.exp * 1000) > now : false;

  return { payload, isValid, expiresAt };
}