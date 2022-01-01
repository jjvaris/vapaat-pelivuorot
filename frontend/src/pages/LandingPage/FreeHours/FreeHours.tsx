import React from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../../utils/api';
import DatePicker from '../DatePicker';
import useSelectedDay from '../../../hooks/useSelectedDay';
import { useQuery } from 'react-query';
import Halls from './Halls';
import useSelectedTime from '../../../hooks/useSelectedTime';
import { State, Type } from 'shared';

export default function FreeHours() {
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
