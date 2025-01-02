import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Menu from "./components/all/menu/menu.tsx";
import BattleField from "./components/all/battlefild/battlefild.tsx";
import Sett from "./components/all/settings/settings.tsx";
import Statistic from "./components/all/Record/Statistic.tsx";

import DataProvider from "./DataContext.tsx";
import { createRoot } from 'react-dom/client';

import './main.css';
import './components/all/menu/menus.css';
import './components/all/battlefild/battlefild.css';
import './components/all/settings/settingus.css';
import './components/other/result/resultstable.css';
import './components/all/Record/statistic.css';






const App = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/battlefild" element={<BattleField />} />
          <Route path="/settings" element={<Sett />} />
          <Route path="/Statistic" element={<Statistic />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

createRoot(document.getElementById('app')!).render(<App />) 
export default App;
 