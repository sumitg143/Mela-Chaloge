import React from 'react';
import {
  ShoppingBag,
  MapPin,
  Radio,
  Share2,
  Volume2,
  VolumeX,
  HelpCircle,
  Store,
  Sparkles,
} from 'lucide-react';
import { Hotspot, MelaStats } from '../types';

interface MelaHudProps {
  currentHotspot: Hotspot | null;
  onOpenModal: (modal: string) => void;
  onInteract: (hotspot: Hotspot) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  stats: MelaStats;
}

export const MelaHud: React.FC<MelaHudProps> = ({
  currentHotspot,
  onOpenModal,
  onInteract,
  isMuted,
  onToggleSound,
  stats,
}) => {
  return (
    <>
      {/* Top HUD Bar */}
      <header className="hud-top z-10 flex items-center justify-between pointer-events-none">
        <div className="game-brand pointer-events-auto cursor-pointer" onClick={() => onOpenModal('map')}>
          <h2 className="font-['Playfair_Display',serif] text-2xl md:text-3xl font-bold tracking-tight text-[#fde4af] drop-shadow-md">
            Mela Chaloge
          </h2>
          <span className="text-[9px] tracking-[2px] text-[#eab875] font-semibold block uppercase">
            Dussehra Online ✦ 2026
          </span>
        </div>

        <div className="hud-actions flex items-center gap-2 pointer-events-auto">
          {/* Mela Bag */}
          <button
            onClick={() => onOpenModal('bag')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#12232b]/80 hover:bg-[#1f3742] text-[#f7e0b5] border border-[#d0bd8a]/30 rounded-md backdrop-blur-md transition-all text-xs cursor-pointer"
            title="Aapka Mela Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#efbf6d]" />
            <span className="hidden sm:inline font-medium">Bag</span>
            <span className="bg-[#efbf6d] text-[#1b2729] font-bold text-[10px] px-1.5 py-0.2 rounded-full ml-1">
              {stats.items.length}
            </span>
          </button>

          {/* Mela Map */}
          <button
            onClick={() => onOpenModal('map')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#12232b]/80 hover:bg-[#1f3742] text-[#f7e0b5] border border-[#d0bd8a]/30 rounded-md backdrop-blur-md transition-all text-xs cursor-pointer"
            title="Mela Map"
          >
            <MapPin className="w-4 h-4 text-[#efbf6d]" />
            <span className="hidden sm:inline font-medium">Map</span>
          </button>

          {/* Mela Radio */}
          <button
            onClick={() => onOpenModal('radio')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#12232b]/80 hover:bg-[#1f3742] text-[#f7e0b5] border border-[#d0bd8a]/30 rounded-md backdrop-blur-md transition-all text-xs cursor-pointer"
            title="Mela Radio & Bhajans"
          >
            <Radio className="w-4 h-4 text-[#efbf6d]" />
            <span className="hidden sm:inline font-medium">Radio</span>
          </button>

          {/* Invite Card Generator */}
          <button
            onClick={() => onOpenModal('invite')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#12232b]/80 hover:bg-[#1f3742] text-[#f7e0b5] border border-[#d0bd8a]/30 rounded-md backdrop-blur-md transition-all text-xs cursor-pointer"
            title="Mela Chaloge Card"
          >
            <Share2 className="w-4 h-4 text-[#efbf6d]" />
            <span className="hidden sm:inline font-medium">Card</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 bg-[#12232b]/80 hover:bg-[#1f3742] text-[#f7e0b5] border border-[#d0bd8a]/30 rounded-md backdrop-blur-md transition-all text-xs cursor-pointer ${
              isMuted ? 'text-[#8b9994]' : 'text-[#f7e0b5]'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#efbf6d]" />}
          </button>

          {/* Help */}
          <button
            onClick={() => onOpenModal('help')}
            className="p-2 bg-[#12232b]/80 hover:bg-[#1f3742] text-[#f7e0b5] border border-[#d0bd8a]/30 rounded-md backdrop-blur-md transition-all text-xs cursor-pointer"
            title="Mela Controls & Guide"
          >
            <HelpCircle className="w-4 h-4 text-[#efbf6d]" />
          </button>
        </div>
      </header>

      {/* Location Badge */}
      <div className="location-hud z-10 flex items-center gap-2">
        <i className="w-2 h-2 rounded-full bg-[#f2c47c] animate-ping" />
        <span className="font-medium text-[#ffdca1]">
          {currentHotspot ? currentHotspot.name : 'Central Bazaar · Fairgrounds'}
        </span>
      </div>

      {/* Interactive Prompt when near any stall/game/ride */}
      {currentHotspot && (
        <div
          onClick={() => onInteract(currentHotspot)}
          className="interact-prompt z-20 cursor-pointer hover:scale-[1.03] transition-all bg-[#14282de6] border border-[#e5bc76] rounded-xl px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-4 animate-bounce"
        >
          <kbd className="bg-[#243d42] border border-[#dbc58d]/60 px-2.5 py-1 text-sm font-bold text-[#f5cd82] rounded">
            E
          </kbd>
          <div>
            <small className="block text-[9px] uppercase tracking-wider text-[#ecc282] font-semibold">
              Near Attraction
            </small>
            <span className="text-sm font-medium text-[#fff3de]">
              {currentHotspot.type === 'balloon'
                ? 'Play Balloon Shooting'
                : currentHotspot.type === 'ring'
                ? 'Play Ring Toss'
                : currentHotspot.type === 'ride'
                ? 'Ride Giant Wheel'
                : currentHotspot.type === 'well'
                ? 'Watch Maut Ka Kuan'
                : currentHotspot.type === 'stage'
                ? 'Watch Ram Leela'
                : currentHotspot.type === 'finale'
                ? 'Begin Ravana Dahan'
                : `Visit ${currentHotspot.name}`}
            </span>
          </div>
          <b className="ml-auto text-[#f1c17d] text-xs font-bold bg-[#354f54]/60 px-2.5 py-1 rounded-md border border-[#e5bc76]/30">
            OPEN ✦
          </b>
        </div>
      )}

      {/* Walk Tip (Desktop) */}
      <div className="walk-tip z-10">
        WASD / ARROWS TO WALK <b>•</b> DRAG TO LOOK <b>•</b> PRESS E TO INTERACT
      </div>

      {/* Community Dock at Bottom Center */}
      <div className="community-dock z-10">
        <button
          onClick={() => onOpenModal('invite')}
          className="invite-mela bg-[#f2cf94] hover:bg-[#ffdeaa] text-[#1b302d] border border-[#ffe2b0] font-bold rounded-lg px-4 py-2 text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#8a5716]" />
          <div>
            <span>Mela chaloge mere sath? ❤️</span>
            <small className="block text-[9px] text-[#4d3714] font-normal tracking-wider">
              CREATE &amp; SHARE YOUR MELA INVITATION CARD
            </small>
          </div>
        </button>

        <button
          onClick={() => onOpenModal('stallBuilder')}
          className="stall-mela bg-[#192f32ee] hover:bg-[#254247] text-[#f1d3a2] border border-[#e7c389]/60 font-semibold rounded-lg px-4 py-2 text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <Store className="w-4 h-4 text-[#ecc282]" />
          <div>
            <span>Place your stall in this mela</span>
            <small className="block text-[9px] text-[#b6c5b5] font-normal tracking-wider">
              YOUR BRAND • APNI DUKAAN BUILDER
            </small>
          </div>
        </button>
      </div>
    </>
  );
};
