// Pads a screenshot onto a 16:10 canvas in its own background color so it fits the Work cards
// without cropping. Keeps the screenshot at native resolution (no upscaling = sharp text).
//   node scripts/frame-shot.mjs <input.png> <name>   → src/assets/shots/<name>.png
import sharp from 'sharp';

const [input, name] = process.argv.slice(2);
if (!input || !name) { console.error('usage: node scripts/frame-shot.mjs <input> <name>'); process.exit(1); }

const img = sharp(input).removeAlpha();
const { width: w, height: h } = await img.metadata();
const { data } = await img.clone().extract({ left: 0, top: 0, width: 4, height: 4 }).raw().toBuffer({ resolveWithObject: true });
const background = { r: data[0], g: data[1], b: data[2] };

const PAD = 0.07; // share of the canvas on each side
const W = Math.ceil(Math.max(w / (1 - 2 * PAD), (h / (1 - 2 * PAD)) * 1.6));
const H = Math.round(W / 1.6);
const left = Math.round((W - w) / 2), top = Math.round((H - h) / 2);

await sharp({ create: { width: W, height: H, channels: 3, background } })
  .composite([{ input: await img.png().toBuffer(), left, top }])
  .png({ compressionLevel: 9 })
  .toFile(`src/assets/shots/${name}.png`);
console.log(`${name}: ${w}×${h} → ${W}×${H}, bg rgb(${background.r},${background.g},${background.b})`);
