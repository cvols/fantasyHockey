import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Context } from '../../context/Context';

SearchForm.propTypes = {
  type: PropTypes.string.isRequired
};

export default function SearchForm({ type }) {
  const { context, setContext } = useContext(Context);
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [fullTeamName, setFullTeamName] = useState('');

  function handleTeamSubmit(event) {
    console.log('clicked');
    event.preventDefault();
    // setErrorMessage(null);
    setTeamId(teamName);
  }

  function handleTeamChange(event) {
    console.log('value: ', event.target.value);
    // setTeamData(null);
    // setErrorMessage(null);
    // setPlayerName('');
    setTeamName(event.target.value);
  }

  function handlePlayerChange(event) {
    // setTeamData(null);
    // setErrorMessage(null);
    setTeamName('');
    // setPlayerName(event.target.value);
  }

  function handlePlayerSubmit(event) {
    event.preventDefault();
    // setErrorMessage(null);
    // setPlayerFullName(playerName);
  }

  // find all the teams to get their respective teamId
  // then find remaining games left by teamId
  useEffect(() => {
    if (teamId) {
      axios(`https://statsapi.web.nhl.com/api/v1/teams`).then(async res => {
        console.log('res: ', res);
        const team = await res.data.teams.filter(
          team =>
            team.locationName === teamName ||
            team.abbreviation === teamName ||
            team.name === teamName ||
            team.teamName === teamName
        );
        console.log('team: ', team);

        if (team[0]) {
          setContext({ teamName: team[0].name, teamId: team[0].id });
        }
      });
    }
  }, [teamId]);

  return (
    <form onSubmit={type === 'team' ? handleTeamSubmit : handlePlayerSubmit}>
      <Grid container>
        <TextField
          id="teamSearch"
          label="SEARCH BY TEAM NAME"
          variant="outlined"
          value={teamName}
          onChange={handleTeamChange}
        />
        <Button variant="container">Search</Button>
      </Grid>
    </form>
  );
}
