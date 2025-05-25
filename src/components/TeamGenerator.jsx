import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

const TeamGenerator = ({ players }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamSize, setTeamSize] = useState(6);
  const [generatedTeams, setGeneratedTeams] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const togglePlayerSelection = (playerId) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId) 
        : [...prev, playerId]
    );
  };

  const generateTeams = () => {
    if (selectedPlayers.length < teamSize * 2) {
      alert(`You need at least ${teamSize * 2} players to generate teams`);
      return;
    }

    const selectedPlayersData = players.filter(p => selectedPlayers.includes(p.id));
    
    const sortedPlayers = [...selectedPlayersData].sort((a, b) => b.overallRating - a.overallRating);
    
    const teamA = [];
    const teamB = [];
    
    sortedPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });
    
    setGeneratedTeams({
      teamA: teamA,
      teamB: teamB
    });
  };

  return (
    <div className="bg-primary p-6 rounded-lg shadow-xl border-2 border-gold-400/20">
      <h2 className="text-3xl font-bold mb-6 text-gold-400 text-center">Team Generator</h2>
      
      {/* Help Section */}
      <div className="mb-8 bg-secondary p-5 rounded-lg border-2 border-gold-400/30">
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setShowHelp(!showHelp)}
        >
          <h3 className="text-xl font-semibold text-gold-400 group-hover:text-gold-300 transition-colors">
            How to use
          </h3>
          {showHelp ? (
            <ChevronUp className="text-gold-400 group-hover:text-gold-300 transition-colors" size={24} />
          ) : (
            <ChevronDown className="text-gold-400 group-hover:text-gold-300 transition-colors" size={24} />
          )}
        </div>
        {showHelp && (
          <div className="mt-4 text-text-gray space-y-3 pl-2">
            <p className="flex items-center">
              <span className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-primary font-bold mr-2">1</span>
              Select players by clicking on them
            </p>
            <p className="flex items-center">
              <span className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-primary font-bold mr-2">2</span>
              Choose team size (5v5, 6v6, or 7v7)
            </p>
            <p className="flex items-center">
              <span className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-primary font-bold mr-2">3</span>
              Click "Generate Teams" to create balanced teams
            </p>
          </div>
        )}
      </div>
      
      {/* Team Size Selector */}
      <div className="mb-8">
        <label className="block mb-3 font-medium text-text-gray text-lg">Team Size:</label>
        <div className="flex space-x-4">
          {[5, 6, 7].map(size => (
            <button
              key={size}
              onClick={() => setTeamSize(size)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                teamSize === size 
                  ? 'bg-gold-500 text-primary border-2 border-gold-500 shadow-gold-sm' 
                  : 'bg-secondary text-text-gray border-2 border-gold-400/30 hover:bg-gold-500/10 hover:border-gold-400/50'
              }`}
            >
              {size} vs {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Player Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-text-gray">
          Select Players <span className='text-gold-400 ml-2'>({selectedPlayers.length} selected)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {players.map(player => (
            <div 
              key={player.id}
              onClick={() => togglePlayerSelection(player.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                selectedPlayers.includes(player.id) 
                  ? 'bg-gold-500/20 border-gold-500 text-text' 
                  : 'bg-secondary border-gold-400/20 text-text-gray hover:border-gold-400 hover:bg-secondary/80'
              }`}
            >
              <div className="font-medium text-lg truncate">{player.name}</div>
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-sm rounded-full px-3 py-1 ${
                  selectedPlayers.includes(player.id)
                    ? 'bg-primary text-gold-400'
                    : 'bg-primary/50 text-text-gray'
                }`}>
                  {player.position}
                </span>
                <span className="text-gold-400 font-bold">{player.overallRating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Generate Button */}
      <button 
        onClick={generateTeams}
        disabled={selectedPlayers.length < teamSize * 2}
        className={`w-full py-3.5 rounded-lg font-bold text-lg transition-all ${
          selectedPlayers.length >= teamSize * 2
            ? 'bg-gold-500 text-primary hover:bg-gold-600 hover:shadow-gold-md active:scale-95'
            : 'bg-secondary text-text-gray border-2 border-gold-400/20 cursor-not-allowed'
        }`}
      >
        Generate Teams
      </button>
      
      {/* Generated Teams */}
      {generatedTeams && (
        <div className="mt-10 animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 text-gold-400 text-center">Generated Teams</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Team A */}
            <div className="bg-secondary p-5 rounded-lg border-2 border-gold-400/30 shadow-lg">
              <h4 className="font-bold text-xl mb-4 text-center">
                <span className='bg-gold-500 text-primary rounded-full px-4 py-1.5 text-lg'>
                  Team A
                </span>
              </h4>
              <ul className="space-y-3">
                {generatedTeams.teamA.map(player => (
                  <li key={player.id} className="flex justify-between items-center bg-primary/50 p-3 rounded-lg border border-gold-400/20">
                    <span className='font-medium text-text'>{player.name}</span>
                    <span className="text-sm bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full font-medium">
                      {player.position} - {player.overallRating}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 font-bold text-gold-400 text-center">
                <span className='bg-primary/70 px-4 py-2 rounded-full inline-block'>
                  Avg Rating: {(generatedTeams.teamA.reduce((sum, p) => sum + p.overallRating, 0) / generatedTeams.teamA.length).toFixed(1)}
                </span>
              </div>
            </div>
            
            {/* Team B */}
            <div className="bg-secondary p-5 rounded-lg border-2 border-gold-400/30 shadow-lg">
              <h4 className="font-bold text-xl mb-4 text-center">
                <span className='bg-gold-500 text-primary rounded-full px-4 py-1.5 text-lg'>
                  Team B
                </span>
              </h4>
              <ul className="space-y-3">
                {generatedTeams.teamB.map(player => (
                  <li key={player.id} className="flex justify-between items-center bg-primary/50 p-3 rounded-lg border border-gold-400/20">
                    <span className='font-medium text-text'>{player.name}</span>
                    <span className="text-sm bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full font-medium">
                      {player.position} - {player.overallRating}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 font-bold text-gold-400 text-center">
                <span className='bg-primary/70 px-4 py-2 rounded-full inline-block'>
                  Avg Rating: {(generatedTeams.teamB.reduce((sum, p) => sum + p.overallRating, 0) / generatedTeams.teamB.length).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamGenerator;