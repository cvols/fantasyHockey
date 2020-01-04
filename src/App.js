import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Navbar } from './components';
import { Home, FantasyHockey, Gambling } from './pages';
import { TeamContext } from './context/TeamContext';

export default function App() {
  const [teamContext, setTeamContext ] = useState('');

  return (
    <TeamContext.Provider value={{ teamContext, setTeamContext }}>
      <Router>
        <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/fantasyHockey" component={FantasyHockey} />
            <Route path="/gambling" component={Gambling} />
          </Switch>
      </Router>
    </TeamContext.Provider>
  )
}
