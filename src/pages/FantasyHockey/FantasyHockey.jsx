import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { Accordion, SearchForm, TeamStats } from '../../components';
import { Context } from '../../context/Context';
import './FantasyHockey.css';
import { getStartDate } from '../../helpers';

export default function FantasyHockey() {
  const { context, setContext } = useContext(Context);
  const [teamName, setTeamName] = useState('');
  const [fullTeamName, setFullTeamName] = useState();
  const [teamData, setTeamData] = useState();
  const [remainingGames, setRemainingGames] = useState();
  const [teamId, setTeamId] = useState();
  const [daysLeft, setDaysLeft] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerFullName, setPlayerFullName] = useState('');

  const END_DATE = '2020-02-02';

  useEffect(() => {
    // get start date and pathname
    // to set to context to use throughout the app
    setContext({
      ...context,
      startDate: getStartDate(),
      endDate: END_DATE,
      pathname: window.location.pathname
    });

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

  // get remaining games left in the week
  useEffect(() => {
    axios(
      `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${context.startDate}&endDate=${context.endDate}`
    )
      .then(data => {
        setRemainingGames(data.data.totalGames);
      })
      .catch(err =>
        setRemainingGames(`An error occurred: ${err.message || err}`)
      );
  }, [context.startDate, context.endDate]);

  useEffect(() => {
    axios(`https://statsapi.web.nhl.com/api/v1/teams/?expand=team.roster`)
      .then(data => {
        console.log('data: ', data);
        data.data.teams.find(roster => {
          roster.roster.roster.find(player => {
            if (playerName === player.person.fullName) {
              const playerId = player.person.id;

              axios(
                `https://statsapi.web.nhl.com/api/v1/people/${playerId}`
              ).then(data => {
                data.data.people.find(teamName => {
                  const currentTeamId = teamName.currentTeam.id;
                  const currentTeamName = teamName.currentTeam.name;

                  axios(
                    `https://statsapi.web.nhl.com/api/v1/schedule?teamId=${currentTeamId}&startDate=${context.startDate}&endDate=${context.endDate}`
                  ).then(data => {
                    setFullTeamName(currentTeamName);
                    setTeamData(data.data.totalGames);
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

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom>
        Fantasy Hockey Add/Drop Comparison Tool
      </Typography>
      <Divider className="divider" />
      <Grid container justify="center">
        <SearchForm type="team" />
      </Grid>
      <Grid container>
        <Grid container>
          <Typography variant="body1">
            Remaining days left in the fantasy hockey week:{' '}
            {daysLeft && daysLeft}
          </Typography>
        </Grid>
        <Grid container>
          <Typography variant="body1">
            Remaining NHL games left in the week:{' '}
            {remainingGames && remainingGames}
          </Typography>
        </Grid>
        <Grid container>
          <Typography variant="body1">
            {fullTeamName} remaining games left in the week: {teamData}
          </Typography>
        </Grid>
        <Grid container></Grid>
        {errorMessage && (
          <Grid container>
            <Typography variant="body1">{errorMessage}</Typography>
          </Grid>
        )}
        <TeamStats />
      </Grid>
    </Container>
  );
}
