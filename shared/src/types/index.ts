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
  | 'billebeinopadel'
  | 'hiekkabeach'
  | 'padelrocks'
  | 'padelpoint-konala'
  | 'social-sports-club'
  | 'finlandsuomenojaespoo'
  | 'finlandkiloespoo'
  | 'padel-club-finland-masala'
  | 'arena-center-kaarela'
  | 'padel-vantaa'
  | 'padelsuperpark'
  | 'finlandtammistiovantaa'
  | 'finlandvantaa'
  | 'padel-&-golf-plaza'
  | 'padel-club-finland-monni,-hyvinkää'
  | 'arena-center-padel-myllypuro'
  | 'tennismesta'
  | 'hiekkaharjuntenniskeskus';

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
