import React, { useState } from 'react';
import { X, Store, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MelaPartner } from '../types';
import { melaAudio } from '../audio/MelaAudio';

interface StallBuilderModalProps {
  onClose: () => void;
  onAddPartner: (partner: MelaPartner) => void;
}

export const StallBuilderModal: React.FC<StallBuilderModalProps> = ({ onClose, onAddPartner }) => {
  const [name, setName] = useState('Chai & Samosa Junction');
  const [theme, setTheme] = useState<'kesari' | 'gulabi' | 'neela'>('kesari');
  const [category, setCategory] = useState<'shop' | 'food' | 'creator'>('food');
  const [greeting, setGreeting] = useState('Garma garam adrak chai aur khasta samosa ready hai!');
  const [isPublished, setIsPublished] = useState(false);

  const themeColors = {
    kesari: '#c95e16',
    gulabi: '#b82763',
    neela: '#1f6494',
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPartner: MelaPartner = {
      id: `partner-${Date.now()}`,
      name: name.trim(),
      slotId: `slot-${Date.now()}`,
      theme,
      plan: 'featured',
      category,
      greeting: greeting.trim() || 'Aao ji! Hamare stall me aapka swagat hai.',
    };

    onAddPartner(newPartner);
    setIsPublished(true);
    melaAudio.playFanfare();
    confetti({ particleCount: 80, spread: 80 });

    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="panel-backdrop fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="game-panel stall-builder relative bg-[#13272d]/95 border border-[#dfc38c] rounded-2xl p-6 sm:p-8 max-w-xl w-full text-center shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="panel-close absolute right-4 top-4 text-[#ecc282] hover:text-white text-2xl transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="eyebrow text-xs uppercase tracking-[2px] text-[#ecc282] font-semibold flex items-center justify-center gap-1.5 mb-1">
          <Store className="w-3.5 h-3.5 text-yellow-300" />
          YOUR BRAND • OUR MELA
        </div>

        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mb-1">
          Place Your Stall in Dussehra Mela
        </h2>

        <p className="text-xs text-[#d5ded2] mb-5">
          Design your custom stall with awning roof, illuminated sign board, and custom vendor dialogues!
        </p>

        {isPublished ? (
          <div className="py-10 bg-[#163038] border border-[#52bd7b] rounded-xl text-center animate-fade-in">
            <span className="text-4xl block mb-2">🎉 🏪</span>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#45e068] mb-1">
              Aapka Stall Live Ho Gaya!
            </h3>
            <p className="text-xs text-[#cfe2d4]">
              Your custom stall &ldquo;{name}&rdquo; is now live in the 3D Dussehra Mela bazaar.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-1">
                Stall / Dukaan Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
                placeholder="e.g. Rameshwaram Sweets"
                className="w-full bg-[#0b171c] border border-[#d2ad6b]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efbf6d]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-1">
                  Awning Color Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'kesari' | 'gulabi' | 'neela')}
                  className="w-full bg-[#0b171c] border border-[#d2ad6b]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efbf6d]"
                >
                  <option value="kesari">Kesari (Royal Saffron)</option>
                  <option value="gulabi">Gulabi (Festival Pink)</option>
                  <option value="neela">Neela (Midnight Blue)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-1">
                  Stall Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'shop' | 'food' | 'creator')}
                  className="w-full bg-[#0b171c] border border-[#d2ad6b]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efbf6d]"
                >
                  <option value="food">Street Food &amp; Sweets</option>
                  <option value="shop">Handicrafts &amp; Toys</option>
                  <option value="creator">Creator &amp; Digital Brand</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-1">
                Vendor Dialogue Greeting
              </label>
              <input
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                maxLength={70}
                placeholder="Greeting to visitors..."
                className="w-full bg-[#0b171c] border border-[#d2ad6b]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efbf6d]"
              />
            </div>

            {/* Live Visual Stall Preview */}
            <div className="stall-design mt-4">
              <div className="stall-design-badge">★ FEATURED MELA PARTNER ★</div>
              <div
                className="stall-design-roof"
                style={{ '--stall-colour': themeColors[theme] } as React.CSSProperties}
              />
              <div
                className="stall-design-sign"
                style={{ '--stall-colour': themeColors[theme] } as React.CSSProperties}
              >
                {name || 'AAPKI DUKAAN'}
              </div>
              <div className="stall-design-shop">
                <span>🏪</span>
                <div>
                  <small>CATEGORIZED: {category.toUpperCase()}</small>
                  <p>&ldquo;{greeting}&rdquo;</p>
                </div>
              </div>
              <div
                className="stall-design-counter"
                style={{ '--stall-colour': themeColors[theme] } as React.CSSProperties}
              />
            </div>

            <button
              type="submit"
              className="gold-button w-full py-3 bg-[#f1c17d] hover:bg-[#ffe0a6] text-[#1a2826] font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-lg cursor-pointer"
            >
              ✦ Place Stall in 3D Mela for Free
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
