import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TeamContext } from '../../context/TeamContext';
import { Accordion } from '../../components';
import './TeamStats.css';
import devilsLogo from '../images/devilsLogo.png';
import images from '../images/images.json';

console.log('images: ', images);

TeamStats.propTypes = {};

export default function TeamStats() {
  const [gameInfo, setGameInfo] = useState([]);
  const { teamContext, setTeamContext } = useContext(TeamContext);

  console.log('teamContext: ', teamContext);

  function fetchData(teamId) {
    if (gameInfo.length > 0) {
      setGameInfo([]);
    }

    fetch(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${teamId}&startDate=2019-12-19&endDate=2019-12-22`)
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
    if (teamContext.teamId) {
      return fetchData(teamContext.teamId);
    }
  }, [teamContext.teamId])

  return (
    <div>
      {gameInfo && console.log('gameInfo: ', gameInfo)}
      {teamContext && <p>{teamContext.teamName} Upcoming Schedule</p>}
      {gameInfo && gameInfo.map((info, index) => {
        const { opponent, date, gameTime, venue, isHome } = info;

        return (
          <div key={index} label={opponent} className="gameBox">
            <div className="gameBoxLeft">
              <img src={images[opponent]} alt="Logo" height="100px" width="150px" />
              <span>{isHome ? 'vs ' : '@ '} {opponent}</span>
              <span>{venue}</span>
            </div>
            <div className="gameBoxRight">
              <p>Date: {date}</p>
              <p>Time: {gameTime}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
