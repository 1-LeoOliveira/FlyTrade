import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AERONAVES } from './data/aeronaves.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const seed = () => ({
  aeronaves: AERONAVES.map((a) => ({ ...a })),
  solicitacoes: [],
  leads: [],
  usuarios: [
    {
      id: 'u-admin',
      nome: 'Equipe FlyTrade',
      email: 'admin@flytrade.com.br',
      senha: 'flytrade',
      telefone: '551130000000',
      papel: 'admin',
      favoritos: [],
    },
    {
      id: 'u-demo',
      nome: 'Ricardo Almeida',
      email: 'cliente@flytrade.com.br',
      senha: 'flytrade',
      telefone: '5511988887777',
      papel: 'cliente',
      favoritos: ['phenom-300e-2021', 'cirrus-sr22t-2019'],
    },
  ],
  sessoes: {},
});

let db = seed();

function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = { ...seed(), ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) };
    } else {
      persist();
    }
  } catch (err) {
    console.error('[store] falha ao ler db.json, usando seed:', err.message);
    db = seed();
  }
}

function persist() {
  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

load();

export const getDb = () => db;
export const save = persist;

export function resetDb() {
  db = seed();
  persist();
  return db;
}
