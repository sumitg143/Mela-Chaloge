import React, { useRef, useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface TouchControlsProps {
  onMove: (vector: { x: number; y: number }) => void;
  isRunning: boolean;
  onToggleRun: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  isRunning,
  onToggleRun,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const joystick = joystickRef.current;
    if (!joystick) return;

    let touchId: number | null = null;
    let centerX = 0;
    let centerY = 0;
    const maxRadius = 38;

    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const rect = joystick.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(touch.clientX - centerX, touch.clientY - centerY);
        if (dist <= maxRadius * 1.5) {
          touchId = touch.identifier;
          setIsDragging(true);
          updateKnob(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchId === null) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === touchId) {
          updateKnob(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchId === null) return;
      let stillPresent = false;
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === touchId) {
          stillPresent = true;
          break;
        }
      }
      if (!stillPresent) {
        touchId = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
      }
    };

    const updateKnob = (clientX: number, clientY: number) => {
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const clampedDist = Math.min(dist, maxRadius);
      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      setKnobPos({ x: knobX, y: knobY });
      onMove({
        x: knobX / maxRadius,
        y: knobY / maxRadius,
      });
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onMove]);

  return (
    <>
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        className="joystick md:hidden z-10 flex items-center justify-center pointer-events-auto"
      >
        <span
          className="transition-transform duration-75"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* Sprint / Run Button for mobile */}
      <button
        onClick={onToggleRun}
        className={`run-button md:hidden z-10 pointer-events-auto cursor-pointer ${
          isRunning ? 'running text-[#efbf6d] border-[#efbf6d]' : 'text-gray-300'
        }`}
        title="Sprint Walk"
      >
        <Zap className="w-5 h-5 fill-current" />
        <small>{isRunning ? 'SPRINT' : 'WALK'}</small>
      </button>

      {/* Touch drag look hint */}
      <div className="touch-look-hint md:hidden z-10">
        DRAG RIGHT SIDE TO LOOK ✦
      </div>
    </>
  );
};
