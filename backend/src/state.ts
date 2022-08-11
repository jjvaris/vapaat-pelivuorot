import { format } from 'date-fns';
import { AvailableHourUpdate, Hall, State } from 'shared';

export const halls: Hall[] = [
  {
    id: 'meilahti',
    name: 'Meilahden liikuntakeskus',
    link: 'https://meilahti.slsystems.fi/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'varisto',
    name: 'Variston Tenniskeskus',
    link: 'https://play.fi/varisto/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'targa',
    name: 'Targa Arena',
    link: 'https://play.fi/targaarena/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS', 'PADEL'],
  },
  {
    id: 'tapiolan-tennispuisto',
    name: 'Tapiolan Tennispuisto',
    link: 'https://play.fi/tapiolantennispuisto/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'mandalum-center',
    name: 'Mandalum Center',
    link: 'https://play.fi/mandatumcenter/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'helsingin-mailapelikeskus',
    name: 'Helsingin Mailapelikeskus',
    link: 'https://play.fi/mailapelikeskus/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'esport-center-tapiola',
    name: 'Esport Center Tapiola',
    link: 'https://varaus.esportcenter.fi/varaus/index.php?func=mod_rc_v2',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'smash-center-helsinki',
    name: 'Smash Center Helsinki, Myllypuro',
    link: 'https://smashcenter.slsystems.fi/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS', 'PADEL'],
  },
  {
    id: 'smash-center-olari',
    name: 'Smash Center Olari',
    link: 'https://smashcenter.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=7&BookingCalForm%5Bp_pvm%5D=2021-11-06&BookingCalForm%5Bp_pvm_interval%5D=&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Lauantai+06.11.2021',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'talin-tenniskeskus',
    name: 'Talin Tenniskeskus',
    link: 'https://talitaivallahti.feel.cintoia.com/',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  {
    id: 'taivallahti',
    name: 'Taivallahti',
    link: 'https://talitaivallahti.feel.cintoia.com/',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
  // {
  //   id: 'laajasalon-tenniskeskus',
  //   name: 'Laajasalon Tenniskeskus',
  //   link: 'https://vj.slsystems.fi/laajasalonpalloiluhallit/',
  //   coordinates: [1, 2],
  //   types: ['TENNIS'],
  // },
  {
    id: 'padelhouse',
    name: 'Padel House',
    link: 'https://padelhouse.slsystems.fi/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
  {
    id: 'padelhouse-uusi',
    name: 'Padel House (uusi)',
    link: 'https://padelhouse.slsystems.fi/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
  {
    id: 'billebeinopadel',
    name: 'Billebeino Padel',
    link: 'https://play.fi/billebeinopadel/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
  {
    id: 'padelpoint-konala',
    name: 'PadelPoint Konala',
    link: 'https://playtomic.io/',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
  // {
  //   id: 'hiekkabeach',
  //   name: 'Hiekka Beach',
  //   link: 'https://play.fi/hiekkabeach/booking/booking-calendar',
  //   coordinates: [1, 2],
  //   types: ['PADEL'],
  // },
  {
    id: 'padelrocks',
    name: 'Padel Rocks',
    link: 'https://play.fi/padelrocks/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
  {
    id: 'social-sports-club',
    name: 'Social Sports Club',
    link: 'https://play.fi/socialsportsclub/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
  {
    id: 'padel-club-finland---suomenoja-espooo',
    name: 'Padel Club Finland - Suomenoja Espoo',
    link: 'https://playtomic.io/',
    coordinates: [60.166183, 24.703338],
    types: ['PADEL'],
  },
  {
    id: 'padel-club-finland---kilo-espoo',
    name: 'Padel Club Finland - Kilo Espoo',
    link: 'https://playtomic.io/',
    coordinates: [60.210771, 24.751772],
    types: ['PADEL'],
  },
  {
    id: 'padel-club-finland-masala',
    name: 'Padel Club Finland Masala, Kirkkonummi',
    link: 'https://playtomic.io/',
    coordinates: [60.16242424, 24.5380983],
    types: ['PADEL'],
  },
  {
    id: 'arena-center-kaarela',
    name: 'Arena Center Kaarela',
    link: 'https://playtomic.io/',
    coordinates: [60.23773592, 24.90034999],
    types: ['PADEL'],
  },
  {
    id: 'padel-vantaa',
    name: 'Open Padel Kaivoksela',
    link: 'https://playtomic.io/',
    coordinates: [60.2675318, 24.8763947],
    types: ['PADEL'],
  },
  {
    id: 'padelsuperpark',
    name: 'Padel SuperPark, Tammisto',
    link: 'https://playtomic.io/',
    coordinates: [60.27625262, 24.97181929],
    types: ['PADEL'],
  },
  {
    id: 'padel-club-finland,-tammisto',
    name: 'Padel Club Finland - Tammisto, Vantaa',
    link: 'https://playtomic.io/',
    coordinates: [60.28509982, 24.97519515],
    types: ['PADEL'],
  },
  {
    id: 'padel-club-finland,-porttipuisto',
    name: 'Padel Club Finland - Porttipuisto Vantaa',
    link: 'https://playtomic.io/',
    coordinates: [60.278843, 25.085704],
    types: ['PADEL'],
  },
  {
    id: 'padel-&-golf-plaza',
    name: 'Padel & Golf Plaza',
    link: 'https://playtomic.io/',
    coordinates: [60.3448783, 25.0260579],
    types: ['PADEL'],
  },
  {
    id: 'padel-club-finland-monni,-hyvinkää',
    name: 'Padel Club Finland Monni, Hyvinkää',
    link: 'https://playtomic.io/',
    coordinates: [60.625524, 24.8489827],
    types: ['PADEL'],
  },
  {
    id: 'tennismesta',
    name: 'Tennismesta, Kera',
    link: 'https://tennismesta.slsystems.fi/booking/booking-calendar',
    coordinates: [60.0, 24.0],
    types: ['TENNIS'],
  },
  {
    id: 'arena-center-padel-myllypuro',
    name: 'Arena Center Padel, Myllypuro',
    link: 'https://smashcenter.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=10&BookingCalForm%5Bp_pvm%5D=2022-01-16&BookingCalForm%5Bp_pvm_interval%5D=&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Sunnuntai+16.01.2022',
    coordinates: [60.0, 24.0],
    types: ['PADEL'],
  },
  {
    id: 'hiekkaharjuntenniskeskus',
    name: 'Hiekkaharjun Tenniskeskus',
    link: 'https://playtomic.io/',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
];

export function factory() {
  let state: State = {
    halls,
    availableHours: [],
  };

  function updateHours(update: AvailableHourUpdate): State {
    state = {
      ...state,
      availableHours: [
        ...state.availableHours.filter(
          ({ hallId, type, day, id }) =>
            hallId !== update.hallId ||
            type !== update.type ||
            day !== update.day ||
            id !== update.id
        ),
        ...update.hours.map(
          ({
            hour,
            thirtyMinutes,
            courtType,
            court,
            isMembersOnly = false,
          }) => ({
            hour,
            id: update.id,
            link: update.link,
            hallId: update.hallId,
            day: update.day,
            thirtyMinutes,
            type: update.type,
            courtType: courtType,
            isMembersOnly: isMembersOnly,
            court,
          })
        ),
      ],
    };
    return state;
  }

  /** clean available hours on past */
  function clean() {
    state = {
      ...state,
      availableHours: [
        ...state.availableHours.filter(
          (hour) => hour.day >= format(new Date(), 'yyyy-MM-dd')
        ),
      ],
    };
  }

  return {
    get: () => state,
    updateAvailableHours: (
      update: AvailableHourUpdate | AvailableHourUpdate[]
    ) =>
      Array.isArray(update) ? update.forEach(updateHours) : updateHours(update),
    clean,
  };
}

export default factory();
