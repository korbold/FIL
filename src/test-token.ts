import { getToken, clearToken, isTokenExpiringSoon, getTokenInfo, isTokenValid, getJWTInfo } from './auth';
import { config } from './config';

/**
 * Test script to verify token management functionality
 */
async function testTokenManagement() {
  try {
    console.log('🧪 Iniciando pruebas de gestión de tokens...\n');
    
    // Validar configuración
    console.log('📋 Configuración actual:');
    console.log(`- URL de autenticación: ${config.auth.url}`);
    console.log(`- Usuario: ${config.auth.username}`);
    console.log(`- Client ID: ${config.auth.clientId}`);
    console.log(`- Timeout: ${config.api.timeout.default}ms`);
    console.log(`- Umbral de renovación: ${config.auth.tokenRefreshThreshold}ms\n`);
    
    // Obtener token inicial
    console.log('🔑 Obteniendo token inicial...');
    const token1 = await getToken();
    console.log(`✅ Token obtenido: ${token1.substring(0, 20)}...`);
    
    // Analizar JWT
    console.log('\n🔍 Analizando JWT...');
    const jwtInfo = getJWTInfo(token1);
    if (jwtInfo.payload) {
      console.log(`- Subject: ${jwtInfo.payload.sub}`);
      console.log(`- Issued at: ${new Date(jwtInfo.payload.iat * 1000).toLocaleString('es-EC')}`);
      console.log(`- Expires at: ${jwtInfo.expiresAt?.toLocaleString('es-EC')}`);
      console.log(`- Es válido: ${jwtInfo.isValid ? '✅ Sí' : '❌ No'}`);
    }
    
    // Mostrar información del token
    const tokenInfo1 = getTokenInfo();
    console.log('\n📊 Información del token:');
    console.log(`- Tiene token: ${tokenInfo1.hasToken}`);
    console.log(`- Expira en: ${tokenInfo1.expiresAt?.toLocaleString('es-EC')}`);
    console.log(`- Expira pronto: ${tokenInfo1.isExpiringSoon ? '⚠️ Sí' : '✅ No'}`);
    console.log(`- Tiempo restante: ${tokenInfo1.timeUntilExpiry}`);
    console.log(`- Es válido: ${isTokenValid() ? '✅ Sí' : '❌ No'}\n`);
    
    // Intentar obtener el mismo token (debería usar el cache)
    console.log('🔄 Intentando obtener el mismo token (debería usar cache)...');
    const token2 = await getToken();
    console.log(`✅ Token del cache: ${token2.substring(0, 20)}...`);
    console.log(`Tokens son iguales: ${token1 === token2}\n`);
    
    // Verificar si expira pronto
    console.log('⏰ Verificando si el token expira pronto...');
    const isExpiring = isTokenExpiringSoon();
    console.log(`Expira pronto: ${isExpiring ? '⚠️ Sí' : '✅ No'}\n`);
    
    // Limpiar token
    console.log('🗑️ Limpiando token...');
    clearToken();
    const tokenInfoAfterClear = getTokenInfo();
    console.log(`Después de limpiar - Tiene token: ${tokenInfoAfterClear.hasToken}`);
    console.log(`Después de limpiar - Es válido: ${isTokenValid()}\n`);
    
    // Obtener nuevo token
    console.log('🔄 Obteniendo nuevo token después de limpiar...');
    const token3 = await getToken();
    console.log(`✅ Nuevo token: ${token3.substring(0, 20)}...`);
    console.log(`Tokens son diferentes: ${token1 !== token3}\n`);
    
    // Verificar validación del nuevo token
    console.log('🔍 Validando nuevo token...');
    const newJwtInfo = getJWTInfo(token3);
    if (newJwtInfo.payload) {
      console.log(`- Expira en: ${newJwtInfo.expiresAt?.toLocaleString('es-EC')}`);
      console.log(`- Es válido: ${newJwtInfo.isValid ? '✅ Sí' : '❌ No'}`);
    }
    
    console.log('\n🎉 Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

// Ejecutar pruebas si se ejecuta directamente
if (require.main === module) {
  testTokenManagement();
}

export { testTokenManagement };
