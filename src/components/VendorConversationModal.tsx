import React, { useState } from 'react';
import { X, Utensils, Check } from 'lucide-react';
import { Hotspot, BagItem } from '../types';
import { melaAudio } from '../audio/MelaAudio';

interface VendorConversationModalProps {
  hotspot: Hotspot;
  onClose: () => void;
  onAddToBag: (item: BagItem) => void;
}

export const VendorConversationModal: React.FC<VendorConversationModalProps> = ({
  hotspot,
  onClose,
  onAddToBag,
}) => {
  const [vendorReply, setVendorReply] = useState<string | null>(null);
  const [itemGiven, setItemGiven] = useState<BagItem | null>(null);

  const getVendorOptions = () => {
    switch (hotspot.id) {
      case 'chaat':
        return [
          {
            label: 'Ek plate Papdi Chaat de do! (₹20)',
            reply: 'Yeh lo bhaiya! Dahi, khatti-meethi saunth aur sev se lada hua special chaat dona!',
            item: {
              id: `chaat-${Date.now()}`,
              name: 'Khatti-Meethi Papdi Chaat',
              icon: '🍲',
              category: 'food' as const,
              obtainedAt: 'Sharma Ji Ki Chaat',
              description: 'Crispy papdis smothered in chilled whipped curd, sweet date-tamarind chutney, and roasted cumin.',
            },
          },
          {
            label: 'Teekhe hing wale Golgappe lagao!',
            reply: 'Arey waah! Yeh lo ek crispy golgappa, teekha spicy pudina hing paani ke saath!',
            item: {
              id: `golgappa-${Date.now()}`,
              name: 'Spicy Hing Golgappa',
              icon: '🥟',
              category: 'food' as const,
              obtainedAt: 'Sharma Ji Ki Chaat',
              description: 'Crispy semolina puris filled with mashed spiced potatoes and zesty mint hing water.',
            },
          },
          {
            label: 'Aaj mela me bheed kaisi hai?',
            reply: 'Aaj poora shehar Dussehra mela aaya hai! Sharma ji ki chaat pe toh hamesha line lagti hai!',
            item: null,
          },
        ];

      case 'jalebi':
        return [
          {
            label: 'Garma garam Jalebi with Rabri de do!',
            reply: 'Ekdum kurkuri shuddh desi ghee ki jalebi, upar se thandi malai rabri! Aaj toh royal treat ho gayi!',
            item: {
              id: `jalebi-${Date.now()}`,
              name: 'Garam Jalebi with Rabri',
              icon: '🍥',
              category: 'food' as const,
              obtainedAt: 'Garam Jalebi Stall',
              description: 'Golden spiral jalebis soaked in saffron sugar syrup, topped with thick condensed milk rabri.',
            },
          },
          {
            label: 'Ek dona crispy Jalebi pack kar do',
            reply: 'Kadhai se abhi-abhi nikali hai! Garma garam khao, maza aa jayega.',
            item: {
              id: `crispy-jalebi-${Date.now()}`,
              name: 'Kurkuri Saffron Jalebi',
              icon: '🍥',
              category: 'food' as const,
              obtainedAt: 'Garam Jalebi Stall',
              description: 'Piping hot crunchy spirals infused with cardamom and saffron.',
            },
          },
        ];

      case 'golgappe':
        return [
          {
            label: '6 piece Teekha Golgappa dona!',
            reply: 'Pehle meetha phir teekha! Yeh lo pehla golgappa, khao!',
            item: {
              id: `golgappe-plate-${Date.now()}`,
              name: 'Khatta-Meetha Golgappe Plate',
              icon: '🥟',
              category: 'food' as const,
              obtainedAt: 'Teekhe Golgappe',
              description: 'Classic crunchy mela puris bursting with tangy street flavors.',
            },
          },
        ];

      case 'momos':
        return [
          {
            label: 'Steaming hot Momos with spicy chutney!',
            reply: 'Yeh lo steaming hot veg momos! Aur teekhi lal tamatar-lehsun chutney!',
            item: {
              id: `momos-${Date.now()}`,
              name: 'Steaming Mela Momos',
              icon: '🥟',
              category: 'food' as const,
              obtainedAt: 'Steaming Momos Stall',
              description: 'Steamed vegetable dumplings with fiery red chili garlic dip.',
            },
          },
        ];

      case 'kulfi':
        return [
          {
            label: 'Matka Malai Kulfi de do!',
            reply: 'Pista, kesar aur badam se bhari authentic earthen pot malai kulfi! Thanda thanda cool treat.',
            item: {
              id: `kulfi-${Date.now()}`,
              name: 'Matka Malai Kulfi',
              icon: '🍨',
              category: 'food' as const,
              obtainedAt: 'Malai Matka Kulfi',
              description: 'Traditional slow-cooked creamy kulfi stick served cold on sal-leaf.',
            },
          },
        ];

      case 'popcorn':
        return [
          {
            label: 'Ek bada packet Caramel Popcorn!',
            reply: 'Mela popcorn bina jhoola adhoora hai! Yeh lo garma garam crunchy caramel bag.',
            item: {
              id: `popcorn-${Date.now()}`,
              name: 'Mela Caramel Popcorn',
              icon: '🍿',
              category: 'food' as const,
              obtainedAt: 'Garam Popcorn Stall',
              description: 'Sweet, buttery crunchy popcorn fresh from the roaster.',
            },
          },
        ];

      case 'candyfloss':
        return [
          {
            label: 'Gudiya ke baal (Pink Cotton Candy)!',
            reply: 'Hawa me udta hua pink mela cloud! Bachpan ki sabse meethi yaad.',
            item: {
              id: `candyfloss-${Date.now()}`,
              name: 'Pink Candy Floss (Gudiya Ke Baal)',
              icon: '🍭',
              category: 'food' as const,
              obtainedAt: 'Candy Floss Stall',
              description: 'Fluffy pink spun sugar on a bamboo reed.',
            },
          },
        ];

      case 'toy':
        return [
          {
            label: 'Dussehra Ravana Mask khareedo',
            reply: 'Yeh lo 10-sar wala glittering Ravana festive mask! Bachhe mela me pehan ke ghoomte hain.',
            item: {
              id: `ravana-mask-${Date.now()}`,
              name: 'Glittering Ravana Mela Mask',
              icon: '🎭',
              category: 'toy' as const,
              obtainedAt: 'Khilone Ki Dukaan',
              description: 'Traditional card & tinsel Dussehra fair face mask with elastic band.',
            },
          },
          {
            label: 'Chabi wala nachne wala Bandar!',
            reply: 'Chabi bharo aur bandar dholak bajayega! Zabardast desi toy.',
            item: {
              id: `windup-monkey-${Date.now()}`,
              name: 'Wind-up Dholak Monkey Toy',
              icon: '🐒',
              category: 'toy' as const,
              obtainedAt: 'Khilone Ki Dukaan',
              description: 'Classic tinplate wind-up toy monkey beating tiny cymbals.',
            },
          },
        ];

      default:
        return [
          {
            label: 'Aaj ka special de do!',
            reply: 'Yeh lo, aapke liye hamara mela special! Khush rahiye aur mela ka anand lijiye.',
            item: {
              id: `treat-${Date.now()}`,
              name: `${hotspot.name} Special`,
              icon: '🎁',
              category: 'food' as const,
              obtainedAt: hotspot.name,
              description: 'A festive souvenir from the mela.',
            },
          },
        ];
    }
  };

  const options = getVendorOptions();

  const handleSelectOption = (opt: { label: string; reply: string; item: BagItem | null }) => {
    melaAudio.playSizzle();
    setVendorReply(opt.reply);

    if (opt.item) {
      setItemGiven(opt.item);
      onAddToBag(opt.item);
      melaAudio.playCoin();
    }
  };

  return (
    <div className="conversation-backdrop fixed inset-0 z-30 flex items-end justify-center p-4 sm:p-8 pointer-events-auto">
      <div className="conversation relative bg-[#13272d]/95 border border-[#dfc38c] rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="panel-close absolute right-4 top-4 text-[#ecc282] hover:text-white text-2xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#ecc282] font-semibold">
          <Utensils className="w-4 h-4 text-[#ffd580]" />
          <span>{hotspot.name}</span>
        </div>

        {/* Vendor Greeting Quote */}
        <p className="vendor-line font-['Playfair_Display',serif] text-xl sm:text-2xl italic text-[#f8dbab] my-3 leading-snug">
          &ldquo;{vendorReply || hotspot.dialogue || 'Aao ji, aao! Garma garam mela special ready hai.'}&rdquo;
        </p>

        {/* Item Given Notification */}
        {itemGiven && (
          <div className="flex items-center gap-3 bg-[#1e3b39] border border-[#52bd7b] text-[#def8e5] text-xs px-3.5 py-2.5 rounded-lg mb-4 animate-fade-in">
            <span className="text-xl">{itemGiven.icon}</span>
            <div>
              <strong className="block text-[#45e068] font-bold">{itemGiven.name}</strong>
              <small className="text-[10px] text-[#b3dec0]">Added to your Mela Bag! Real mela memories.</small>
            </div>
            <Check className="w-4 h-4 text-[#45e068] ml-auto" />
          </div>
        )}

        {/* Dialogue Choices */}
        <div className="choices flex flex-col gap-2 mt-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectOption(opt)}
              className="text-left px-4 py-2.5 bg-[#1b343a] hover:bg-[#284950] active:scale-[0.99] text-[#f7e0b5] border border-[#d2ad6b]/30 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              👉 {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#dfc38c]/20 flex justify-between items-center text-[10px] text-[#adbdb0]">
          <span>Traditional Dussehra Bazaar ✦ No real money, 100% free virtual treat</span>
          <button onClick={onClose} className="text-[#ecc282] hover:underline font-semibold cursor-pointer">
            Walk away
          </button>
        </div>
      </div>
    </div>
  );
};
