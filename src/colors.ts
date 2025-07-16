// Catálogo de colores
export const COLOR_CATALOG: { [key: string]: string } = {
  // Colores básicos
  'NARANJA': '#FFA500',
  'ROJO': '#FF0000',
  
  // Por defecto
  'DEFAULT': '#FF0000'
};

export function getColorByName(colorName: string): string {
  const normalizedName = colorName?.toUpperCase()?.trim();
  return COLOR_CATALOG[normalizedName] || COLOR_CATALOG['DEFAULT'];
} 