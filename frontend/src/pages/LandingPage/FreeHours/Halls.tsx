import { groupBy } from 'ramda';
import React, { useMemo, useState } from 'react';
import { AvailableHour, HallId, State, Type } from 'shared';
import { format, parseISO } from 'date-fns';
import Favourite from './Favourite';
import useFavourites from './useFavourites';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import c from 'classnames';
import TimePicker from '../TimePicker/TimePicker';

type Hall = {
  name: string;
  availableHours: {
    hour: string;
    thirtyMinutes: boolean;
  }[];
  freeHours: AvailableHour[];
  link: string;
  id: HallId;
  favourite: boolean;
};

const weekDays: Record<number, string> = {
  0: 'Sunnuntai',
  1: 'Maanantai',
  2: 'Tiistai',
  3: 'Keskiviikko',
  4: 'Torstai',
  5: 'Perjantai',
  6: 'Lauantai',
};

export default function Halls({
  data,
  type,
  searchDate,
  time = '05:00',
}: {
  data: State;
  type: Type;
  searchDate: string;
  time?: string;
}) {
  const [favourites, toggleFavourite] = useFavourites();

  const halls = useMemo(
    () => getHours(data, type, searchDate, time, favourites),
    [data, type, searchDate, time, favourites]
  );

  const date = parseISO(searchDate);

  return (
    <div className="text-left px-4 space-y-4">
      <div className="flex gap-6 items-center sticky top-0 bg-gray-900 py-2 -mt-2">
        <h2 className="text-xl">
          {`${weekDays[date.getDay()]} ${format(date, 'd.M')}`}
        </h2>
        <TimePicker />
        <span className="text-gray-200 font-light text-right bg-primary-800 rounded-sm px-2 py-1 text-xs">{`${
          type.charAt(0) + type.slice(1).toLocaleLowerCase()
        }`}</span>
      </div>
      {halls.map((hall) => (
        <HallCard
          key={hall.id}
          hall={hall}
          onToggleFavourite={toggleFavourite}
        />
      ))}
    </div>
  );
}

const getHours = (
  data: State | undefined,
  type: Type,
  searchDate: string,
  time: string,
  favourites: HallId[]
): Hall[] => {
  if (!data) {
    return [];
  }

  const today = new Date();
  const todayIso = format(today, 'yyyy-MM-dd');

  const isInPast = (hour: AvailableHour) =>
    hour.day <= todayIso && parseInt(hour.hour) < today.getHours();

  const filteredHours = data.availableHours.filter(
    (hour) =>
      hour.day === searchDate &&
      hour.type === type &&
      hour.hour.trim() >= time &&
      ['INFLATED', 'INSIDE'].includes(hour.courtType) &&
      !isInPast(hour)
  );

  const byDay = filteredHours.reduce((acc, cur) => {
    if (!acc[cur.day]) {
      acc[cur.day] = [cur];
      return acc;
    }
    acc[cur.day] = [...acc[cur.day], cur];
    return acc;
  }, {} as Record<string, AvailableHour[]>);

  const allByDay = byDay[searchDate] ?? [];

  const byHallId = allByDay.reduce((acc, cur) => {
    if (!acc[cur.hallId]) {
      acc[cur.hallId] = {
        name: data.halls.find((hall) => hall.id === cur.hallId)?.name || '',
        availableHours: [`${cur.hour.trim()};${cur.thirtyMinutes}`],
        freeHours: [cur],
        link: cur.link,
      };
      return acc;
    }
    acc[cur.hallId].freeHours = [...acc[cur.hallId].freeHours, cur];
    acc[cur.hallId].availableHours = [
      ...new Set([
        ...acc[cur.hallId].availableHours,
        `${cur.hour.trim()};${cur.thirtyMinutes}`,
      ]),
    ];
    return acc;
  }, {} as Record<HallId, { name: string; availableHours: string[]; freeHours: AvailableHour[]; link: string }>);

  return data.halls
    .filter((hall) => hall.types.includes(type))
    .map((hall) => ({ ...hall, favourite: favourites.includes(hall.id) }))
    .map((hall) => ({
      name: hall.name,
      availableHours: mapToHours(byHallId[hall.id]?.availableHours),
      freeHours: byHallId[hall.id]?.freeHours ?? [],
      link: byHallId[hall.id]?.link ?? hall.link,
      id: hall.id,
      favourite: hall.favourite,
    }))
    .sort(
      (a, b) =>
        Number(b.favourite) - Number(a.favourite) ||
        a.name.localeCompare(b.name)
    );
};

function mapToHours(hours?: string[]) {
  if (!hours) return [];
  return hours
    .filter((hour) => {
      const isThirtyMinutes = hour.split(';')[1] === 'true';
      if (isThirtyMinutes) {
        return !hours
          .filter((h) => h.includes('false'))
          .map((h) => h.split(';')[0])
          .some((h) => h.slice(0, 2) === hour.split(';')[0].slice(0, 2));
      }
      return true;
    })
    .map((hour) => ({
      hour: hour.split(';')[0].trim(),
      thirtyMinutes: hour.split(';')[1] === 'true',
    }));
}

function HallCard({
  hall,
  onToggleFavourite,
}: {
  hall: Hall;
  onToggleFavourite: (id: HallId) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasHours = hall.availableHours.length > 0;
  return (
    <div key={hall.name} className="bg-gray-800 rounded-md p-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <div>
            <Favourite
              isToggled={hall.favourite}
              onToggle={() => onToggleFavourite(hall.id)}
            />
          </div>
          <button
            disabled={!hasHours}
            className={c('text-left', { 'pointer-events-none': !hasHours })}
            onClick={() => setIsOpen((open) => !open)}
          >
            <h3 className="text-white font-extralight text-sm xs:text-base">
              {hall.name}
            </h3>
          </button>
        </div>
        <a
          className="flex items-center hover:text-primary-500"
          href={hall.link}
          rel="noreferrer noopener"
          target="_blank"
        >
          <span className="invisible xs:visible mr-2 text-sm">Varaukset</span>
          <ExternalLinkIcon className="h-5 w-5" />
        </a>
      </div>
      <AvailableHours hall={hall} isOpen={isOpen} />
    </div>
  );
}

function AvailableHours({ hall, isOpen }: { hall: Hall; isOpen: boolean }) {
  if (hall.availableHours.length === 0) {
    return (
      <div className="text-pink-500 text-sm font-light">Ei vapaita vuoroja</div>
    );
  }
  return isOpen ? <FreeHours hall={hall} /> : <FreeHoursCompact hall={hall} />;
}

function FreeHours({ hall }: { hall: Hall }) {
  const hoursByCourt = groupBy((hour) => hour.court ?? 'N/A', hall.freeHours);
  if (Object.keys(hoursByCourt).length === 1) {
    return <FreeHoursCompact hall={hall} />;
  }
  return (
    <div className="space-y-4">
      {Object.entries(hoursByCourt)
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([court, hours]) => {
          return (
            <div key={court}>
              <h4 className="text-sm font-extralight text-white mb-2">
                {court}
              </h4>
              <div className="flex flex-wrap gap-2">
                {hours
                  .slice()
                  .sort((a, b) => a.hour.localeCompare(b.hour))
                  .map(({ hour, thirtyMinutes }) => (
                    <a
                      href={hall.link}
                      key={hour}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={c(
                        'flex justify-center p-1 w-11 border text-xs',
                        {
                          'text-yellow-500 border-yellow-500': thirtyMinutes,
                          'border-green-500 text-green-500': !thirtyMinutes,
                        }
                      )}
                    >
                      {hour}
                    </a>
                  ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

function FreeHoursCompact({ hall }: { hall: Hall }) {
  return (
    <div className="flex flex-wrap gap-2">
      {hall.availableHours
        .slice()
        .sort((a, b) => a.hour.localeCompare(b.hour))
        .map(({ hour, thirtyMinutes }) => (
          <a
            href={hall.link}
            key={hour}
            target="_blank"
            rel="noreferrer noopener"
            className={c('flex justify-center p-1 w-11 border text-xs', {
              'text-yellow-500 border-yellow-500': thirtyMinutes,
              'border-green-500 text-green-500': !thirtyMinutes,
            })}
          >
            {hour}
          </a>
        ))}
    </div>
  );
}
