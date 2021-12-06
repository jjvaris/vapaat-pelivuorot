import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import FreeHours from './pages/LandingPage/FreeHours';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [selectedType] = useLocalStorage('selected-type', '/tennis');
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={selectedType} />} />
      <Route path="/" element={<LandingPage />}>
        <Route path="/:type" element={<FreeHours />} />
      </Route>
    </Routes>
  );
}

export default App;
