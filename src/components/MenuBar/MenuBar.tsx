import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToggleFullscreenButton from '../ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';
import queryString from 'query-string';
import { Grid } from '@material-ui/core';

require('dotenv').config();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    root: {
      flexGrow: 1,
    },
    form: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      marginLeft: '2.2em',
      minWidth: '200px',
      fontWeight: 600,
    },
    crlogo: {
      height: 65,
    },
    clientLogo: {
      height: '50px',
      borderRadius: '8px',
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();

  let url = window.location.search;
  let params = queryString.parse(url);
  const clientLogoImage = params.logo_path;

  const roomImage = clientLogoImage
    ? `${process.env.REACT_APP_S3_BUCKET}/${clientLogoImage}`
    : `${process.env.REACT_APP_PUBLIC_URL}/logo-cr.png`;

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        <Grid container>
          <Grid item xs={11}>
            <img src={roomImage} alt="Logo de aplicación" className={classes.clientLogo} />
          </Grid>
          <Grid container item xs={1} justify="flex-end">
            <ToggleFullscreenButton />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
