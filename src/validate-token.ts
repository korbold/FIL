import { getJWTInfo, isTokenValid } from './auth';

/**
 * Script para validar un token específico y mostrar información detallada
 * Uso: npx ts-node src/validate-token.ts "token_aqui"
 */
function validateSpecificToken(token: string) {
  console.log('🔍 Validando token específico...\n');
  
  if (!token) {
    console.error('❌ Error: Debe proporcionar un token como argumento');
    console.log('Uso: npx ts-node src/validate-token.ts "token_aqui"');
    return;
  }

  try {
    // Validar el token
    const jwtInfo = getJWTInfo(token);
    
    if (!jwtInfo.payload) {
      console.error('❌ Token inválido o no se puede decodificar');
      return;
    }

    console.log('📋 Información del JWT:');
    console.log(`- Subject: ${jwtInfo.payload.sub || 'No especificado'}`);
    console.log(`- Issued at (iat): ${new Date(jwtInfo.payload.iat * 1000).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}`);
    
    if (jwtInfo.payload.exp) {
      const expDate = new Date(jwtInfo.payload.exp * 1000);
      const now = new Date();
      const timeLeft = expDate.getTime() - now.getTime();
      const minutesLeft = Math.floor(timeLeft / 60000);
      const hoursLeft = Math.floor(minutesLeft / 60);
      const daysLeft = Math.floor(hoursLeft / 24);
      
      console.log(`- Expires at (exp): ${expDate.toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}`);
      console.log(`- Tiempo restante: ${daysLeft > 0 ? `${daysLeft} días, ` : ''}${hoursLeft % 24} horas, ${minutesLeft % 60} minutos`);
      
      if (timeLeft > 0) {
        console.log(`- Estado: ✅ Válido`);
        if (minutesLeft < 30) {
          console.log(`- ⚠️  ADVERTENCIA: El token expira en menos de 30 minutos`);
        } else if (minutesLeft < 60) {
          console.log(`- ⚠️  ADVERTENCIA: El token expira en menos de 1 hora`);
        }
      } else {
        console.log(`- Estado: ❌ Expirado (hace ${Math.abs(minutesLeft)} minutos)`);
      }
    } else {
      console.log('- Expires at (exp): No especificado');
    }

    // Mostrar otros campos del payload si existen
    const otherFields = Object.keys(jwtInfo.payload).filter(key => !['exp', 'iat', 'sub'].includes(key));
    if (otherFields.length > 0) {
      console.log('\n📝 Otros campos del payload:');
      otherFields.forEach(key => {
        const value = jwtInfo.payload![key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          console.log(`- ${key}: ${value}`);
        } else {
          console.log(`- ${key}: [${typeof value}]`);
        }
      });
    }

    // Validación final
    console.log('\n🔍 Validación final:');
    console.log(`- Token decodificable: ${jwtInfo.payload ? '✅ Sí' : '❌ No'}`);
    console.log(`- Token válido: ${jwtInfo.isValid ? '✅ Sí' : '❌ No'}`);
    
    if (jwtInfo.isValid) {
      console.log('🎉 El token es válido y puede ser usado');
    } else {
      console.log('❌ El token no es válido o ha expirado');
    }

  } catch (error) {
    console.error('❌ Error validando el token:', error);
  }
}

// Obtener token del argumento de línea de comandos
const tokenArg = process.argv[2];

if (require.main === module) {
  validateSpecificToken(tokenArg);
}

export { validateSpecificToken };
