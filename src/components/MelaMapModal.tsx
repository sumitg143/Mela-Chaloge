import React from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { Hotspot } from '../types';

interface MelaMapModalProps {
  onClose: () => void;
  onFastTravel: (hotspot: Hotspot) => void;
}

const MAP_LOCATIONS: Hotspot[] = [
  { id: 'entrance', type: 'food', name: 'Entrance Gate', x: 0, z: 28, radius: 6 },
  { id: 'chaat', type: 'food', name: 'Sharma Ji Ki Chaat', x: -14, z: 18, radius: 5.5 },
  { id: 'jalebi', type: 'food', name: 'Garam Jalebi & Rabri', x: 14, z: 18, radius: 5.5 },
  { id: 'golgappe', type: 'food', name: 'Teekhe Golgappe', x: -14, z: 7, radius: 5.5 },
  { id: 'chowmein', type: 'food', name: 'Desi Chowmein', x: 14, z: 7, radius: 5.5 },
  { id: 'balloon', type: 'balloon', name: 'Nishana Lagao (Balloons)', x: 25, z: 18, radius: 6 },
  { id: 'ring', type: 'ring', name: 'Ring Toss (Chhalla Phek)', x: 25, z: 6, radius: 6 },
  { id: 'toy', type: 'toy', name: 'Khilone Ki Dukaan', x: -25, z: 18, radius: 6 },
  { id: 'wheel', type: 'ride', name: 'Chand Wala Jhoola', x: 28, z: -29, radius: 7.5 },
  { id: 'well', type: 'well', name: 'Maut Ka Kuan', x: -23, z: -27, radius: 7.5 },
  { id: 'stage', type: 'stage', name: 'Ram Leela Stage', x: -27, z: -43, radius: 8 },
  { id: 'finale', type: 'finale', name: 'Ravana Dahan Ground', x: 2, z: -60, radius: 10 },
];

export const MelaMapModal: React.FC<MelaMapModalProps> = ({ onClose, onFastTravel }) => {
  return (
    <div className="panel-backdrop fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="game-panel relative bg-[#13272d]/95 border border-[#dfc38c] rounded-2xl p-6 sm:p-8 max-w-xl w-full text-center shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="panel-close absolute right-4 top-4 text-[#ecc282] hover:text-white text-2xl transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="eyebrow text-xs uppercase tracking-[2px] text-[#ecc282] font-semibold flex items-center justify-center gap-1.5 mb-1">
          <MapPin className="w-3.5 h-3.5 text-yellow-300" />
          FESTIVAL OVERVIEW &amp; FAST TRAVEL
        </div>

        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mb-1">
          Mela Naksha (Map) 🗺️
        </h2>

        <p className="text-xs text-[#d5ded2] mb-5">
          Tap any landmark to fast travel instantly to that attraction!
        </p>

        {/* 2D Graphical Fair Map */}
        <div className="relative aspect-[4/3] w-full bg-[#1e2a22] border-2 border-[#d2ad6b] rounded-xl overflow-hidden p-4 mb-5 shadow-inner">
          {/* Main Central Fairground Road */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-12 bg-[#423326] border-x border-[#8c6b4d]/40 rounded-sm" />

          {/* Ravana Ground at Top */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#571919] border border-red-500/60 rounded-lg px-3 py-1 text-[10px] text-red-200 font-bold flex items-center gap-1 shadow-md">
            <span>🔥</span> Ravana Maidan
          </div>

          {/* Giant Wheel on Top Right */}
          <div className="absolute top-10 right-4 bg-[#1f3d52] border border-sky-400/60 rounded-lg px-2.5 py-1 text-[10px] text-sky-200 font-bold">
            🎡 Giant Wheel
          </div>

          {/* Ram Leela on Top Left */}
          <div className="absolute top-12 left-4 bg-[#4a2e1d] border border-amber-500/60 rounded-lg px-2.5 py-1 text-[10px] text-amber-200 font-bold">
            🏹 Ram Leela
          </div>

          {/* Maut ka kuan Middle Left */}
          <div className="absolute top-28 left-4 bg-[#233f3c] border border-teal-500/60 rounded-lg px-2.5 py-1 text-[10px] text-teal-200 font-bold">
            🏍️ Maut Ka Kuan
          </div>

          {/* Games on Middle Right */}
          <div className="absolute top-28 right-4 bg-[#45233c] border border-pink-500/60 rounded-lg px-2.5 py-1 text-[10px] text-pink-200 font-bold">
            🎯 Nishana &amp; Rings
          </div>

          {/* Food Bazaar Bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#3f341d] border border-yellow-500/60 rounded-lg px-3 py-1 text-[10px] text-yellow-200 font-bold">
            🍲 Chaat &amp; Jalebi Gali
          </div>

          {/* Entrance Gate */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#1b262b] border border-white/40 rounded px-2 text-[9px] text-gray-300">
            🚪 Entrance
          </div>
        </div>

        {/* Location Hotspots List for 1-Click Fast Travel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
          {MAP_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                onFastTravel(loc);
                onClose();
              }}
              className="px-3 py-2 bg-[#193238] hover:bg-[#254952] active:scale-95 text-[#f5deaf] border border-[#d2ad6b]/30 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span className="truncate">{loc.name}</span>
              <Navigation className="w-3.5 h-3.5 text-[#efbf6d] shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
