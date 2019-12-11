import React, { useState } from 'react';
import { Home } from './pages';
import { TeamContext } from './context/TeamContext';

export default function App() {
  const [teamNameContext, setTeamNameContext ] = useState(null);
  const [teamIdContext, setTeamIdContext] = useState('');
  return (
    <TeamContext.Provider value={{ teamNameContext, setTeamNameContext }}>
      <Home />
    </TeamContext.Provider>

  )
}
