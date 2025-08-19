import 'dotenv/config';
import axios from 'axios';
import { ResponseVO, PersonVO, CatalogsResponseVO, CatalogTypeVO, CatalogValueVO } from './types';
import { NoveltyResponseVO } from './novelty-response.vo';
import { getToken, clearToken, refreshTokenIfNeeded } from './auth';

// Use environment variables with fallback values
const API_URL_BASE = process.env.API_URL_BASE ?? 'https://aplpre.favorita.ec';
export const REGISTER_API_URL = API_URL_BASE + '/sisegv2Services/api/v1/migrate/createUpdateNovelty';
export const FIND_API_URL = API_URL_BASE + '/sisegv2Services/api/v1/external/getPersonByDocumentAndType';
export const CATALOGS_API_URL = API_URL_BASE + '/sisegSubsidiaryServices/api/v1/catalogs/getCatalogsFil';

// Configuración para reintentos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// Función helper para esperar
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper para manejar automáticamente la renovación del token
async function apiCallWithTokenRefresh<T>(
  apiCall: (token: string) => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      const token = await getToken();
      return await apiCall(token);
    } catch (error: any) {
      if (error.response?.status === 401 && retries < maxRetries) {
        console.log(`🔄 Token expirado (401), renovando... (intento ${retries + 1}/${maxRetries})`);
        clearToken(); // Limpiar token expirado
        retries++;
        if (retries <= maxRetries) {
          await delay(RETRY_DELAY); // Esperar antes del siguiente intento
        }
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Error después de intentar renovar el token');
}

export async function buscarPersona(documentType: string, documentNumber: string, token: string): Promise<PersonVO | null> {
  const payloadFind = {
    validateEmployee: false,
    documentType,
    documentNumber
  };
  
  try {
    const response = await axios.post<ResponseVO>(FIND_API_URL, payloadFind, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000 // 30 segundos de timeout
    });
    return response.data && response.data.data ? response.data.data : null;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('🔄 Token expirado en buscarPersona, renovando...');
      clearToken();
      const newToken = await getToken();
      const response = await axios.post<ResponseVO>(FIND_API_URL, payloadFind, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        timeout: 30000
      });
      return response.data && response.data.data ? response.data.data : null;
    }
    throw error;
  }
}

export async function registrarNovedad(payload: any, token: string): Promise<NoveltyResponseVO> {
  try {
    const response = await axios.post<NoveltyResponseVO>(REGISTER_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 60000 // 60 segundos de timeout para registro
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('🔄 Token expirado en registrarNovedad, renovando...');
      clearToken();
      const newToken = await getToken();
      const response = await axios.post<NoveltyResponseVO>(REGISTER_API_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        timeout: 60000
      });
      return response.data;
    }
    throw error;
  }
}

export async function obtenerCatalogs(token: string): Promise<CatalogsResponseVO> {
  try {
    const response = await axios.get<CatalogsResponseVO>(CATALOGS_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('🔄 Token expirado en obtenerCatalogs, renovando...');
      clearToken();
      const newToken = await getToken();
      const response = await axios.get<CatalogsResponseVO>(CATALOGS_API_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        timeout: 30000
      });
      return response.data;
    }
    console.error('Error obteniendo catálogos:', error);
    throw error;
  }
}

// Función helper para buscar categoría por nombre
export function buscarCategoriaPorNombre(catalogs: CatalogsResponseVO, nombreCategoria: string): CatalogTypeVO | null {
  const categoriaEncontrada = catalogs.data.find(catalogType => 
    catalogType.catalogTypeName.toUpperCase().includes(nombreCategoria.toUpperCase())
  );
  return categoriaEncontrada || null;
}

// Función helper para buscar subcategoría por nombre
export function buscarSubcategoriaPorNombre(catalogs: CatalogsResponseVO, nombreSubcategoria: string): CatalogValueVO | null {
  for (const catalogType of catalogs.data) {
    const subcategoriaEncontrada = catalogType.catalogValues.find(value => 
      value.catalogValueName.toUpperCase().includes(nombreSubcategoria.toUpperCase())
    );
    if (subcategoriaEncontrada) {
      return subcategoriaEncontrada;
    }
  }
  return null;
}

// Función helper para obtener códigos de categoría y subcategoría
export function obtenerCodigosCatalogo(catalogs: CatalogsResponseVO, nombreCategoria: string, nombreSubcategoria: string): { catalogTypeCode: number | null, catalogValueCode: number | null } {
  const categoria = buscarCategoriaPorNombre(catalogs, nombreCategoria);
  
  if (!categoria) {
    return { catalogTypeCode: null, catalogValueCode: null };
  }
  
  // Buscar subcategoría solo dentro de la categoría encontrada
  const subcategoria = categoria.catalogValues.find(value => 
    value.catalogValueName.toUpperCase().includes(nombreSubcategoria.toUpperCase())
  );
  
  return {
    catalogTypeCode: categoria.catalogTypeCode,
    catalogValueCode: subcategoria ? subcategoria.catalogValueCode : null
  };
}