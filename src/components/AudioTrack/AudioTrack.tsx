import React, { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface AudioTrackProps {
  track: IAudioTrack;
  volume?: number;
}

export default function AudioTrack({ track, volume = 1 }: AudioTrackProps) {
  const ref = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    const el = ref.current;
    track.attach(el);
    el.volume = volume;

    return () => {
      track.detach(el);
    };
  }, [track, volume]);

  return <audio ref={ref} />;
}
