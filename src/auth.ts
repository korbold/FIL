import axios from 'axios';
import qs from 'qs';

// Obtener token usando el flujo client_credentials
export async function getToken(): Promise<string> {
  const data = qs.stringify({
    grant_type: 'client_credentials',
    client_id: 'CORPORATE-DATA',
    client_secret: 'cfbb4048-5218-4593-8a74-2e60440cb983'
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://aplpre.favorita.ec/auth/realms/CFAVORITA-SSO-INTRANET/protocol/openid-connect/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: 'KEYCLOAK_LOCALE=es'
    },
    data
  } as const;

  try {
    const response = await axios.request(config);
    if (response.status === 200 && response.data && response.data.access_token) {
      return response.data.access_token;
    }
    throw new Error('No se pudo obtener el token');
  } catch (error) {
    console.error('Error obteniendo el token:', error);
    throw error;
  }
}