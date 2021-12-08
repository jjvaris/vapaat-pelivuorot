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
import { AvailableHourUpdate } from 'shared';
import billebeino from './padel/billebeino';
import { padelpoint } from './padel/padelpoint';
import { hiekkabeach } from './padel/hiekkabeach';
import { padelrocks } from './padel/padelrocks';
import { socialSportsClub } from './padel/socialSportsClub';

type Scraper = (date: Date) => Promise<AvailableHourUpdate>;

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
  { name: 'laajasalon-tenniskeskus', scraper: laajasalonTenniskeskus },
  { name: 'padelhouse', scraper: padelhouse },
  { name: 'padelhouse-uusi', scraper: padelhouseUusi },
  { name: 'billebeinopadel', scraper: billebeino },
  { name: 'padelpoint', scraper: padelpoint },
  { name: 'hiekkabeach', scraper: hiekkabeach },
  { name: 'padelrocks', scraper: padelrocks },
  { name: 'social-sports-club', scraper: socialSportsClub },
];

export {
  talitaivallahti,
  targaPadelInside,
  padelpoint,
  hiekkabeach,
  padelrocks,
  padelhouse,
  padelhouseUusi,
  socialSportsClub,
};

export default scrapers;
