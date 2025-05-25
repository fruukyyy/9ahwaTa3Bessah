import React, { useState } from 'react';
import { playersList } from '../data/players';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search } from 'react-feather';

const MatchHistory = ({ matches }) => {
  const [expandedMatches, setExpandedMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('date');

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
    <div className="bg-primary p-6">
      {/* Search Section */}
      <div className="bg-secondary p-6 rounded-lg mb-6 border-2 border-gold-400/20 shadow-gold-sm">
        <h2 className="text-3xl font-bold mb-4 text-gold-400">
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
        <div className="text-center py-12 text-text-gray">
          No matches found matching your search
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map(match => (
            <div 
              key={match.id} 
              className="rounded-lg overflow-hidden bg-secondary border-2 border-gold-400/20 shadow-lg"
            >
              {/* Match Header */}
              <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-opacity-90 transition-all bg-secondary border-b-2 border-gold-400/30"
                onClick={() => toggleMatch(match.id)}
              >
                <h3 className="font-bold text-lg text-gold-400">
                  {new Date(match.date).toLocaleDateString()} at {match.time} - {match.location}
                </h3>
                {expandedMatches.includes(match.id) ? (
                  <ChevronUp size={22} className="text-gold-400" />
                ) : (
                  <ChevronDown size={22} className="text-gold-400" />
                )}
              </div>
              
              {/* Expanded Match Details */}
              {expandedMatches.includes(match.id) && (
                <div className="animate-fade-in">
                  <div className="p-5 md:flex justify-between items-start gap-6">
                    {/* Team A */}
                    <div className="md:w-1/3 mb-6 md:mb-0 p-4 rounded-lg bg-primary border-2 border-gold-400/30">
                      <h4 className="font-semibold text-xl mb-3">
                        <span className="bg-gold-500 text-primary px-3 py-1 rounded-full">
                          Team A
                        </span>
                      </h4>
                      <ul className="space-y-3">
                        {match.teamA.players.map(playerId => {
                          const player = getPlayerById(playerId);
                          return (
                            <li key={playerId} className="hover:bg-gold-500/10 px-3 py-2 rounded">
                              <Link to={`/player/${playerId}`} className="group">
                                <span className="text-text font-semibold">
                                  {player.name}
                                </span>
                                <span className="text-gold-400 ml-2">
                                  ({player.position} - {player.overallRating})
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    
                    {/* Score */}
                    <div className="md:w-1/3 flex flex-col items-center justify-center my-6 md:my-0">
                      <div className="text-4xl font-bold text-gold-400">
                        {match.teamA.score} - {match.teamB.score}
                      </div>
                      <div className={`text-lg font-semibold mt-2 ${
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
                    <div className="md:w-1/3 p-4 rounded-lg bg-primary border-2 border-gold-400/30">
                      <h4 className="font-semibold text-xl mb-3">
                        <span className="bg-gold-500 text-primary px-3 py-1 rounded-full">
                          Team B
                        </span>
                      </h4>
                      <ul className="space-y-3">
                        {match.teamB.players.map(playerId => {
                          const player = getPlayerById(playerId);
                          return (
                            <li key={playerId} className="hover:bg-gold-500/10 px-3 py-2 rounded">
                              <Link to={`/player/${playerId}`} className="group">
                                <span className="text-text font-semibold">
                                  {player.name}
                                </span>
                                <span className="text-gold-400 ml-2">
                                  ({player.position} - {player.overallRating})
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  
                  {/* MVP Section */}
                  {match.mvp && (
                    <div className="p-5 border-t border-gold-400/20 bg-primary">
                      <h4 className="font-semibold text-lg mb-3 text-gold-400">
                        Most Valuable Player
                      </h4>
                      <Link 
                        to={`/player/${match.mvp}`} 
                        className="inline-flex items-center group"
                      >
                        <img 
                          src={getPlayerById(match.mvp).image} 
                          alt="MVP" 
                          className="w-12 h-12 rounded-full mr-3 border-2 border-gold-400"
                        />
                        <div>
                          <span className='font-bold text-xl text-gold-400'>
                            {getPlayerById(match.mvp).name}
                          </span>
                          <div className="text-gold-400 text-sm">
                            {getPlayerById(match.mvp).position} • OVR: {getPlayerById(match.mvp).overallRating}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  
                  {/* Notes Section */}
                  {match.notes && (
                    <div className="p-5 border-t border-gold-400/20 bg-primary">
                      <h4 className="font-semibold text-lg mb-2 text-gold-400">
                        Match Notes
                      </h4>
                      <p className="text-text-gray">{match.notes}</p>
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