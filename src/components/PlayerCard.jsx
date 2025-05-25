import React from 'react';
import { calculateAge } from '../utils/ageCalculator';
import { Link } from 'react-router-dom';

const PlayerCard = ({ player }) => {
  return (
    <div className="bg-secondary rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 border-2 border-gold-400/30 hover:border-gold-400/50">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img 
            src={player.image} 
            alt={player.name} 
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gold-400"
          />
          <div>
            <h3 className="text-xl font-bold text-gold-400">{player.name}</h3>
            <div className="flex items-center">
              <span className="inline-block bg-gold-500 py-0.5 px-1.5 rounded-full text-primary font-semibold text-xs mr-2">
                {player.position}
              </span>
              <span className="text-xs text-text-gray">
                Age: {calculateAge(player.birthday)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-text">Rating</span>
            <span className="font-bold text-primary bg-gold-500 py-1 px-1.5 rounded-full">
              {player.overallRating}
            </span>
          </div>
          <div className="w-full bg-primary/50 rounded-full h-2">
            <div 
              className="bg-gold-500 h-2 rounded-full" 
              style={{ width: `${player.overallRating}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-text-gray">
          <div>
            <span className="font-medium text-text">Attack:</span> {player.attack}
          </div>
          <div>
            <span className="font-medium text-text">Defense:</span> {player.defense}
          </div>
          <div>
            <span className="font-medium text-text">Dribble:</span> {player.dribble}
          </div>
          <div>
            <span className="font-medium text-text">Stamina:</span> {player.stamina}
          </div>
          <div>
            <span className="font-medium text-text">Speed:</span> {player.speed}
          </div>
          <div>
            <span className="font-medium text-text">Impact:</span> {player.impact}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;