import React from 'react';
import { Sparkles, Volume2, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  return (
    <div className="welcome z-20 pointer-events-auto">
      <div className="welcome-top">
        <span className="font-semibold text-[#f8d796]">DUSSEHRA 2026</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f2c47c] animate-pulse"></span>
          INDIA&apos;S ONLINE FESTIVAL FAIR
        </span>
      </div>

      <div className="welcome-copy max-w-[680px]">
        <div className="live-label flex items-center gap-2 mb-3 text-[11px] font-semibold tracking-widest text-[#f0c27e] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#ffd580]" />
          A sky full of mela lights
        </div>

        <h1 className="font-['Playfair_Display',serif] text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight my-4 text-[#fff3db] drop-shadow-lg">
          Mela chaloge <br />
          <em className="text-[#f1c17d] not-italic underline decoration-[#e5b763]/60 underline-offset-8">
            mere sath? ❤️
          </em>
        </h1>

        <p className="invitation text-lg md:text-2xl italic font-['Playfair_Display',serif] text-[#eed9b9] mb-7 leading-relaxed drop-shadow">
          An actual Dussehra mela inside your browser. Walk through glowing stalls, play balloon shooting, ride the giant wheel, watch Ram Leela and celebrate Ravana Dahan.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onEnter}
            className="gold-button enter px-8 py-4 bg-[#f1c17d] text-[#222c2a] hover:bg-[#ffe0a6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-md font-bold text-sm tracking-wider flex items-center justify-between shadow-[0_0_30px_rgba(241,193,125,0.35)] cursor-pointer"
          >
            <span>ENTER MELA</span>
            <ArrowRight className="w-5 h-5 ml-4" />
          </button>
        </div>

        <div className="welcome-hint flex items-center gap-2 text-[11px] tracking-wider text-[#dcd6c5] mt-6">
          <Volume2 className="w-3.5 h-3.5 text-[#f1c17d]" />
          <span>Festive sound begins when you enter. Every game & ride is 100% free.</span>
        </div>
      </div>

      <div className="welcome-footer flex justify-between items-center text-[11px] text-[#caa772] border-t border-[#8f6d3b]/30 pt-4">
        <span>WASD / ARROWS TO WALK • DRAG TO LOOK AROUND</span>
        <span>JAI SHRI RAM • HAPPY DUSSEHRA</span>
      </div>
    </div>
  );
};
