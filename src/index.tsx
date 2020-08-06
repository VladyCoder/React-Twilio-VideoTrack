import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ConnectOptions } from 'twilio-video';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'https://5c5259bb88c64d6bba6cb0c866d3a734@o381916.ingest.sentry.io/5210015' });

// See: https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions
// for available connection options.
const connectionOptions: ConnectOptions = {
  bandwidthProfile: {
    video: {
      mode: 'presentation',
      trackSwitchOffMode: 'detected', // Probar si esto evita que te quite de la sala cuando tenes mala conexión.
      dominantSpeakerPriority: 'high', // Uso standard ya que voy a sobreescribir la calidad del track para los docentes unicamente.
      renderDimensions: {
        high: { height: 720, width: 1280 },
        standard: { height: 480, width: 640 },
        low: { height: 90, width: 160 },
      },
    },
  },
  dominantSpeaker: true,
  maxAudioBitrate: 12000,
  networkQuality: { local: 1, remote: 1 },
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
};

const VideoApp = () => {
  const { error, setError } = useAppState();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <App />
    </VideoProvider>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <VideoApp />
          </PrivateRoute>
          <PrivateRoute path="/room/:URLRoomName">
            <VideoApp />
          </PrivateRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
