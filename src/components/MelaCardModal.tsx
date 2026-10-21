import React, { useState, useRef } from 'react';
import { X, Download, Share2, Copy, Check, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { melaAudio } from '../audio/MelaAudio';

interface MelaCardModalProps {
  onClose: () => void;
  snapshotDataUrl?: string | null;
}

export const MelaCardModal: React.FC<MelaCardModalProps> = ({ onClose, snapshotDataUrl }) => {
  const [senderName, setSenderName] = useState('Main');
  const [receiverName, setReceiverName] = useState('Dost');
  const [customNote, setCustomNote] = useState('Jalebi khilayenge, jhoola jhulayenge, aur Ravan Dahan dekhenge!');
  const [copied, setCopied] = useState(false);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  const inviteText = `Mela chaloge mere sath? 🎪❤️ Mujhe tumhare sath Dussehra mela ghumna hai! Yahan aao: ${window.location.origin}/?from=${encodeURIComponent(senderName)}&to=${encodeURIComponent(receiverName)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    melaAudio.playCoin();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCard = () => {
    melaAudio.playFanfare();
    confetti({ particleCount: 70, spread: 70 });

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // Instagram 4:5 portrait ratio
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1350);
    grad.addColorStop(0, '#0c1824');
    grad.addColorStop(0.5, '#172834');
    grad.addColorStop(1, '#09121c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1350);

    // If we have a 3D mela snapshot, blend it subtly in top half
    if (snapshotDataUrl) {
      const img = new Image();
      img.src = snapshotDataUrl;
      try {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.drawImage(img, 40, 160, 1000, 560);
        ctx.restore();
      } catch {
        // safe fallback
      }
    }

    // Ornate Golden Borders
    ctx.strokeStyle = '#efb653';
    ctx.lineWidth = 14;
    ctx.strokeRect(35, 35, 1010, 1280);

    ctx.strokeStyle = '#ffd77d';
    ctx.lineWidth = 3;
    ctx.strokeRect(55, 55, 970, 1240);

    // Header eyebrow
    ctx.fillStyle = '#ffcf75';
    ctx.font = 'bold 28px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('DUSSEHRA 2026 • OFFICIAL INVITATION', 540, 120);

    // Main Invitation Title
    ctx.fillStyle = '#fff4de';
    ctx.font = 'italic bold 76px "Playfair Display", Georgia, serif';
    ctx.fillText('Mela chaloge mere sath? ❤️', 540, 260);

    // Decorative Diya / Stars
    ctx.fillStyle = '#f1c17d';
    ctx.font = '40px sans-serif';
    ctx.fillText('✦ 🪔 🎡 🏹 🪔 ✦', 540, 340);

    // Recipient & Sender Banner
    ctx.fillStyle = 'rgba(23, 44, 52, 0.85)';
    ctx.fillRect(100, 420, 880, 380);
    ctx.strokeStyle = '#e7b55f';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 420, 880, 380);

    ctx.fillStyle = '#ffd685';
    ctx.font = '32px "DM Sans", sans-serif';
    ctx.fillText(`DEAR ${receiverName.toUpperCase() || 'FRIEND'},`, 540, 490);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 42px "Playfair Display", Georgia, serif';
    ctx.fillText(`“${customNote}”`, 540, 580);

    ctx.fillStyle = '#ffb347';
    ctx.font = 'bold 36px "DM Sans", sans-serif';
    ctx.fillText(`— Warmly, ${senderName || 'Your Mela Partner'}`, 540, 690);

    // Feature highlights
    ctx.fillStyle = '#eedac3';
    ctx.font = '26px "DM Sans", sans-serif';
    ctx.fillText('Chand Wala Jhoola • Sharma Ji Ki Chaat • Nishana Lagao • Ravana Dahan', 540, 890);

    // Dussehra Greeting
    ctx.fillStyle = '#ffd57a';
    ctx.font = 'bold 38px "DM Sans", sans-serif';
    ctx.fillText('HAPPY DUSSEHRA • VIJAYADASHAMI', 540, 970);

    // Footer link
    ctx.fillStyle = '#a6b8ad';
    ctx.font = '24px "DM Sans", sans-serif';
    ctx.fillText('Visit the interactive 3D fair online: melachaloge.online', 540, 1220);

    // Trigger download
    const link = document.createElement('a');
    link.download = `dussehra-mela-invite-${receiverName || 'partner'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(inviteText)}`, '_blank');
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

        <div className="eyebrow text-xs uppercase tracking-[2px] text-[#ecc282] font-semibold flex items-center justify-center gap-1.5 mb-1">
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          CUSTOM MELA INVITATION
        </div>

        <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#fff3dc] mb-1">
          Mela chaloge mere sath? ❤️
        </h2>

        <p className="text-xs text-[#d5ded2] mb-5">
          Generate your personalized Dussehra Mela invitation postcard to invite your friend, family, or partner!
        </p>

        {/* Inputs */}
        <div className="space-y-3 text-left mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-1">
                Aapka Naam (Your Name)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={30}
                className="w-full bg-[#0b171c] border border-[#d2ad6b]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efbf6d]"
                placeholder="Mera Naam"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-1">
                Kise Bula Rahe Ho? (Friend&apos;s Name)
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                maxLength={30}
                className="w-full bg-[#0b171c] border border-[#d2ad6b]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efbf6d]"
                placeholder="Dost / Partner"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#ecc282] tracking-wider block mb-1">
              Sweet Mela Message
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              maxLength={80}
              className="w-full bg-[#0b171c] border border-[#d2ad6b]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efbf6d]"
              placeholder="Jalebi khilayenge, jhoola jhulayenge..."
            />
          </div>
        </div>

        {/* Live Card Preview */}
        <div className="bg-gradient-to-b from-[#182b35] to-[#0c1822] border-2 border-[#efbf6d] rounded-xl p-5 mb-5 shadow-inner relative overflow-hidden">
          <div className="text-[9px] uppercase tracking-widest text-[#ffd27d] mb-1 font-bold">
            DUSSEHRA 2026 INVITATION PASS
          </div>
          <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-white mb-2">
            Mela chaloge mere sath? ❤️
          </h3>

          <div className="bg-[#112328]/80 border border-[#e5bc76]/30 rounded-lg p-3 my-3">
            <span className="text-[11px] text-[#f7e0b5] font-semibold block mb-0.5">
              Dear {receiverName || 'Friend'},
            </span>
            <p className="text-xs italic text-[#eedbb8] font-['Playfair_Display',serif]">
              &ldquo;{customNote}&rdquo;
            </p>
            <small className="block text-[10px] text-[#f1c17d] font-bold text-right mt-2">
              — {senderName || 'Your Mela Partner'}
            </small>
          </div>

          <div className="text-[10px] text-[#b7c9ba] flex justify-center items-center gap-2">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>Chand Jhoola • Sharma Ji Ki Chaat • Nishana Lagao • Ravana Dahan</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={handleDownloadCard}
            className="gold-button flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f1c17d] hover:bg-[#ffe0a6] text-[#1a2826] font-bold text-xs rounded-lg transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e3b42] hover:bg-[#284f58] text-[#f5deaf] border border-[#e5bc76]/40 font-semibold text-xs rounded-lg transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#45e068]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-[#0d261a] font-bold text-xs rounded-lg transition shadow-md cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
