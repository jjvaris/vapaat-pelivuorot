import { scrape } from '../../api';
import { addDays, format } from 'date-fns';
import { AvailableHourUpdate, HallId, Hour } from 'shared';

const scrapePadelhouse = async (
  url: string,
  hallId: HallId,
  date: Date
): Promise<AvailableHourUpdate> => {
  const isoDate = format(date, 'yyyy-MM-dd');
  const $ = await scrape(url);

  const hours = $("a:contains('Varaa')")
    .map((_, e): Hour & { day: string } => {
      const href = decodeURIComponent($(e).attr().href);
      const day = href.split('alkuaika=')[1].slice(0, 10);
      const hour = href.split('alkuaika=')[1].slice(11, 16);
      const thirtyMinutes = !href.includes('kesto=60');
      const court = $(e).text().split(' ')[0];
      return {
        hour,
        courtType: 'INSIDE',
        court,
        thirtyMinutes,
        day,
      };
    })
    .get()
    .filter((hour) => !hour.court.includes('Cupra'));
  return {
    hallId,
    day: hours[0]?.day ?? isoDate,
    hours,
    link: url,
    type: 'PADEL',
  };
};

export const padelhouse = async (date: Date): Promise<AvailableHourUpdate> => {
  const isoDate = format(addDays(date, 1), 'yyyy-MM-dd');
  const url = `https://padelhouse.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=1&BookingCalForm%5Bp_pvm%5D=${isoDate}&BookingCalForm%5Bp_pvm_interval%5D=-1&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Tiistai+07.12.2021`;
  return scrapePadelhouse(url, 'padelhouse', date);
};

export const padelhouseUusi = async (
  date: Date
): Promise<AvailableHourUpdate> => {
  const isoDate = format(date, 'yyyy-MM-dd');
  const url = `https://padelhouse.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=2&BookingCalForm%5Bp_pvm%5D=${isoDate}&BookingCalForm%5Bp_pvm_interval%5D=&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Maanantai+06.12.2021`;
  return scrapePadelhouse(url, 'padelhouse-uusi', date);
};
