import { useSearchParams } from 'react-router-dom';

export default function useSelectedTime() {
  const [params, setParams] = useSearchParams();
  return [
    params.get('time') || undefined,
    (time: string) =>
      setParams({ ...Object.fromEntries(params.entries()), time }),
  ] as const;
}
