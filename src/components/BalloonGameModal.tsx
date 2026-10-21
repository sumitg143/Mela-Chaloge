import React, { useState } from 'react';
import { X, Crosshair, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { melaAudio } from '../audio/MelaAudio';
import { BagItem } from '../types';

interface BalloonGameModalProps {
  onClose: () => void;
  onReward: (item: BagItem) => void;
}

interface BalloonItem {
  id: number;
  color: string;
  popped: boolean;
}

export const BalloonGameModal: React.FC<BalloonGameModalProps> = ({ onClose, onReward }) => {
  const initialColors = [
    '#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de', '#ff2d55',
    '#5856d6', '#32ade6', '#30d158', '#ffd60a', '#ff9f0a', '#ff453a', '#bf5af2',
    '#64d2ff', '#30db5b', '#ffd60a', '#ff375f', '#ff9f0a', '#ac8e68', '#ff3b30'
  ];

  const [balloons, setBalloons] = useState<BalloonItem[]>(
    initialColors.map((color, index) => ({ id: index, color, popped: false }))
  );
  const [shotsLeft, setShotsLeft] = useState(6);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleShootBalloon = (id: number) => {
    if (gameOver || shotsLeft <= 0) return;

    melaAudio.playGunshot();
    setShotsLeft((prev) => prev - 1);

    const target = balloons.find((b) => b.id === id);
    if (target && !target.popped) {
      setTimeout(() => {
        melaAudio.playPop();
      }, 50);

      setBalloons((prev) =>
        prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
      );
      setScore((s) => s + 1);
    }

    if (shotsLeft - 1 <= 0) {
      setGameOver(true);
      melaAudio.playFanfare();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleClaimReward = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);

    const trophy: BagItem = {
      id: `balloon-trophy-${Date.now()}`,
      name: score >= 4 ? 'Golden Sharpshooter Bandook' : 'Mela Gulabi Teddy Bear',
      icon: score >= 4 ? '🎯' : '🧸',
      category: 'toy',
      obtainedAt: 'Nishana Lagao Stall',
      description: `Won by shooting ${score} balloons with cork rifle at Dussehra mela.`,
    };

    onReward(trophy);
    melaAudio.playCoin();
  };

  const resetGame = () => {
    setBalloons(initialColors.map((color, index) => ({ id: index, color, popped: false })));
    setShotsLeft(6);
    setScore(0);
    setGameOver(false);
    setRewardClaimed(false);
  };

  return (
    <div className="panel-backdrop fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="game-panel relative bg-[#13272d]/95 border border-[#dfc38c] rounded-2xl p-6 sm:p-8 max-w-xl w-full text-center shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="panel-close absolute right-4 top-4 text-[#ecc282] hover:text-white text-2xl transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="eyebrow text-xs uppercase tracking-[2px] text-[#ecc282] font-semibold">
          TRADITIONAL FESTIVAL ATTRACTION
        </div>
        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mt-1 mb-2">
          Nishana Lagao 🎯
        </h2>
        <p className="text-xs sm:text-sm text-[#d4ded1] mb-5">
          Tap or click on the balloons to take aim and shoot! 6 cork bullets ready.
        </p>

        {/* Status Bar */}
        <div className="flex justify-around items-center bg-[#0d1d22] border border-[#dfc38c]/30 rounded-lg p-3 mb-5">
          <div>
            <span className="text-[10px] uppercase text-[#a9b8ad] block">Shots Remaining</span>
            <span className="text-xl font-bold text-[#f5cd82]">
              {'🔴 '.repeat(shotsLeft) || 'None'}
            </span>
          </div>
          <div className="h-8 w-px bg-[#dfc38c]/20" />
          <div>
            <span className="text-[10px] uppercase text-[#a9b8ad] block">Balloons Popped</span>
            <span className="text-xl font-bold text-[#45e068]">{score}</span>
          </div>
        </div>

        {/* Balloon Stall Board */}
        <div className="bg-[#241712] border-4 border-[#8c5a35] rounded-xl p-4 sm:p-6 shadow-inner relative overflow-hidden mb-6">
          <div className="grid grid-cols-7 gap-3 sm:gap-4 place-items-center">
            {balloons.map((b) => (
              <button
                key={b.id}
                disabled={b.popped || gameOver}
                onClick={() => handleShootBalloon(b.id)}
                className={`w-9 h-12 sm:w-11 sm:h-14 rounded-full relative transition-transform duration-150 cursor-pointer ${
                  b.popped
                    ? 'opacity-0 scale-50 pointer-events-none'
                    : 'hover:scale-110 active:scale-95 shadow-md flex items-center justify-center'
                }`}
                style={{
                  backgroundColor: b.color,
                  boxShadow: `inset -3px -3px 8px rgba(0,0,0,0.4), 0 4px 10px ${b.color}55`,
                }}
              >
                {!b.popped && (
                  <Crosshair className="w-4 h-4 text-white/50 opacity-0 hover:opacity-100 transition" />
                )}
                {/* Balloon string */}
                <div className="absolute -bottom-2 w-0.5 h-2.5 bg-yellow-100/70" />
              </button>
            ))}
          </div>
        </div>

        {/* Game Result */}
        {gameOver ? (
          <div className="bg-[#1b343a] border border-[#efbf6d] rounded-xl p-4 text-center">
            <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#fde3ad] mb-1">
              {score >= 4 ? 'Waah! Zabardast Nishana! 🏆' : 'Kamaal ka prayas! 🎪'}
            </h3>
            <p className="text-xs text-[#cfdcd0] mb-4">
              You popped {score} balloons! Collect your prize for your Mela Bag.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!rewardClaimed ? (
                <button
                  onClick={handleClaimReward}
                  className="gold-button flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f1c17d] text-[#1c2a28] font-bold rounded-lg hover:bg-[#ffdca3] transition"
                >
                  <Award className="w-4 h-4" />
                  <span>Claim Mela Prize</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-[#45e068] py-2">
                  ✓ Prize added to your Mela Bag!
                </span>
              )}
              <button
                onClick={resetGame}
                className="px-5 py-2.5 bg-[#263e42] hover:bg-[#345258] text-[#f7e4be] border border-[#e5bc76]/40 rounded-lg text-xs font-semibold transition"
              >
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-[#a1b3a3] italic">
            &quot;Bhaiya ka nishana ekdum pakka hai! Ek baar aur try karo.&quot;
          </p>
        )}
      </div>
    </div>
  );
};
