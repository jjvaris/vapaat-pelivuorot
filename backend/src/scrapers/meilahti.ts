import { format } from 'date-fns';
import { AvailableHourUpdate, CourtType } from 'shared';

import scrapePlayfi from './playfi';

const courtToCourtType: Record<string, CourtType> = {
  K2: 'INFLATED',
  K3: 'INFLATED',
  K4: 'INFLATED',
  K5: 'INFLATED',
  K6: 'INSIDE',
  K7: 'INSIDE',
  K8: 'INSIDE',
};

export default async function (date: Date): Promise<AvailableHourUpdate> {
  const today = format(date, 'yyyy-MM-dd');
  const url = `https://play.fi/meilahti/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=1&BookingCalForm%5Bp_location%5D=1&BookingCalForm%5Bp_pvm%5D=${today}&BookingCalForm%5Bp_pvm_interval%5D=&BookingCalForm%5Bp_calmode%5D=2&BookingCalForm%5Bp_pvm_custom%5D=Keskiviikko+03.11.2021`;
  return scrapePlayfi({
    hallId: 'meilahti',
    url,
    courtToCourtType: (court) => courtToCourtType[court],
    type: 'TENNIS',
  });
}
