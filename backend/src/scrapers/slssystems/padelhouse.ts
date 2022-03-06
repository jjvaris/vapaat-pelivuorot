import { scrape } from '../../api';
import { addDays, format } from 'date-fns';
import { AvailableHourUpdate, HallId, Hour } from 'shared';
import { CheerioAPI } from 'cheerio';

const getHour = (hour: string) => {
  const s = hour.split(':');
  return `${s[0].substring(s[0].length - 2)}:${s[1].substring(0, 2)}`;
};

const getCourt = (hour: string) => hour.split(':')[0].slice(0, -2).trim();

const isMembersOnly = (hour: string) =>
  !hour.toLocaleLowerCase().includes('varaa');

const getHours = ($: CheerioAPI, selector: string, thirtyMinutes: boolean) =>
  $(selector)
    .map((_, e) => $(e).text())
    .get()
    .filter((hour) => !hour.toLocaleLowerCase().includes('cupra'))
    .map((hour): Hour => {
      return {
        hour: getHour(hour),
        courtType: getCourt(hour).toLocaleLowerCase().includes('tykki')
          ? 'BALL-LAUNCHER'
          : 'INSIDE',
        court: getCourt(hour),
        thirtyMinutes,
        isMembersOnly: isMembersOnly(hour),
      };
    });

const scrapePadelhouse = async (
  url: string,
  hallId: HallId,
  date: Date
): Promise<AvailableHourUpdate> => {
  const $ = await scrape(url);

  const dateTime = ($('#bookingcalform-p_pvm_custom').val() as string).split(
    ' '
  )[1];
  const day = `${dateTime.slice(6, 10)}-${dateTime.slice(
    3,
    5
  )}-${dateTime.slice(0, 2)}`;

  const fullHours = getHours(
    $,
    'td[class*="s-avail"]:not(.s-avail-short)',
    false
  );

  const shortHours = getHours($, 'td[class*="s-avail-short"]', true);

  return {
    hallId,
    id: hallId,
    day,
    hours: [...fullHours, ...shortHours],
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
