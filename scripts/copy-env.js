/**
 * Script para copiar archivos de entorno en Windows
 * Este script es utilizado por los comandos npm run start:prod:win y npm run start:test:win
 */

const fs = require('fs');
const path = require('path');

// Obtener el entorno desde los argumentos de línea de comandos
const environment = process.argv[2];

if (!environment) {
  console.error('Error: Debe especificar un entorno (production o test)');
  process.exit(1);
}

// Definir rutas de archivos
const sourceFile = path.join(__dirname, '..', `.env.${environment}`);
const targetFile = path.join(__dirname, '..', '.env');

// Verificar que el archivo fuente existe
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: El archivo ${sourceFile} no existe`);
  process.exit(1);
}

// Copiar el archivo
try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`✅ Archivo .env.${environment} copiado a .env correctamente`);
} catch (error) {
  console.error(`❌ Error copiando el archivo: ${error.message}`);
  process.exit(1);
}