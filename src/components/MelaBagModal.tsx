import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import { BagItem } from '../types';

interface MelaBagModalProps {
  items: BagItem[];
  onClose: () => void;
}

export const MelaBagModal: React.FC<MelaBagModalProps> = ({ items, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'food' | 'toy' | 'trophy' | 'souvenir'>('all');
  const [selectedItem, setSelectedItem] = useState<BagItem | null>(null);

  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

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
          <ShoppingBag className="w-3.5 h-3.5 text-yellow-300" />
          YOUR DUSSEHRA MEMORIES
        </div>

        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mb-1">
          Aapka Mela Bag 🛍️
        </h2>

        <p className="text-xs text-[#d5ded2] mb-4">
          All your collected treats, shooting prizes, ring toss trophies, and ride badges.
        </p>

        {/* Filter buttons */}
        <div className="flex justify-center gap-1.5 mb-5 flex-wrap">
          {(['all', 'food', 'toy', 'trophy', 'souvenir'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
                filter === cat
                  ? 'bg-[#efbf6d] text-[#1b2729]'
                  : 'bg-[#1b343a] text-[#d4ded1] hover:bg-[#284f58]'
              }`}
            >
              {cat === 'all' ? `All (${items.length})` : cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-12 bg-[#0c181c] border border-[#dfc38c]/20 rounded-xl mb-4">
            <span className="text-4xl block mb-2">🎪</span>
            <p className="text-xs text-[#9bb1a1]">
              Your mela bag is empty! Stroll into stalls, shoot balloons, toss rings, or grab a jalebi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[45vh] overflow-y-auto p-1 mb-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-[#183038] hover:bg-[#23444f] border border-[#d2ad6b]/40 rounded-xl p-3 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] uppercase font-bold text-[#f1c17d] tracking-wider truncate">
                    {item.category}
                  </span>
                </div>
                <strong className="text-xs text-[#fff3de] line-clamp-2 mb-1">
                  {item.name}
                </strong>
                <small className="text-[9px] text-[#93aba0] block mt-auto">
                  📍 {item.obtainedAt}
                </small>
              </div>
            ))}
          </div>
        )}

        {/* Selected Item Detail Modal View */}
        {selectedItem && (
          <div className="bg-[#183138] border border-[#efbf6d] rounded-xl p-4 text-left mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{selectedItem.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedItem.name}</h4>
                <small className="text-[10px] text-[#ecc282]">
                  From: {selectedItem.obtainedAt}
                </small>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="ml-auto text-xs text-[#b8c9bd] hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#d3e2d6] italic">&ldquo;{selectedItem.description}&rdquo;</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#263e42] hover:bg-[#345258] text-[#f7e4be] border border-[#e5bc76]/40 rounded-lg text-xs font-semibold transition"
        >
          Back to Exploring
        </button>
      </div>
    </div>
  );
};
