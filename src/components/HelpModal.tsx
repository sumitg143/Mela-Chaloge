import React from 'react';
import { X, HelpCircle, Gamepad2, Smartphone, Sparkles } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="panel-backdrop fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="game-panel relative bg-[#13272d]/95 border border-[#dfc38c] rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="panel-close absolute right-4 top-4 text-[#ecc282] hover:text-white text-2xl transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="eyebrow text-xs uppercase tracking-[2px] text-[#ecc282] font-semibold flex items-center justify-center gap-1.5 mb-1">
          <HelpCircle className="w-3.5 h-3.5 text-yellow-300" />
          FESTIVAL GUIDE &amp; CONTROLS
        </div>

        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mb-1">
          Mela Kaise Ghoomein?
        </h2>

        <p className="text-xs text-[#d5ded2] mb-5">
          Everything you need to know to walk, play, and celebrate in this 3D Dussehra fair.
        </p>

        <div className="space-y-3 text-left mb-5">
          <div className="bg-[#183138] border border-[#d2ad6b]/30 rounded-xl p-3.5 flex items-start gap-3">
            <Gamepad2 className="w-5 h-5 text-[#f1c17d] shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs font-bold text-white block">Desktop Controls</strong>
              <p className="text-[11px] text-[#b4c7b8] mt-0.5">
                • <kbd className="bg-[#0b171c] px-1.5 py-0.5 rounded text-[#f5cd82] border border-[#dfc38c]/40 font-mono">W</kbd>{' '}
                <kbd className="bg-[#0b171c] px-1.5 py-0.5 rounded text-[#f5cd82] border border-[#dfc38c]/40 font-mono">A</kbd>{' '}
                <kbd className="bg-[#0b171c] px-1.5 py-0.5 rounded text-[#f5cd82] border border-[#dfc38c]/40 font-mono">S</kbd>{' '}
                <kbd className="bg-[#0b171c] px-1.5 py-0.5 rounded text-[#f5cd82] border border-[#dfc38c]/40 font-mono">D</kbd> or Arrow Keys to walk.
                <br />
                • Click and drag anywhere to look around in 360°.
                <br />
                • Press <kbd className="bg-[#0b171c] px-1.5 py-0.5 rounded text-[#f5cd82] border border-[#dfc38c]/40 font-mono">E</kbd> when near any stall to talk, play, or ride.
              </p>
            </div>
          </div>

          <div className="bg-[#183138] border border-[#d2ad6b]/30 rounded-xl p-3.5 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-[#f1c17d] shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs font-bold text-white block">Mobile &amp; Touch Controls</strong>
              <p className="text-[11px] text-[#b4c7b8] mt-0.5">
                • Left thumb virtual joystick to walk forward/back and strafe.
                <br />
                • Drag your right thumb on screen to look around smoothly.
                <br />
                • Tap the floating action prompt to interact with stalls.
              </p>
            </div>
          </div>

          <div className="bg-[#183138] border border-[#d2ad6b]/30 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#f1c17d] shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs font-bold text-white block">Attractions &amp; Games</strong>
              <p className="text-[11px] text-[#b4c7b8] mt-0.5">
                • <strong>Nishana Lagao:</strong> 6 cork shots to pop balloons and win toys.
                <br />
                • <strong>Ring Toss:</strong> Fling golden rings onto soda bottles to score trophies.
                <br />
                • <strong>Chand Wala Jhoola:</strong> Ride the rotating giant Ferris wheel.
                <br />
                • <strong>Maut Ka Kuan:</strong> Watch high-speed vertical wall motorcycle stunts.
                <br />
                • <strong>Ram Leela:</strong> Watch theatrical enactment of the Ramayana.
                <br />
                • <strong>Ravana Dahan:</strong> Draw the bow and ignite the 10-headed effigy!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="gold-button w-full py-2.5 bg-[#f1c17d] hover:bg-[#ffdca3] text-[#1b2826] font-bold text-xs uppercase tracking-wider rounded-lg transition"
        >
          Samajh Gaya! Let&apos;s Explore
        </button>
      </div>
    </div>
  );
};
