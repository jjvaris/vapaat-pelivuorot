import { AvailableHourUpdate, CourtType, HallId, Type } from 'shared';
import { scrape, fake } from '../api';

type Options = {
  url: string;
  hallId: HallId;
  courtToCourtType: (court: string) => CourtType;
  type: Type;
};

export default async function ({
  hallId,
  type,
  courtToCourtType,
  url,
}: Options): Promise<AvailableHourUpdate> {
  const $ = await scrape(url);
  // const $ = await fake('meilahti.html');
  const freeHours = $('td[class*="s-avail"], td[class*="s-avail-short"]')
    .filter((_, e) => $(e).children('a').attr() !== undefined)
    .map((_, e) => {
      const href = $(e).children('a').attr().href;
      const fullHour = ['kesto=60', 'kesto=90'].some((v) => href.includes(v));
      const htmlParts = $(e).children().html()?.split('<br>') ?? [];
      const court = htmlParts[0];
      const hour = htmlParts[1];
      const courtType: CourtType =
        court === 'Pallotykki' || court.includes('PT')
          ? 'BALL-LAUNCHER'
          : courtToCourtType(court);
      return { court, courtType, hour, fullHour };
    })
    .get();

  const day = $('#bookingcalform-p_pvm_custom').val();
  const dateTime = day?.slice(day.length - 10, day.length) ?? '';

  return {
    hallId,
    id: hallId,
    day: `${dateTime.slice(6, 10)}-${dateTime.slice(3, 5)}-${dateTime.slice(
      0,
      2
    )}`,
    type,
    link: url,
    hours: freeHours.map(({ court, courtType, hour, fullHour }) => ({
      hour,
      thirtyMinutes: !fullHour,
      court,
      courtType,
    })),
  };
}
