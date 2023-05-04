import { scrape } from '../../api';
import { format } from 'date-fns';
import { AvailableHourUpdate, CourtType, HallId, Hour, Type } from 'shared';

const matchi = async (
  url: string,
  hallId: HallId,
  date: Date,
  courtToType: (court: string) => CourtType,
  link: string,
  type: Type = 'PADEL'
): Promise<AvailableHourUpdate> => {
  const $ = await scrape(url);

  const hours: Hour[] = $('td[class="slot free"]')
    .map((_, e) => {
      const title = $(e).attr('title') ?? '';
      const court = title.split('<br>')[1];
      const hours = title.split('<br>')[2].trim();
      const firstMinute = hours[3];
      const secondMinute = hours[11];
      return {
        court,
        courtType: courtToType(court),
        thirtyMinutes: firstMinute !== secondMinute,
        hour: hours.substring(0, 5),
        isMembersOnly: false,
      };
    })
    .get();

  // two sequential half hours combined to full hour
  const combined: Hour[] = [];
  for (let i = 0; i < hours.length - 1; i++) {
    const [hour, minutes] = hours[i].hour.split(':').map((i) => parseInt(i));
    const [nextHour, nextMinutes] = hours[i + 1].hour
      .split(':')
      .map((i) => parseInt(i));
    if (hour === nextHour) {
      combined.push({
        ...hours[i],
        hour: `${hour.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`,
        thirtyMinutes: false,
      });
      i++;
      continue;
    } else if (hour + 1 === nextHour && minutes !== nextMinutes) {
      combined.push({
        ...hours[i],
        hour: `${hour.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`,
        thirtyMinutes: false,
      });
      i++;
      continue;
    }
    combined.push(hours[i]);
    if (i + 1 === hours.length - 1) {
      // Last thirty minutes item
      combined.push(hours[i + 1]);
    }
  }

  return {
    hallId,
    id: hallId,
    day: format(date, 'yyyy-MM-dd'),
    hours: combined,
    link,
    type,
  };
};

const getUrl = (
  date: Date,
  facilityId: string,
  type: 'PADEL' | 'TENNIS' = 'PADEL'
) => {
  const typeToSportId = { PADEL: '5', TENNIS: '1' };
  const sport = typeToSportId[type];
  const day = format(date, 'yyyy-MM-dd');
  return `https://www.matchi.se/book/schedule?wl=&facilityId=${facilityId}&date=${day}&sport=${sport}&week=&year=&_=167031514${
    Math.floor(Math.random() * (9999 - 1000)) + 1000
  }`;
};

export function padelrocks(date: Date) {
  return matchi(
    getUrl(date, '2070'),
    'padelrocks',
    date,
    (court) =>
      court.toLowerCase().includes('single') ? 'PADEL-TWO-PLAYER' : 'INSIDE',
    'https://www.matchi.se/facilities/padelrocks?lang=fi'
  );
}

export function theParkPadelKonala(date: Date) {
  return matchi(
    getUrl(date, '2062'),
    'the-park-padel-konala',
    date,
    () => 'INSIDE',
    'https://www.matchi.se/facilities/THEPARKKONALA'
  );
}

export function socialSportsClub(date: Date) {
  return matchi(
    getUrl(date, '1953'),
    'social-sports-club',
    date,
    () => 'INSIDE',
    'https://www.matchi.se/facilities/socialsportsclub'
  );
}

export function varisto(date: Date) {
  return matchi(
    getUrl(date, '2067', 'TENNIS'),
    'varisto',
    date,
    () => 'INSIDE',
    'https://www.matchi.se/facilities/varistontennis',
    'TENNIS'
  );
}

export function billebeino(date: Date) {
  return matchi(
    getUrl(date, '2257'),
    'billebeino-padel-train-factory',
    date,
    () => 'INSIDE',
    'https://www.matchi.se/facilities/billebeinohelsinki',
    'PADEL'
  );
}

export const matchiScrapers = [
  { name: 'padelrocks', scraper: padelrocks },
  { name: 'the-park-padel-konala', scraper: theParkPadelKonala },
  { name: 'social-sports-club', scraper: socialSportsClub },
  { name: 'varisto', scraper: varisto },
  { name: 'billebeino', scraper: billebeino },
] as const;
