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
      </footer>
    </div>
  );
}
