import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const valueInLocalStorage = localStorage.getItem(key);
    return valueInLocalStorage ? JSON.parse(valueInLocalStorage) : defaultValue;
  });

  useEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [key, defaultValue, value]
  );

  return [value, setValue] as const;
}
