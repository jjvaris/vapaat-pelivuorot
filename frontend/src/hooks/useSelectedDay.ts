import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useEffect } from 'react';

export default function useSelectedDay() {
  const [params, setParams] = useSearchParams();
  const today = format(new Date(), 'yyyy-MM-dd');
  const day = params.get('day') || today;
  useEffect(() => {
    if (day < today) {
      setParams({ day: today });
    }
  }, [setParams, day, today]);
  return day < today ? today : day;
}
