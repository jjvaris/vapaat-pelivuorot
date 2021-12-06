import React from 'react';
import { format, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import c from 'classnames';
import useSelectedDay from '../../../hooks/useSelectedDay';

const weekDays: Record<number, string> = {
  0: 'Su',
  1: 'Ma',
  2: 'Ti',
  3: 'Ke',
  4: 'To',
  5: 'Pe',
  6: 'La',
};

export default function DatePicker() {
  const selectedDay = useSelectedDay();

  const days = Array.from({ length: 14 }, (v, i) => addDays(new Date(), i)).map(
    (day) =>
      ({
        formattedDay: format(day, 'd.M'),
        weekDay: weekDays[day.getDay()],
        day,
        isoDate: format(day, 'yyyy-MM-dd'),
      } as const)
  );

  return (
    <div className="flex flex-wrap justify-center mb-6 gap-3 px-4 text-gray-600 text-xs">
      {days.map(({ formattedDay, weekDay, isoDate }) => {
        return (
          <Link to={`?day=${isoDate}`} key={isoDate}>
            <div
              className={c(
                'flex flex-col items-center justify-center p-1 rounded-sm w-11 h-10 bg-white',
                {
                  'bg-primary text-white': isoDate === selectedDay,
                  'border hover:bg-primary hover:text-gray-100 hover:border-grey-200':
                    isoDate !== selectedDay,
                }
              )}
            >
              <div>{weekDay}</div>
              <div>{formattedDay}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
