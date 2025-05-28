import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PlayersPage from './pages/PlayersPage';
import TeamGeneratorPage from './pages/TeamGeneratorPage';
import MatchHistoryPage from './pages/MatchHistoryPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import PlayerStatsPage from './pages/PlayerStatsPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen font-mont bg-primary text-gray-100 w-full overflow-x-hidden">
        <Navbar />
        <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 w-full">
          <Routes>
            <Route path="/" element={<PlayersPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/team-generator" element={<TeamGeneratorPage />} />
            <Route path="/match-history" element={<MatchHistoryPage />} />
            <Route path="/player/:id" element={<PlayerProfilePage />} />
            <Route path="/player-stats" element={<PlayerStatsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;