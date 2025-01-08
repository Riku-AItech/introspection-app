'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// BGMのパスを定数として定義
const BGM_PATH = '/meditation-bgm.mp3';  // ここを変更することで別の音声ファイルを使用可能

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(BGM_PATH);
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 flex items-center gap-3"
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => setIsControlsVisible(false)}
    >
      {isControlsVisible && (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-indigo-400/20 rounded-lg p-3 animate-fade-in">
          <span className="text-indigo-200 text-sm whitespace-nowrap">BGM</span>
          <div className="w-24">
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
      <Button
        onClick={togglePlay}
        variant="ghost"
        size="icon"
        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-indigo-400/20"
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 text-indigo-200" />
        ) : (
          <VolumeX className="h-5 w-5 text-indigo-200" />
        )}
      </Button>
    </div>
  );
} 