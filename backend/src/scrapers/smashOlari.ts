import { scrape } from '../api';
import { format } from 'date-fns';
import { AvailableHourUpdate, CourtType, Hour } from 'shared';

export const smashCenterOlari = async (
  date: Date
): Promise<AvailableHourUpdate> => {
  const today = format(date, 'yyyy-MM-dd');
  const url = `https://smashcenter.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=7&BookingCalForm%5Bp_pvm%5D=${today}&BookingCalForm%5Bp_pvm_interval%5D=&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Lauantai+14.03.2020`;
  const $ = await scrape(url);

  const dateTime = ($('#bookingcalform-p_pvm_custom').val() as string).split(
    ' '
  )[1];
  const day = `${dateTime.slice(6, 10)}-${dateTime.slice(
    3,
    5
  )}-${dateTime.slice(0, 2)}`;

  const hours = $('td[class="s-avail"],td[class="s-avail-short"]')
    .map((_, e): Hour => {
      const fullHour = $(e).children('a').attr().href.includes('kesto=60');
      const hour = $(e).text().trim();
      const s = hour.split(':');
      const courtType: CourtType = hour.startsWith('Pallotykki')
        ? 'BALL-LAUNCHER'
        : 'INSIDE';

      return {
        hour: `${s[0].substring(s[0].length - 2)}:${s[1].substring(0, 2)}`,
        courtType,
        court: hour.split(' ')[0],
        thirtyMinutes: !fullHour,
      };
    })
    .get();
  return {
    hallId: 'smash-center-olari',
    id: 'smash-center-olari',
    day,
    hours,
    link: url,
    type: 'TENNIS',
  };
};
