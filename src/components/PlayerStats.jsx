import React from 'react';
import { matchesList } from '../data/matches';
import { playersList } from '../data/players';
import { Link } from 'react-router-dom';

const PlayerStats = () => {
  const calculatePlayerStats = () => {
    const stats = {};
    
    playersList.forEach(player => {
      stats[player.id] = {
        name: player.name,
        image: player.image,
        position: player.position,
        overallRating: player.overallRating,
        wins: 0,
        losses: 0,
        draws: 0,
        mvps: 0,
        goals: 0
      };
    });
    
    matchesList.forEach(match => {
      const teamAPlayers = match.teamA.players;
      const teamBPlayers = match.teamB.players;
      const teamAScore = match.teamA.score;
      const teamBScore = match.teamB.score;
      
      const teamAResult = 
        teamAScore > teamBScore ? 'win' : 
        teamAScore < teamBScore ? 'loss' : 'draw';
      const teamBResult = 
        teamBScore > teamAScore ? 'win' : 
        teamBScore < teamAScore ? 'loss' : 'draw';
      
      teamAPlayers.forEach(playerId => {
        if (teamAResult === 'win') stats[playerId].wins++;
        if (teamAResult === 'loss') stats[playerId].losses++;
        if (teamAResult === 'draw') stats[playerId].draws++;
      });
      
      teamBPlayers.forEach(playerId => {
        if (teamBResult === 'win') stats[playerId].wins++;
        if (teamBResult === 'loss') stats[playerId].losses++;
        if (teamBResult === 'draw') stats[playerId].draws++;
      });
      
      if (match.mvp) {
        stats[match.mvp].mvps++;
      }
    });
    
    return stats;
  };
  
  const playerStats = calculatePlayerStats();
  const sortedPlayers = Object.entries(playerStats)
    .map(([id, stats]) => ({ id: parseInt(id), ...stats }))
    .filter(player => 
      (player.wins > 0 || player.losses > 0 || player.draws > 0) && // Filter out players with no participations
      player.id !== 99 // Exclude player with ID 99
    )
    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses));
  
  return (
    <div className="bg-primary p-6 rounded-lg shadow-xl border-2 border-gold-500/20">
      <h2 className="text-3xl font-bold mb-6 text-gold-400 text-center">Player Statistics</h2>
      
      {sortedPlayers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No player statistics available yet. Play some matches first!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gold-500/20">
            <thead className="bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Wins
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Losses
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Draws
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Win Rate
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  MVPs
                </th>
              </tr>
            </thead>
            <tbody className="bg-primary divide-y divide-gold-500/10">
              {sortedPlayers.map(player => {
                const totalGames = player.wins + player.losses + player.draws;
                const winRate = totalGames > 0 ? (player.wins / totalGames * 100).toFixed(1) : 0;
                
                return (
                  <tr key={player.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/player/${player.id}`} 
                        className="flex items-center group"
                      >
                        <img 
                          src={player.image} 
                          alt={player.name} 
                          className="w-10 h-10 rounded-full mr-3 border-2 border-gold-500 group-hover:border-gold-300 transition-colors"
                        />
                        <div>
                          <div className="text-lg font-medium text-gray-300 group-hover:text-gold-300 transition-colors">
                            {player.name}
                          </div>
                          <div className="text-sm text-gold-400">
                            {player.position} • OVR: {player.overallRating}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                      {player.wins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                      {player.losses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                      {player.draws}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        winRate >= 60 ? 'bg-green-900/30 text-green-400' :
                        winRate >= 40 ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {winRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center">
                        <span className="text-gold-400 mr-1">★</span>
                        <span className="text-gray-300 font-bold">{player.mvps}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;