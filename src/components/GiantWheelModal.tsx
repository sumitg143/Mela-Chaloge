import React from 'react';
import { Eye, ArrowDownCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { melaAudio } from '../audio/MelaAudio';
import { BagItem } from '../types';

interface GiantWheelModalProps {
  progress: number;
  onExitRide: () => void;
  onRideCompleted: (item: BagItem) => void;
  hasCompleted: boolean;
}

export const GiantWheelModal: React.FC<GiantWheelModalProps> = ({
  progress,
  onExitRide,
  onRideCompleted,
  hasCompleted,
}) => {
  const isFinished = progress >= 100;

  React.useEffect(() => {
    if (isFinished && !hasCompleted) {
      melaAudio.playFanfare();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

      const ticket: BagItem = {
        id: `wheel-ticket-${Date.now()}`,
        name: 'Chand Wala Jhoola Golden Pass',
        icon: '🎡',
        category: 'souvenir',
        obtainedAt: 'Chand Wala Jhoola',
        description: 'Completed a panoramic nighttime Ferris wheel ride viewing all Dussehra mela lights.',
      };
      onRideCompleted(ticket);
    }
  }, [isFinished, hasCompleted, onRideCompleted]);

  return (
    <div className="ride-hud fixed bottom-8 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-md bg-[#12252bcc]/95 border border-[#e0bc79]/70 rounded-2xl p-5 text-center shadow-[0_12px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl pointer-events-auto">
      <span className="text-[10px] uppercase tracking-[3px] text-[#f1c17d] font-bold block mb-1">
        RIDING CHAND WALA JHOOLA 🎡
      </span>

      <h2 className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-bold text-[#fff3dc] mb-1">
        {isFinished ? 'Jhoola completed! Poora mela ek nazar mein.' : 'Ek chakkar? Upar se mela chamak raha hai!'}
      </h2>

      <p className="text-xs text-[#d5ded2] mb-3">
        Enjoy the 360° panoramic nighttime aerial fairground view.
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-[#20363a] rounded-full h-2.5 mb-4 overflow-hidden border border-[#dfc38c]/30">
        <div
          className="bg-gradient-to-r from-[#d99824] to-[#ffdb70] h-2.5 rounded-full transition-all duration-300 shadow-[0_0_12px_#ffdb70]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#b4c3b5] mb-4">
        <span>Ride Progress</span>
        <strong className="text-[#f1c17d] font-mono">{progress}%</strong>
      </div>

      <div className="flex gap-3 justify-center">
        {isFinished ? (
          <div className="flex items-center gap-2 text-xs font-bold text-[#45e068] bg-[#1a3832] px-4 py-2 rounded-lg border border-[#45e068]/40">
            <CheckCircle2 className="w-4 h-4" />
            <span>Golden Pass Added to Bag!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-[#eed39d]">
            <Eye className="w-4 h-4 text-[#ffd778] animate-pulse" />
            <span>Taking in the fair lights...</span>
          </div>
        )}

        <button
          onClick={onExitRide}
          className="gold-button flex items-center gap-2 px-5 py-2 bg-[#f1c17d] text-[#1e2a28] font-bold rounded-lg hover:bg-[#ffe2aa] transition text-xs cursor-pointer ml-auto"
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Exit Ride</span>
        </button>
      </div>
    </div>
  );
};
