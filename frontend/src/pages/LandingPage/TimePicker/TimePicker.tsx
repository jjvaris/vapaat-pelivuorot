import { ChevronDownIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import React from 'react';
import useSelectedDay from '../../../hooks/useSelectedDay';
import useSelectedTime from '../../../hooks/useSelectedTime';

export default function TimePicker() {
  const options = useOptions();
  const [time, setTime] = useSelectedTime();
  return (
    <div className="flex items-center text-green-500">
      <select
        className="pr-5 bg-transparent border-transparent focus:outline-none focus:border-transparent focus:ring-0 bg-none"
        value={time}
        onChange={(event) => setTime(event.target.value)}
      >
        {options}
      </select>
      <ChevronDownIcon className="pointer-events-none w-4 h-4 -ml-5" />
    </div>
  );
}

function useOptions() {
  const [day] = useSelectedDay();
  return (
    <>
      {getOptions(day).map((o) => (
        <option key={o}>{`${String(o).padStart(2, '0')}:00`}</option>
      ))}
    </>
  );
}

function getOptions(day: string) {
  const options = [
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  ];
  const now = new Date();
  if (day === format(now, 'yyyy-MM-dd')) {
    return options.filter((o) => o >= now.getHours());
  }
  return options;
}
