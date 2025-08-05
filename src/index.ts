import 'dotenv/config';
import { leerExcel } from './excel';
import { getToken } from './auth';
import { buscarPersona, registrarNovedad, obtenerCatalogs, obtenerCodigosCatalogo } from './api';
import { getColorByName } from './colors';
import { convertirFechaHoraISO } from './utils';
import { NoveltyModel } from './request/novelty.model';
import { AuditManager } from './audit';

async function main() {
  const rows = leerExcel('assets/prod.xlsx');
  const token = await getToken();
  
  // Inicializar auditoría
  const auditManager = new AuditManager(rows.length);
  
  console.log(`🚀 Iniciando procesamiento de ${rows.length} registros...`);
  
  // Obtener catálogos una sola vez
  const catalogs = await obtenerCatalogs(token);
  console.log('Catálogos cargados exitosamente');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as any;
    let personList: any[] = [];
    const documentType = row['TIPO DOCUMENTO'] === 'CÉDULA' ? 'CI' : 'PAS';
    const documentNumber = row['NRO. DOCUMENTO'];
    const category = row['CATEGORIA'] || '';
    const subcategory = row['SUBCATEGORIA'] || '';
    const description = row['DESCRIPCION DE NOVEDAD'] || '';
    
    try {
      const person = await buscarPersona(documentType, documentNumber, token);
      if (person) {
        personList.push({
          personCode: person.codigoPersona,
          documentNumber: person.numeroDocumento,
          documentType: person.tipoDocumento,
          mainPerson: true,
          blockDays: null,
          startBlockDate: null,
          endBlockDate: null
        });
        console.log(`✔️ Persona encontrada en la fila ${i + 1}`);
      } else {
        console.log(`❌ Persona no encontrada en la fila ${i + 1}`);
        auditManager.recordPersonNotFound(i + 1, documentType, documentNumber, category, subcategory, description);
        continue; // Saltar al siguiente registro
      }
    } catch (error: any) {
      console.log(`❌ Error buscando persona en la fila ${i + 1}: ${error.message}`);
      auditManager.recordPersonSearchError(i + 1, documentType, documentNumber, category, subcategory, description, error.message);
      continue; // Saltar al siguiente registro
    }

    // Buscar códigos de catálogo automáticamente
    const codigos = obtenerCodigosCatalogo(catalogs, row['CATEGORIA'], row['SUBCATEGORIA']);
    
    // Corregir el tipo de noveltyDate
    const fechaIso = convertirFechaHoraISO(row['FECHA NOVEDAD'], row['HORA NOVEDAD']);
    const noveltyDate = fechaIso ? new Date(fechaIso) : new Date();

    // Crear el payload usando el modelo y asignar propiedades manualmente
    const payload = new NoveltyModel();
    payload.catalogTypeCode = codigos.catalogTypeCode || row['CATEGORIA'];
    payload.catalogValueCode = codigos.catalogValueCode || row['SUBCATEGORIA'];
    payload.workAreaCode = Number(process.env.WORK_AREA_CODE) || 22352;
    payload.noveltyDate = noveltyDate;
    payload.description = row['DESCRIPCION DE NOVEDAD'];
    payload.canUpdate = true;
    payload.catalogueValueCode = codigos.catalogValueCode || row['SUBCATEGORIA'];
    payload.personList = personList;
    payload.isActive = true;
    payload.isMainPersonBlock = false;
    payload.isUpdate = false;
    payload.canUpdate = true;
    payload.complaint = false;
    payload.isPoliceReport = false;
    payload.activesDoneCodes = '';
    payload.repose = false;
    payload.needAmbulanceService = false;
    payload.camLocation = process.env.CAM_LOCATION || 'LCD';
    payload.camSubLocation = process.env.CAM_SUB_LOCATION || 'CAB';
    payload.descriptionLocation = process.env.DESCRIPTION_LOCATION || 'FILIAL';
    payload.subTotalNoImp = 0;
    payload.subTotalImp = 0;
    payload.iva = 0;
    payload.amountLeft = 0;
    payload.noveltyTotal = 0;
    payload.detectedByEmployee = Number(process.env.DETECTED_BY_EMPLOYEE) || 1713109047;
    payload.createdByEmployee = Number(process.env.CREATED_BY_EMPLOYEE) || 1713109047;
    payload.employeePersonCodeCreated = Number(process.env.EMPLOYEE_PERSON_CODE_CREATED) || 69265;
    payload.employeePersonCodeDetected = Number(process.env.EMPLOYEE_PERSON_CODE_DETECTED) || 69265;
    payload.status = true;
    payload.source = '1';
    payload.color = getColorByName(row['COLOR'] || 'ROJO');
    payload.createdDate = new Date().getTime();
    payload.createdByUser = process.env.CREATED_BY_USER || 'FR0M';


    try {
      const result = await registrarNovedad(payload, token);
      if (result.data.observation) {
        console.log(`❌ Fila ${i + 1} no registrada correctamente. Observación: ${result.data.observation}`);
        auditManager.recordError(i + 1, documentType, documentNumber, category, subcategory, description, result.data.observation);
        break;
      }
      console.log(`✔️ Fila ${i + 1} registrada correctamente. Código de novedad: ${result.data.noveltyCode}`);
      
      // Registrar éxito en auditoría
      auditManager.recordSuccess(i + 1, documentType, documentNumber, category, subcategory, description, result.data.noveltyCode.toString());
      
    } catch (error: any) {
      const errorMsg = error.response?.data || error.message;
      console.log(`❌ Error en registro fila ${i + 1}:`, errorMsg);
      
      // Registrar error en auditoría
      const errorMessage = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
      auditManager.recordError(i + 1, documentType, documentNumber, category, subcategory, description, errorMessage);
    }
  }

  // Generar reporte de auditoría
  try {
    await auditManager.generateReport();
  } catch (error) {
    console.error('❌ Error generando reporte:', error);
  }
  
  // Mostrar resumen final
  auditManager.printSummary();
}

main();