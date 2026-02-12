import moment from 'moment';
import { openSync, writeSync, closeSync } from 'fs';

export type Pay = {
  id: string;
  contact_id: string;
  created_at: string;
  status: 'pending' | 'paid';
  amount: number; // stored in cents
  direction: 'send' | 'request';
  memo: string;
};


const CONTACT_IDS = [
  'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
  '3958dc9e-712f-4377-85e9-fec4b6a6442a',
  '3958dc9e-742f-4377-85e9-fec4b6a6442a',
  '76d65c26-f784-44a2-ac19-586678f7c2f2',
  'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
  '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
];

const STATUSES: Pay['status'][] = ['pending', 'paid'];
const DIRECTIONS: Pay['direction'][] = ['send', 'request'];
const MEMOS = [
  '🍽️ dinner', '🥗 lunch', '☕ coffee', '🏠 rent split', '💡 utilities',
  '🛒 groceries', '🎶 concert tickets', '⛽ gas money', '🎁 birthday gift',
  '🎬 movie night', '🚗 uber ride', '🏋️ gym membership', '📶 wifi bill',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function printFront(msg: string) {
  console.log('\r')
  console.log(msg)
}

let idCounter = 0;

function generatePay(year: number = 2024): Pay {
  const month = randomInt(0, 11);
  const maxDay = moment({ year, month }).daysInMonth();
  const day = randomInt(1, maxDay);
  const date = moment({ year, month, day });

  // attempt at generating cool progress spinner.. might come back later
  printFront('-')
  printFront('\\')
  printFront('-')
  printFront('/')

  idCounter++;

  return {
    id: `pay-${String(idCounter).padStart(4, '0')}`,
    contact_id: pick(CONTACT_IDS),
    created_at: date.format('YYYY-MM-DD'),
    status: pick(STATUSES),
    amount: randomInt(250, 50000),
    direction: pick(DIRECTIONS),
    memo: pick(MEMOS),
  };
}

function generatePays(count: number, year: number): Pay[] {
  return Array.from({ length: count }, () => generatePay(year));
}

function main() {
  console.log('Generating pays');
  const pays = generatePays(500, moment().year() - 1)
  const fh = openSync('./scripts/pays.json', 'w');
  writeSync(fh, JSON.stringify({pays}))
  closeSync(fh);
}

main();
