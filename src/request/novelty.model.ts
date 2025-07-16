import { NoveltyPersonModel } from './noveltyPerson.model';

/**
 * Model define for novelty data
 * @author dbarahona
 */
export class NoveltyModel {
  noveltyCode?: number;
  catalogTypeCode?: number;
  catalogValueCode?: number;
  workAreaCode?: number;
  noveltyDate?: Date;
  description?: string;
  camLocation?: string;
  camSubLocation?: string;
  descriptionLocation?: string;
  passage?: string;
  subTotalNoImp?: number;
  subTotalImp?: number;
  iva?: number;
  noveltyTotal?: number;
  canUpdate?: boolean;
  catalogueValueCode?: number;
  createdByEmployee?: number;
  detectedByEmployee?: number;
  documentNumberCreated?: string;
  documentNumberDetected?: string;
  amountLeft?: number;
  garmentLeft?: boolean;
  complaint?: boolean;
  isPoliceReport?: boolean;
  activesDoneCodes?: string;
  repose?: boolean;
  daysOfRepose?: number;
  reposeStartDate?: Date;
  reposeEndDate?: Date;
  needAmbulanceService?: boolean;
  isUpdate?: boolean;
  personList?: NoveltyPersonModel[];
  workAreaDescription?: string;
  employeePersonCodeCreated?: number;
  employeePersonCodeDetected?: number;
  isActive?: boolean;
  isMainPersonBlock?: boolean;
  device?: string;
  color?: string;
  observationInactive?: string;
}
