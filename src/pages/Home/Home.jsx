import React, { useEffect, useState } from 'react';
import { Accordion, TeamStats, SearchForm } from '../../components';
import './Home.css';

function Home() {
  const [teamName, setTeamName] = useState('');
  const [fullTeamName, setFullTeamName] = useState();
  const [teamData, setTeamData] = useState();
  const [remainingGames, setRemainingGames] = useState();
  const [teamId, setTeamId] = useState();
  const [daysLeft, setDaysLeft] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerFullName, setPlayerFullName] = useState('');

  const START_DATE = getStartDate();
  const END_DATE = '2019-12-15';

  // get remaining games left in the week
  useEffect(() => {
    fetch(
      `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${START_DATE}&endDate=${END_DATE}`
    )
      .then(res => res.json())
      .then(data => {
        setRemainingGames(data.totalGames);
      })
      .catch(err =>
        setRemainingGames(`An error occurred: ${err.message || err}`)
      );
  }, [START_DATE, END_DATE]);

  // // find all the teams to get their respective teamId
  // // then find remaining games left by teamId
  // useEffect(() => {
  //   fetch(`https://statsapi.web.nhl.com/api/v1/teams`)
  //     .then(res => res.json())
  //     .then(response => {
  //       const team = response.teams.filter(
  //         team =>
  //           team.locationName === teamName ||
  //           team.abbreviation === teamName ||
  //           team.name === teamName ||
  //           team.teamName === teamName
  //       );
  //       if (team[0]) {
  //         setFullTeamName(team[0].name);
  //         fetch(
  //           `https://statsapi.web.nhl.com/api/v1/schedule?teamId=${team[0].id}&startDate=${START_DATE}&endDate=${END_DATE}`
  //         )
  //           .then(res => res.json())
  //           .then(response => {
  //             console.log('response: ', response);
  //             setTeamData(response.totalGames);
  //           })
  //           .catch(err =>
  //             setRemainingGames(`An error occurred: ${err.message || err}`)
  //           );
  //       } else if (teamName.length > 0) {
  //         setErrorMessage('Did not find that team');
  //       }
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [teamId]);

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/teams/?expand=team.roster`)
      .then(res => res.json())
      .then(data => {
        data.teams.find(roster => {
          roster.roster.roster.find(player => {
            if (playerName === player.person.fullName) {
              const playerId = player.person.id;

              fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)
                .then(res => res.json())
                .then(data => {
                  data.people.find(teamName => {
                    const currentTeamId = teamName.currentTeam.id;
                    const currentTeamName = teamName.currentTeam.name;

                    fetch(
                      `https://statsapi.web.nhl.com/api/v1/schedule?teamId=${currentTeamId}&startDate=${START_DATE}&endDate=2019-11-24`
                    )
                      .then(res => res.json())
                      .then(data => {
                        setFullTeamName(currentTeamName);
                        setTeamData(data.totalGames);
                      });

                    return null;
                  });
                });
            }

            return null;
          });

          return null;
        });
      })
      .catch(err => console.log('err: ', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerFullName]);

  function getStartDate() {
    return new Date().toJSON().slice(0, 10);
  }

  useEffect(() => {
    const today = new Date().toString();
    const day = today.split(' ');

    switch (day[0]) {
      case 'Mon':
        setDaysLeft(7);
        break;
      case 'Tue':
        setDaysLeft(6);
        break;
      case 'Wed':
        setDaysLeft(5);
        break;
      case 'Thu':
        setDaysLeft(4);
        break;
      case 'Fri':
        setDaysLeft(3);
        break;
      case 'Sat':
        setDaysLeft(2);
        break;
      default:
        setDaysLeft(1);
        break;
    }
  }, []);

  // function handleTeamChange(event) {
  //   setTeamData(null);
  //   setErrorMessage(null);
  //   setPlayerName('');
  //   setTeamName(event.target.value);
  // }

  // function handlePlayerChange(event) {
  //   setTeamData(null);
  //   setErrorMessage(null);
  //   setTeamName('');
  //   setPlayerName(event.target.value);
  // }

  // function handleTeamSubmit(event) {
  //   event.preventDefault();
  //   setErrorMessage(null);
  //   setTeamId(teamName);
  // }

  // function handlePlayerSubmit(event) {
  //   event.preventDefault();
  //   setErrorMessage(null);
  //   setPlayerFullName(playerName);
  // }

  return (
    <div className="app">
      <h1>Fantasy Hockey Add/Drop Comparison Tool</h1>
      <SearchForm type="team" />
      {/* <form onSubmit={teamName ? handleTeamSubmit : handlePlayerSubmit}>
        <div className="form">
          <p>Team Name: </p>
          <input
            className="input"
            type="text"
            name="teamName"
            value={teamName}
            onChange={handleTeamChange}
          />
          <button
            className="submitButton"
            type="button"
            onClick={handleTeamSubmit}
          >
            Team Search
          </button>
          <p>Player Name: </p>
          <input
            className="input"
            type="text"
            name="playerName"
            value={playerName}
            onChange={handlePlayerChange}
          />
          <button
            className="submitButton"
            type="button"
            onClick={handlePlayerSubmit}
          >
            Player Search
          </button>
        </div>
      </form> */}
      {daysLeft && (
        <p>Remaining days left in the fantasy hockey week: {daysLeft}</p>
      )}
      {remainingGames && (
        <p>Remaining NHL games left in the week: {remainingGames}</p>
      )}
      {teamData && (
        <p>
          {fullTeamName} remaining games left in the week: {teamData}
        </p>
      )}
      {errorMessage && <p>{errorMessage}</p>}
      <Accordion>
        <div label="Alligator Mississippiensis">
          <p>
            <strong>Common Name:</strong> American Alligator
          </p>
          <p>
            <strong>Distribution:</strong> Texas to North Carolina, United
            States
          </p>
          <p>
            <strong>Endangered Status:</strong> Currently Not Endangered
          </p>
        </div>
        <div label="Alligator Sinensis">
          <p>
            <strong>Common Name:</strong> Chinese Alligator
          </p>
          <p>
            <strong>Distribution:</strong> Eastern China
          </p>
          <p>
            <strong>Endangered Status:</strong> Critically Endangered
          </p>
        </div>
      </Accordion>
      <Accordion allowMultipleOpen>
        <div label="Alligator Mississippiensis" isOpen>
          <p>
            <strong>Common Name:</strong> American Alligator
          </p>
          <p>
            <strong>Distribution:</strong> Texas to North Carolina, United
            States
          </p>
          <p>
            <strong>Endangered Status:</strong> Currently Not Endangered
          </p>
        </div>
        <div label="Alligator Sinensis">
          <p>
            <strong>Common Name:</strong> Chinese Alligator
          </p>
          <p>
            <strong>Distribution:</strong> Eastern China
          </p>
          <p>
            <strong>Endangered Status:</strong> Critically Endangered
          </p>
        </div>
      </Accordion>
      <TeamStats />
    </div>
  );
}

export default Home;
