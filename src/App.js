import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ teamName, setTeamName ] = useState('');
  const [ fullTeamName, setFullTeamName ] = useState();
  const [ teamData, setTeamData ] = useState();
  const [ remainingGames, setRemainingGames ] = useState();
  const [ teamId, setTeamId ] = useState();
  const [ daysLeft, setDaysLeft ] = useState();
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ playerName, setPlayerName ] = useState('');
  const [ playerFullName, setPlayerFullName ] = useState('');

  // get remaining games left in the week
  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${getStartDate()}&endDate=2019-11-24`)
      .then(res => res.json())
      .then(data => setRemainingGames(data.totalGames))
      .catch(err => setRemainingGames(`An error occurred: ${err.message || err}`));
  }, []);

  // find all the teams to get their respective teamId
  // then find remaining games left by teamId
  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/teams`)
      .then(res => res.json())
      .then(response => {
        const team = response.teams.filter(team =>
          (team.locationName === teamName) ||
          (team.abbreviation === teamName) ||
          (team.name === teamName) ||
          (team.teamName === teamName)
        );
        if (team[0]) {
          setFullTeamName(team[0].name);
          fetch(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${team[0].id}&startDate=${getStartDate()}&endDate=2019-11-24`)
            .then(res => res.json())
            .then(response => setTeamData(response.totalGames))
            .catch(err => setRemainingGames(`An error occurred: ${err.message || err}`));
        } else if (teamName.length > 0) {
          setErrorMessage('Did not find that team');
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/teams/?expand=team.roster`)
      .then(res => res.json())
      .then(data => {
        console.log('data: ', data.teams.find(roster => {
          console.log('franchise: ', roster.franchise.teamName);
          console.log('roster: ', roster.roster.roster.map(player => {
            console.log('player: ', player.person.fullName);
          }));
        }));
      })
      .catch(err => console.log('err: ', err));
  }, [playerFullName]);

  function getStartDate() {
    return new Date().toJSON().slice(0,10);
  }

  function handleTeamChange(event) {
    setTeamData(null);
    setErrorMessage(null);
    setTeamName(event.target.value);
  }

  function handlePlayerChange(event) {
    setPlayerName(event.target.value);
  }

  useEffect(() => {
    const today = new Date().toString();
    const day = today.split(' ');
    switch (day[0]) {
      case "Mon":
        setDaysLeft(7);
        break;
      case "Tue":
        setDaysLeft(6);
        break;
      case "Wed":
        setDaysLeft(5);
        break;
      case "Thu":
        setDaysLeft(4);
        break;
      case "Fri":
        setDaysLeft(3);
        break;
      case "Sat":
        setDaysLeft(2);
        break;
      default:
        setDaysLeft(1);
        break;
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage(null);

    if (teamName.length > 0) {
      setTeamId(teamName);
    }

    if (playerName.length > 0) {
      setPlayerFullName(playerName);
    }
  }

  return (
    <div className="app">
      <h1>Fantasy Hockey Add/Drop Comparison Tool</h1>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <p>Team Name: </p>
          <input className="input" type="text" name="teamName" value={teamName} onChange={handleTeamChange} />
          <p>Player Name: </p>
          <input className="input" type="text" name="playerName" value={playerName} onChange={handlePlayerChange} />
        </div>
          <button type="button" onClick={handleSubmit}>Search</button>
      </form>
      {daysLeft && (
        <p>Remaining days left in the fantasy hockey week: {daysLeft}</p>
      )}
      {remainingGames && (
        <p>Remaining NHL games left in the week: {remainingGames}</p>
      )}
      {teamData && (
        <p>{fullTeamName} remaining games left in the week: {teamData}</p>
      )}
      {errorMessage && (
        <p>{errorMessage}</p>
      )}
    </div>
  );
}

export default App;
