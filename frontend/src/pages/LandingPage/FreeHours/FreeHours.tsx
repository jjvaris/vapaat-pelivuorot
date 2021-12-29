import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../../utils/api';
import { AvailableHour, HallId, State, Type } from 'shared';
import DatePicker from '../DatePicker';
import useSelectedDay from '../../../hooks/useSelectedDay';
import { useQuery } from 'react-query';
import { format, parseISO } from 'date-fns';
import Favourite from './Favourite';
import useFavourites from './useFavourites';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import c from 'classnames';
import TimePicker from '../TimePicker/TimePicker';
import useSelectedTime from '../../../hooks/useSelectedTime';

const weekDays: Record<number, string> = {
  0: 'Sunnuntai',
  1: 'Maanantai',
  2: 'Tiistai',
  3: 'Keskiviikko',
  4: 'Torstai',
  5: 'Perjantai',
  6: 'Lauantai',
};

export default function AvailableHours() {
  const { type = 'TENNIS' } = useParams();
  const [selectedDay] = useSelectedDay();
  const [selectedTime] = useSelectedTime();
  const { isError, data } = useAvailableHours();

  if (isError)
    return <p>Virhe vuorojen latauksessa, yritä uudelleen myöhemmin :(</p>;

  if (!data) return <Skeletons />;

  return (
    <>
      <DatePicker />
      <Halls
        data={data}
        type={type.toUpperCase() as Type}
        searchDate={selectedDay}
        time={selectedTime}
      />
      <Instructions />
    </>
  );
}

function Halls({
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
        <div key={hall.name} className="bg-gray-800 rounded-md p-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <Favourite
                isToggled={favourites.includes(hall.id)}
                onToggle={() => toggleFavourite(hall.id)}
              />
              <h3 className="text-white font-extralight text-md">
                {hall.name}
              </h3>
            </div>
            <a
              className="flex items-center hover:text-primary-500"
              href={hall.link}
              rel="noreferrer noopener"
              target="_blank"
            >
              <span className="invisible xs:visible mr-2 text-sm">
                Varaukset
              </span>
              <ExternalLinkIcon className="h-5 w-5" />
            </a>
          </div>
          {hall.availableHours.length === 0 && (
            <div className="text-pink-500 text-sm font-light">
              Ei vapaita vuoroja
            </div>
          )}
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
        </div>
      ))}
    </div>
  );
}

function useAvailableHours() {
  return useQuery(['available-hours'], () => getAvailableHours(), {
    staleTime: 30000,
    refetchInterval: 30000,
  });
}

async function getAvailableHours() {
  const { data } = await client.get<State>(
    `${process.env.REACT_APP_BACKEND_HOST}/api/available-hours`
  );
  return data;
}

const getHours = (
  data: State | undefined,
  type: Type,
  searchDate: string,
  time: string,
  favourites: HallId[]
) => {
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
      hour.hour >= time &&
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
        availableHours: [`${cur.hour};${cur.thirtyMinutes}`],
        link: cur.link,
      };
      return acc;
    }
    acc[cur.hallId].availableHours = [
      ...new Set([
        ...acc[cur.hallId].availableHours,
        `${cur.hour};${cur.thirtyMinutes}`,
      ]),
    ];
    return acc;
  }, {} as Record<HallId, { name: string; availableHours: string[]; link: string }>);

  return data.halls
    .filter((hall) => hall.types.includes(type))
    .map((hall) => ({ ...hall, favourite: favourites.includes(hall.id) }))
    .map((hall) => ({
      name: hall.name,
      availableHours: mapToHours(byHallId[hall.id]?.availableHours),
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
      hour: hour.split(';')[0],
      thirtyMinutes: hour.split(';')[1] === 'true',
    }));
}

function Skeletons() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="h-20 m-4 animate-pulse bg-gray-800 rounded-md"
        />
      ))}
    </>
  );
}

function Instructions() {
  return (
    <div className="px-4 mt-14 space-y-3 text-xs ">
      <div className="flex items-center text-green-500">
        <div className="flex justify-center p-1 w-11 h-6 border text-xs border-green-500 text-green-500 mr-4"></div>
        <div>Vapaa aika 60 min</div>
      </div>
      <div className="flex items-center text-yellow-500">
        <div className="flex justify-center p-1 w-11 h-6 border text-xs border-yellow-500 text-yellow-500 mr-4"></div>
        <div>Vapaa aika 30 min</div>
      </div>
    </div>
  );
}
