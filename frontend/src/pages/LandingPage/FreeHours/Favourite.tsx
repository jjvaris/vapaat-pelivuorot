import React from 'react';
import { StarIcon } from '@heroicons/react/outline';
import { StarIcon as SolidStar } from '@heroicons/react/solid';

type Props = {
  isToggled: boolean;
  onToggle: () => void;
};

export default function Favourite({ isToggled, onToggle }: Props) {
  return isToggled ? (
    <SolidStar className="h-5 w-5 mr-2 " onClick={onToggle} />
  ) : (
    <StarIcon
      className="h-5 w-5 mr-2 text-gray-500 hover:text-primary"
      onClick={onToggle}
    />
  );
}
