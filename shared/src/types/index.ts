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
  | 'laajasalon-tenniskeskus';

export type Type = 'TENNIS' | 'PADEL' | 'BADMINTON' | 'SQUASH';

export type CourtType = 'INSIDE' | 'OUTSIDE' | 'INFLATED' | 'BALL-LAUNCHER';

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
  court?: string;
  courtType: CourtType;
  type: Type;
  link: string;
};

export type Hour = {
  hour: string;
  thirtyMinutes: boolean;
  courtType: CourtType;
  court: string;
};

export type AvailableHourUpdate = {
  hallId: HallId;
  type: Type;
  /* yyyy-MM-dd */
  day: string;
  link: string;
  hours: Hour[];
};
