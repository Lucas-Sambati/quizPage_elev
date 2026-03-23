import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copia 404.html para a pasta dist após o build
const source = path.join(__dirname, '..', 'public', '404.html');
const destination = path.join(__dirname, '..', 'dist', '404.html');

try {
  fs.copyFileSync(source, destination);
  console.log('✅ 404.html copiado para dist com sucesso!');
} catch (error) {
  console.error('❌ Erro ao copiar 404.html:', error);
  process.exit(1);
}
