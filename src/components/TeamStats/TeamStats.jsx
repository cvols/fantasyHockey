import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TeamContext } from '../../context/TeamContext';

TeamStats.propTypes = {};

export default function TeamStats() {
  const [gameInfo, setGameInfo] = useState([]);
  const { teamContext, setTeamContext } = useContext(TeamContext);

  console.log('teamContext: ', teamContext);

  function fetchData(teamId = 1) {
    if (gameInfo.length > 0) {
      setGameInfo([]);
    }

    fetch(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${teamId}&startDate=2019-12-10&endDate=2019-12-15`)
    .then(res => res.json())
    .then(res => {
      res.dates.map(dates => {
        console.log('topher');
        console.log('dates: ', dates.date);
        let obj = {};

        obj.date = dates.date;

        dates.games.map(games => {
          if (games.teams.home.team.name === teamContext.teamName) {
            console.log('home team');
            obj = {
              ...obj,
              opponent: games.teams.away.team.name,
              isHome: true
            }
          } else {
            obj = {
              ...obj,
              opponent: games.teams.home.team.name,
              isHome: false
            }
           }
           obj.venue = games.venue.name;
           obj.gameTime = games.gameDate;
          console.log('games: ', games);
          setGameInfo((initialArray) => [...initialArray, obj]);
        })
      })
    })
    .catch(err => console.log('err: ', err));
  }

  useEffect(() => {
    fetchData(teamContext.teamId);
  }, [teamContext.teamId])

  return (
    <div>
      {gameInfo && console.log('gameInfo: ', gameInfo)}
      {teamContext && <p>{teamContext.teamName} Schedule</p>}
      {gameInfo && gameInfo.map((info, index) => {
        const { opponent, date, gameTime, venue, isHome } = info;

        return (
          <div key={index}>
            <p>Opponent: {opponent}</p>
            <p>Date: {date}</p>
            <p>Time: {gameTime}</p>
            <p>{venue}</p>
            <p>{isHome ? 'Home Team' : 'Away Team'}</p>
          </div>
        )
      })}
    </div>
  )
}
