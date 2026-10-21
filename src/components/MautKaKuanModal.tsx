import React, { useState } from 'react';
import { Award, ArrowDownCircle, Gauge, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { melaAudio } from '../audio/MelaAudio';
import { BagItem } from '../types';

interface MautKaKuanModalProps {
  onExit: () => void;
  onReward: (item: BagItem) => void;
}

export const MautKaKuanModal: React.FC<MautKaKuanModalProps> = ({ onExit, onReward }) => {
  const [speedKmh, setSpeedKmh] = useState(72);
  const [laps, setLaps] = useState(3);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleBoost = () => {
    melaAudio.playGunshot();
    setSpeedKmh((s) => Math.min(110, s + 12));
    setLaps((l) => l + 1);
  };

  const handleClaim = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    melaAudio.playFanfare();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    const badge: BagItem = {
      id: `well-medal-${Date.now()}`,
      name: 'Maut Ka Kuan Daredevil Medal',
      icon: '🏍️',
      category: 'trophy',
      obtainedAt: 'Maut Ka Kuan',
      description: 'Cheered the daring motorcycle stunt riders performing gravity-defying vertical wall circles.',
    };

    onReward(badge);
    melaAudio.playCoin();
  };

  return (
    <div className="well-hud fixed bottom-6 left-6 z-20 w-11/12 max-w-sm bg-[#13272eed]/95 border border-[#d8b56d] rounded-2xl p-5 shadow-[0_15px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl pointer-events-auto">
      <span className="text-[10px] uppercase tracking-[2px] text-[#ecc282] font-bold block mb-1">
        LIVE STUNT ARENA 🏍️
      </span>

      <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#fff3dc] mb-1">
        Maut Ka Kuan
      </h2>

      <p className="text-xs text-[#d5ded2] mb-4">
        Dhol baje, bike ghoome! Two riders roaring across the vertical wooden well.
      </p>

      {/* Speed & Laps display */}
      <div className="well-score flex justify-between bg-[#0e1d22] border border-[#d8b56d]/30 rounded-xl p-3 mb-4">
        <div>
          <span className="text-[10px] text-[#a9b8ad] block">Stunt Speed</span>
          <strong className="text-2xl font-bold text-[#f5cd82] flex items-center gap-1">
            <Gauge className="w-5 h-5 text-[#f5cd82]" />
            {speedKmh} <small className="text-xs font-normal">km/h</small>
          </strong>
        </div>
        <div className="h-10 w-px bg-[#dfc38c]/20" />
        <div>
          <span className="text-[10px] text-[#a9b8ad] block">Wall Laps</span>
          <strong className="text-2xl font-bold text-[#45e068]">{laps}</strong>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleBoost}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ad3a22] hover:bg-[#c9452b] text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-md"
        >
          <Flame className="w-4 h-4 text-yellow-300" />
          <span>Rev Throttle / Boost Speed!</span>
        </button>

        {!rewardClaimed ? (
          <button
            onClick={handleClaim}
            className="gold-button flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f1c17d] text-[#1c2a28] font-bold rounded-lg hover:bg-[#ffdca3] transition text-xs cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Claim Daredevil Spectator Medal</span>
          </button>
        ) : (
          <div className="text-center text-xs font-semibold text-[#45e068] py-1">
            ✓ Daredevil Medal added to Bag!
          </div>
        )}

        <button
          onClick={onExit}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#20363a] hover:bg-[#2d4d53] text-[#e0cfaf] border border-[#d8b56d]/30 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Exit Well Gallery</span>
        </button>
      </div>

      <small className="well-fiction block text-[10px] text-[#8e9e92] text-center mt-3 italic">
        A traditional festival stunt showcase. Stunts are virtual.
      </small>
    </div>
  );
};
