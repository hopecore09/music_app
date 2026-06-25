import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const cache = {};

export async function loadJSON(file) {
  if (cache[file]) return cache[file];
  const data = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
  cache[file] = JSON.parse(data);
  return cache[file];
}

export const loadLocales = () => loadJSON('locales.json');
export const loadGenres = () => loadJSON('genres.json');

export const pickRandom = (arr, rng) => arr[Math.floor(rng() * arr.length)];

export const fractionalRound = (rng, value) => {
  const base = Math.floor(value);
  return base + (rng() < (value % 1) ? 1 : 0);
};