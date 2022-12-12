import { scrape } from '../../api';
import { format } from 'date-fns';
import { AvailableHourUpdate, CourtType, HallId, Hour } from 'shared';

const matchi = async (
  url: string,
  hallId: HallId,
  date: Date,
  courtToType: (court: string) => CourtType
): Promise<AvailableHourUpdate> => {
  const $ = await scrape(url);

  const hours: Hour[] = $('td[class="slot free"]')
    .map((_, e) => {
      const title = $(e).attr('title') ?? '';
      const court = title.split('<br>')[1];
      const hours = title.split('<br>')[2].trim();
      return {
        court,
        courtType: courtToType(court),
        thirtyMinutes: true,
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
    link: 'https://www.matchi.se/facilities/padelrocks?lang=fi',
    type: 'PADEL',
  };
};

export function padelrocks(date: Date) {
  const day = format(date, 'yyyy-MM-dd');
  return matchi(
    `https://www.matchi.se/book/schedule?wl=&facilityId=2070&date=${day}&sport=5&week=&year=&_=167031514${
      Math.floor(Math.random() * (9999 - 1000)) + 1000
    }`,
    'padelrocks',
    date,
    (court) =>
      court.toLowerCase().includes('single') ? 'PADEL-TWO-PLAYER' : 'INSIDE'
  );
}
