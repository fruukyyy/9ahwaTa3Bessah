import { useState } from 'react';
import { GiSoccerBall, GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-secondary border-2 border-b-selected text-gray-100 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-xl font-bold hover:text-selected transition-colors">
            <GiSoccerBall className="text-selected text-2xl mx-2" />9ahwa Ta3 Bessah
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
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
              Players Statistics
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <GiHamburgerMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link 
              to="/players" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Players
            </Link>
            <Link 
              to="/team-generator" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Team Generator
            </Link>
            <Link 
              to="/match-history" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Match History
            </Link>
            <Link 
              to="/player-stats" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-selected transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Players Statistics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;