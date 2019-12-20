import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [teamName, setTeamName] = useState("");
  const [fullTeamName, setFullTeamName] = useState();
  const [teamData, setTeamData] = useState();
  const [remainingGames, setRemainingGames] = useState();
  const [teamId, setTeamId] = useState();
  const [daysLeft, setDaysLeft] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerFullName, setPlayerFullName] = useState("");

  const START_DATE = getStartDate();
  const END_DATE = "2019-11-24";

  // get remaining games left in the week
  useEffect(() => {
    fetch(
      `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${START_DATE}&endDate=${END_DATE}`
    )
      .then(res => res.json())
      .then(data => setRemainingGames(data.totalGames))
      .catch(err => setRemainingGames(`An error occurred: ${err.u || err}`));
  }, []);

  // find all the teams to get their respective teamId
  // then find remaining games left by teamId
  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/teams`)
      .then(res => res.json())
      .then(data => {
        const team = data.teams.filter(
          team =>
            team.locationName === teamName ||
            team.abbreviation === teamName ||
            team.name === teamName ||
            team.teamName === teamName
        );
        if (team.length > 0) {
          setFullTeamName(team[0].name);
          fetch(
            `https://statsapi.web.nhl.com/api/v1/schedule?teamId=${team[0].id}&startDate=${START_DATE}&endDate=${END_DATE}`
          )
            .then(res => res.json())
            .then(data => setTeamData(data.totalGames))
            .catch(err =>
              setRemainingGames(`An error occurred: ${err.message || err}`)
            );
        } else if (teamName.length > 0) {
          setErrorMessage("Did not find that team");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

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
      .catch(err => console.log("err: ", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerFullName]);

  function getStartDate() {
    return new Date().toJSON().slice(0, 10);
  }

  useEffect(() => {
    const today = new Date().toString();
    const day = today.split(" ");

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
  }, []);

  function handleTeamChange(event) {
    setTeamData(null);
    setErrorMessage(null);
    setPlayerName("");
    setTeamName(event.target.value);
  }

  function handlePlayerChange(event) {
    setTeamData(null);
    setErrorMessage(null);
    setTeamName("");
    setPlayerName(event.target.value);
  }

  function handleTeamSubmit(event) {
    event.preventDefault();
    setErrorMessage(null);
    setTeamId(teamName);
  }

  function handlePlayerSubmit(event) {
    event.preventDefault();
    setErrorMessage(null);
    setPlayerFullName(playerName);
  }

  return (
    <div className="app">
      <h1>Fantasy Hockey Add/Drop Comparison Tool</h1>
      <form onSubmit={teamName ? handleTeamSubmit : handlePlayerSubmit}>
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
      </form>
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
    </div>
  );
}
