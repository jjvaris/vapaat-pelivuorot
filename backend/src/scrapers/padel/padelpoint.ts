import { subDays, format } from 'date-fns';
import { AvailableHourUpdate } from 'shared';
import scrapePlayfi from '../playfi';

export async function padelpoint(date: Date): Promise<AvailableHourUpdate> {
  const day = format(subDays(date, 1), 'yyyy-MM-dd');
  const url = `https://play.fi/padelpoint/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=1&BookingCalForm%5Bp_location%5D=1&BookingCalForm%5Bp_pvm%5D=${day}&BookingCalForm%5Bp_pvm_interval%5D=1&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Keskiviikko+08.12.2021`;
  return scrapePlayfi({
    hallId: 'padelpoint',
    url,
    courtToCourtType: () => 'INSIDE',
    type: 'PADEL',
  });
}
