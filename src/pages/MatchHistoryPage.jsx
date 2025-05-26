import React from 'react';
import MatchHistory from '../components/MatchHistory';
import PlayerStats from '../components/PlayerStats';
import { matchesList } from '../data/matches';

const MatchHistoryPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Match History</h1>
      
      <div className="mb-12">
        <MatchHistory matches={matchesList} />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Player Statistics</h2>
        <PlayerStats />
      </div>
      
    </div>
  );
};

export default MatchHistoryPage;