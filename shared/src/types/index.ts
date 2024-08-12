export type State = {
  halls: Hall[];
  availableHours: AvailableHour[];
};

export type HallId =
  | 'meilahti'
  | 'tapiola'
  | 'talin-tenniskeskus'
  | 'taivallahti'
  | 'varisto'
  | 'targa'
  | 'tapiolan-tennispuisto'
  | 'mandalum-center'
  | 'helsingin-mailapelikeskus'
  | 'esport-center-tapiola'
  | 'smash-center-helsinki'
  | 'smash-center-olari'
  | 'laajasalon-tenniskeskus'
  | 'padelhouse'
  | 'padelhouse-uusi'
  | 'billebeino-padel-train-factory'
  | 'hiekkabeach'
  | 'padelrocks'
  | 'padelpoint-konala'
  | 'social-sports-club'
  | 'padel-club-finland---suomenoja-espooo'
  | 'padel-club-finland---kilo-espoo'
  | 'padel-club-finland-masala'
  | 'padel-club-viikinranta'
  | 'padel-vantaa'
  | 'padelsuperpark'
  | 'padel-club-finland,-tammisto'
  | 'padel-club-finland,-porttipuisto'
  | 'padel-&-golf-plaza'
  | 'padel-club-finland-monni,-hyvinkää'
  | 'arena-center-padel-myllypuro'
  | 'tennismesta'
  | 'hiekkaharjuntenniskeskus'
  | 'open-padel-martinlaakso'
  | 'padel-club-finland,-pirkkola'
  | 'superpadel-siltamäkii'
  | 'the-park-padel-konala';

export type Type = 'TENNIS' | 'PADEL' | 'BADMINTON' | 'SQUASH';

export type CourtType =
  | 'INSIDE'
  | 'OUTSIDE'
  | 'INFLATED'
  | 'BALL-LAUNCHER'
  | 'PADEL-TWO-PLAYER';

export type Hall = {
  id: HallId;
  name: string;
  link: string;
  coordinates: [number, number];
  types: Type[];
};

export type AvailableHour = {
  hallId: HallId;
  day: string;
  hour: string;
  thirtyMinutes: boolean;
  isMembersOnly: boolean;
  court?: string;
  courtType: CourtType;
  type: Type;
  link: string;
  id: string;
};

export type Hour = {
  // 08:00
  hour: string;
  thirtyMinutes: boolean;
  courtType: CourtType;
  court: string;
  isMembersOnly?: boolean;
};

export type AvailableHourUpdate = {
  hallId: HallId;
  type: Type;
  /* yyyy-MM-dd */
  day: string;
  link: string;
  id: string;
  hours: Hour[];
};
