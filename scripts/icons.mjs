// Generates favicon + app icons from the mark. Run once (or after changing the mark): node scripts/icons.mjs
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';

const PATH = 'M10 14 L80 14 C87 14 92 19 92 26 L92 36 L82 26 L22 26 L22 74 L60 74 L60 86 L10 86 Z M30 34 L76 34 L76 46 L30 46 Z M30 54 L68 54 L68 66 L30 66 Z';
// pad: fraction of the canvas left around the mark.
const icon = (pad) => {
  const vb = 116 / (1 - pad * 2);
  const o = (vb - 116) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-26 - o} ${-8 - o} ${vb} ${vb}"><rect x="${-26 - o}" y="${-8 - o}" width="${vb}" height="${vb}" fill="#000"/><g transform="skewX(-20)" fill="#b2ffff"><path d="${PATH}"/></g></svg>`;
};
const png = (svg, size) => new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();

writeFileSync('public/favicon.svg', icon(0.02));
writeFileSync('public/apple-touch-icon.png', png(icon(0.1), 180));
writeFileSync('public/icon-192.png', png(icon(0.06), 192));
writeFileSync('public/icon-512.png', png(icon(0.06), 512));
writeFileSync('public/icon-maskable-512.png', png(icon(0.2), 512));

// favicon.ico containing a single 32×32 PNG.
const p32 = png(icon(0.02), 32);
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9);
head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(p32.length, 14); head.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([head, p32]));
console.log('icons written');
