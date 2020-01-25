import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';

import { Navbar } from './components';
import { Home, FantasyHockey, Gambling } from './pages';
import { Context } from './context/Context';
import theme from './theme';

export default function App() {
  const [context, setContext] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={{ context, setContext }}>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/fantasyHockey" component={FantasyHockey} />
            <Route path="/gambling" component={Gambling} />
          </Switch>
        </Router>
      </Context.Provider>
    </ThemeProvider>
  );
}
