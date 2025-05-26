import React from 'react';
import PlayerStats from '../components/PlayerStats';

function PlayerStatsPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
        <h2 className="text-2xl font-semibold mb-4">Player Statistics</h2>
        <PlayerStats />
      </div>
  )
}

export default PlayerStatsPage