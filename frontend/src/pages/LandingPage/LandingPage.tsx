import React from 'react';
import { NavLink, Outlet, useSearchParams } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import ContactForm from './FreeHours/ContactForm';

const SelectTypeLink = ({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <NavLink
      onClick={onClick}
      to={to}
      className={({ isActive }) =>
        `inline-block p-2 border shadow-lg rounded-lg w-32 ${
          isActive
            ? 'bg-primary text-gray-100 border-gray-800'
            : 'border-primary text-primary-500 hover:bg-primary hover:text-gray-100 hover:border-gray-200 hover:border'
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default function LandingPage() {
  const [, setSelectedType] = useLocalStorage('selected-type', '/tennis');
  const [params] = useSearchParams();
  return (
    <div className="max-w-3xl px-3 py-10 mx-auto text-center text-base min-h-screen flex flex-col text-primary-600">
      <header className="flex-none App-header ">
        <div className="">
          <div className="text-2xl px-3 mt-10 mb-3 bg-white inline-block rounded-lg text-sky-700">
            VAPAAT
          </div>
          <h1 className="text-4xl mb-10">PELIVUOROT</h1>
        </div>
      </header>
      <nav className="mb-6 flex gap-5 justify-center items-center">
        <SelectTypeLink
          onClick={() => setSelectedType('/tennis')}
          to={`/tennis?${params.toString()}`}
        >
          TENNIS
        </SelectTypeLink>
        <SelectTypeLink
          onClick={() => setSelectedType('/padel')}
          to={`/padel?${params.toString()}`}
        >
          PADEL
        </SelectTypeLink>
      </nav>
      <Outlet />
      <footer>
        <ContactForm />
        <div className="flex mt-8 justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            viewBox="0 0 752 752"
          >
            <path
              d="m222.83 498.1c29.598-33.668 45.879-77.328 45.879-122.09 0-45.137-16.281-88.426-46.25-122.09-56.605 71.402-56.605 173.15 0.37109 244.19z"
              fill="#facc15"
              className="color000 svgShape"
            />
            <path
              d="m446.3 376c0-55.129 20.348-108.04 57.348-148.73-73.258-62.898-182.03-62.898-255.29 0 37 40.699 57.348 93.609 57.348 148.73 0 54.02-19.609 106.19-55.496 146.88-0.73828 0.73828-1.8516 1.8516-1.8516 1.8516 73.258 62.898 182.03 62.898 255.66 0-0.73828-0.73828-1.4805-1.1094-1.8516-1.8516-36.258-40.695-55.867-92.863-55.867-146.88z"
              fill="#facc15"
              className="color000 svgShape"
            />
            <path
              d="m529.55 498.1c56.977-71.406 56.977-173.15 0-244.19-29.969 33.668-46.25 76.957-46.25 122.09 0 45.141 16.281 88.43 46.25 122.1-0.37109 0-0.37109 0 0 0z"
              fill="#facc15"
              className="color000 svgShape"
            />
          </svg>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          www.pelivuorot.com &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
