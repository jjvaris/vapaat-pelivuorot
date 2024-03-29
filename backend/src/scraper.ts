import state from './state';
import { format, addDays, parseISO } from 'date-fns';
import scrapers, {
  socialSportsClub,
  playtomic,
  padelrocks,
  arenaCenterMyllypuro,
  esport1TennisInside,
  esport2TennisInside,
  smashCenterPadel,
  varisto,
  billebeino,
} from './scrapers';
import { AvailableHourUpdate } from 'shared';
import {
  mandalum,
  meilahti,
  padelhouse,
  talinTenniskeskus,
  tapiolanTennispuisto,
} from './scrapers/cintoia/cintoia';

const random = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min) + min);

const schedule = (fn: () => void, max = 300000, min = 0) =>
  setTimeout(fn, random(max, min));

const scrapeByDate = (
  date: Date,
  name: string,
  fn: (date: Date) => Promise<AvailableHourUpdate | AvailableHourUpdate[]>
) => {
  //console.log('scraping', name);
  fn(date)
    .then(state.updateAvailableHours)
    //.then(() => console.log(`scraping ${date} ${name} completed`))
    .catch((e) => console.log(`scraping ${date} ${name} failed`, e));
};

const tenMinutes = 600_000;
const twentyMinutes = 1200_000;
const oneDay = 1000 * 60 * 60 * 24;

const resolveTimeout = () => {
  const currentHour = new Date().getHours();
  return (currentHour > 5 && currentHour < 23) || currentHour === 0
    ? tenMinutes
    : twentyMinutes;
};

export function start() {
  console.log('Starting scrapers');
  scrapeLoop();
  //scrapeByDate(parseISO('2023-11-08'), 'test', padelhouse);
  //scrapeAll();
  cleanLoop();
}

function scrapeLoop() {
  scrapeAll();
  setTimeout(() => {
    scrapeLoop();
  }, resolveTimeout());
}

function cleanLoop() {
  //console.log('cleaning');
  setTimeout(() => {
    state.clean();
    cleanLoop();
  }, oneDay);
}

export function scrapeAll() {
  const daysToScrape = Array.from({ length: 14 }, (v, i) =>
    addDays(new Date(), i)
  );
  daysToScrape.forEach(scrapeAllByDate);
}

function scrapeAllByDate(date: Date) {
  //console.log('Scheduling all scrapers to scrape ', format(date, 'yyyy-MM-dd'));
  scrapers.forEach(({ name, scraper }) =>
    schedule(() => scrapeByDate(date, name, scraper))
  );
}
