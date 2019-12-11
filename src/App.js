import React, { useState } from 'react';
import { Home } from './pages';
import { TeamContext } from './context/TeamContext';

export default function App() {
  const [teamContext, setTeamContext ] = useState('');

  return (
    <TeamContext.Provider value={{ teamContext, setTeamContext }}>
      <Home />
    </TeamContext.Provider>

  )
}
