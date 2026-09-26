// Server-side map rendering with d3-geo: returns SVG path strings, so the panel ships no map JS.
import { geoAlbersUsa, geoEqualEarth, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import usTopo from 'us-atlas/states-10m.json';
import worldTopo from 'world-atlas/countries-110m.json';

// State FIPS code -> USPS code (Cloudflare's cf-region-code for the US is the USPS code).
const FIPS: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI',
  '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN',
  '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
  '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA',
  '54': 'WV', '55': 'WI', '56': 'WY', '72': 'PR',
};

export const US_W = 960, US_H = 600, WORLD_W = 960, WORLD_H = 470;

const usStatesGeo = feature(usTopo as any, (usTopo as any).objects.states) as any;
const usProj = geoAlbersUsa().fitSize([US_W, US_H], usStatesGeo);
const usPath = geoPath(usProj);
export const usStates = usStatesGeo.features.map((f: any) => ({ code: FIPS[f.id] ?? f.id, name: f.properties.name as string, d: usPath(f) ?? '' }));
export const usBorders = usPath(mesh(usTopo as any, (usTopo as any).objects.states, (a: any, b: any) => a !== b)) ?? '';
export const projectUs = (lon: number, lat: number) => usProj([lon, lat]);

const worldGeo = feature(worldTopo as any, (worldTopo as any).objects.countries) as any;
const worldProj = geoEqualEarth().fitSize([WORLD_W, WORLD_H], { type: 'Sphere' } as any);
const worldPath = geoPath(worldProj);
export const worldLand = worldGeo.features.map((f: any) => worldPath(f) ?? '').join('');
export const projectWorld = (lon: number, lat: number) => worldProj([lon, lat]);

/** Sequential Ice ramp, dark (few) -> bright (many), for the dark surface. */
export const SEQ = ['#064b4b', '#0b6b6b', '#1f9a9a', '#45c4c4', '#b2ffff'];
export function binner(values: number[]) {
  const max = Math.max(0, ...values);
  if (!max) return () => null;
  // Equal-interval bins on a sqrt scale so one big state doesn't wash out the rest.
  return (v: number) => (v > 0 ? SEQ[Math.min(SEQ.length - 1, Math.floor((Math.sqrt(v) / Math.sqrt(max)) * SEQ.length - 1e-9))] : null);
}
