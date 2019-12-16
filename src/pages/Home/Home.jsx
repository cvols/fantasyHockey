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

  return (
    <div className="app">
      <h1>Fantasy Hockey Add/Drop Comparison Tool</h1>
      <div className="formBox">
      <Accordion allowMultipleOpen>
        <div label="Team Search" isOpen>
        <SearchForm type="team" />
        </div>
        <div label="Player Search">
        <SearchForm type="player" />
        </div>
      </Accordion>
        {/* <SearchForm type="team" />
        <SearchForm type="player" /> */}
      </div>
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
      <TeamStats />
    </div>
  );
}

export default Home;
