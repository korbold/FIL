import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Interfaces para auditoría
export interface AuditRecord {
  rowNumber: number;
  documentType: string;
  documentNumber: string;
  category: string;
  subcategory: string;
  description: string;
  status: 'SUCCESS' | 'ERROR' | 'PERSON_NOT_FOUND';
  errorMessage?: string;
  noveltyCode?: string;
  timestamp: Date;
}

export interface AuditSummary {
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  personNotFoundRecords: number;
  records: AuditRecord[];
}

export class AuditManager {
  private audit: AuditSummary;

  constructor(totalRecords: number) {
    this.audit = {
      totalRecords,
      successfulRecords: 0,
      failedRecords: 0,
      personNotFoundRecords: 0,
      records: []
    };
  }

  // Registrar persona no encontrada
  recordPersonNotFound(rowNumber: number, documentType: string, documentNumber: string, category: string, subcategory: string, description: string) {
    const record: AuditRecord = {
      rowNumber,
      documentType,
      documentNumber,
      category,
      subcategory,
      description,
      status: 'PERSON_NOT_FOUND',
      errorMessage: 'Persona no encontrada en el sistema',
      timestamp: new Date()
    };
    
    this.audit.records.push(record);
    this.audit.personNotFoundRecords++;
  }

  // Registrar error de búsqueda de persona
  recordPersonSearchError(rowNumber: number, documentType: string, documentNumber: string, category: string, subcategory: string, description: string, errorMessage: string) {
    const record: AuditRecord = {
      rowNumber,
      documentType,
      documentNumber,
      category,
      subcategory,
      description,
      status: 'ERROR',
      errorMessage: `Error buscando persona: ${errorMessage}`,
      timestamp: new Date()
    };
    
    this.audit.records.push(record);
    this.audit.failedRecords++;
  }

  // Registrar éxito en el registro
  recordSuccess(rowNumber: number, documentType: string, documentNumber: string, category: string, subcategory: string, description: string, noveltyCode: string) {
    const record: AuditRecord = {
      rowNumber,
      documentType,
      documentNumber,
      category,
      subcategory,
      description,
      status: 'SUCCESS',
      noveltyCode,
      timestamp: new Date()
    };
    
    this.audit.records.push(record);
    this.audit.successfulRecords++;
  }

  // Registrar error en el registro
  recordError(rowNumber: number, documentType: string, documentNumber: string, category: string, subcategory: string, description: string, errorMessage: string) {
    const record: AuditRecord = {
      rowNumber,
      documentType,
      documentNumber,
      category,
      subcategory,
      description,
      status: 'ERROR',
      errorMessage,
      timestamp: new Date()
    };
    
    this.audit.records.push(record);
    this.audit.failedRecords++;
  }

  // Obtener resumen de auditoría
  getSummary(): AuditSummary {
    return { ...this.audit };
  }

  // Mostrar resumen en consola
  printSummary() {
    console.log('\n📊 RESUMEN FINAL:');
    console.log(`Total de registros procesados: ${this.audit.totalRecords}`);
    console.log(`✅ Registros exitosos: ${this.audit.successfulRecords}`);
    console.log(`❌ Registros con error: ${this.audit.failedRecords}`);
    console.log(`👤 Personas no encontradas: ${this.audit.personNotFoundRecords}`);
    console.log(`📈 Tasa de éxito: ${((this.audit.successfulRecords / this.audit.totalRecords) * 100).toFixed(2)}%`);
  }

  // Generar reporte Excel
  async generateReport(): Promise<string> {
    try {
      // Crear carpeta audit si no existe
      const auditDir = path.join(process.cwd(), 'audit');
      if (!fs.existsSync(auditDir)) {
        fs.mkdirSync(auditDir, { recursive: true });
        console.log('📁 Carpeta audit creada');
      }

      // Crear datos para el Excel
      const excelData = this.audit.records.map(record => ({
        'Número de Fila': record.rowNumber.toString(),
        'Tipo Documento': record.documentType,
        'Número Documento': record.documentNumber,
        'Categoría': record.category,
        'Subcategoría': record.subcategory,
        'Descripción': record.description,
        'Estado': record.status,
        'Código Novedad': record.noveltyCode || '',
        'Mensaje Error': record.errorMessage || '',
        'Fecha/Hora Procesamiento': record.timestamp.toLocaleString('es-ES')
      }));

      // Crear workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 15 }, // Número de Fila
        { wch: 20 }, // Tipo Documento
        { wch: 20 }, // Número Documento
        { wch: 25 }, // Categoría
        { wch: 25 }, // Subcategoría
        { wch: 40 }, // Descripción
        { wch: 15 }, // Estado
        { wch: 20 }, // Código Novedad
        { wch: 50 }, // Mensaje Error
        { wch: 25 }  // Fecha/Hora
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Auditoría');

      // Crear hoja de resumen
      const summaryData = [
        { 'Métrica': 'Total de Registros', 'Valor': this.audit.totalRecords.toString() },
        { 'Métrica': 'Registros Exitosos', 'Valor': this.audit.successfulRecords.toString() },
        { 'Métrica': 'Registros con Error', 'Valor': this.audit.failedRecords.toString() },
        { 'Métrica': 'Personas No Encontradas', 'Valor': this.audit.personNotFoundRecords.toString() },
        { 'Métrica': 'Tasa de Éxito (%)', 'Valor': ((this.audit.successfulRecords / this.audit.totalRecords) * 100).toFixed(2) + '%' }
      ];

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');

      // Generar nombre de archivo con timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `audit-report-${timestamp}.xlsx`;
      const filePath = path.join(auditDir, filename);

      // Guardar archivo en la carpeta audit
      XLSX.writeFile(workbook, filePath);
      console.log(`📄 Reporte de auditoría generado: ${filePath}`);
      
      return filePath;
      
    } catch (error) {
      console.error('❌ Error generando reporte de auditoría:', error);
      throw error;
    }
  }
} 