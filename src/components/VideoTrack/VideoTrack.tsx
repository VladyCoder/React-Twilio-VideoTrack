import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from '../../types';
import { styled } from '@material-ui/core/styles';
import { Track } from 'twilio-video';

require('dotenv').config();

const VideoContainer = styled('div')({
  display: 'flex',
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const Video = styled('video')({
  width: '100%',
  height: '100%',
});

const CompanyLogo = styled('div')(({ theme }) => ({
  position: 'absolute',
  padding: '0.56%',
  right: '0.5vw',
  backgroundImage: `url(${process.env.REACT_APP_PUBLIC_URL}/logo-cr.png)`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  width: '12vw',
  height: '50vh',
  opacity: '0.75',
  zIndex: 999,
}));

const ProviderLogo = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: '8px',
  bottom: '8px',
  backgroundImage: `url(${process.env.REACT_APP_PUBLIC_URL}/twilio-video-boost-badge@2x.png)`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  width: '140px',
  height: '32px',
  opacity: '0.9',
  zIndex: 999,
}));

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
  showAppLogo?: boolean;
  showProviderLogo?: boolean;
}

export default function VideoTrack({ track, isLocal, priority, showAppLogo, showProviderLogo }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored.
  const style = isLocal ? { transform: 'rotateY(180deg)' } : {};

  return (
    <VideoContainer>
      {showAppLogo && <CompanyLogo />}
      {showProviderLogo && <ProviderLogo />}
      <Video ref={ref} style={style} />
    </VideoContainer>
  );
}
