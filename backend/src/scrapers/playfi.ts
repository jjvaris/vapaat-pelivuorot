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
  const freeHours = $('td[class="s-avail"], td[class="s-avail-short"]')
    .map((_, e) => {
      const fullHour = $(e).children('a').attr().href.includes('kesto=60');
      const text = $(e).children().text();
      const htmlParts = $(e).children().html()?.split('<br>') ?? [];
      const court = htmlParts[0];
      //console.log(court);
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
