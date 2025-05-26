import React from 'react';
import { Link } from 'react-router-dom';
import { FaFutbol } from 'react-icons/fa';
import { GiSoccerBall } from 'react-icons/gi';

const Navbar = () => {
  return (
    <nav className="bg-secondary border-2 border-b-selected text-gray-100 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center text-xl font-bold  hover:text-selected transition-colors">
             <GiSoccerBall className="text-selected text-2xl mx-2" />9ahwa Ta3 Bessah
          </Link>
          <div className="flex space-x-4">
            <Link 
              to="/players" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
            >
              Players
            </Link>
            <Link 
              to="/team-generator" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
            >
              Team Generator
            </Link>
            <Link 
              to="/match-history" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
            >
              Match History
            </Link>
            <Link 
              to="/player-stats" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
            >
              Player Statistics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;