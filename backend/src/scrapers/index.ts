import meilahti from './meilahti';
import { targaTennisInside, targaPadelInside } from './targa';
import { varistoTennisInside } from './varisto';
import { talitaivallahti } from './talitaivallahti';
import { mandalumTennisInside } from './mandalum';
import { tapiolanTennispuistoInside } from './tapiolanTennispuisto';
import { helsinginMailapelikeskusTennisInside } from './helsinginMailapelikeskus';
import { esport1TennisInside, esport2TennisInside } from './esportTapiola';
import { smashCenterHelsinki } from './smashHelsinki';
import { smashCenterOlari } from './smashOlari';
import { laajasalonTenniskeskus } from './laajasalo';
import { padelhouse, padelhouseUusi } from './slssystems/padelhouse';
import { tennismesta } from './slssystems/tennismesta';
import { arenaCenterMyllypuro } from './slssystems/arenaCenterMyllypuro';
import { smashCenterPadel } from './slssystems/smashCenterPadel';
import { AvailableHourUpdate } from 'shared';
import { hiekkabeach } from './padel/hiekkabeach';
import { playtomic } from './playtomic/playtomic';
import {
  padelrocks,
  matchiScrapers,
  theParkPadelKonala,
  socialSportsClub,
} from './matchi/matchi';

type Scraper = (
  date: Date
) => Promise<AvailableHourUpdate | AvailableHourUpdate[]>;

const scrapers: { name: string; scraper: Scraper }[] = [
  { name: 'meilahti', scraper: meilahti },
  { name: 'targa', scraper: targaTennisInside },
  { name: 'targa-padel', scraper: targaPadelInside },
  { name: 'varisto', scraper: varistoTennisInside },
  { name: 'mandalum-center', scraper: mandalumTennisInside },
  { name: 'tapiolan-tennispuisto', scraper: tapiolanTennispuistoInside },
  {
    name: 'helsingin-mailapelikeskus',
    scraper: helsinginMailapelikeskusTennisInside,
  },
  { name: 'esport-1', scraper: esport1TennisInside },
  { name: 'esport-2', scraper: esport2TennisInside },
  { name: 'smash-center-helsinki', scraper: smashCenterHelsinki },
  { name: 'smash-center-olari', scraper: smashCenterOlari },
  // { name: 'laajasalon-tenniskeskus', scraper: laajasalonTenniskeskus },
  { name: 'padelhouse', scraper: padelhouse },
  { name: 'padelhouse-uusi', scraper: padelhouseUusi },
  { name: 'tennismesta', scraper: tennismesta },
  { name: 'arena-center-padel-myllypuro', scraper: arenaCenterMyllypuro },
  { name: 'smash-center-padel-myllypuro', scraper: smashCenterPadel },
  //{ name: 'hiekkabeach', scraper: hiekkabeach },
  { name: 'padelrocks', scraper: padelrocks },
  { name: 'playtomic', scraper: playtomic },
  ...matchiScrapers,
];

export {
  talitaivallahti,
  targaPadelInside,
  hiekkabeach,
  padelrocks,
  padelhouse,
  padelhouseUusi,
  playtomic,
  tennismesta,
  arenaCenterMyllypuro,
  smashCenterPadel,
  esport1TennisInside,
  esport2TennisInside,
  theParkPadelKonala,
  socialSportsClub,
};

export default scrapers;
