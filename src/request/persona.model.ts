import { EmployeeResponseModel } from './employeeResponse.model';

/**
 * Model definition for person data
 * @author dbarahona
 */
export class PersonaModel {
  codigoPersona?: number;
  tipoDocumento?: string;
  numeroDocumento?: string;
  numeroRuc?: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  nombreCompleto?: string;
  genero?: string;
  estadoCivil?: string;
  codigoJDE?: number;
  userId?: string;
  sistemaModificacion?: string;
  codigoSistema?: string;
  fechaNacimiento?: Date;
  contacto?: any;
  contactoPrincipal?: any;
  listaContactosPrincipal?: any[];
  listaContactosRelacionados?: any[];
  camposBloqueados?: string[];
  errores?: string[];
  funcionario?: any;
  usuario?: any;
  urlFotoPersona?: string;
  origenDato?: string;
  validacion?: string;
  valorTipoDocumento?: string;
  valorTipoCedula?: string;
  tieneIncidente?: string;
  iCanAdd?: boolean;
  codigoPaisNacimiento?: string;
  codigoCiudadNacimiento?: string;
  isUpdate?: boolean;
  file?: File;
  validarPersona?: boolean;
  isUsedOnPoliceReport?: boolean;
  employee?: EmployeeResponseModel;
  infraccionesCount?: number;
}
