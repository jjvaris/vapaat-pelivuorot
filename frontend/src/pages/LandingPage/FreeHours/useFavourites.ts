import { useCallback } from 'react';
import { HallId } from 'shared';
import useLocalStorage from '../../../hooks/useLocalStorage';

export default function useFavourites() {
  const [favourites, setFavourites] = useLocalStorage<HallId[]>(
    'favourites',
    []
  );

  const toggleFavourite = useCallback(
    (id: HallId) =>
      setFavourites((current) => {
        console.log({ current, id });

        return current.includes(id)
          ? current.filter((c) => c !== id)
          : [...current, id];
      }),
    [setFavourites]
  );

  return [favourites, toggleFavourite] as const;
}
