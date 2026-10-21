import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { melaAudio } from '../audio/MelaAudio';
import { BagItem } from '../types';

interface RavanaDahanModalProps {
  onClose: () => void;
  onReward: (item: BagItem) => void;
}

export const RavanaDahanModal: React.FC<RavanaDahanModalProps> = ({ onClose, onReward }) => {
  const [phase, setPhase] = useState<'aim' | 'firing' | 'burning' | 'celebrate'>('aim');
  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isCharging && phase === 'aim') {
      interval = window.setInterval(() => {
        setPower((p) => {
          if (p >= 100) {
            setIsCharging(false);
            return 100;
          }
          return p + 5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isCharging, phase]);

  const handleShootArrow = () => {
    if (power < 30 || phase !== 'aim') return;
    setPhase('firing');
    melaAudio.playArrowLaunch();

    setTimeout(() => {
      setPhase('burning');
      melaAudio.playFirework();

      // Multi-wave celebratory fireworks
      const fireInterval = setInterval(() => {
        melaAudio.playFirework();
        confetti({
          particleCount: 50,
          spread: 80,
          origin: {
            x: Math.random() * 0.6 + 0.2,
            y: Math.random() * 0.4 + 0.1,
          },
          colors: ['#ffdd22', '#ff4422', '#ff8800', '#ffffff', '#ff0055'],
        });
      }, 600);

      setTimeout(() => {
        clearInterval(fireInterval);
        setPhase('celebrate');
        melaAudio.playFanfare();
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
      }, 4500);
    }, 700);
  };

  const handleClaimCoin = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);

    const coin: BagItem = {
      id: `ravana-coin-${Date.now()}`,
      name: 'Ravana Dahan Vijay Mudra (Golden Coin)',
      icon: '🪙',
      category: 'souvenir',
      obtainedAt: 'Ravana Dahan Maidan',
      description: 'Commemorative pure brass token celebrating the victory of Good over Evil on Dussehra 2026.',
    };

    onReward(coin);
    melaAudio.playCoin();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto">
      <div className="relative bg-[#13272eed]/95 border-2 border-[#efbf6d] rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-[0_0_80px_rgba(239,191,109,0.3)]">
        <div className="eyebrow text-xs uppercase tracking-[3px] text-[#ecc282] font-bold mb-1 flex items-center justify-center gap-1.5">
          <Flame className="w-4 h-4 text-[#ff5522] animate-bounce" />
          VIJAYADASHAMI MAHA MAHOTSAV
        </div>

        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-[#fff3dc] mb-2 drop-shadow">
          Ravana Dahan (रावण दahan) 🔥
        </h2>

        {phase === 'aim' && (
          <>
            <p className="text-xs sm:text-sm text-[#d4ded1] mb-5">
              Draw Lord Rama&apos;s golden bow and aim the blazing Agni Baan at Dashanana.
            </p>

            {/* Bow Power Meter */}
            <div className="bg-[#0b161a] border border-[#dfc38c]/40 rounded-xl p-4 mb-5">
              <span className="text-[10px] uppercase tracking-wider text-[#ecc282] block mb-2 font-semibold">
                Bow Tension • Agni Baan Charge: {power}%
              </span>

              <div className="w-full bg-[#20363a] rounded-full h-3 mb-4 overflow-hidden border border-[#dfc38c]/30">
                <div
                  className="bg-gradient-to-r from-[#d99824] via-[#ff5522] to-[#ffdb70] h-3 rounded-full transition-all duration-100 shadow-[0_0_15px_#ff5522]"
                  style={{ width: `${power}%` }}
                />
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onMouseDown={() => setIsCharging(true)}
                  onMouseUp={() => setIsCharging(false)}
                  onTouchStart={() => setIsCharging(true)}
                  onTouchEnd={() => setIsCharging(false)}
                  className="px-5 py-3 bg-[#e87023] hover:bg-[#ff8030] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-lg cursor-pointer"
                >
                  Hold to Draw Bow 🏹
                </button>

                <button
                  disabled={power < 30}
                  onClick={handleShootArrow}
                  className="gold-button px-6 py-3 bg-[#f1c17d] disabled:opacity-40 text-[#1b2729] font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-lg cursor-pointer"
                >
                  Shoot Arrow! ✦
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'firing' && (
          <div className="py-8">
            <span className="text-5xl block animate-bounce mb-3">🏹 ➔ 🔥</span>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#fde3ad]">
              Agni Baan Chhuta!
            </h3>
            <p className="text-xs text-[#cfdcd0] mt-2">The fiery arrow speeds towards the 10-headed effigy...</p>
          </div>
        )}

        {phase === 'burning' && (
          <div className="py-6 animate-pulse">
            <span className="text-6xl block mb-3">🔥💥✨</span>
            <h3 className="font-['Playfair_Display',serif] text-3xl font-extrabold text-[#ff4422] drop-shadow-[0_0_20px_#ff4422]">
              JAI SHRI RAM!
            </h3>
            <p className="text-sm font-semibold text-[#ffe39e] mt-2">
              Burai par achchai ki vijay! Fireworks lighting up the mela sky!
            </p>
          </div>
        )}

        {phase === 'celebrate' && (
          <div className="bg-[#1b343a] border border-[#efbf6d] rounded-xl p-5 text-center mt-2">
            <div className="text-4xl mb-2">🎆 🏹 👑</div>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#fde3ad] mb-1">
              Dussehra Mubarak! Happy Dussehra!
            </h3>
            <p className="text-xs text-[#cfdcd0] mb-4">
              May the virtues of truth, courage, and goodness conquer every darkness.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!rewardClaimed ? (
                <button
                  onClick={handleClaimCoin}
                  className="gold-button flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f1c17d] text-[#1c2a28] font-bold rounded-lg hover:bg-[#ffdca3] transition text-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Receive Vijay Mudra Souvenir</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#45e068] py-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Vijay Mudra added to Bag!</span>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#263e42] hover:bg-[#345258] text-[#f7e4be] border border-[#e5bc76]/40 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Back to Mela Fairgrounds
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
