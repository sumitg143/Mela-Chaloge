import React, { useState } from 'react';
import { X, Play, Award, Sparkles, Volume2 } from 'lucide-react';
import { melaAudio } from '../audio/MelaAudio';
import { BagItem } from '../types';

interface RamLeelaModalProps {
  onClose: () => void;
  onReward: (item: BagItem) => void;
}

export const RamLeelaModal: React.FC<RamLeelaModalProps> = ({ onClose, onReward }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handlePrasad = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    melaAudio.playFanfare();

    const prasad: BagItem = {
      id: `ramleela-prasad-${Date.now()}`,
      name: 'Ram Leela Darshan Prasad (Besan Ladoo)',
      icon: '🟡',
      category: 'souvenir',
      obtainedAt: 'Ram Leela Stage',
      description: 'Blessed yellow besan ladoo and marigold garland received at the Dussehra Ram Leela theatre.',
    };

    onReward(prasad);
    melaAudio.playCoin();
  };

  return (
    <div className="panel-backdrop fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="game-panel relative bg-[#13272d]/95 border border-[#dfc38c] rounded-2xl p-6 sm:p-7 max-w-2xl w-full text-center shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="panel-close absolute right-4 top-4 text-[#ecc282] hover:text-white text-2xl transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="eyebrow text-xs uppercase tracking-[2px] text-[#ecc282] font-semibold flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          DUSSEHRA TRADITION • RAM LEELA
        </div>

        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mb-1">
          Ram Leela Ground (राम लीला मंच)
        </h2>

        <p className="text-xs sm:text-sm text-[#d4ded1] mb-4">
          Experience the divine saga of Maryada Purushottam Shri Ram, Sita Mata, Lakshman, and Hanuman Ji.
        </p>

        {/* Video Theatre Screen */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border-2 border-[#b9824b] shadow-[0_0_40px_rgba(230,179,101,0.25)] mb-4">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/--VFGn2WhLg?autoplay=1&rel=0&modestbranding=1"
            title="Ram Leela Performance"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1d22] border border-[#dfc38c]/30 rounded-xl p-3">
          <div className="text-left text-xs">
            <span className="text-[#ecc282] font-bold block">Jai Shri Ram ✦ Ramayana Leela</span>
            <span className="text-[#98aba0] text-[11px]">Enactment of triumph over adharma</span>
          </div>

          <div className="flex items-center gap-2">
            {!rewardClaimed ? (
              <button
                onClick={handlePrasad}
                className="gold-button flex items-center gap-2 px-4 py-2 bg-[#f1c17d] text-[#1e2a28] font-bold rounded-lg hover:bg-[#ffe0a6] text-xs transition cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Receive Darshan Prasad</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-[#45e068] px-3">
                ✓ Darshan Prasad in Bag!
              </span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#263e42] hover:bg-[#345258] text-[#f7e4be] border border-[#e5bc76]/40 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Back to Mela
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
