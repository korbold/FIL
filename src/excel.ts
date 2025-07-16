import * as XLSX from 'xlsx';

export function leerExcel(path: string): any[] {
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
} 