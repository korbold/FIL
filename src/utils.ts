// Función para limpiar formato de hora removiendo AM/PM
export function limpiarHora(hora: string): string {
  if (!hora) return '';
  
  // Convertir a string y limpiar espacios
  let horaLimpia = String(hora).trim();
  
  // Remover AM/PM (case insensitive)
  horaLimpia = horaLimpia.replace(/am|pm/gi, '').trim();
  
  return horaLimpia;
}

// Función para parsear fechas en formato DD/MM/YYYY HH:mm:ss
export function parsearFechaHoraEuropea(fecha: string, hora: string): Date | null {
  if (!fecha) return null;

  // Si `fecha` es un número (por ejemplo 36425 proveniente de Excel), conviértelo a "DD/MM/YYYY"
  let fechaFormateada: string = fecha;
  if (/^\d+$/.test(fecha)) {
    const convertido = convertirSerieExcelAFecha(Number(fecha));
    if (!convertido) return null;
    fechaFormateada = convertido;
  }

  const [dia, mes, anio] = fechaFormateada.split('/');
  const horaLimpia = limpiarHora(hora) || '00:00:00';
  // Si la hora viene sin segundos, agrégale ":00"
  const partesHora = horaLimpia.split(':');
  let horaFinal = horaLimpia;
  if (partesHora.length === 2) horaFinal += ':00';
  // Construir en formato ISO: YYYY-MM-DDTHH:mm:ss
  const fechaIso = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${horaFinal}`;
  const dateObj = new Date(fechaIso);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

// Función para convertir fecha y hora a string ISO 8601
export function convertirFechaHoraISO(fecha: string, hora: string): string | null {
  const dateObj = parsearFechaHoraEuropea(fecha, hora);
  return dateObj ? dateObj.toISOString() : null;
}

// Convertir número de serie de Excel (días desde 1899-12-30) a string "DD/MM/YYYY"
export function convertirSerieExcelAFecha(serial: number): string | null {
  if (isNaN(serial)) return null;
  const base = new Date(Date.UTC(1899, 11, 30)); // 1899-12-30 corrige el bug de Excel 1900
  base.setUTCDate(base.getUTCDate() + serial);
  const dia = String(base.getUTCDate()).padStart(2, '0');
  const mes = String(base.getUTCMonth() + 1).padStart(2, '0');
  const anio = base.getUTCFullYear();
  return `${dia}/${mes}/${anio}`;
} 