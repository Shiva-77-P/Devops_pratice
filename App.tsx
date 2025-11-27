import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { LabView } from './components/LabView';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0f172a]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lab/:courseId/:labId" element={<LabView />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;