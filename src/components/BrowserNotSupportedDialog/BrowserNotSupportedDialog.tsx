import React, { PropsWithChildren } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import queryString from 'query-string';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getRecomendedBrowser } from '../../lib/utils';

import { Grid } from '@material-ui/core';
require('dotenv').config();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    clientLogo: {
      height: '50px',
      borderRadius: '8px',
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    headerContainer: {
      marginTop: '20px',
      marginBottom: '20px',
    },
    crlogo: {
      height: 65,
    },
    dialogTitle: {
      marginTop: '15px',
    },
    URL: {
      backgroundColor: '#333',
      borderRadius: 3,
      padding: 5,
      wordWrap: 'break-word',
      color: '#FFF',
    },
    navegadorLogo: {
      height: '50px',
      borderRadius: '5px',
    },
    navegadorLink: {
      color: '#fff',
      lineHeight: '1.5',
    },
  })
);

interface BrowserNotSupportedDialogProps {
  browserName?: string;
  browserOs?: string;
}

function BrowserNotSupportedDialog({ browserName, browserOs }: PropsWithChildren<BrowserNotSupportedDialogProps>) {
  const classes = useStyles();

  let url = window.location.search;
  let params = queryString.parse(url);
  const clientLogoImage = params.logo_path;
  const appLogo = `${process.env.REACT_APP_PUBLIC_URL}/logo-cr.png`;
  const roomImage = clientLogoImage && `${process.env.REACT_APP_S3_BUCKET}/${clientLogoImage}`;
  const recomendedBrowser = getRecomendedBrowser(browserName, browserOs);

  return (
    <Dialog open fullWidth={true} maxWidth="xs">
      <div className={classes.container}>
        {roomImage ? (
          <Grid container className={classes.headerContainer}>
            <Grid container item xs={12} sm={2} justify="center"></Grid>
            <Grid container item xs={12} sm={3} justify="center">
              <img src={appLogo} alt="Logo de aplicación" className={classes.clientLogo} />
            </Grid>
            <Grid item xs={12} sm={2}>
              <span style={{ fontSize: 30 }}>+</span>
            </Grid>
            <Grid container item xs={12} sm={3} justify="center">
              <img src={roomImage} alt="Logo de aplicación" className={classes.clientLogo} />
            </Grid>
          </Grid>
        ) : (
          <Grid container className={classes.headerContainer}>
            <Grid container item xs={12} sm={12} justify="center">
              <img src={appLogo} alt="Logo de aplicación" className={classes.clientLogo} />
            </Grid>
          </Grid>
        )}

        <DialogTitle className={classes.dialogTitle}>Tu navegador no es compatible</DialogTitle>

        {recomendedBrowser ? (
          <DialogContent>
            <DialogContentText>Para unirte a la videollamada debarás utilizar este navegador:</DialogContentText>

            <DialogContentText>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={recomendedBrowser.link}
                className={classes.navegadorLink}
              >
                <img
                  src={recomendedBrowser.logo}
                  alt={`Navegador ${recomendedBrowser.name}`}
                  className={classes.navegadorLogo}
                />
                <br />
                {recomendedBrowser.name}
              </a>
            </DialogContentText>

            <DialogContentText>Copia esta dirección y pégala en el nuevo navegador para ingresar:</DialogContentText>
            <DialogContentText className={classes.URL}>{window.location.href}</DialogContentText>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogContentText>Ingresa desde otro dispositivo</DialogContentText>
          </DialogContent>
        )}

        <DialogActions></DialogActions>
      </div>
    </Dialog>
  );
}

export default BrowserNotSupportedDialog;
