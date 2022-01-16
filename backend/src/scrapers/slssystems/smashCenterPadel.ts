import { scrape } from '../../api';
import { format } from 'date-fns';
import { AvailableHourUpdate, CourtType, HallId, Hour } from 'shared';
import { CheerioAPI } from 'cheerio';

const getHour = (hour: string) => {
  const s = hour.split(':');
  return `${s[0].substring(s[0].length - 2)}:${s[1].substring(0, 2)}`;
};

const mapCourtToType = (court: string): CourtType => {
  switch (court.toLocaleLowerCase().trim()) {
    case 'p1':
      return 'INSIDE';
    case 'p2':
      return 'INSIDE';
    case 'p3':
      return 'OUTSIDE';
    case 'p4':
      return 'OUTSIDE';
    case 'tykki':
      return 'BALL-LAUNCHER';
    default:
      return 'INSIDE';
  }
};

const getCourt = (hour: string) => hour.split(':')[0].slice(0, -2).trim();

const isMembersOnly = (hour: string) =>
  !hour.toLocaleLowerCase().includes('varaa');

const getHours = ($: CheerioAPI, selector: string, thirtyMinutes: boolean) =>
  $(selector)
    .map((_, e) => $(e).text())
    .get()
    .map((hour): Hour => {
      return {
        hour: getHour(hour),
        courtType: mapCourtToType(getCourt(hour)),
        court: getCourt(hour),
        thirtyMinutes,
        isMembersOnly: isMembersOnly(hour),
      };
    });

const scapeSmashCenterPadel = async (
  url: string,
  hallId: HallId
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

export const smashCenterPadel = async (
  date: Date
): Promise<AvailableHourUpdate> => {
  const isoDate = format(date, 'yyyy-MM-dd');
  const url = `https://smashcenter.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=5&BookingCalForm%5Bp_pvm%5D=${isoDate}&BookingCalForm%5Bp_pvm_interval%5D=&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Tiistai+18.01.2022`;
  return scapeSmashCenterPadel(url, 'smash-center-helsinki');
};
