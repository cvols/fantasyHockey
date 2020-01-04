import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  link: {
    marginRight: theme.spacing(2),
  },
}));

export default function DenseAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Link to="/">
            {/* <img src={} alt="Degenerate Hockey Helper" /> */}
           </Link>
          <Link to ="/fantasyHockey" className={classes.link}>
            Fantasy Hockey
          </Link>
          <Link to ="/gambling" className={classes.link}>
            Gambling
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
