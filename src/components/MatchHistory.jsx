import React, { useState, useEffect } from 'react';
import { playersList } from '../data/players';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, X } from 'react-feather';

const MatchHistory = ({ matches }) => {
  const [expandedMatches, setExpandedMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('date');
  const [isLandscape, setIsLandscape] = useState(false);
  const [topRivalries, setTopRivalries] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [customRivalry, setCustomRivalry] = useState(null);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);

  // Sort matches by date (newest first)
  const sortedMatches = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Check screen orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Calculate top rivalries
  useEffect(() => {
    const calculateRivalries = () => {
      const playerPairs = {};
      
      matches.forEach(match => {
        const allPlayers = [...match.teamA.players, ...match.teamB.players];
        
        for (let i = 0; i < allPlayers.length; i++) {
          for (let j = i + 1; j < allPlayers.length; j++) {
            const pairKey = [allPlayers[i], allPlayers[j]].sort().join('-');
            playerPairs[pairKey] = (playerPairs[pairKey] || 0) + 1;
          }
        }
      });

      const rivalries = Object.entries(playerPairs)
        .map(([pairKey, count]) => {
          const [id1, id2] = pairKey.split('-').map(Number);
          return {
            player1: getPlayerById(id1),
            player2: getPlayerById(id2),
            count
          };
        })
        .filter(rivalry => rivalry.player1 && rivalry.player2)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return rivalries.map(rivalry => ({
        ...rivalry,
        headToHead: calculateHeadToHead(rivalry.player1.id, rivalry.player2.id)
      }));
    };

    setTopRivalries(calculateRivalries());
  }, [matches]);

  // Calculate head-to-head stats between two players
  const calculateHeadToHead = (player1Id, player2Id) => {
    const headToHead = { 
      player1Wins: 0, 
      player2Wins: 0, 
      draws: 0,
      totalMatches: 0,
      matches: []
    };
    
    matches.forEach(match => {
      const teamAPlayers = match.teamA.players;
      const teamBPlayers = match.teamB.players;
      const hasPlayer1 = teamAPlayers.includes(player1Id) || teamBPlayers.includes(player1Id);
      const hasPlayer2 = teamAPlayers.includes(player2Id) || teamBPlayers.includes(player2Id);
      
      if (hasPlayer1 && hasPlayer2) {
        headToHead.totalMatches++;
        const player1Team = teamAPlayers.includes(player1Id) ? 'A' : 'B';
        const player2Team = teamAPlayers.includes(player2Id) ? 'A' : 'B';
        
        if (match.teamA.score > match.teamB.score) {
          if (player1Team === 'A') headToHead.player1Wins++;
          if (player2Team === 'A') headToHead.player2Wins++;
        } else if (match.teamB.score > match.teamA.score) {
          if (player1Team === 'B') headToHead.player1Wins++;
          if (player2Team === 'B') headToHead.player2Wins++;
        } else {
          headToHead.draws++;
        }
        
        headToHead.matches.push(match);
      }
    });

    return headToHead;
  };

  const getPlayerById = (id) => playersList.find(p => p.id === id);

  const toggleMatch = (matchId) => {
    setExpandedMatches(prev =>
      prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  const togglePlayerSelection = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const showCustomRivalry = () => {
    if (selectedPlayers.length === 2) {
      const [player1, player2] = selectedPlayers;
      setCustomRivalry({
        player1: getPlayerById(player1),
        player2: getPlayerById(player2),
        headToHead: calculateHeadToHead(player1, player2)
      });
      setShowPlayerSelector(false);
    }
  };

  const filteredMatches = sortedMatches.filter(match => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchType) {
      case 'date':
        return match.date.toLowerCase().includes(searchLower);
      case 'location':
        return match.location.toLowerCase().includes(searchLower);
      case 'player':
        const allPlayerNames = [...match.teamA.players, ...match.teamB.players]
          .map(playerId => getPlayerById(playerId)?.name.toLowerCase());
        return allPlayerNames.some(name => name?.includes(searchLower));
      default:
        return true;
    }
  });

  const renderRivalryCard = (rivalry, isCustom = false) => {
    if (!rivalry.player1 || !rivalry.player2) return null;
    
    return (
      <div className={`bg-primary/50 p-4 rounded-lg border-2 ${isCustom ? 'border-blue-400/50' : 'border-gold-400/30'} mb-4`}>
        {isCustom && (
          <div className="flex justify-end">
            <button 
              onClick={() => setCustomRivalry(null)}
              className="text-blue-400 hover:text-blue-300"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="flex flex-col items-center">
          {/* Player 1 */}
          <Link 
            to={`/player/${rivalry.player1.id}`} 
            className="group flex flex-col items-center mb-2"
          >
            <img 
              src={rivalry.player1.image} 
              alt={rivalry.player1.name} 
              className="w-14 h-14 rounded-full border-2 border-gold-400 mb-1 group-hover:border-gold-300 transition-colors"
            />
            <span className="text-lg font-medium text-gold-400 group-hover:text-gold-300 transition-colors text-center">
              {rivalry.player1.name}
            </span>
            <span className="text-sm text-gold-500">
              {rivalry.player1.position} • OVR: {rivalry.player1.overallRating}
            </span>
          </Link>

          {/* VS Score */}
          <div className="my-2 flex items-center justify-center w-full">
            <div className="text-2xl font-bold text-gold-400 mx-2">
              {rivalry.headToHead.player1Wins}
            </div>
            <div className="text-xl text-gold-300 mx-2">-</div>
            <div className="text-2xl font-bold text-gold-400 mx-2">
              {rivalry.headToHead.player2Wins}
            </div>
          </div>

          {/* Player 2 */}
          <Link 
            to={`/player/${rivalry.player2.id}`} 
            className="group flex flex-col items-center mt-2"
          >
            <img 
              src={rivalry.player2.image} 
              alt={rivalry.player2.name} 
              className="w-14 h-14 rounded-full border-2 border-gold-400 mb-1 group-hover:border-gold-300 transition-colors"
            />
            <span className="text-lg font-medium text-gold-400 group-hover:text-gold-300 transition-colors text-center">
              {rivalry.player2.name}
            </span>
            <span className="text-sm text-gold-500">
              {rivalry.player2.position} • OVR: {rivalry.player2.overallRating}
            </span>
          </Link>

          {/* Match Stats */}
          <div className="mt-3 text-sm text-gold-400">
            <span className="font-medium">{rivalry.headToHead.totalMatches}</span> matches • 
            <span className="font-medium"> {rivalry.headToHead.draws}</span> draws
          </div>

          {/* View Matches Button */}
          {rivalry.headToHead.matches.length > 0 && (
            <button
              onClick={() => {
                setExpandedMatches(rivalry.headToHead.matches.map(m => m.id));
                setTimeout(() => {
                  const firstMatch = document.getElementById(`match-${rivalry.headToHead.matches[0].id}`);
                  firstMatch?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="mt-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-sm transition-colors"
            >
              View All Their Matches
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-primary p-4 sm:p-6">
      {/* Head-to-Head Rivalries Section */}
      <div className="bg-secondary p-4 sm:p-6 rounded-lg mb-6 border-2 border-gold-400/20 shadow-gold-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-400">
            🔥 Player Rivalries
          </h2>
          <button
            onClick={() => setShowPlayerSelector(!showPlayerSelector)}
            className="bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 px-3 py-1 rounded-lg text-sm transition-colors"
          >
            {showPlayerSelector ? 'Cancel' : 'Compare Players'}
          </button>
        </div>

        {/* Player Selector */}
        {showPlayerSelector && (
          <div className="mb-6 bg-primary/50 p-4 rounded-lg border border-gold-400/30">
            <h3 className="text-lg font-semibold text-gold-400 mb-3">
              Select 2 Players to Compare
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
              {playersList.map(player => (
                <div
                  key={player.id}
                  onClick={() => togglePlayerSelection(player.id)}
                  className={`p-2 rounded-lg cursor-pointer transition-all border-2 ${
                    selectedPlayers.includes(player.id)
                      ? 'bg-gold-500/20 border-gold-500'
                      : 'bg-secondary border-gold-400/20 hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-center">
                    <img 
                      src={player.image} 
                      alt={player.name} 
                      className="w-8 h-8 rounded-full mr-2 border border-gold-400/50"
                    />
                    <span className="text-sm text-text truncate">{player.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gold-400">
                {selectedPlayers.length}/2 players selected
              </div>
              <button
                onClick={showCustomRivalry}
                disabled={selectedPlayers.length !== 2}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedPlayers.length === 2
                    ? 'bg-gold-500 text-primary hover:bg-gold-600 cursor-pointer'
                    : 'bg-secondary/50 text-text-gray cursor-not-allowed'
                }`}
              >
                Show Rivalry
              </button>
            </div>
          </div>
        )}

        {/* Custom Rivalry Display */}
        {customRivalry && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">Your Selected Rivalry</h3>
            {renderRivalryCard(customRivalry, true)}
          </div>
        )}

        {/* Top Rivalries */}
        {topRivalries.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gold-400 mb-3">Top Rivalries</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topRivalries.map((rivalry, index) => (
                <div key={index}>
                  {renderRivalryCard(rivalry)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rest of your existing code (Search Section and Match List) */}
      {/* Search Section */}
      <div className="bg-secondary p-4 sm:p-6 rounded-lg mb-6 border-2 border-gold-400/20 shadow-gold-sm">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gold-400">
          Search Matches
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gold-400" size={18} />
            </div>
            <input
              type="text"
              placeholder={`Search by ${searchType}...`}
              className="pl-10 w-full p-3 rounded-lg focus:outline-none bg-secondary border-2 border-gold-400/30 text-text caret-gold-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-3 rounded-lg focus:outline-none bg-secondary border-2 border-gold-400/30 text-text"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="date" className="bg-secondary">Date</option>
            <option value="location" className="bg-secondary">Location</option>
            <option value="player" className="bg-secondary">Player Name</option>
          </select>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
  <div className="text-center py-8 sm:py-12 text-text-gray">
    No matches found matching your search
  </div>
) : (
  <div className="space-y-3 sm:space-y-4">
    {filteredMatches.map(match => (
      <div 
        key={match.id} 
        id={`match-${match.id}`}
        className="rounded-lg overflow-hidden bg-secondary border-2 border-gold-400/20 shadow-lg"
      >
        <div 
          className="p-3 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-opacity-90 transition-all bg-secondary border-b-2 border-gold-400/30"
          onClick={() => toggleMatch(match.id)}
        >
          <h3 className="font-bold text-base sm:text-lg text-gold-400">
            {new Date(match.date).toLocaleDateString()} at {match.time} - {match.location}
          </h3>
          {expandedMatches.includes(match.id) ? (
            <ChevronUp size={20} className="text-gold-400" />
          ) : (
            <ChevronDown size={20} className="text-gold-400" />
          )}
        </div>
        
        {expandedMatches.includes(match.id) && (
          <div className="animate-fade-in">
            <div className={`p-3 sm:p-5 ${isLandscape ? 'flex flex-row' : 'flex flex-col'} justify-between items-start gap-4 sm:gap-6`}>
              <div className={`${isLandscape ? 'w-1/3' : 'w-full'} mb-4 sm:mb-0 p-3 sm:p-4 rounded-lg bg-primary border-2 border-gold-400/30`}>
                <h4 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">
                  <span className="bg-gold-500 text-primary px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base">
                    Team A
                  </span>
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {match.teamA.players.map(playerId => {
                    const player = getPlayerById(playerId);
                    if (!player) return null;
                    return (
                      <li key={playerId} className="hover:bg-gold-500/10 px-2 py-1 sm:px-3 sm:py-2 rounded">
                        <Link to={`/player/${playerId}`} className="group flex items-center">
                          <img 
                            src={player.image} 
                            alt={player.name} 
                            className="w-8 h-8 rounded-full mr-3 border border-gold-400/50 object-cover"
                          />
                          <div>
                            <span className="text-text font-semibold text-sm sm:text-base block">
                              {player.name}
                            </span>
                            <span className="text-gold-400 text-xs sm:text-sm">
                              {player.position} - {player.overallRating}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div className={`${isLandscape ? 'w-1/3' : 'w-full'} flex flex-col items-center justify-center my-4 sm:my-0`}>
                <div className="text-3xl sm:text-4xl font-bold text-gold-400">
                  {match.teamA.score} - {match.teamB.score}
                </div>
                <div className={`text-base sm:text-lg font-semibold mt-1 sm:mt-2 ${
                  match.teamA.score > match.teamB.score 
                    ? 'text-gold-400' 
                    : match.teamB.score > match.teamA.score 
                      ? 'text-red-500' 
                      : 'text-gold-400'
                }`}>
                  {match.teamA.score > match.teamB.score ? 'Team A Wins' : 
                   match.teamB.score > match.teamA.score ? 'Team B Wins' : 'Draw'}
                </div>
              </div>
              
              <div className={`${isLandscape ? 'w-1/3' : 'w-full'} p-3 sm:p-4 rounded-lg bg-primary border-2 border-gold-400/30`}>
                <h4 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">
                  <span className="bg-gold-500 text-primary px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base">
                    Team B
                  </span>
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {match.teamB.players.map(playerId => {
                    const player = getPlayerById(playerId);
                    if (!player) return null;
                    return (
                      <li key={playerId} className="hover:bg-gold-500/10 px-2 py-1 sm:px-3 sm:py-2 rounded">
                        <Link to={`/player/${playerId}`} className="group flex items-center">
                          <img 
                            src={player.image} 
                            alt={player.name} 
                            className="w-8 h-8 rounded-full mr-3 border border-gold-400/50 object-cover"
                          />
                          <div>
                            <span className="text-text font-semibold text-sm sm:text-base block">
                              {player.name}
                            </span>
                            <span className="text-gold-400 text-xs sm:text-sm">
                              {player.position} - {player.overallRating}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            
            {match.mvp && (
              <div className="p-3 sm:p-5 border-t border-gold-400/20 bg-primary">
                <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gold-400">
                  Most Valuable Player
                </h4>
                <Link 
                  to={`/player/${match.mvp}`} 
                  className="inline-flex items-center group"
                >
                  <img 
                    src={getPlayerById(match.mvp)?.image} 
                    alt="MVP" 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3 border-2 border-gold-400"
                  />
                  <div>
                    <span className='font-bold text-lg sm:text-xl text-gold-400'>
                      {getPlayerById(match.mvp)?.name}
                    </span>
                    <div className="text-gold-400 text-xs sm:text-sm">
                      {getPlayerById(match.mvp)?.position} • OVR: {getPlayerById(match.mvp)?.overallRating}
                    </div>
                  </div>
                </Link>
              </div>
            )}
            
            {match.notes && (
              <div className="p-3 sm:p-5 border-t border-gold-400/20 bg-primary">
                <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gold-400">
                  Match Notes
                </h4>
                <p className="text-text-gray text-sm sm:text-base">{match.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default MatchHistory;