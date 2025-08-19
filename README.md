# Script Filiales - Sistema de Gestión de Novedades

Sistema automatizado para el procesamiento de novedades en filiales, con manejo inteligente de autenticación y auditoría completa.

## 🚀 Características Principales

- **Procesamiento Automatizado**: Lee archivos Excel y procesa novedades automáticamente
- **Manejo Inteligente de Tokens**: Renovación automática cuando expiran (401)
- **Auditoría Completa**: Registro detallado de todas las operaciones
- **Manejo de Errores Robusto**: Reintentos automáticos y logging detallado
- **Configuración Centralizada**: Variables de entorno organizadas y validadas

## 🔐 Sistema de Autenticación

### Manejo Automático de Tokens

El sistema incluye un mecanismo inteligente para manejar la expiración de tokens:

- **Cache de Tokens**: Almacena tokens válidos para evitar solicitudes innecesarias
- **Renovación Automática**: Detecta errores 401 y renueva automáticamente el token
- **Prevención de Expiración**: Renueva tokens antes de que expiren
- **Reintentos Inteligentes**: Hasta 3 reintentos con delays apropiados

### Funciones de Autenticación

```typescript
// Obtener token (con cache automático)
const token = await getToken();

// Verificar si expira pronto
if (isTokenExpiringSoon()) {
  token = await getToken();
}

// Limpiar token (forzar renovación)
clearToken();

// Información del token actual
const info = getTokenInfo();
```

## 📊 Sistema de Auditoría

### Campos Registrados

El sistema de auditoría captura **todos los campos del payload** incluyendo:

- **Información Básica**: Número de fila, tipo documento, número documento
- **Categorización**: Categoría, subcategoría, descripción
- **Estado del Proceso**: Estado, código de novedad, mensajes de error
- **Campos del Payload**: Todos los campos enviados a la API
- **Metadatos**: Timestamp de procesamiento, información de usuarios

### Generación de Reportes

- **Formato Excel**: Reportes detallados con múltiples hojas
- **Resumen Ejecutivo**: Métricas de éxito y fallos
- **Trazabilidad Completa**: Seguimiento de cada registro procesado

## ⚙️ Configuración

### Variables de Entorno Requeridas

```bash
# Autenticación
AUTH_USERNAME=tu_usuario
AUTH_PASSWORD=tu_password
AUTH_CLIENT_ID=SISEGV2-WEB
AUTH_URL=https://aplpre.favorita.ec/auth/realms/CFAVORITA-SSO-INTRANET/protocol/openid-connect/token

# API
API_URL_BASE=https://aplpre.favorita.ec

# Configuración de Negocio
WORK_AREA_CODE=22352
CAM_LOCATION=LCD
CAM_SUB_LOCATION=CAB
DESCRIPTION_LOCATION=FILIAL
DETECTED_BY_EMPLOYEE=1713109047
CREATED_BY_EMPLOYEE=1713109047
EMPLOYEE_PERSON_CODE_CREATED=69265
EMPLOYEE_PERSON_CODE_DETECTED=69265
CREATED_BY_USER=FR0M

# Archivos
INPUT_FILE=remake.xlsx
```

### Archivo de Configuración

El sistema incluye un archivo `src/config.ts` que centraliza toda la configuración:

```typescript
export const config = {
  api: {
    baseUrl: process.env.API_URL_BASE ?? 'https://aplpre.favorita.ec',
    timeout: {
      default: 30000,
      register: 60000,
      catalogs: 30000
    }
  },
  auth: {
    tokenRefreshThreshold: 300000, // 5 minutos
    maxRetries: 3,
    retryDelay: 1000
  }
  // ... más configuración
};
```

## 🧪 Pruebas

### Pruebas de Gestión de Tokens

```bash
# Ejecutar pruebas de autenticación
npx ts-node src/test-token.ts
```

Este script verifica:
- Obtención de tokens
- Cache de tokens
- Renovación automática
- Limpieza de tokens
- Detección de expiración

## 📁 Estructura del Proyecto

```
Script Filiales/
├── src/
│   ├── auth.ts          # Gestión de autenticación y tokens
│   ├── api.ts           # Llamadas a la API con manejo de tokens
│   ├── config.ts        # Configuración centralizada
│   ├── audit.ts         # Sistema de auditoría
│   ├── index.ts         # Punto de entrada principal
│   └── test-token.ts    # Pruebas de autenticación
├── assets/              # Archivos Excel de entrada
├── audit/               # Reportes de auditoría generados
└── package.json
```

## 🚀 Uso

### Instalación

```bash
npm install
```

### Ejecución

```bash
# Procesar novedades
npm start

# Ejecutar con archivo específico
INPUT_FILE=prod.xlsx npm start

# Ejecutar pruebas de token
npx ts-node src/test-token.ts
```

## 🔍 Monitoreo y Logs

El sistema proporciona logs detallados para monitoreo:

- `🔑` - Operaciones de autenticación
- `🔄` - Renovación de tokens
- `✅` - Operaciones exitosas
- `❌` - Errores y fallos
- `📊` - Información de auditoría
- `🧪` - Pruebas y validaciones

## 🛡️ Manejo de Errores

### Estrategias de Recuperación

1. **Reintentos Automáticos**: Hasta 3 intentos para operaciones fallidas
2. **Renovación de Tokens**: Automática ante errores 401
3. **Fallback Graceful**: Continúa procesamiento con registros válidos
4. **Logging Detallado**: Registra todos los errores para análisis

### Tipos de Errores Manejados

- **401 Unauthorized**: Renovación automática de token
- **Timeout**: Reintentos con delays apropiados
- **Errores de Red**: Manejo de conexiones inestables
- **Errores de Validación**: Registro en auditoría para revisión

## 📈 Métricas y Reportes

### Reporte de Auditoría

- **Resumen Ejecutivo**: Total de registros, éxitos, fallos
- **Detalle por Registro**: Información completa de cada operación
- **Análisis de Errores**: Categorización y mensajes de error
- **Trazabilidad**: Seguimiento completo del procesamiento

### Métricas Clave

- Tasa de éxito del procesamiento
- Tiempo promedio por registro
- Distribución de tipos de error
- Eficiencia del sistema de tokens

## 🔧 Mantenimiento

### Limpieza de Tokens

```typescript
// Forzar renovación de token
clearToken();

// Verificar estado del token
const info = getTokenInfo();
```

### Monitoreo de Performance

- Timeouts configurables por operación
- Delays entre reintentos
- Cache de tokens con expiración inteligente
- Logging de métricas de performance

## 📝 Notas de Desarrollo

- **TypeScript**: Código completamente tipado
- **Async/Await**: Manejo moderno de promesas
- **Error Handling**: Manejo robusto de errores
- **Configuration**: Configuración centralizada y validada
- **Testing**: Scripts de prueba incluidos

## 🤝 Contribución

1. Mantener documentación en inglés
2. Seguir estándares de TypeScript
3. Incluir pruebas para nuevas funcionalidades
4. Actualizar configuración según sea necesario

## 📄 Licencia

Proyecto interno de Favorita - Uso restringido a la organización.