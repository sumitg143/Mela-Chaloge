import React, { useState } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Radio, Volume2 } from 'lucide-react';
import { BhajanTrack } from '../types';

interface MelaRadioModalProps {
  onClose: () => void;
}

const BHAJAN_PLAYLIST: BhajanTrack[] = [
  { id: '1', name: 'Ram Aayenge', artist: 'Maithili Thakur', youtubeId: 'vqmmNPBnINg', duration: 250 },
  { id: '2', name: 'Ram Siya Ram', artist: 'Govind Krsna Das', youtubeId: 'YzV7cR1MBmw', duration: 235 },
  { id: '3', name: 'Shri Ramchandra Kripalu Bhajman', artist: 'Shri Ram Bhajan', youtubeId: 'GmbzO39zdTc', duration: 310 },
  { id: '4', name: 'Mangal Bhavan Amangal Haari', artist: 'Ravindra Jain', youtubeId: 'Yco6KxqpnJc', duration: 290 },
  { id: '5', name: 'Hanuman Chalisa', artist: 'Hanuman Bhajan', youtubeId: 'sFN9C8QE-Nc', duration: 580 },
];

export const MelaRadioModal: React.FC<MelaRadioModalProps> = ({ onClose }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentTrack = BHAJAN_PLAYLIST[currentTrackIndex];

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % BHAJAN_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + BHAJAN_PLAYLIST.length) % BHAJAN_PLAYLIST.length);
    setIsPlaying(true);
  };

  return (
    <div className="panel-backdrop fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="game-panel relative bg-[#13272d]/95 border border-[#dfc38c] rounded-2xl p-6 sm:p-7 max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="panel-close absolute right-4 top-4 text-[#ecc282] hover:text-white text-2xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="eyebrow text-xs uppercase tracking-[2px] text-[#ecc282] font-semibold flex items-center justify-center gap-1.5 mb-1">
          <Radio className="w-3.5 h-3.5 text-yellow-300" />
          MELA RADIO • BHAJAN DHUN
        </div>

        <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#fff3dc] mb-1">
          Dussehra Mela Radio 📻
        </h2>

        <p className="text-xs text-[#d5ded2] mb-5">
          Curated devotional hymns and auspicious festive chants filling the night fairgrounds.
        </p>

        {/* Vinyl Disc Player */}
        <div className="flex flex-col items-center justify-center py-4 bg-[#0d1b20] border border-[#dfc38c]/30 rounded-2xl mb-5">
          <div
            className={`w-28 h-28 rounded-full border-4 border-[#e5be72] flex items-center justify-center shadow-[0_0_30px_rgba(229,190,114,0.3)] bg-gradient-to-tr from-[#1b2f33] to-[#0a1216] ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '8s' }}
          >
            <div className="w-10 h-10 rounded-full bg-[#f1c17d] flex items-center justify-center text-[#182c2e] font-bold text-xs">
              ✦
            </div>
          </div>

          <div className="mt-4 text-center">
            <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#fde3ad]">
              {currentTrack.name}
            </h3>
            <span className="text-xs text-[#9eb5a5] block">{currentTrack.artist}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5 mt-5">
            <button
              onClick={handlePrev}
              className="p-2 text-[#ecc282] hover:text-white transition cursor-pointer"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-[#f1c17d] hover:bg-[#ffe0a6] text-[#1b2729] flex items-center justify-center shadow-lg transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 text-[#ecc282] hover:text-white transition cursor-pointer"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded audio player for continuous bhajan stream */}
        <div className="h-0 overflow-hidden opacity-0 pointer-events-none">
          <iframe
            key={currentTrack.youtubeId}
            width="200"
            height="200"
            src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
            title={currentTrack.name}
            allow="autoplay"
          />
        </div>

        {/* Playlist selection */}
        <div className="text-left mb-4">
          <span className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-2">
            Bhajan Playlist
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {BHAJAN_PLAYLIST.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                  currentTrackIndex === idx
                    ? 'bg-[#294c54] text-[#fce2a9] font-bold border border-[#f1c17d]/40'
                    : 'bg-[#182f34] text-[#b8cbbe] hover:bg-[#203c42]'
                }`}
              >
                <span>{track.name}</span>
                <small className="text-[10px] opacity-75">{track.artist}</small>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#263e42] hover:bg-[#345258] text-[#f7e4be] border border-[#e5bc76]/40 rounded-lg text-xs font-semibold transition"
        >
          Keep Playing &amp; Close
        </button>
      </div>
    </div>
  );
};
