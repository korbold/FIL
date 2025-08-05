import axios from 'axios';
import qs from 'qs';
import 'dotenv/config';

// Obtener token usando el flujo client_credentials
export async function getToken(): Promise<string> {
  const data = qs.stringify({
    grant_type: 'password',
    client_id: process.env.AUTH_CLIENT_ID || 'SISEGV2-WEB',
    username: process.env.AUTH_USERNAME || 'smxadmin',
    password: process.env.AUTH_PASSWORD || 'Password01.',
    // client_secret: 'cfbb4048-5218-4593-8a74-2e60440cb983'
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.AUTH_URL || 'https://aplpre.favorita.ec/auth/realms/CFAVORITA-SSO-INTRANET/protocol/openid-connect/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'sid=311235d0-320c-448e-8473-62895860c244'
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