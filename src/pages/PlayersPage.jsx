import React, { useState } from 'react';
import { playersList } from '../data/players';
import PlayerCard from '../components/PlayerCard';
import { Link } from 'react-router-dom';
import { Search } from 'react-feather';

const PlayersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = playersList.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-selected mb-8">9ahwa Ta3 Bessah Players</h1>
      
      <div className="mb-8  p-4 rounded-lg shadow-md">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-text-gray" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search players by name..."
            className="pl-10 w-full p-2  border border-selected rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-8 text-selected">
          No players found matching your search
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map(player => (
            <Link to={`/player/${player.id}`} key={player.id}>
              <PlayerCard player={player} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersPage;