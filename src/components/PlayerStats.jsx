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
        last10: { wins: 0, losses: 0, draws: 0 },
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

    // Calculate last 5/10 matches and streaks
    Object.values(stats).forEach(player => {
      // Last 5 matches
      const last5 = player.lastMatches.slice(0, 5);
      player.last5.wins = last5.filter(r => r === 'win').length;
      player.last5.losses = last5.filter(r => r === 'loss').length;
      player.last5.draws = last5.filter(r => r === 'draw').length;
      player.last5WinRate = player.last5.wins / (player.last5.wins + player.last5.losses) || 0;
      player.last5Total = player.last5.wins + player.last5.losses + player.last5.draws;

      // Last 10 matches
      const last10 = player.lastMatches.slice(0, 10);
      player.last10.wins = last10.filter(r => r === 'win').length;
      player.last10.losses = last10.filter(r => r === 'loss').length;
      player.last10.draws = last10.filter(r => r === 'draw').length;
      player.last10WinRate = player.last10.wins / (player.last10.wins + player.last10.losses) || 0;
      player.last10Total = player.last10.wins + player.last10.losses + player.last10.draws;

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
        case 'last10':
          return b.last10WinRate - a.last10WinRate;
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
    { value: 'last10', label: 'Last 10 Matches' },
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

  // Helper function to get display stats based on current filter
  const getDisplayStats = (player) => {
    switch(filter) {
      case 'last5':
        return {
          wins: player.last5.wins,
          losses: player.last5.losses,
          draws: player.last5.draws,
          winRate: player.last5WinRate,
          totalGames: player.last5Total
        };
      case 'last10':
        return {
          wins: player.last10.wins,
          losses: player.last10.losses,
          draws: player.last10.draws,
          winRate: player.last10WinRate,
          totalGames: player.last10Total
        };
      default:
        return {
          wins: player.wins,
          losses: player.losses,
          draws: player.draws,
          winRate: player.wins / (player.wins + player.losses) || 0,
          totalGames: player.wins + player.losses + player.draws
        };
    }
  };

  return (
    <div className="bg-primary p-3 sm:p-4 md:p-6 rounded-lg shadow-xl border-2 border-gold-500/20">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gold-400 text-center">Player Statistics</h2>
      
      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Search Box */}
        <div className="sm:col-span-2 md:col-span-1">
          <label className="block text-xs sm:text-sm font-medium text-gold-400 mb-1">Search Players</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-gold-500/30 text-gray-300 rounded-lg px-3 sm:px-4 py-2 pl-8 sm:pl-10 focus:ring-gold-500 focus:border-gold-500 text-sm sm:text-base"
            />
            <svg 
              className="absolute left-2 sm:left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gold-400" 
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
          <label className="block text-xs sm:text-sm font-medium text-gold-400 mb-1">Sort By</label>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-secondary border border-gold-500/30 text-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:ring-gold-500 focus:border-gold-500 text-sm sm:text-base"
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
          <label className="block text-xs sm:text-sm font-medium text-gold-400 mb-1">Position</label>
          <select 
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="w-full bg-secondary border border-gold-500/30 text-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:ring-gold-500 focus:border-gold-500 text-sm sm:text-base"
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
        <div className="mb-4 sm:mb-6 bg-secondary/50 p-3 sm:p-4 rounded-lg border border-gold-500/30">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gold-400">
              Comparison Tool ({selectedPlayers.length}/2 selected)
            </h3>
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs sm:text-sm bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 px-2 sm:px-3 py-1 rounded-lg transition-colors"
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {comparedPlayers.map(player => (
              <div key={player.id} className="flex items-center bg-primary/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gold-500/30">
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full mr-1 sm:mr-2 border border-gold-500 object-cover"
                />
                <span className="text-xs sm:text-sm text-gray-300">{player.name}</span>
                <button 
                  onClick={() => togglePlayerComparison(player.id)}
                  className="ml-1 sm:ml-2 text-gold-400 hover:text-gold-300 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {showComparison && comparedPlayers.length === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
              {comparedPlayers.map(player => {
                const displayStats = getDisplayStats(player);
                const winRate = filter === 'last5' ? player.last5WinRate : 
                              filter === 'last10' ? player.last10WinRate : 
                              (player.wins / (player.wins + player.losses)) || 0;
                const totalGames = player.wins + player.losses + player.draws;
                
                return (
                  <div key={player.id} className="bg-primary p-3 sm:p-4 rounded-lg border border-gold-500/30">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <img 
                        src={player.image} 
                        alt={player.name} 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3 border-2 border-gold-500 object-cover"
                      />
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-300">{player.name}</h4>
                        <div className="text-xs sm:text-sm text-gold-400">
                          {player.position} • {totalGames} games
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="bg-secondary/50 p-2 rounded">
                        <div className="text-gray-400">Win Rate</div>
                        <div className="font-bold text-gold-400">{(winRate * 100).toFixed(1)}%</div>
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
                      <div className="bg-secondary/50 p-2 rounded">
                        <div className="text-gray-400">Last 10</div>
                        <div className="font-bold text-gold-400">
                          {player.last10.wins}W {player.last10.losses}L {player.last10.draws}D
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
        <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
          No player statistics available yet. Play some matches first!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gold-500/20">
            <thead className="bg-secondary">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Wins
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Losses
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Draws
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Win Rate
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  MVPs
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Streak
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  Compare
                </th>
              </tr>
            </thead>
            <tbody className="bg-primary divide-y divide-gold-500/10">
              {sortedPlayers.map(player => {
                const displayStats = getDisplayStats(player);
                const isSelected = selectedPlayers.includes(player.id);
                const totalGames = player.wins + player.losses + player.draws;
                
                return (
                  <tr key={player.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/player/${player.id}`} 
                        className="flex items-center group"
                      >
                        <img 
                          src={player.image} 
                          alt={player.name} 
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 border-2 border-gold-500 group-hover:border-gold-300 transition-colors object-cover"
                        />
                        <div>
                          <div className="text-sm sm:text-base font-medium text-gray-300 group-hover:text-gold-300 transition-colors">
                            {player.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gold-400">
                            {player.position} • {totalGames} games
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-300 font-medium text-sm sm:text-base">
                      {displayStats.wins}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-300 font-medium text-sm sm:text-base">
                      {displayStats.losses}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-300 font-medium text-sm sm:text-base">
                      {displayStats.draws}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        displayStats.winRate >= 0.6 ? 'bg-green-900/30 text-green-400' :
                        displayStats.winRate >= 0.4 ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {(displayStats.winRate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center">
                        <span className="text-gold-400 mr-1">★</span>
                        <span className="text-gray-300 font-bold text-sm sm:text-base">{player.mvps}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {player.streak.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          player.streak.type === 'win' ? 'bg-green-900/30 text-green-400' :
                          player.streak.type === 'loss' ? 'bg-red-900/30 text-red-400' :
                          'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {player.streak.count} {player.streak.type}
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePlayerComparison(player.id)}
                        disabled={!isSelected && selectedPlayers.length >= 2}
                        className={`p-1 sm:p-1.5 rounded-full text-xs sm:text-sm ${
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