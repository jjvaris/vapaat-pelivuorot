import { targaTennisInside, targaPadelInside } from './targa';
import { talitaivallahti } from './talitaivallahti';
import { tapiolanTennispuistoInside } from './tapiolanTennispuisto';
import { helsinginMailapelikeskusTennisInside } from './helsinginMailapelikeskus';
import { esport1TennisInside, esport2TennisInside } from './esportTapiola';
import { smashCenterHelsinki } from './smashHelsinki';
import { smashCenterOlari } from './smashOlari';
import { laajasalonTenniskeskus } from './laajasalo';
import { arenaCenterMyllypuro } from './slssystems/arenaCenterMyllypuro';
import { smashCenterPadel } from './slssystems/smashCenterPadel';
import { AvailableHourUpdate } from 'shared';
import { hiekkabeach } from './padel/hiekkabeach';
import { playtomic } from './playtomic/playtomic';
import {
  padelrocks,
  matchiScrapers,
  socialSportsClub,
  varisto,
  billebeino,
} from './matchi/matchi';
import {
  mandalum,
  meilahti,
  padelhouse,
  talinTenniskeskus,
  tapiolanTennispuisto,
} from './cintoia/cintoia';

type Scraper = (
  date: Date
) => Promise<AvailableHourUpdate | AvailableHourUpdate[]>;

const scrapers: { name: string; scraper: Scraper }[] = [
  { name: 'meilahti', scraper: meilahti },
  { name: 'targa', scraper: targaTennisInside },
  { name: 'targa-padel', scraper: targaPadelInside },
  { name: 'mandalum-center', scraper: mandalum },
  { name: 'tapiolan-tennispuisto', scraper: tapiolanTennispuisto },
  { name: 'talinTenniskeskus', scraper: talinTenniskeskus },
  {
    name: 'helsingin-mailapelikeskus',
    scraper: helsinginMailapelikeskusTennisInside,
  },
  { name: 'esport-1', scraper: esport1TennisInside },
  { name: 'esport-2', scraper: esport2TennisInside },
  // requires scraping new system
  // { name: 'smash-center-helsinki', scraper: smashCenterHelsinki },
  // { name: 'smash-center-olari', scraper: smashCenterOlari },
  // { name: 'laajasalon-tenniskeskus', scraper: laajasalonTenniskeskus },
  { name: 'padelhouse', scraper: padelhouse },
  // requires scraping new system
  // { name: 'arena-center-padel-myllypuro', scraper: arenaCenterMyllypuro },
  // requires scraping new system
  // { name: 'smash-center-padel-myllypuro', scraper: smashCenterPadel },
  //{ name: 'hiekkabeach', scraper: hiekkabeach },
  { name: 'padelrocks', scraper: padelrocks },
  { name: 'playtomic', scraper: playtomic },
  ...matchiScrapers,
];

export {
  targaPadelInside,
  hiekkabeach,
  padelrocks,
  padelhouse,
  playtomic,
  arenaCenterMyllypuro,
  smashCenterPadel,
  esport1TennisInside,
  esport2TennisInside,
  socialSportsClub,
  varisto,
  billebeino,
};

export default scrapers;
