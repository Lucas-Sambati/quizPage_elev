import sharp from "sharp";
import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const IMG_DIR = "public/img";
const MAX_WIDTH = 500; // 2x de ~250px real de exibição
const WEBP_QUALITY = 80;

const files = readdirSync(IMG_DIR).filter((f) => f.endsWith(".webp"));

for (const file of files) {
  const filePath = join(IMG_DIR, file);
  const sizeBefore = statSync(filePath).size;

  // Pula o logo (já é pequeno)
  if (sizeBefore < 50_000) {
    console.log(`⏭  ${file} — ${(sizeBefore / 1024).toFixed(1)} KB (já pequeno, pulando)`);
    continue;
  }

  // Lê o arquivo inteiro em memória para liberar o handle
  const inputBuffer = readFileSync(filePath);
  const meta = await sharp(inputBuffer).metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;

  let pipeline = sharp(inputBuffer);
  if (needsResize) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  const buffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  const sizeAfter = buffer.length;

  // Só sobrescreve se ficou menor
  if (sizeAfter < sizeBefore) {
    writeFileSync(filePath, buffer);
    console.log(
      `✅ ${file} — ${(sizeBefore / 1024).toFixed(1)} KB → ${(sizeAfter / 1024).toFixed(1)} KB (${Math.round((1 - sizeAfter / sizeBefore) * 100)}% menor)`
    );
  } else {
    console.log(`⏭  ${file} — ${(sizeBefore / 1024).toFixed(1)} KB (já otimizado)`);
  }
}

console.log("\n✨ Otimização concluída!");
