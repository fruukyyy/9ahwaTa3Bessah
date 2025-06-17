import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { playersList } from '../data/players';
import { calculateAge } from '../utils/ageCalculator';

const PlayerProfilePage = () => {
  const { id } = useParams();
  const player = playersList.find(p => p.id === parseInt(id));
  const [showFullImage, setShowFullImage] = useState(false);
  const [clickedImagePosition, setClickedImagePosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  if (!player) {
    return <div className="text-text flex justify-center">Player not found</div>;
  }

  const stats = [
    { label: 'Attack', value: player.attack },
    { label: 'Defense', value: player.defense },
    { label: 'Dribble', value: player.dribble },
    { label: 'Stamina', value: player.stamina },
    { label: 'Speed', value: player.speed },
    { label: 'Ball Control', value: player.ballControl },
    { label: 'Pass Accuracy', value: player.passAccuracy },
    { label: 'Finish', value: player.finish },
  ];

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickedImagePosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    });
    setShowFullImage(true);
  };

  const handleCloseImage = () => {
    setShowFullImage(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Full Image Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm transition-opacity duration-300"
          onClick={handleCloseImage}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <img 
            src={player.image} 
            alt={player.name} 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
            style={{
              animation: 'zoomIn 0.3s ease-out',
              transformOrigin: `${clickedImagePosition.left + clickedImagePosition.width/2}px ${clickedImagePosition.top + clickedImagePosition.height/2}px`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { 
            transform: scale(${clickedImagePosition.width / window.innerWidth});
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes zoomOut {
          from { 
            transform: scale(1);
            opacity: 1;
          }
          to { 
            transform: scale(${clickedImagePosition.width / window.innerWidth});
            opacity: 0;
          }
        }
      `}</style>

      <div className="bg-secondary rounded-lg shadow-lg overflow-hidden border-2 border-gold-400/30">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex justify-center">
            <img 
              src={player.image} 
              alt={player.name} 
              className="w-64 h-64 rounded-full object-cover border-4 border-gold-400 cursor-pointer hover:border-gold-300 transition-transform hover:scale-105 duration-200"
              onClick={handleImageClick}
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2 text-gold-400">{player.name}</h1>
            <div className="flex items-center mb-4">
              <span className="inline-block bg-gold-500 text-primary font-semibold px-3 py-1 rounded-full text-sm mr-2">
                {player.position}
              </span>
              <span className="text-text-gray">
                Age: {calculateAge(player.birthday)}
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-text">Overall Rating</h2>
              <div className="w-full bg-primary/50 rounded-full h-6">
                <div 
                  className="bg-gold-500 h-6 rounded-full flex items-center justify-center text-primary font-bold" 
                  style={{ width: `${player.overallRating}%` }}
                >
                  {player.overallRating}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-text">Player Bio</h2>
              <p className="text-text-gray">{player.bio}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-secondary border-t border-gold-400/20">
          <h2 className="text-2xl font-semibold mb-4 text-text">Player Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="mb-2">
                <div className="flex justify-between mb-1 text-text">
                  <span className="font-medium">{stat.label}</span>
                  <span className='text-text-gray'>{stat.value}</span>
                </div>
                <div className="w-full bg-primary/50 rounded-full h-2">
                  <div 
                    className="bg-gold-500 h-2 rounded-full" 
                    style={{ width: `${stat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;