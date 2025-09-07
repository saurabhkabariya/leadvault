import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Leads from './pages/Leads';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
      </Routes>
    </div>
  );
}

export default App;
