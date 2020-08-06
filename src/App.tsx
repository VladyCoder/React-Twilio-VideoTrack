import React, { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import UserNameDialog from './components/UserNameDialog/UserNameDialog';
import BrowserNotSupportedDialog from './components/BrowserNotSupportedDialog/BrowserNotSupportedDialog';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import ReactGA from 'react-ga';

import useRoomState from './hooks/useRoomState/useRoomState';
import { isBrowserSupported } from './lib/utils';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const Main = styled('main')({
  height: '100%',
  position: 'relative',
});

declare global {
  interface Window {
    fcWidget: any;
  }
}

export default function App() {
  const roomState = useRoomState();
  const { detect } = require('detect-browser');
  const browser = detect();

  const [browserName, setBrowserName] = useState<string>();
  const [browserOS, setBrowserOS] = useState<string>();
  const [browserSupported, setBrowserSupported] = useState<boolean>(true);
  const [browserWebRTCSupported, setBrowserWebRTCSupported] = useState<boolean>(true);
  const [browserHasMicrophone, setBrowserHasMicrophone] = useState<boolean>(true);
  const [browserHasWebCam, setBrowserHasWebCam] = useState<boolean>(true);

  const sendBrowserNotSupportRTCEvent = (
    os?: string,
    name?: string,
    webRTCSupported?: boolean,
    hasWebCam?: boolean,
    hasMicrophone?: boolean
  ) => {
    ReactGA.event({
      category: 'BrowserNotSupportRTC',
      action: `${os}-${name}-RTC:${webRTCSupported}-Cam:${hasWebCam}-Mic:${hasMicrophone}`,
    });
  };

  useEffect(() => {
    ReactGA.initialize('UA-162453446-1');

    if (browser) {
      setBrowserName(browser.name);
      setBrowserOS(browser.os);

      setTimeout(() => {
        if (window.fcWidget) {
          // Send user properties to freshchat
          window.fcWidget.user.setProperties({
            browserName: browser.name,
            browserOS: browser.os,
          });
        }
      }, 4000);
    }

    var DetectRTC = require('detectrtc');

    DetectRTC.load(function() {
      setBrowserWebRTCSupported(DetectRTC.isWebRTCSupported);
      setBrowserHasMicrophone(DetectRTC.hasMicrophone);
      setBrowserHasWebCam(DetectRTC.hasWebcam);

      if (!browserWebRTCSupported || !isBrowserSupported(browserName, browserOS)) {
        setBrowserSupported(false);
        sendBrowserNotSupportRTCEvent(
          browserOS,
          browserName,
          browserWebRTCSupported,
          browserHasWebCam,
          browserHasMicrophone
        );
      }
    });
  }, [
    browser,
    browserName,
    browserOS,
    browserSupported,
    browserWebRTCSupported,
    browserHasMicrophone,
    browserHasWebCam,
  ]);

  return (
    <div>
      {browserSupported ? (
        <Container>
          {roomState === 'disconnected' ? <UserNameDialog /> : <MenuBar />}
          <Main>
            {roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}
            <Controls />
          </Main>
          <ReconnectingNotification />
        </Container>
      ) : (
        <Container>
          <BrowserNotSupportedDialog browserName={browserName} browserOs={browserOS} />
        </Container>
      )}
    </div>
  );
}
