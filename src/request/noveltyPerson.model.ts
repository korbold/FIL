import { PersonaModel } from './persona.model';

/**
 * Model define for novelty data
 * @author dbarahona
 */
export class NoveltyPersonModel {
  uuid?: string;
  personCode?: number;
  documentNumber?: string;
  documentType?: string;
  blockDays?: number;
  startBlockDate?: Date;
  endBlockDate?: Date;
  mainPerson?: boolean;
  codeEmployee?: string;
  isCreate?: boolean;
  person?: PersonaModel;
}
