import { format } from 'date-fns';
import { AvailableHourUpdate, Hall, State } from 'shared';

const halls: Hall[] = [
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
    name: 'Smash Center Helsinki',
    link: 'https://smashcenter.slsystems.fi/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['TENNIS'],
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
  {
    id: 'laajasalon-tenniskeskus',
    name: 'Laajasalon Tenniskeskus',
    link: 'https://vj.slsystems.fi/laajasalonpalloiluhallit/',
    coordinates: [1, 2],
    types: ['TENNIS'],
  },
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
    id: 'padelpoint',
    name: 'Padelpoint',
    link: 'https://play.fi/padelpoint/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
  {
    id: 'hiekkabeach',
    name: 'Hiekka Beach',
    link: 'https://play.fi/hiekkabeach/booking/booking-calendar',
    coordinates: [1, 2],
    types: ['PADEL'],
  },
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
          ({ hallId, type, day, link }) =>
            hallId !== update.hallId ||
            type !== update.type ||
            day !== update.day ||
            link !== update.link
        ),
        ...update.hours.map(({ hour, thirtyMinutes, courtType, court }) => ({
          hour,
          link: update.link,
          hallId: update.hallId,
          day: update.day,
          thirtyMinutes,
          type: update.type,
          courtType: courtType,
          court,
        })),
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
