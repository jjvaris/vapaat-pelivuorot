import meilahti from './meilahti';
import { targaTennisInside } from './targa';
import { varistoTennisInside } from './varisto';
import { talitaivallahti } from './talitaivallahti';
import { mandalumTennisInside } from './mandalum';
import { tapiolanTennispuistoInside } from './tapiolanTennispuisto';
import { helsinginMailapelikeskusTennisInside } from './helsinginMailapelikeskus';
import { esport1TennisInside, esport2TennisInside } from './esportTapiola';
import { smashCenterHelsinki } from './smashHelsinki';
import { smashCenterOlari } from './smashOlari';
import { laajasalonTenniskeskus } from './laajasalo';
import { AvailableHourUpdate } from 'shared';

type Scraper = (date: Date) => Promise<AvailableHourUpdate>;

const scrapers: { name: string; scraper: Scraper }[] = [
  { name: 'meilahti', scraper: meilahti },
  { name: 'targa', scraper: targaTennisInside },
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
];

export { talitaivallahti };

export default scrapers;
