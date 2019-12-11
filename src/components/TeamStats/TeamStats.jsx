import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TeamContext } from '../../context/TeamContext';

TeamStats.propTypes = {};

export default function TeamStats() {
  const [gameInfo, setGameInfo] = useState([]);
  const { teamNameContext, setTeamNameContext } = useContext(TeamContext);
  const { teamIdContext, setTeamIdContext } = useContext(TeamContext);

  console.log('teamNameContext: ', teamNameContext);
  console.log('teamIdContext: ', teamIdContext);


  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=1&startDate=2019-12-10&endDate=2019-12-15`)
      .then(res => res.json())
      .then(res => {
        res.dates.map(dates => {
          console.log('topher');
          console.log('dates: ', dates.date);
          let obj = {};

          obj.date = dates.date;

          dates.games.map(games => {
            if (games.teams.home.team.name === 'New Jersey Devils') {
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
      .catch(console.log)
  }, [teamNameContext])

  return (
    <div>
      {gameInfo && console.log('gameInfo: ', gameInfo)}
      <p>New Jersey Devils</p>
      {gameInfo && gameInfo.map(info => {
        return (
          <div>
            <p>Opponent: {info.opponent}</p>
            <p>Date: {info.date}</p>
            <p>Time: {info.gameTime}</p>
            <p>{info.venue}</p>
            <p>{info.isHome ? 'Home Team' : 'Away Team'}</p>
          </div>
        )
      })}
    </div>
  )
}
