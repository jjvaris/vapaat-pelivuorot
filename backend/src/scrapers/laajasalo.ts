import { scrape } from '../api';
import { format } from 'date-fns';
import { AvailableHourUpdate, Hour } from 'shared';

export const laajasalonTenniskeskus = async (
  date: Date
): Promise<AvailableHourUpdate> => {
  const isoDate = format(date, 'yyyy-MM-dd');
  const url = `https://vj.slsystems.fi/laajasalonpalloiluhallit/ftpages/ft-varaus-table-01.php?laji=1&pvm=${isoDate}&goto=0`;
  const $ = await scrape(url);

  const hours = $("a:contains('Varaa')")
    .map((_, e): Hour & { day: string } => {
      const { href } = $(e).attr();
      const day = href.split('pvm=')[1].slice(0, 10);
      const hour = href.split('klo=')[1].slice(0, 5);
      const thirtyMinutes = !href.includes('kesto=01');
      const court = $(e).parent().parent().text()[0];

      return {
        hour,
        courtType: 'INSIDE',
        court,
        thirtyMinutes,
        day,
      };
    })
    .get();
  return {
    hallId: 'laajasalon-tenniskeskus',
    day: hours[0]?.day ?? isoDate,
    hours,
    link: url,
    type: 'TENNIS',
  };
};
