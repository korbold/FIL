// Value Object para la respuesta de registrarNovedad

export interface NoveltyPersonVO {
  uuid: string;
  personCode: number;
  documentNumber: string;
  documentType: string;
  mainPerson: boolean;
  isCreate: boolean;
  isActive: boolean;
  blocked: boolean;
}

export interface NoveltyDataVO {
  noveltyCode: number;
  catalogTypeCode: number;
  catalogValueCode: number;
  workAreaCode: number;
  noveltyDate: number;
  description: string;
  camLocation: string;
  camSubLocation: string;
  descriptionLocation: string;
  createdByEmployee: number;
  detectedByEmployee: number;
  employeePersonCodeCreated: number;
  employeePersonCodeDetected: number;
  complaint: boolean;
  isValidate: boolean;
  canUpdate: boolean;
  isMainPersonBlock: boolean;
  personList: NoveltyPersonVO[];
  isActive: boolean;
  device: string;
  needAmbulanceService: boolean;
  isPoliceReport: boolean;
  repose: boolean;
  subTotalNoImp: number;
  subTotalImp: number;
  iva: number;
  noveltyTotal: number;
  color: string;
  enableNotification: boolean;
  isUpdate: boolean;
  observation: string;
}

export interface NoveltyResponseVO {
  code: number;
  data: NoveltyDataVO;
} 