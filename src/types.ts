// Value Objects para la respuesta de persona
export interface PersonVO {
  codigoPersona: number;
  tipoDocumento: string;
  numeroDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombreCompleto: string;
  genero: string;
  estadoCivil: string;
  fechaNacimiento: number;
  codigoPaisNacimiento: string;
  codigoCiudadNacimiento: string;
  infraccionesCount: number;
}

export interface ResponseVO {
  data: PersonVO | null;
  message?: string;
  success?: boolean;
}

// Value Objects para catálogos
export interface CatalogValueVO {
  catalogValueCode: number;
  catalogValueName: string;
  catalogValueDescription: string;
  status: boolean;
  color?: string;
}

export interface CatalogTypeVO {
  catalogTypeCode: number;
  catalogTypeName: string;
  catalogTypeDescription: string;
  catalogValues: CatalogValueVO[];
  status: boolean;
}

export interface CatalogsResponseVO {
  code: number;
  data: CatalogTypeVO[];
} 