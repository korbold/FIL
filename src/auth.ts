import axios from 'axios';

const KEYCLOAK_URL = 'https://aplpre.favorita.ec/auth/realms/CFAVORITA-SSO-INTRANET/protocol/openid-connect/token';
const CLIENT_ID = 'SISEG-SUB-WEB';
const USERNAME = 'vfheredia';
const PASSWORD = 'Password01.!';

export async function getToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', CLIENT_ID);
  params.append('username', USERNAME);
  params.append('password', PASSWORD);

  try {
    const response = await axios.post(KEYCLOAK_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (response.status === 200 && response.data && response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('No se pudo obtener el token');
    }
  } catch (error) {
    console.error('Error obteniendo el token:', error);
    throw error;
  }
} 