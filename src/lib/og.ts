// Build-time Open Graph images (1200×630 PNG) in the brand style: Falco Black, Ice mark, Archivo 800.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const fontDir = join(process.cwd(), 'node_modules/@fontsource/archivo/files');
let fonts: { name: string; data: Buffer; weight: 400 | 800; style: 'normal' }[] | null = null;
const loadFonts = () =>
  (fonts ??= [
    { name: 'Archivo', data: readFileSync(join(fontDir, 'archivo-latin-400-normal.woff')), weight: 400, style: 'normal' },
    { name: 'Archivo', data: readFileSync(join(fontDir, 'archivo-latin-800-normal.woff')), weight: 800, style: 'normal' },
  ]);

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-26 -8 116 116" fill="#b2ffff"><g transform="skewX(-20)"><path d="M10 14 L80 14 C87 14 92 19 92 26 L92 36 L82 26 L22 26 L22 74 L60 74 L60 86 L10 86 Z M30 34 L76 34 L76 46 L30 46 Z M30 54 L68 54 L68 66 L30 66 Z"/></g></svg>`;
const markUri = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`;

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({ type, props: { style, children, ...extra } });

export async function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  const size = title.length > 70 ? 60 : title.length > 45 ? 72 : 88;
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#000', color: '#fff', fontFamily: 'Archivo', position: 'relative' }, [
    h('div', { position: 'absolute', right: -60, bottom: -70, width: 520, height: 520, display: 'flex', opacity: 0.16 }, [h('img', { width: 520, height: 520 }, undefined, { src: markUri, width: 520, height: 520 })]),
    h('div', { display: 'flex', alignItems: 'center', gap: 16, padding: '44px 64px 28px', borderBottom: '3px solid #b2ffff' }, [
      h('img', { width: 52, height: 52 }, undefined, { src: markUri, width: 52, height: 52 }),
      h('div', { fontSize: 30, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }, 'FalcoDash'),
    ]),
    h('div', { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', padding: '0 64px', gap: 24 }, [
      h('div', { fontSize: 24, color: '#b2ffff', letterSpacing: 3, textTransform: 'uppercase' }, eyebrow),
      h('div', { fontSize: size, fontWeight: 800, lineHeight: 1.0, letterSpacing: -2, maxWidth: 1010 }, title),
    ]),
    h('div', { display: 'flex', justifyContent: 'space-between', padding: '24px 64px 40px', borderTop: '3px solid #333', fontSize: 24, color: '#cfcfcf' }, [
      h('div', {}, 'falcodash.com'),
      h('div', { color: '#b2ffff' }, 'Better data. Better decisions.'),
    ]),
  ]);
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
