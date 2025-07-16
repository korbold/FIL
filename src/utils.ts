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
  const [dia, mes, anio] = fecha.split('/');
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