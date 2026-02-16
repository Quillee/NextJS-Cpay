import { readFileSync, writeFileSync } from 'fs';
import { Pay } from './definitions';

const DB_PATH = 'app/data/pays.json';

export function readPays(): Pay[] {
  const raw = readFileSync(DB_PATH, 'utf-8');
  const p =JSON.parse(raw) as { pays: Pay[] };
  return p['pays'];
}

export function writePays(pays: Pay[]): void {
  writeFileSync(DB_PATH, JSON.stringify(pays, null, 2));
}

