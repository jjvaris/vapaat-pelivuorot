import { scrape } from '../api';
import { format } from 'date-fns';
import { AvailableHourUpdate, Hour } from 'shared';

const getAvailableHours = async (url: string) => {
  const $ = await scrape(url);
  const availableHours: Hour[] = $('tr[class=state_R],tr[class=state_F]')
    .filter(
      (_, e) => $(e).find('td[class="state_white res_success"]').length > 0
    )
    .map((_, e): Hour => {
      return {
        hour: $(e).text().split(' - ')[0],
        court: 'n/a',
        courtType: 'INSIDE',
        thirtyMinutes: false,
      };
    })
    .get();
  const day = $('#date_select option:selected').val() as string;
  return [
    `${day.slice(6, 10)}-${day.slice(3, 5)}-${day.slice(0, 2)}`,
    availableHours,
  ] as const;
};

export const esport1TennisInside = async (
  date: Date
): Promise<AvailableHourUpdate> => {
  const today = format(date, 'dd.MM.yyyy');
  const courts10To14 = `https://varaus.esportcenter.fi/varaus/index.php?func=mod_rc_v2&pageId=3&cdate=${today}`;
  const [day, hours] = await getAvailableHours(courts10To14);
  return {
    hallId: 'esport-center-tapiola',
    day,
    hours,
    type: 'TENNIS',
    link: courts10To14,
    id: 'esport-center-tapiola-1',
  };
};

export const esport2TennisInside = async (
  date: Date
): Promise<AvailableHourUpdate> => {
  const today = format(date, 'dd.MM.yyyy');
  const courts1To8 = `https://varaus.esportcenter.fi/varaus/index.php?func=mod_rc_v2&pageId=4&cdate=${today}`;
  const [day, hours] = await getAvailableHours(courts1To8);
  return {
    hallId: 'esport-center-tapiola',
    day,
    hours,
    type: 'TENNIS',
    link: courts1To8,
    id: 'esport-center-tapiola-2',
  };
};
