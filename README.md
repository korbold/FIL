# Script Filiales

Script para procesar datos de filiales y registrar novedades en el sistema.

## Instalación

```bash
npm install
```

## Configuración de Variables de Entorno

El proyecto utiliza archivos de variables de entorno para configurar diferentes entornos:

- `.env.production`: Configuración para entorno de producción
- `.env.test`: Configuración para entorno de pruebas
- `.env.example`: Ejemplo de configuración (no se usa directamente)

Para usar uno de estos archivos, puede:

1. Copiar manualmente el archivo deseado a `.env`:
   ```bash
   cp .env.production .env
   ```

2. O usar los scripts predefinidos que hacen esto automáticamente:
   ```bash
   npm run start:prod  # Usa configuración de producción
   npm run start:test  # Usa configuración de pruebas
   ```

## Variables de Entorno Disponibles

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| API_URL_BASE | URL base de la API | https://aplpre.favorita.ec |
| AUTH_URL | URL de autenticación | https://aplpre.favorita.ec/auth/realms/CFAVORITA-SSO-INTRANET/protocol/openid-connect/token |
| AUTH_CLIENT_ID | ID de cliente para autenticación | SISEGV2-WEB |
| AUTH_USERNAME | Usuario para autenticación | smxadmin |
| AUTH_PASSWORD | Contraseña para autenticación | Password01. |
| WORK_AREA_CODE | Código de área de trabajo | 22352 |
| EMPLOYEE_PERSON_CODE_CREATED | Código de persona del empleado que crea | 69265 |
| EMPLOYEE_PERSON_CODE_DETECTED | Código de persona del empleado que detecta | 69265 |
| DETECTED_BY_EMPLOYEE | ID del empleado que detecta | 1713109047 |
| CREATED_BY_EMPLOYEE | ID del empleado que crea | 1713109047 |
| CREATED_BY_USER | Usuario que crea | FR0M |
| CAM_LOCATION | Ubicación de cámara | LCD |
| CAM_SUB_LOCATION | Sub-ubicación de cámara | CAB |
| DESCRIPTION_LOCATION | Descripción de ubicación | FILIAL |

## Ejecución

```bash
# Usando la configuración en .env (si existe)
npm start

# Usando configuración de producción
npm run start:prod

# Usando configuración de pruebas
npm run start:test
```