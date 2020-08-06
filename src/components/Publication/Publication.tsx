import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import AudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';

import { IVideoTrack } from '../../types';
import {
  AudioTrack as IAudioTrack,
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
  Track,
} from 'twilio-video';
import { identityParser } from '../../lib/utils';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocal: boolean;
  disableAudio?: boolean;
  videoPriority?: Track.Priority | null;
  showAppLogo?: boolean;
  showProviderLogo?: boolean;
}

export default function Publication({
  publication,
  isLocal,
  disableAudio,
  videoPriority,
  showAppLogo,
  participant,
  showProviderLogo,
}: PublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  const participantData = identityParser(participant.identity);

  let volume = 1;
  if (participantData.role !== 'teacher') {
    volume = 0.6;
  }

  switch (track.kind) {
    case 'video':
      return (
        <VideoTrack
          track={track as IVideoTrack}
          priority={videoPriority}
          isLocal={track.name === 'camera' && isLocal}
          showAppLogo={showAppLogo}
          showProviderLogo={showProviderLogo}
        />
      );
    case 'audio':
      return disableAudio ? null : <AudioTrack track={track as IAudioTrack} volume={volume} />;
    default:
      return null;
  }
}
