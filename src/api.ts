import 'dotenv/config';
import axios from 'axios';
import { ResponseVO, PersonVO, CatalogsResponseVO, CatalogTypeVO, CatalogValueVO } from './types';
import { NoveltyResponseVO } from './novelty-response.vo';

// Use environment variables with fallback values
const API_URL_BASE = process.env.API_URL_BASE ?? 'https://aplpre.favorita.ec';
export const REGISTER_API_URL = API_URL_BASE + '/sisegv2Services/api/v1/migrate/createUpdateNovelty';
export const FIND_API_URL = API_URL_BASE + '/sisegv2Services/api/v1/external/getPersonByDocumentAndType';
export const CATALOGS_API_URL = API_URL_BASE + '/sisegSubsidiaryServices/api/v1/catalogs/getCatalogsFil';

export async function buscarPersona(documentType: string, documentNumber: string, token: string): Promise<PersonVO | null> {
  const payloadFind = {
    validateEmployee: false,
    documentType,
    documentNumber
  };
  const response = await axios.post<ResponseVO>(FIND_API_URL, payloadFind, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data && response.data.data ? response.data.data : null;
}

export async function registrarNovedad(payload: any, token: string): Promise<NoveltyResponseVO> {
  const response = await axios.post<NoveltyResponseVO>(REGISTER_API_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export async function obtenerCatalogs(token: string): Promise<CatalogsResponseVO> {
  try {
    const response = await axios.get<CatalogsResponseVO>(CATALOGS_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
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