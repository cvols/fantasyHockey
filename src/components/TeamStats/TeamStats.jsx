import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function TeamStats() {
  const [gameDay, setGameDay] = useState('');
  const [isHomeTeam, setIsHomeTeam] = useState(null);
  const [opponent, setOpponent] = useState('');
  const [gameInfo, setGameInfo] = useState();
  TeamStats.propTypes = {};

  function getGameDay(dates) {
    console.log('dates: ', dates);
    return setGameDay(dates);
  }

  function getGameInfo(gameInfo) {
    return gameInfo.map(game => {
      // set isHomeTeam
      setIsHomeTeam(game.teams.home.team.name === 'New Jersey Devils');
      if (game.teams.home.team.name !== 'New Jersey Devils') {
       return setOpponent(game.teams.home.team.name);
      }

      return setOpponent(game.teams.away.team.name);
    });
  }

  // console.log('gameDay: ', gameDay);
  // console.log('isHomeTeam: ', isHomeTeam);
  // console.log('opponent: ', opponent);

  gameInfo && gameInfo.map(game => {
    game.games.map(res => {
      // console.log('res: ', res.teams.home.team.name);
    })
  })

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=1&startDate=2019-12-09&endDate=2019-12-15`)
      .then(res => res.json())
      .then(res => {
        // console.log('res: ', res);
        setGameInfo(res.dates);
        // console.log('games: ', res.dates[0].games[0]);
        // getGameDay(res.dates);
        // res.dates.map(gameInfo => {
        //   getGameInfo(gameInfo.games);
        // })
      })
      .catch(console.log)
  }, [])
  return (
    <div>
      {/* {gameDay && gameDay.map(day => {
        return (<div>{day.date}</div>)
      })}
      {(isHomeTeam === false || isHomeTeam) && `isHomeTeam: ${isHomeTeam}`}
      opponent: {opponent} */}
      {gameInfo && `date: ${gameInfo.map(game => game.date)}`}
      {gameInfo && `date: ${gameInfo.map(game => {
        game.games.map(res => {
          if (res.teams.home.team.name !== 'New Jersey Devils') {
            console.log(res.teams.home.team.name);
            return (
              <div>{res.teams.home.team.name}</div>
            )
          }

          return res.teams.away.team.name;
        })
      })}`}

    </div>
  )
}
