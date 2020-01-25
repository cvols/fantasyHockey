import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Context } from '../../context/Context';
import { useStyles } from './Navbar.styles.js';

export default function DenseAppBar() {
  const { context, setContext } = useContext(Context);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Link
            to="/"
            className={
              context.pathname === '/' ? classes.active : classes.inactive
            }
          >
            {/* <img src={} alt="Degenerate Hockey Helper" /> */}
            Home
          </Link>
          <Link
            to="/fantasyHockey"
            className={
              context.pathname === '/fantasyHockey'
                ? classes.active
                : classes.inactive
            }
          >
            Fantasy Hockey
          </Link>
          <Link
            to="/gambling"
            className={
              context.pathname === '/gambling'
                ? classes.active
                : classes.inactive
            }
          >
            Gambling
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
