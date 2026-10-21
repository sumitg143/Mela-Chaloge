import React, { useState, useEffect, useRef } from 'react';
import { MelaWorld3D } from './components/MelaWorld3D';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MelaHud } from './components/MelaHud';
import { BalloonGameModal } from './components/BalloonGameModal';
import { RingTossModal } from './components/RingTossModal';
import { VendorConversationModal } from './components/VendorConversationModal';
import { GiantWheelModal } from './components/GiantWheelModal';
import { MautKaKuanModal } from './components/MautKaKuanModal';
import { RamLeelaModal } from './components/RamLeelaModal';
import { RavanaDahanModal } from './components/RavanaDahanModal';
import { MelaCardModal } from './components/MelaCardModal';
import { MelaBagModal } from './components/MelaBagModal';
import { MelaRadioModal } from './components/MelaRadioModal';
import { MelaMapModal } from './components/MelaMapModal';
import { StallBuilderModal } from './components/StallBuilderModal';
import { HelpModal } from './components/HelpModal';
import { TouchControls } from './components/TouchControls';
import { Hotspot, MelaStats, BagItem, MelaPartner } from './types';
import { melaAudio } from './audio/MelaAudio';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [mode, setMode] = useState<'walk' | 'ride' | 'stage' | 'finale' | 'well'>('walk');
  const [currentHotspot, setCurrentHotspot] = useState<Hotspot | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dialogHotspot, setDialogHotspot] = useState<Hotspot | null>(null);
  const [rideProgress, setRideProgress] = useState(0);
  const [hasCompletedRide, setHasCompletedRide] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 });

  const snapshotRef = useRef<(() => string | null) | null>(null);
  const [latestSnapshot, setLatestSnapshot] = useState<string | null>(null);

  // Initial stats & loaded items from localStorage
  const [stats, setStats] = useState<MelaStats>(() => {
    try {
      const saved = localStorage.getItem('mela_stats_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // safe fallback
    }
    return {
      balloons: 0,
      rings: 0,
      ride: false,
      wellRide: false,
      finale: false,
      foodCount: 0,
      items: [
        {
          id: 'welcome-wristband',
          name: 'Dussehra 2026 Mela Wristband',
          icon: '🎟️',
          category: 'souvenir',
          obtainedAt: 'Entrance Gate',
          description: 'Official golden VIP festival entry wristband for the 3D Dussehra fair.',
        },
      ],
    };
  });

  const [partners, setPartners] = useState<MelaPartner[]>(() => {
    try {
      const saved = localStorage.getItem('mela_partners_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // safe fallback
    }
    return [];
  });

  // Save stats to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('mela_stats_v1', JSON.stringify(stats));
    } catch {
      // safe fallback
    }
  }, [stats]);

  // Save custom stalls to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('mela_partners_v1', JSON.stringify(partners));
    } catch {
      // safe fallback
    }
  }, [partners]);

  // Handle entering mela
  const handleEnterMela = () => {
    melaAudio.init();
    setHasEntered(true);
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    melaAudio.setMuted(nextMuted);
  };

  // Add Item to Mela Bag
  const handleAddItemToBag = (item: BagItem) => {
    setStats((prev) => ({
      ...prev,
      items: [item, ...prev.items],
      foodCount: item.category === 'food' ? prev.foodCount + 1 : prev.foodCount,
    }));
  };

  // Trigger interaction when user presses 'E' or clicks prompt
  const handleInteract = (hotspot: Hotspot) => {
    melaAudio.playCoin();

    if (hotspot.type === 'balloon') {
      setActiveModal('balloon');
    } else if (hotspot.type === 'ring') {
      setActiveModal('ring');
    } else if (hotspot.type === 'ride') {
      setMode('ride');
      setRideProgress(0);
    } else if (hotspot.type === 'well') {
      setMode('well');
    } else if (hotspot.type === 'stage') {
      setActiveModal('stage');
    } else if (hotspot.type === 'finale') {
      setMode('finale');
      setActiveModal('finale');
    } else {
      // Food stalls & toys
      setDialogHotspot(hotspot);
      setActiveModal('vendor');
    }
  };

  // Keyboard shortcut for 'E' and 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && currentHotspot && !activeModal && mode === 'walk') {
        handleInteract(currentHotspot);
      } else if (e.code === 'Escape') {
        if (activeModal) {
          setActiveModal(null);
        } else if (mode !== 'walk') {
          setMode('walk');
        }
      } else if (e.code === 'KeyM' && !activeModal && mode === 'walk') {
        setActiveModal('map');
      } else if (e.code === 'KeyB' && !activeModal && mode === 'walk') {
        setActiveModal('bag');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentHotspot, activeModal, mode]);

  const handleOpenModal = (modalName: string) => {
    if (modalName === 'invite') {
      if (snapshotRef.current) {
        setLatestSnapshot(snapshotRef.current());
      }
    }
    setActiveModal(modalName);
  };

  return (
    <div className="game-app relative w-screen h-screen overflow-hidden bg-[#0c1724]">
      {/* 3D WebGL Canvas */}
      <MelaWorld3D
        onHotspotChange={setCurrentHotspot}
        onInteract={handleInteract}
        mode={mode}
        joystickVector={joystickVector}
        isRunning={isRunning}
        onRideProgress={setRideProgress}
        partners={partners}
        activeModal={activeModal}
        cameraSnapshotRef={snapshotRef}
      />

      {/* Welcome Screen Overlay */}
      {!hasEntered && <WelcomeScreen onEnter={handleEnterMela} />}

      {/* Main HUD */}
      {hasEntered && mode === 'walk' && (
        <>
          <MelaHud
            currentHotspot={currentHotspot}
            onOpenModal={handleOpenModal}
            onInteract={handleInteract}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
            stats={stats}
          />
          <TouchControls
            onMove={setJoystickVector}
            isRunning={isRunning}
            onToggleRun={() => setIsRunning(!isRunning)}
          />
        </>
      )}

      {/* Giant Wheel Ride Experience HUD */}
      {hasEntered && mode === 'ride' && (
        <GiantWheelModal
          progress={rideProgress}
          onExitRide={() => setMode('walk')}
          onRideCompleted={handleAddItemToBag}
          hasCompleted={hasCompletedRide}
        />
      )}

      {/* Maut Ka Kuan Stunt Experience HUD */}
      {hasEntered && mode === 'well' && (
        <MautKaKuanModal
          onExit={() => setMode('walk')}
          onReward={handleAddItemToBag}
        />
      )}

      {/* Balloon Shooting Mini-game Modal */}
      {activeModal === 'balloon' && (
        <BalloonGameModal
          onClose={() => setActiveModal(null)}
          onReward={(item) => {
            handleAddItemToBag(item);
            setStats((prev) => ({ ...prev, balloons: prev.balloons + 1 }));
          }}
        />
      )}

      {/* Ring Toss Mini-game Modal */}
      {activeModal === 'ring' && (
        <RingTossModal
          onClose={() => setActiveModal(null)}
          onReward={(item) => {
            handleAddItemToBag(item);
            setStats((prev) => ({ ...prev, rings: prev.rings + 1 }));
          }}
        />
      )}

      {/* Vendor Food & Craft Dialogue Modal */}
      {activeModal === 'vendor' && dialogHotspot && (
        <VendorConversationModal
          hotspot={dialogHotspot}
          onClose={() => {
            setActiveModal(null);
            setDialogHotspot(null);
          }}
          onAddToBag={handleAddItemToBag}
        />
      )}

      {/* Ram Leela Stage Modal */}
      {activeModal === 'stage' && (
        <RamLeelaModal
          onClose={() => setActiveModal(null)}
          onReward={handleAddItemToBag}
        />
      )}

      {/* Ravana Dahan Finale Modal */}
      {activeModal === 'finale' && (
        <RavanaDahanModal
          onClose={() => {
            setActiveModal(null);
            setMode('walk');
          }}
          onReward={(item) => {
            handleAddItemToBag(item);
            setStats((prev) => ({ ...prev, finale: true }));
          }}
        />
      )}

      {/* Mela Chaloge Mere Sath? Custom Invitation Card Generator */}
      {activeModal === 'invite' && (
        <MelaCardModal
          onClose={() => setActiveModal(null)}
          snapshotDataUrl={latestSnapshot}
        />
      )}

      {/* Mela Bag / Inventory Modal */}
      {activeModal === 'bag' && (
        <MelaBagModal
          items={stats.items}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Mela Radio & Devotional Bhajan Player */}
      {activeModal === 'radio' && (
        <MelaRadioModal onClose={() => setActiveModal(null)} />
      )}

      {/* Fairground Map & Fast Travel Modal */}
      {activeModal === 'map' && (
        <MelaMapModal
          onClose={() => setActiveModal(null)}
          onFastTravel={(spot) => {
            handleInteract(spot);
          }}
        />
      )}

      {/* Place Your Stall in this Mela Builder Modal */}
      {activeModal === 'stallBuilder' && (
        <StallBuilderModal
          onClose={() => setActiveModal(null)}
          onAddPartner={(p) => setPartners((prev) => [p, ...prev])}
        />
      )}

      {/* Guide & Controls Modal */}
      {activeModal === 'help' && (
        <HelpModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
