import 'dotenv/config';

/**
 * Configuration file for the application
 * Centralizes all environment variables and configuration settings
 */
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.API_URL_BASE ?? 'https://aplpre.favorita.ec',
    timeout: {
      default: 30000, // 30 seconds
      register: 60000, // 60 seconds for registration
      catalogs: 30000  // 30 seconds for catalogs
    }
  },

  // Authentication Configuration
  auth: {
    url: process.env.AUTH_URL ?? 'https://aplpre.favorita.ec/auth/realms/CFAVORITA-SSO-INTRANET/protocol/openid-connect/token',
    clientId: process.env.AUTH_CLIENT_ID ?? 'SISEGV2-WEB',
    username: process.env.AUTH_USERNAME ?? 'smxadmin',
    password: process.env.AUTH_PASSWORD ?? 'Password01.',
    tokenRefreshThreshold: 300000, // 5 minutes before expiration
    maxRetries: 3,
    retryDelay: 1000 // 1 second
  },

  // Business Logic Configuration
  business: {
    workAreaCode: Number(process.env.WORK_AREA_CODE) ?? 22352,
    camLocation: process.env.CAM_LOCATION ?? 'LCD',
    camSubLocation: process.env.CAM_SUB_LOCATION ?? 'CAB',
    descriptionLocation: process.env.DESCRIPTION_LOCATION ?? 'FILIAL',
    detectedByEmployee: Number(process.env.DETECTED_BY_EMPLOYEE) ?? 1713109047,
    createdByEmployee: Number(process.env.CREATED_BY_EMPLOYEE) ?? 1713109047,
    employeePersonCodeCreated: Number(process.env.EMPLOYEE_PERSON_CODE_CREATED) ?? 69265,
    employeePersonCodeDetected: Number(process.env.EMPLOYEE_PERSON_CODE_DETECTED) ?? 69265,
    createdByUser: process.env.CREATED_BY_USER ?? 'FR0M'
  },

  // File Configuration
  files: {
    inputFile: process.env.INPUT_FILE ?? 'remake.xlsx',
    assetsFolder: 'assets',
    auditFolder: 'audit'
  }
};

/**
 * Helper function to validate required configuration
 */
export function validateConfig(): void {
  const requiredEnvVars = [
    'AUTH_USERNAME',
    'AUTH_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Helper function to get API URLs
 */
export function getApiUrls() {
  return {
    register: `${config.api.baseUrl}/sisegv2Services/api/v1/migrate/createUpdateNovelty`,
    findPerson: `${config.api.baseUrl}/sisegSubsidiaryServices/api/v1/external/getPersonByDocumentAndType`,
    catalogs: `${config.api.baseUrl}/sisegSubsidiaryServices/api/v1/catalogs/getCatalogsFil`
  };
}
