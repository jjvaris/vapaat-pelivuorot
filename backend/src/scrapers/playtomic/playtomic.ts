import { get } from '../../api';
import { format } from 'date-fns';
import {
  AvailableHourUpdate,
  CourtType,
  Hall,
  HallId,
  Hour,
  Type,
} from 'shared';
import { tentants } from './tenants';
import { resources } from './resources';
import { halls as hallsInSystem } from '../../state';
import { utcToZonedTime } from 'date-fns-tz';

const hasIndoorDoubleCourt = (tenant: (typeof tentants)[0]) =>
  tenant.resources.some(
    (court) =>
      court.is_active &&
      court.properties.resource_type === 'indoor' &&
      court.properties.resource_size === 'double'
  );

const halls = tentants
  .filter((tenant) =>
    tenant.sport_ids.some((sport) => ['PADEL', 'TENNIS'].includes(sport))
  )
  .filter(hasIndoorDoubleCourt)
  .map<
    Hall & {
      tenantId: string;
      courts: {
        resourceId: string;
        name: string;
        isActive: boolean;
        type: string;
        double: boolean;
        hallType: Type;
      }[];
    }
  >((tenant) => ({
    id: tenant.tenant_uid as HallId,
    name: tenant.tenant_name,
    link: tenant.url,
    coordinates: [tenant.address.coordinate.lat, tenant.address.coordinate.lon],
    types: tenant.sport_ids.filter((sport_id) =>
      ['PADEL', 'TENNIS'].includes(sport_id)
    ) as Type[],
    tenantId: tenant.tenant_id,
    courts: [...tenant.resources]
      .filter((resource) => ['PADEL', 'TENNIS'].includes(resource.sport_id))
      .map((resource) => ({
        resourceId: resource.resource_id,
        isActive: resource.is_active,
        type: resource.properties.resource_type,
        double: resource.properties.resource_size === 'double',
        name: resource.name,
        hallType: resource.sport_id as Type,
      })),
  }));
const hallsByResourceId = halls.reduce((acc, hall) => {
  hall.courts
    .filter((court) => !court.name.includes('(ei padelkenttä)'))
    .forEach((court) => (acc[court.resourceId] = hall));
  return acc;
}, {} as Record<string, (typeof halls)[0]>);

const toCourtType = (type: string, double: boolean): CourtType =>
  !double ? 'PADEL-TWO-PLAYER' : type === 'indoor' ? 'INSIDE' : 'OUTSIDE';

const startTimeToHour = (day: string, startTime: string) => {
  const utcDate = new Date(`${day}T${startTime}.000Z`);
  const zonedDate = utcToZonedTime(utcDate, 'Europe/Helsinki');
  return format(zonedDate, 'HH:mm');
};

export async function playtomic(date: Date): Promise<AvailableHourUpdate[]> {
  const padelTenantIds = halls
    .filter((hall) => hall.types.includes('PADEL'))
    .map((hall) => hall.tenantId)
    .join('%2C');
  const tennisTenantIds = halls
    .filter((hall) => hall.types.includes('TENNIS'))
    .map((hall) => hall.tenantId)
    .join('%2C');

  const day = format(date, 'yyyy-MM-dd');

  const padelUrl = `https://playtomic.io/api/v1/availability?user_id=me&tenant_id=${padelTenantIds}&sport_id=PADEL&local_start_min=${day}T05%3A00%3A00&local_start_max=${day}T23%3A00%3A00`;
  const tennisUrl = `https://playtomic.io/api/v1/availability?user_id=me&tenant_id=${tennisTenantIds}&sport_id=TENNIS&local_start_min=${day}T05%3A00%3A00&local_start_max=${day}T23%3A00%3A00`;

  const { data: padelData } = await get<typeof resources>(padelUrl);
  const { data: tennisData } = await get<typeof resources>(tennisUrl);
  const data = [...padelData, ...tennisData];

  return data.reduce<AvailableHourUpdate[]>(
    (acc, resource) => {
      const hallByResourceId = hallsByResourceId[resource.resource_id];
      if (!hallByResourceId) return acc;
      const availableHourUpdate = acc.find(
        (i) => i.hallId === hallByResourceId.id
      );
      if (!availableHourUpdate) return acc;
      const court = hallByResourceId.courts.find(
        (c) => c.resourceId === resource.resource_id
      );
      if (!court) return acc;
      availableHourUpdate.type = court.hallType;
      availableHourUpdate.hours = [
        ...availableHourUpdate.hours,
        ...resource.slots
          .filter((slot) => [30, 60].includes(slot.duration))
          .map((slot) => ({
            hour: startTimeToHour(day, slot.start_time),
            thirtyMinutes: slot.duration === 30,
            court:
              hallByResourceId.courts.find(
                (c) => c.resourceId === resource.resource_id
              )?.name ?? 'unknown',
            courtType: toCourtType(court.type, court.double),
          })),
      ];
      return acc;
    },
    halls.map((hall) => ({
      hallId: hall.id,
      id: hall.id,
      type: hall.types[0],
      day,
      link:
        hallsInSystem.find((h) => hall.id === h.id)?.link ??
        'https://playtomic.io/',
      hours: [],
    }))
  );
}
