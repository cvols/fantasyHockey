import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../context/Context';

SearchForm.propTypes = {
  type: PropTypes.string.isRequired,
};

export default function SearchForm({ type }) {
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [fullTeamName, setFullTeamName] = useState('');
  const { context, setContext } = useContext(Context);

  const START_DATE = '2019-12-13';
  const END_DATE = '2019-12-15';

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
      fetch(`https://statsapi.web.nhl.com/api/v1/teams`)
      .then(res => res.json())
      .then(async res => {
        console.log('res: ', res)
        const team = await res.teams.filter(team =>
            team.locationName === teamName ||
            team.abbreviation === teamName ||
            team.name === teamName ||
            team.teamName === teamName
        );
        console.log('team: ', team);

        if (team[0]) {
          setContext({ teamName: team[0].name, teamId: team[0].id});
        }
      });
    }
  }, [teamId]);

  return (
      <form onSubmit={type === 'team' ? handleTeamSubmit : handlePlayerSubmit}>
        <div className="form">
          <p>Team Name: </p>
          <input
            className="input"
            type="text"
            name="teamName"
            value={teamName}
            onChange={type === 'team' ? handleTeamChange : handlePlayerChange}
          />
          <button
            className="submitButton"
            type="button"
            onClick={type === 'team' ? handleTeamSubmit : handlePlayerSubmit}
          >
            Team Search
          </button>
        </div>
      </form>
  )
}
