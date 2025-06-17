import React, { useState, useEffect } from 'react';
import { playersList } from '../data/players';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search } from 'react-feather';

const MatchHistory = ({ matches }) => {
  const [expandedMatches, setExpandedMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('date');
  const [isLandscape, setIsLandscape] = useState(false);

  // Check screen orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const getPlayerById = (id) => playersList.find(p => p.id === id);

  const toggleMatch = (matchId) => {
    setExpandedMatches(prev =>
      prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  const filteredMatches = matches.filter(match => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchType) {
      case 'date':
        return match.date.toLowerCase().includes(searchLower);
      case 'location':
        return match.location.toLowerCase().includes(searchLower);
      case 'player':
        const allPlayerNames = [...match.teamA.players, ...match.teamB.players]
          .map(playerId => getPlayerById(playerId).name.toLowerCase());
        return allPlayerNames.some(name => name.includes(searchLower));
      default:
        return true;
    }
  });

  return (
    <div className="bg-primary p-4 sm:p-6">
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
              className="rounded-lg overflow-hidden bg-secondary border-2 border-gold-400/20 shadow-lg"
            >
              {/* Match Header */}
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
              
              {/* Expanded Match Details */}
              {expandedMatches.includes(match.id) && (
                <div className="animate-fade-in">
                  <div className={`p-3 sm:p-5 ${isLandscape ? 'flex flex-row' : 'flex flex-col'} justify-between items-start gap-4 sm:gap-6`}>
                    {/* Team A */}
                    <div className={`${isLandscape ? 'w-1/3' : 'w-full'} mb-4 sm:mb-0 p-3 sm:p-4 rounded-lg bg-primary border-2 border-gold-400/30`}>
                      <h4 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">
                        <span className="bg-gold-500 text-primary px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base">
                          Team A
                        </span>
                      </h4>
                      <ul className="space-y-2 sm:space-y-3">
                        {match.teamA.players.map(playerId => {
                          const player = getPlayerById(playerId);
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
                    
                    {/* Score */}
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
                    
                    {/* Team B */}
                    <div className={`${isLandscape ? 'w-1/3' : 'w-full'} p-3 sm:p-4 rounded-lg bg-primary border-2 border-gold-400/30`}>
                      <h4 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">
                        <span className="bg-gold-500 text-primary px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base">
                          Team B
                        </span>
                      </h4>
                      <ul className="space-y-2 sm:space-y-3">
                        {match.teamB.players.map(playerId => {
                          const player = getPlayerById(playerId);
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
                  
                  {/* MVP Section */}
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
                          src={getPlayerById(match.mvp).image} 
                          alt="MVP" 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3 border-2 border-gold-400"
                        />
                        <div>
                          <span className='font-bold text-lg sm:text-xl text-gold-400'>
                            {getPlayerById(match.mvp).name}
                          </span>
                          <div className="text-gold-400 text-xs sm:text-sm">
                            {getPlayerById(match.mvp).position} • OVR: {getPlayerById(match.mvp).overallRating}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  
                  {/* Notes Section */}
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