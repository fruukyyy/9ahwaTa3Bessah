import React from 'react';
import TeamGenerator from '../components/TeamGenerator';
import { playersList } from '../data/players';

const TeamGeneratorPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Team Generator</h1>
      <TeamGenerator players={playersList} />
    </div>
  );
};

export default TeamGeneratorPage;