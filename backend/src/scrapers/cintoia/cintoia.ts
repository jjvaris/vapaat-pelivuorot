import { format } from 'date-fns';
import { get, post } from '../../api';
import { AvailableHourUpdate, CourtType, Hour } from 'shared';

const memoize = <T>(fn: (args?: any) => T): ((args?: any) => T) => {
  let cache: Record<string, T> = {};
  evict();
  function evict() {
    const twentyMinutes = 1200_000;
    setTimeout(() => {
      cache = {};
      evict();
    }, twentyMinutes);
  }
  return (args?: any) => {
    if (cache[args]) {
      return cache[args];
    }
    const response = fn(args);
    cache[args] = response;
    return response;
  };
};

const getResources = memoize((customerid: string) =>
  post('https://europe-west1-falcon-328a1.cloudfunctions.net/ui-get', {
    data: { q: 'getResources', customerid },
  })
);

const getFreeIndex = memoize((customerid: string) =>
  get(`https://falcon-328a1.firebaseio.com/freeindex/${customerid}/public.json`)
);

type FreeHour = {
  s: string;
  e: string;
  ex: { e: string }[];
};

const courtToCourtType: Record<string, CourtType> = {
  UK28: 'OUTSIDE',
  UK29: 'OUTSIDE',
  UK30: 'OUTSIDE',
  KPK31: 'PADEL-TWO-PLAYER',
  KPK32: 'PADEL-TWO-PLAYER',
  KPK33: 'PADEL-TWO-PLAYER',
  Pallotykki: 'BALL-LAUNCHER',
};

// start: 0730
const isThiryMinutes = (start: string, ends: Set<string>) =>
  !ends.has(
    `${start[1] === '9' ? parseInt(start[0]) + 1 : start[0]}${
      start[1] === '9' ? '0' : parseInt(start[1]) + 1
    }${start[2]}${start[3]}`
  );

export async function cintoia(
  date: Date,
  customerId: string,
  type: 'Padel'
): Promise<Hour[]> {
  const { data: resources } = await getResources(customerId);
  const { data: freeIndex } = await getFreeIndex(customerId);
  const day = format(date, 'yyyyMMdd');
  const { data: freeHoursForDay } = await get<Record<string, FreeHour[]>>(
    freeIndex[day].key
  );
  const hours: Hour[] = [];
  Object.entries(freeHoursForDay)
    .filter(
      ([courtInfoHash, freeHours]) =>
        resources?.result[courtInfoHash]?.sport === type
    )
    .forEach(([courtInfoHash, freeHours]) => {
      const starts = new Set<string>();
      const ends = new Set<string>();
      freeHours.forEach((freeHour) => {
        starts.add(freeHour.s);
        ends.add(freeHour.e);
        freeHour.ex?.forEach(({ e }) => ends.add(e));
      });
      starts.forEach((start) => {
        const displayName =
          resources?.result[courtInfoHash]?.displayName ?? 'n/a';
        hours.push({
          court: displayName,
          courtType: courtToCourtType[displayName] ?? 'INSIDE',
          hour: `${start[0]}${start[1]}:${start[2]}${start[3]}`,
          thirtyMinutes: isThiryMinutes(start, ends),
          isMembersOnly: false,
        });
      });
    });

  return hours;
}

export async function padelhouse(date: Date): Promise<AvailableHourUpdate> {
  const hours = await cintoia(date, 'padelhouse-Y0aRF9RZ', 'Padel');
  return {
    day: format(date, 'yyyy-MM-dd'),
    hallId: 'padelhouse',
    hours,
    type: 'PADEL',
    id: 'padelhouse',
    link: 'https://padelhouse.cintoia.com/',
  };
}
