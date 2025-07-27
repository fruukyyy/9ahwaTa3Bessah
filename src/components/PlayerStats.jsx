import React, { useState } from 'react';
import { matchesList } from '../data/matches';
import { playersList } from '../data/players';
import { Link } from 'react-router-dom';

const PlayerStats = () => {
  const [filter, setFilter] = useState('winRate');
  const [positionFilter, setPositionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const calculatePlayerStats = () => {
    const stats = {};
    
    // Initialize player stats
    playersList.forEach(player => {
      stats[player.id] = {
        id: player.id,
        name: player.name,
        image: player.image,
        position: player.position,
        overallRating: player.overallRating,
        wins: 0,
        losses: 0,
        draws: 0,
        mvps: 0,
        last5: { wins: 0, losses: 0, draws: 0 },
        streak: { type: 'none', count: 0 },
        lastMatches: []
      };
    });

    // Process matches in chronological order
    const sortedMatches = [...matchesList].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedMatches.forEach(match => {
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
      
      // Update basic stats
      teamAPlayers.forEach(playerId => {
        if (teamAResult === 'win') stats[playerId].wins++;
        if (teamAResult === 'loss') stats[playerId].losses++;
        if (teamAResult === 'draw') stats[playerId].draws++;
        stats[playerId].lastMatches.unshift(teamAResult);
      });
      
      teamBPlayers.forEach(playerId => {
        if (teamBResult === 'win') stats[playerId].wins++;
        if (teamBResult === 'loss') stats[playerId].losses++;
        if (teamBResult === 'draw') stats[playerId].draws++;
        stats[playerId].lastMatches.unshift(teamBResult);
      });

      // Update MVP
      if (match.mvp) {
        stats[match.mvp].mvps++;
      }
    });

    // Calculate last 5 matches and streaks
    Object.values(stats).forEach(player => {
      // Last 5 matches
      const last5 = player.lastMatches.slice(0, 5);
      player.last5.wins = last5.filter(r => r === 'win').length;
      player.last5.losses = last5.filter(r => r === 'loss').length;
      player.last5.draws = last5.filter(r => r === 'draw').length;
      player.last5WinRate = player.last5.wins / (player.last5.wins + player.last5.losses) || 0;

      // Calculate streak
      if (player.lastMatches.length > 0) {
        const currentResult = player.lastMatches[0];
        let streakCount = 1;
        
        for (let i = 1; i < player.lastMatches.length; i++) {
          if (player.lastMatches[i] === currentResult) {
            streakCount++;
          } else {
            break;
          }
        }
        
        player.streak = {
          type: currentResult,
          count: streakCount
        };
      }
    });
    
    return stats;
  };
  
  const playerStats = calculatePlayerStats();
  
  // Filter and sort players
  const sortedPlayers = Object.values(playerStats)
    .filter(player => {
      const totalGames = player.wins + player.losses + player.draws;
      return (
        totalGames > 2 && // Only show players with more than 2 games
        player.id !== 99 && // Exclude player with ID 99
        (positionFilter === 'all' || player.position === positionFilter) && // Position filter
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) // Search filter
      );
    })
    .sort((a, b) => {
      switch(filter) {
        case 'mvps': 
          return b.mvps - a.mvps;
        case 'gamesPlayed': 
          return (b.wins + b.losses + b.draws) - (a.wins + a.losses + a.draws);
        case 'last5': 
          return b.last5WinRate - a.last5WinRate;
        case 'streak':
          // Sort by streak length, then by streak type (win > draw > loss)
          if (b.streak.count !== a.streak.count) return b.streak.count - a.streak.count;
          if (b.streak.type === 'win') return -1;
          if (a.streak.type === 'win') return 1;
          if (b.streak.type === 'draw') return -1;
          if (a.streak.type === 'draw') return 1;
          return 0;
        default: // winRate (default)
          const aRate = (a.wins / (a.wins + a.losses)) || 0;
          const bRate = (b.wins / (b.wins + b.losses)) || 0;
          return bRate - aRate;
      }
    });

  const togglePlayerComparison = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const filterOptions = [
    { value: 'winRate', label: 'Win Rate %' },
    { value: 'mvps', label: 'Most MVPs' },
    { value: 'gamesPlayed', label: 'Games Played' },
    { value: 'last5', label: 'Last 5 Matches' },
    { value: 'streak', label: 'Current Streak' }
  ];

  const positionOptions = [
    { value: 'all', label: 'All Positions' },
    { value: 'ATT', label: 'Forwards' },
    { value: 'MID', label: 'Midfielders' },
    { value: 'DEF', label: 'Defenders' },
    { value: 'GK', label: 'Goalkeepers' }
  ];

  const comparedPlayers = selectedPlayers.map(id => playerStats[id]);

  return (
    <div className="bg-primary p-6 rounded-lg shadow-xl border-2 border-gold-500/20">
      <h2 className="text-3xl font-bold mb-6 text-gold-400 text-center">Player Statistics</h2>
      
      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Box */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gold-400 mb-1">Search Players</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-gold-500/30 text-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-gold-500 focus:border-gold-500"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gold-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gold-400 mb-1">Sort By</label>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-secondary border border-gold-500/30 text-gray-300 rounded-lg px-4 py-2 focus:ring-gold-500 focus:border-gold-500"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Position Filter */}
        <div>
          <label className="block text-sm font-medium text-gold-400 mb-1">Position</label>
          <select 
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="w-full bg-secondary border border-gold-500/30 text-gray-300 rounded-lg px-4 py-2 focus:ring-gold-500 focus:border-gold-500"
          >
            {positionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Tool */}
      {selectedPlayers.length > 0 && (
        <div className="mb-6 bg-secondary/50 p-4 rounded-lg border border-gold-500/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gold-400">
              Comparison Tool ({selectedPlayers.length}/2 selected)
            </h3>
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="text-sm bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 px-3 py-1 rounded-lg transition-colors"
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {comparedPlayers.map(player => (
              <div key={player.id} className="flex items-center bg-primary/50 px-3 py-1.5 rounded-full border border-gold-500/30">
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-6 h-6 rounded-full mr-2 border border-gold-500"
                />
                <span className="text-sm text-gray-300">{player.name}</span>
                <button 
                  onClick={() => togglePlayerComparison(player.id)}
                  className="ml-2 text-gold-400 hover:text-gold-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {showComparison && comparedPlayers.length === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {comparedPlayers.map(player => {
                const decisiveGames = player.wins + player.losses;
                const winRate = decisiveGames > 0 
                  ? (player.wins / decisiveGames * 100).toFixed(1) 
                  : '0.0';
                const totalGames = player.wins + player.losses + player.draws;
                
                return (
                  <div key={player.id} className="bg-primary p-4 rounded-lg border border-gold-500/30">
                    <div className="flex items-center mb-3">
                      <img 
                        src={player.image} 
                        alt={player.name} 
                        className="w-12 h-12 rounded-full mr-3 border-2 border-gold-500"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-gray-300">{player.name}</h4>
                        <div className="text-sm text-gold-400">
                          {player.position} • {totalGames} games
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-secondary/50 p-2 rounded">
                        <div className="text-gray-400">Win Rate</div>
                        <div className="font-bold text-gold-400">{winRate}%</div>
                      </div>
                      <div className="bg-secondary/50 p-2 rounded">
                        <div className="text-gray-400">MVPs</div>
                        <div className="font-bold text-gold-400">{player.mvps}</div>
                      </div>
                      <div className="bg-secondary/50 p-2 rounded">
                        <div className="text-gray-400">Streak</div>
                        <div className="font-bold text-gold-400">
                          {player.streak.count} {player.streak.type}
                        </div>
                      </div>
                      <div className="bg-secondary/50 p-2 rounded">
                        <div className="text-gray-400">Last 5</div>
                        <div className="font-bold text-gold-400">
                          {player.last5.wins}W {player.last5.losses}L {player.last5.draws}D
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Players Table */}
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
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Streak
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Compare
                </th>
              </tr>
            </thead>
            <tbody className="bg-primary divide-y divide-gold-500/10">
              {sortedPlayers.map(player => {
                const decisiveGames = player.wins + player.losses;
                const winRate = decisiveGames > 0 
                  ? (player.wins / decisiveGames * 100).toFixed(1) 
                  : '0.0';
                const totalGames = player.wins + player.losses + player.draws;
                const isSelected = selectedPlayers.includes(player.id);
                
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
                            {player.position} • {totalGames} games
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {player.streak.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          player.streak.type === 'win' ? 'bg-green-900/30 text-green-400' :
                          player.streak.type === 'loss' ? 'bg-red-900/30 text-red-400' :
                          'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {player.streak.count} {player.streak.type}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePlayerComparison(player.id)}
                        disabled={!isSelected && selectedPlayers.length >= 2}
                        className={`p-1.5 rounded-full ${
                          isSelected 
                            ? 'bg-gold-500 text-primary' 
                            : selectedPlayers.length >= 2 
                              ? 'opacity-30 cursor-not-allowed' 
                              : 'bg-secondary text-gold-400 hover:bg-gold-500/20'
                        }`}
                      >
                        {isSelected ? '✓' : 'VS'}
                      </button>
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