import { format, subDays } from 'date-fns';
import { AvailableHourUpdate } from 'shared';

import scrapePlayfi from './playfi';

export async function helsinginMailapelikeskusTennisInside(
  date: Date
): Promise<AvailableHourUpdate> {
  const today = format(subDays(date, 1), 'yyyy-MM-dd');
  const url = `https://play.fi/mailapelikeskus/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=1&BookingCalForm%5Bp_location%5D=1&BookingCalForm%5Bp_pvm%5D=${today}&BookingCalForm%5Bp_pvm_interval%5D=1&BookingCalForm%5Bp_calmode%5D=1&BookingCalForm%5Bp_pvm_custom%5D=Torstai+04.11.2021`;
  return scrapePlayfi({
    hallId: 'helsingin-mailapelikeskus',
    url,
    courtToCourtType: () => 'INSIDE',
    type: 'TENNIS',
  });
}
