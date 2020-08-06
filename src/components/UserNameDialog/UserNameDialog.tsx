import React, { ChangeEvent, FormEvent, useState, useEffect, PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import queryString from 'query-string';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid } from '@material-ui/core';
require('dotenv').config();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    clientLogo: {
      height: '50px',
      borderRadius: '8px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: '20px',
    },
    formMultimedia: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: '20px',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '75%',
      marginBottom: '20px',
    },
    displayName: {
      marginLeft: '2.2em',
      minWidth: '200px',
      fontWeight: 600,
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
    loadingSpinner: {
      marginLeft: '1em',
    },
  })
);

function UserNameDialog() {
  const classes = useStyles();
  const { URLRoomName } = useParams();
  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect } = useVideoContext();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');

  let url = window.location.search;
  let params = queryString.parse(url);
  const clientLogoImage = params.logo_path;
  const role = params.role === 'teacher' ? 'teacher' : undefined;
  const appLogo = `${process.env.REACT_APP_PUBLIC_URL}/logo-cr.png`;
  const roomImage = clientLogoImage && `${process.env.REACT_APP_S3_BUCKET}/${clientLogoImage}`;

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
  }, [URLRoomName]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    // If this app is deployed as a twilio function, don't change the URL beacuse routing isn't supported.
    window.history.replaceState(
      null,
      '',
      window.encodeURI(`/room/${roomName}?logo_path=${clientLogoImage || ''}&role=${role || ''}`)
    );

    // use this to not override participants only by name.
    const randomID = Math.ceil(Math.random() * 100);
    const newName = `${name}-${randomID}`;

    getToken(newName, roomName, role)
      .then(token => {
        connect(token);
      })
      .catch(err => {
        console.log('Ha ocurrido un error al obtener el token: ', err);
      });
  };

  return (
    <div>
      <Dialog open fullWidth={true} maxWidth="xs" disableEnforceFocus>
        <form className={classes.form} onSubmit={handleSubmit}>
          {roomImage ? (
            <Grid container>
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
            <Grid container>
              <Grid container item xs={12} sm={12} justify="center">
                <img src={appLogo} alt="Logo de aplicación" className={classes.clientLogo} />
              </Grid>
            </Grid>
          )}

          <DialogTitle className={classes.dialogTitle}>#MasConectados</DialogTitle>

          <DialogContent>
            <DialogContentText>¡Comencemos la videollamada!</DialogContentText>
            <DialogContentText>Ingresa tu nombre a continuación para identificarte</DialogContentText>

            {!user?.displayName ? (
              <TextField
                id="menu-name"
                label="Nombre"
                className={classes.textField}
                value={name}
                onChange={handleNameChange}
                margin="dense"
              />
            ) : (
              <Typography className={classes.displayName} variant="body1">
                {user.displayName}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isConnecting || !name || !roomName || isFetching}
            >
              Ingresar
            </Button>
            {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} size={26} />}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default UserNameDialog;
