import React from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(track => track.name === 'camera') as LocalVideoTrack;

  return videoTrack ? <VideoTrack track={videoTrack} showProviderLogo isLocal /> : null;
}
