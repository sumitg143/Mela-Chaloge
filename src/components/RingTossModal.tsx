import React, { useState } from 'react';
import { X, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { melaAudio } from '../audio/MelaAudio';
import { BagItem } from '../types';

interface RingTossModalProps {
  onClose: () => void;
  onReward: (item: BagItem) => void;
}

interface Bottle {
  id: number;
  label: string;
  points: number;
  color: string;
  ringLanded: boolean;
}

export const RingTossModal: React.FC<RingTossModalProps> = ({ onClose, onReward }) => {
  const [ringsLeft, setRingsLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [isTossing, setIsTossing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);

  const initialBottles: Bottle[] = [
    { id: 1, label: 'Vintage Banta', points: 20, color: '#397d49', ringLanded: false },
    { id: 2, label: 'Kala Khatta', points: 40, color: '#682a4d', ringLanded: false },
    { id: 3, label: 'Thums Up', points: 30, color: '#993026', ringLanded: false },
    { id: 4, label: 'Rooh Afza', points: 50, color: '#a62437', ringLanded: false },
    { id: 5, label: 'Gold Trophy', points: 100, color: '#dca326', ringLanded: false },
    { id: 6, label: 'Rose Sherbet', points: 30, color: '#b53e65', ringLanded: false },
    { id: 7, label: 'Limca Fizz', points: 20, color: '#448c5e', ringLanded: false },
    { id: 8, label: 'Jeera Soda', points: 40, color: '#7a5a30', ringLanded: false },
    { id: 9, label: 'Aam Panna', points: 30, color: '#889e2e', ringLanded: false },
  ];

  const [bottles, setBottles] = useState<Bottle[]>(initialBottles);

  const handleTossRing = (bottleId: number) => {
    if (ringsLeft <= 0 || isTossing || gameOver) return;

    setSelectedTarget(bottleId);
    setIsTossing(true);

    setTimeout(() => {
      melaAudio.playRingClink();
      // 65% probability of landing ring for fun & satisfying gameplay
      const success = Math.random() < 0.65;

      setRingsLeft((r) => r - 1);

      if (success) {
        setBottles((prev) =>
          prev.map((b) => (b.id === bottleId ? { ...b, ringLanded: true } : b))
        );
        const b = bottles.find((b) => b.id === bottleId);
        if (b) {
          setScore((s) => s + b.points);
          melaAudio.playCoin();
        }
      }

      setIsTossing(false);
      setSelectedTarget(null);

      if (ringsLeft - 1 <= 0) {
        setGameOver(true);
        melaAudio.playFanfare();
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }
    }, 450);
  };

  const handleClaimReward = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);

    const trophy: BagItem = {
      id: `ring-trophy-${Date.now()}`,
      name: score >= 60 ? 'Chhalla Phek Champion Cup' : 'Mela Brass Ghungroo',
      icon: score >= 60 ? '🏆' : '🔔',
      category: 'trophy',
      obtainedAt: 'Ring Toss Stall',
      description: `Scored ${score} points by tossing rings onto bottles at Dussehra mela.`,
    };

    onReward(trophy);
    melaAudio.playCoin();
  };

  const resetGame = () => {
    setBottles(initialBottles);
    setRingsLeft(5);
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
          DESI MELA GAME
        </div>
        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mt-1 mb-2">
          Ring Toss (Chhalla Phek) ⭕
        </h2>
        <p className="text-xs sm:text-sm text-[#d4ded1] mb-5">
          Select any bottle on the table to fling your golden ring. Land rings over bottles to win prizes!
        </p>

        {/* Status Bar */}
        <div className="flex justify-around items-center bg-[#0d1d22] border border-[#dfc38c]/30 rounded-lg p-3 mb-5">
          <div>
            <span className="text-[10px] uppercase text-[#a9b8ad] block">Rings Left</span>
            <span className="text-xl font-bold text-[#f5cd82]">
              {'⭕ '.repeat(ringsLeft) || 'None'}
            </span>
          </div>
          <div className="h-8 w-px bg-[#dfc38c]/20" />
          <div>
            <span className="text-[10px] uppercase text-[#a9b8ad] block">Total Points</span>
            <span className="text-xl font-bold text-[#ffd559]">{score}</span>
          </div>
        </div>

        {/* Wooden Stall Table with Bottles */}
        <div className="bg-[#2a1d17] border-4 border-[#7a4e2e] rounded-xl p-5 shadow-2xl mb-6 relative">
          <div className="grid grid-cols-3 gap-4 place-items-center">
            {bottles.map((bottle) => {
              const isSelected = selectedTarget === bottle.id;
              return (
                <button
                  key={bottle.id}
                  disabled={ringsLeft <= 0 || isTossing || gameOver}
                  onClick={() => handleTossRing(bottle.id)}
                  className={`w-full py-4 px-2 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer ${
                    bottle.ringLanded
                      ? 'bg-[#3b4c3e] border-2 border-[#45e068]'
                      : 'bg-[#18282d] hover:bg-[#253f47] border border-[#d2ad6b]/40 hover:scale-105 active:scale-95'
                  }`}
                >
                  {/* Floating ring animation */}
                  {isSelected && (
                    <div className="absolute -top-3 w-10 h-10 border-4 border-yellow-300 rounded-full animate-ping pointer-events-none" />
                  )}

                  {/* Ring landed over bottle neck */}
                  {bottle.ringLanded && (
                    <div className="absolute top-2 w-12 h-6 border-4 border-[#ffd700] rounded-full shadow-[0_0_12px_#ffd700]" />
                  )}

                  {/* Bottle neck & body */}
                  <div
                    className="w-4 h-5 rounded-t-sm mb-0.5"
                    style={{ backgroundColor: bottle.color }}
                  />
                  <div
                    className="w-8 h-12 rounded-b-md shadow-md flex items-center justify-center text-[10px] font-bold text-white/90"
                    style={{ backgroundColor: bottle.color }}
                  >
                    {bottle.points}
                  </div>

                  <span className="text-[11px] font-medium text-[#fae4be] mt-2">
                    {bottle.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Area */}
        {gameOver ? (
          <div className="bg-[#1b343a] border border-[#efbf6d] rounded-xl p-4 text-center">
            <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#fde3ad] mb-1">
              {score >= 60 ? 'Mela Ring Master! 🏆' : 'Shandaar khel! 🎪'}
            </h3>
            <p className="text-xs text-[#cfdcd0] mb-4">
              Aapka total score: <strong className="text-[#ffd559]">{score} points</strong>. Claim your trophy!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!rewardClaimed ? (
                <button
                  onClick={handleClaimReward}
                  className="gold-button flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f1c17d] text-[#1c2a28] font-bold rounded-lg hover:bg-[#ffdca3] transition"
                >
                  <Award className="w-4 h-4" />
                  <span>Claim Trophy</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-[#45e068] py-2">
                  ✓ Trophy added to your Mela Bag!
                </span>
              )}
              <button
                onClick={resetGame}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#263e42] hover:bg-[#345258] text-[#f7e4be] border border-[#e5bc76]/40 rounded-lg text-xs font-semibold transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-[#a1b3a3] italic">
            &quot;Seedha bottle pe! Chhalla phek aur kismat aazma.&quot;
          </p>
        )}
      </div>
    </div>
  );
};
