import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Hotspot, MelaPartner } from '../types';

interface MelaWorld3DProps {
  onHotspotChange: (hotspot: Hotspot | null) => void;
  onInteract: (hotspot: Hotspot) => void;
  mode: 'walk' | 'ride' | 'stage' | 'finale' | 'well';
  joystickVector: { x: number; y: number };
  isRunning: boolean;
  onModeExit?: () => void;
  onRideProgress?: (progress: number) => void;
  partners?: MelaPartner[];
  activeModal: string | null;
  cameraSnapshotRef?: React.MutableRefObject<(() => string | null) | null>;
}

export const MelaWorld3D: React.FC<MelaWorld3DProps> = ({
  onHotspotChange,
  mode,
  joystickVector,
  isRunning,
  onRideProgress,
  partners = [],
  activeModal,
  cameraSnapshotRef,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseStateRef = useRef<{ isDown: boolean; lastX: number; lastY: number }>({
    isDown: false,
    lastX: 0,
    lastY: 0,
  });

  // Hotspots definition matching the mela layout
  const hotspotsRef = useRef<Hotspot[]>([
    { id: 'entrance', type: 'food', name: 'Mela Gate', x: 0, z: 28, radius: 6, dialogue: 'Mela chaloge mere sath? ❤️ Swagat hai Dussehra Mela me!' },
    { id: 'chaat', type: 'food', name: 'Sharma Ji Ki Chaat', x: -14, z: 18, radius: 5.5, dialogue: 'Garma garam papdi chaat aur golgappe! Khatti meethi chutney dalu bhaiya?' },
    { id: 'jalebi', type: 'food', name: 'Garam Jalebi & Rabri', x: 14, z: 18, radius: 5.5, dialogue: 'Shuddh desi ghee ki kurkuri jalebi aur thandi rabri! Yeh lo ek dona.' },
    { id: 'golgappe', type: 'food', name: 'Teekhe Golgappe', x: -14, z: 7, radius: 5.5, dialogue: 'Pani puri khao! Hing wala paani ya pudina wala?' },
    { id: 'chowmein', type: 'food', name: 'Desi Chowmein Stall', x: 14, z: 7, radius: 5.5, dialogue: 'Garam garam fried mela chowmein with extra sauce ready hai!' },
    { id: 'momos', type: 'food', name: 'Steaming Momos', x: -14, z: -5, radius: 5.5, dialogue: 'Teekhi lal chutney ke saath hot veg momos ready hai!' },
    { id: 'kulfi', type: 'food', name: 'Malai Matka Kulfi', x: 14, z: -5, radius: 5.5, dialogue: 'Pista-badam wali thandi malai kulfi, mela ki best treat!' },
    { id: 'popcorn', type: 'food', name: 'Garam Popcorn', x: -24, z: -18, radius: 5.5, dialogue: 'Butter aur caramel popcorn! Cinema jaisa swad.' },
    { id: 'candyfloss', type: 'food', name: 'Gudiya Ke Baal (Candy Floss)', x: 23, z: -13, radius: 5.5, dialogue: 'Pink candy floss! Bachpan ki meethi yaadein.' },
    { id: 'balloon', type: 'balloon', name: 'Nishana Lagao (Balloon Shooting)', x: 25, z: 18, radius: 6, dialogue: 'Paanch nishane! Gun pakdo aur gubbare phodo!' },
    { id: 'ring', type: 'ring', name: 'Ring Toss (Chhalla Phek)', x: 25, z: 6, radius: 6, dialogue: 'Chhalla phek ke dekho! Bottle par ring fasa aur inaam jeeto!' },
    { id: 'toy', type: 'toy', name: 'Khilone Ki Dukaan', x: -25, z: 18, radius: 6, dialogue: 'Chabi wale bandar, glowing whistle aur Dussehra mela masks!' },
    { id: 'wheel', type: 'ride', name: 'Chand Wala Jhoola (Giant Wheel)', x: 28, z: -29, radius: 7.5, dialogue: 'Ek chakkar? Upar se poora mela chamakta hua dikhega!' },
    { id: 'well', type: 'well', name: 'Maut Ka Kuan (Well of Death)', x: -23, z: -27, radius: 7.5, dialogue: 'Dhol baje, bike ghoome! Wooden barrel me stuntbaazi dekho!' },
    { id: 'stage', type: 'stage', name: 'Ram Leela Stage', x: -27, z: -43, radius: 8, dialogue: 'Aaiye, Ram Leela shuru hone wali hai. Baith kar manch dekhein.' },
    { id: 'finale', type: 'finale', name: 'Ravana Dahan Maidan', x: 2, z: -60, radius: 10, dialogue: 'Burai par achchai ki jeet. Agni Baan chalane ke liye taiyaar?' },
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0c1724');
    scene.fog = new THREE.FogExp2('#111f30', 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    // Start facing the entrance gate looking into the mela
    camera.position.set(0, 2.5, 42);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Provide snapshot method to parent for mela card generator / selfie
    if (cameraSnapshotRef) {
      cameraSnapshotRef.current = () => {
        try {
          renderer.render(scene, camera);
          return renderer.domElement.toDataURL('image/jpeg', 0.85);
        } catch {
          return null;
        }
      };
    }

    // --- Lighting ---
    const hemiLight = new THREE.HemisphereLight('#c4d4eb', '#755030', 1.8);
    scene.add(hemiLight);

    const moonLight = new THREE.DirectionalLight('#ffe2b8', 1.2);
    moonLight.position.set(-30, 60, 20);
    scene.add(moonLight);

    // Entrance Gate Warm Lanterns
    const gateLight = new THREE.PointLight('#ffb44a', 3.5, 35, 1.2);
    gateLight.position.set(0, 8, 32);
    scene.add(gateLight);

    const bazaarLight = new THREE.PointLight('#ffc873', 3.0, 40, 1.2);
    bazaarLight.position.set(0, 6, 8);
    scene.add(bazaarLight);

    const ravanaLight = new THREE.PointLight('#ff7020', 4.0, 45, 1.2);
    ravanaLight.position.set(2, 8, -55);
    scene.add(ravanaLight);

    // --- Texture Generator Helpers ---
    const createSignTexture = (text: string, bgColor = '#66222b', fgColor = '#ffe7a3') => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 512, 128);

      ctx.strokeStyle = '#efb653';
      ctx.lineWidth = 8;
      ctx.strokeRect(6, 6, 500, 116);

      // Inner ornate border
      ctx.strokeStyle = '#ffcf75';
      ctx.lineWidth = 2;
      ctx.strokeRect(14, 14, 484, 100);

      ctx.fillStyle = fgColor;
      ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64, 480);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Ground: Fairground dirt texture with paths
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 256;
    groundCanvas.height = 256;
    const gctx = groundCanvas.getContext('2d')!;
    gctx.fillStyle = '#4a3b2c';
    gctx.fillRect(0, 0, 256, 256);
    // Add noise & pebble specks
    for (let i = 0; i < 4000; i++) {
      const rx = Math.floor(Math.random() * 256);
      const ry = Math.floor(Math.random() * 256);
      gctx.fillStyle = i % 2 ? '#5c4b3a' : '#382a1d';
      gctx.fillRect(rx, ry, (i % 3) + 1, 1);
    }
    const groundTex = new THREE.CanvasTexture(groundCanvas);
    groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(24, 32);

    const groundGeo = new THREE.PlaneGeometry(130, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -15;
    ground.receiveShadow = true;
    scene.add(ground);

    // Central Walkway path
    const pathGeo = new THREE.PlaneGeometry(16, 120);
    const pathMat = new THREE.MeshStandardMaterial({
      color: '#6e5a47',
      roughness: 0.9,
      transparent: true,
      opacity: 0.5,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.02, -10);
    scene.add(pathMesh);

    // --- ENTRANCE GATE ---
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 32);
    scene.add(gateGroup);

    // Ornate entrance towers
    [-8, 8].forEach((x) => {
      const pillarGeo = new THREE.BoxGeometry(2, 9, 2);
      const pillarMat = new THREE.MeshStandardMaterial({ color: '#8c2d19', roughness: 0.7 });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 4.5, 0);
      gateGroup.add(pillar);

      const baseGeo = new THREE.BoxGeometry(2.6, 2, 2.6);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#c98a32', roughness: 0.6 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(x, 1, 0);
      gateGroup.add(base);

      // Top Dome
      const domeGeo = new THREE.ConeGeometry(1.6, 2.2, 8);
      const domeMat = new THREE.MeshStandardMaterial({ color: '#df9c2c', metalness: 0.3, roughness: 0.4 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.set(x, 10, 0);
      gateGroup.add(dome);

      // Kalash / spire sphere
      const spire = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12),
        new THREE.MeshStandardMaterial({ color: '#ffe66d', emissive: '#ffaa00', emissiveIntensity: 0.6 })
      );
      spire.position.set(x, 11.2, 0);
      gateGroup.add(spire);
    });

    // Archway top banner
    const archBeam = new THREE.Mesh(
      new THREE.BoxGeometry(16, 2.2, 1.4),
      new THREE.MeshStandardMaterial({ color: '#7a2215', roughness: 0.7 })
    );
    archBeam.position.set(0, 8, 0);
    gateGroup.add(archBeam);

    // Glowing Sign Board: "मेरा DUSSEHRA MELA"
    const signFront = new THREE.Mesh(
      new THREE.PlaneGeometry(13.5, 1.8),
      new THREE.MeshBasicMaterial({ map: createSignTexture('मेरा DUSSEHRA MELA', '#7a1923', '#ffd57d'), side: THREE.DoubleSide })
    );
    signFront.position.set(0, 8.05, 0.73);
    gateGroup.add(signFront);

    // Subtitle Sign Board: "Mela chaloge mere sath? ❤️"
    const subSign = new THREE.Mesh(
      new THREE.PlaneGeometry(10.5, 0.95),
      new THREE.MeshBasicMaterial({ map: createSignTexture('Mela chaloge mere sath? ❤️', '#4a151b', '#ffebba'), side: THREE.DoubleSide })
    );
    subSign.position.set(0, 6.2, 0.75);
    gateGroup.add(subSign);

    // Fairy light beads along the entrance arch
    for (let x = -7; x <= 7; x += 0.5) {
      const y = 6.9 - Math.sin(((x + 7) / 14) * Math.PI) * 1.4;
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: x % 1 === 0 ? '#ffcf40' : '#ff5533' })
      );
      bulb.position.set(x, y, 0.85);
      gateGroup.add(bulb);
    }

    // --- FESTOON STRINGS & LANTERNS ALONG THE MAIN BAZAAR ---
    const festoonGroup = new THREE.Group();
    scene.add(festoonGroup);

    for (let z = 24; z >= -48; z -= 12) {
      // Light poles
      [-8.5, 8.5].forEach((px) => {
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.1, 7.5, 8),
          new THREE.MeshStandardMaterial({ color: '#524337' })
        );
        pole.position.set(px, 3.75, z);
        festoonGroup.add(pole);

        // Lantern on top
        const lantern = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 10, 10),
          new THREE.MeshBasicMaterial({ color: '#ffd06b' })
        );
        lantern.position.set(px, 7.5, z);
        festoonGroup.add(lantern);
      });

      // Hanging garland curve
      const p1 = new THREE.Vector3(-8.5, 7.3, z);
      const p2 = new THREE.Vector3(8.5, 7.3, z);
      for (let s = 1; s <= 20; s++) {
        const t = s / 20;
        const cur = new THREE.Vector3().lerpVectors(p1, p2, t);
        cur.y -= Math.sin(t * Math.PI) * 1.3;
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 6, 6),
          new THREE.MeshBasicMaterial({ color: s % 3 === 0 ? '#ffda59' : s % 3 === 1 ? '#ff3e3e' : '#45e068' })
        );
        bulb.position.copy(cur);
        festoonGroup.add(bulb);
      }
    }

    // --- STALL BUILDER HELPER ---
    const createStall = (
      name: string,
      x: number,
      z: number,
      color: string,
      type: 'food' | 'balloon' | 'ring' | 'toy'
    ) => {
      const stall = new THREE.Group();
      stall.position.set(x, 0, z);
      stall.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      scene.add(stall);

      // Wooden counter & base
      const counterBase = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 0.9, 2.8),
        new THREE.MeshStandardMaterial({ color: '#573d2a', roughness: 0.85 })
      );
      counterBase.position.set(0, 0.45, 0);
      stall.add(counterBase);

      // Counter top
      const counterTop = new THREE.Mesh(
        new THREE.BoxGeometry(5.4, 0.18, 1.2),
        new THREE.MeshStandardMaterial({ color: '#a67246', roughness: 0.6 })
      );
      counterTop.position.set(0, 1.0, 0.9);
      stall.add(counterTop);

      // Canopy pillars
      [-2.3, 2.3].forEach((cx) => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 4.2, 6),
          new THREE.MeshStandardMaterial({ color: '#80593b' })
        );
        post.position.set(cx, 2.1, 1.1);
        stall.add(post);
      });

      // Canopy roof
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(5.6, 0.15, 3.2),
        new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      );
      roof.position.set(0, 4.1, 0);
      roof.rotation.x = -0.15;
      stall.add(roof);

      // Name signboard
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 0.85),
        new THREE.MeshBasicMaterial({ map: createSignTexture(name, color, '#fff3d1'), side: THREE.DoubleSide })
      );
      sign.position.set(0, 3.2, 1.2);
      stall.add(sign);

      // Decorative mini bulb string under roof
      for (let bi = 0; bi < 8; bi++) {
        const bx = -2.2 + bi * 0.62;
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 6, 6),
          new THREE.MeshBasicMaterial({ color: bi % 2 ? '#ffdf7a' : '#ff7a7a' })
        );
        bulb.position.set(bx, 3.65 - Math.sin((bi / 7) * Math.PI) * 0.25, 1.35);
        stall.add(bulb);
      }

      // Stall-specific props
      if (type === 'food') {
        // Brass cooking kadai / thali
        const kadai = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.25, 0.25, 12),
          new THREE.MeshStandardMaterial({ color: '#d19e34', metalness: 0.8, roughness: 0.3 })
        );
        kadai.position.set(0, 1.25, 0.9);
        stall.add(kadai);

        // Treats inside kadai
        const treats = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 8, 8),
          new THREE.MeshStandardMaterial({ color: '#ff8800', roughness: 0.5 })
        );
        treats.position.set(0, 1.35, 0.9);
        stall.add(treats);
      } else if (type === 'balloon') {
        // Balloon backboard with colorful target spheres
        const backboard = new THREE.Mesh(
          new THREE.BoxGeometry(4.8, 2.4, 0.15),
          new THREE.MeshStandardMaterial({ color: '#38251e' })
        );
        backboard.position.set(0, 2.3, -1.1);
        stall.add(backboard);

        const balloonColors = ['#ff3344', '#33aaff', '#ffcc00', '#44dd55', '#cc44ff'];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 7; col++) {
            const bMesh = new THREE.Mesh(
              new THREE.SphereGeometry(0.22, 10, 10),
              new THREE.MeshStandardMaterial({ color: balloonColors[(row + col) % balloonColors.length], roughness: 0.3 })
            );
            bMesh.position.set(-1.8 + col * 0.6, 1.6 + row * 0.65, -0.95);
            stall.add(bMesh);
          }
        }
      } else if (type === 'ring') {
        // Bottles on table for ring toss
        const bottleColors = ['#2e7039', '#8a3c1e', '#235e7d'];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const bottle = new THREE.Mesh(
              new THREE.CylinderGeometry(0.1, 0.12, 0.65, 8),
              new THREE.MeshStandardMaterial({ color: bottleColors[(r + c) % 3], roughness: 0.2, metalness: 0.3 })
            );
            bottle.position.set(-1.1 + c * 1.1, 1.45, 0.3 + r * 0.45);
            stall.add(bottle);
          }
        }
      } else if (type === 'toy') {
        // Toy shelf
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(4.6, 1.8, 0.3),
          new THREE.MeshStandardMaterial({ color: '#4a3322' })
        );
        shelf.position.set(0, 2.2, -0.9);
        stall.add(shelf);
      }

      return stall;
    };

    // Stalls mapping
    createStall('SHARMA JI KI CHAAT', -14, 18, '#bd3a2b', 'food');
    createStall('GARAM JALEBI', 14, 18, '#d46513', 'food');
    createStall('GOLGAPPE', -14, 7, '#397839', 'food');
    createStall('CHOWMEIN', 14, 7, '#c2381f', 'food');
    createStall('STEAMING MOMOS', -14, -5, '#ab4430', 'food');
    createStall('MALAI KULFI', 14, -5, '#5d8096', 'food');
    createStall('GARAM POPCORN', -24, -18, '#cf8e23', 'food');
    createStall('CANDY FLOSS', 23, -13, '#c94073', 'food');
    createStall('KHILONE KI DUKAAN', -25, 18, '#4478a6', 'toy');
    createStall('NISHANA LAGAO', 25, 18, '#82243d', 'balloon');
    createStall('RING TOSS', 25, 6, '#b56d1b', 'ring');

    // Partner stalls if customized
    partners.forEach((p, idx) => {
      const px = idx % 2 === 0 ? -14 : 14;
      const pz = -15 - idx * 10;
      createStall(p.name, px, pz, p.theme === 'kesari' ? '#c75816' : p.theme === 'gulabi' ? '#b82763' : '#1f6494', 'food');
    });

    // --- GIANT WHEEL (FERRIS WHEEL / CHAND WALA JHOOLA) ---
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(28, 0, -29);
    scene.add(wheelGroup);

    // Support A-frame towers
    [-2.2, 2.2].forEach((zOffset) => {
      [-3.5, 3.5].forEach((xOffset) => {
        const strut = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.25, 15, 8),
          new THREE.MeshStandardMaterial({ color: '#59697a', metalness: 0.6, roughness: 0.4 })
        );
        strut.position.set(xOffset, 7.5, zOffset);
        strut.rotation.z = xOffset > 0 ? 0.22 : -0.22;
        wheelGroup.add(strut);
      });
    });

    // Rotating Wheel Assembly
    const rotatingWheel = new THREE.Group();
    rotatingWheel.position.y = 13;
    wheelGroup.add(rotatingWheel);

    const wheelRadius = 8.5;
    const gondolaColors = ['#ff3344', '#ffaa00', '#22bbff', '#44dd66', '#ee44cc', '#ffdd22'];
    const gondolas: THREE.Group[] = [];

    // Outer rims
    [-0.7, 0.7].forEach((zRim) => {
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(wheelRadius, 0.12, 8, 36),
        new THREE.MeshStandardMaterial({ color: '#ffb938', metalness: 0.7, roughness: 0.3 })
      );
      rim.position.z = zRim;
      rotatingWheel.add(rim);
    });

    // Spokes and 12 Gondolas
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const gx = Math.cos(angle) * wheelRadius;
      const gy = Math.sin(angle) * wheelRadius;

      // Spoke
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, wheelRadius * 2, 6),
        new THREE.MeshStandardMaterial({ color: '#e0c279' })
      );
      spoke.position.set(0, 0, 0);
      spoke.rotation.z = angle + Math.PI / 2;
      rotatingWheel.add(spoke);

      // Gondola cabin
      const gondola = new THREE.Group();
      gondola.position.set(gx, gy, 0);
      rotatingWheel.add(gondola);
      gondolas.push(gondola);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.2, 1.3),
        new THREE.MeshStandardMaterial({ color: gondolaColors[i % gondolaColors.length], roughness: 0.6 })
      );
      cabin.position.y = -0.5;
      gondola.add(cabin);

      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 0.6, 6),
        new THREE.MeshStandardMaterial({ color: '#ffe494' })
      );
      canopy.position.y = 0.4;
      gondola.add(canopy);
    }

    // Wheel center jewel
    const centerStar = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#ff9900', emissive: '#ff5500', emissiveIntensity: 0.7 })
    );
    rotatingWheel.add(centerStar);

    // Giant Wheel Signboard
    const wheelSign = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 1.3),
      new THREE.MeshBasicMaterial({ map: createSignTexture('CHAND TAK CHALOGE? 🎡', '#8a2b16', '#ffea9e'), side: THREE.DoubleSide })
    );
    wheelSign.position.set(0, 2.2, 3.2);
    wheelGroup.add(wheelSign);

    // --- MAUT KA KUAN (WELL OF DEATH) ---
    const wellGroup = new THREE.Group();
    wellGroup.position.set(-23, 0, -27);
    scene.add(wellGroup);

    // Wooden cylinder
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 4.8, 7.5, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: '#7a5232', side: THREE.DoubleSide, roughness: 0.9 })
    );
    barrel.position.y = 3.75;
    wellGroup.add(barrel);

    // Upper Viewing Balcony
    const balcony = new THREE.Mesh(
      new THREE.TorusGeometry(6.2, 0.45, 8, 24),
      new THREE.MeshStandardMaterial({ color: '#573d2a' })
    );
    balcony.position.y = 7.4;
    balcony.rotation.x = Math.PI / 2;
    wellGroup.add(balcony);

    // Stunt bike inside
    const bikeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.4, 0.25),
      new THREE.MeshStandardMaterial({ color: '#ff2222' })
    );
    bikeMesh.position.set(4.6, 5.0, 0);
    wellGroup.add(bikeMesh);

    // Well Signboard
    const wellSign = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 1.2),
      new THREE.MeshBasicMaterial({ map: createSignTexture('MAUT KA KUAN 🏍️', '#1b3b3a', '#ffea9e'), side: THREE.DoubleSide })
    );
    wellSign.position.set(0, 2, 6.2);
    wellGroup.add(wellSign);

    // --- RAM LEELA STAGE ---
    const stageGroup = new THREE.Group();
    stageGroup.position.set(-27, 0, -43);
    stageGroup.rotation.y = 0.45;
    scene.add(stageGroup);

    // Stage podium
    const stagePodium = new THREE.Mesh(
      new THREE.BoxGeometry(14, 1.4, 9),
      new THREE.MeshStandardMaterial({ color: '#6e2b20', roughness: 0.7 })
    );
    stagePodium.position.set(0, 0.7, 0);
    stageGroup.add(stagePodium);

    // Stage backdrop screen
    const stageBackdrop = new THREE.Mesh(
      new THREE.BoxGeometry(13, 7, 0.3),
      new THREE.MeshStandardMaterial({ color: '#162238' })
    );
    stageBackdrop.position.set(0, 4.8, -4);
    stageGroup.add(stageBackdrop);

    // Stage Name Banner
    const stageSign = new THREE.Mesh(
      new THREE.PlaneGeometry(11, 1.3),
      new THREE.MeshBasicMaterial({ map: createSignTexture('RAM LEELA • राम लीला 🏹', '#821a1a', '#ffe496'), side: THREE.DoubleSide })
    );
    stageSign.position.set(0, 8.4, 0.4);
    stageGroup.add(stageSign);

    // Audience benches
    for (let row = 0; row < 3; row++) {
      for (let seat = -4; seat <= 4; seat += 2) {
        const bench = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 0.5, 0.7),
          new THREE.MeshStandardMaterial({ color: '#573d28' })
        );
        bench.position.set(seat, 0.25, 7 + row * 1.8);
        stageGroup.add(bench);
      }
    }

    // --- RAVANA DAHAN FINALE GROUNDS & EFFIGY ---
    const ravanaGroup = new THREE.Group();
    ravanaGroup.position.set(2, 0, -60);
    scene.add(ravanaGroup);

    // Effigy base plinth
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(9, 1.2, 7),
      new THREE.MeshStandardMaterial({ color: '#4a3224' })
    );
    plinth.position.y = 0.6;
    ravanaGroup.add(plinth);

    // Effigy Robe / Body
    const ravanaBody = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 11, 10),
      new THREE.MeshStandardMaterial({ color: '#1e488f', roughness: 0.6 })
    );
    ravanaBody.position.y = 6.8;
    ravanaGroup.add(ravanaBody);

    // Chest armor / Ornaments
    const ravanaChest = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 4.2, 1.8),
      new THREE.MeshStandardMaterial({ color: '#c72e2e', roughness: 0.5 })
    );
    ravanaChest.position.set(0, 9.5, 0);
    ravanaGroup.add(ravanaChest);

    // Central Head (Dashanana)
    const centerHead = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 12, 12),
      new THREE.MeshStandardMaterial({ color: '#d98b2b' })
    );
    centerHead.position.set(0, 12.5, 0.2);
    ravanaGroup.add(centerHead);

    // 9 Side Heads (Total 10 heads)
    for (let h = -4; h <= 4; h++) {
      if (h === 0) continue;
      const sideHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 8, 8),
        new THREE.MeshStandardMaterial({ color: '#d98b2b' })
      );
      sideHead.position.set(h * 0.95, 12.3 - Math.abs(h) * 0.15, 0.1);
      ravanaGroup.add(sideHead);
    }

    // Grand Golden Crown (Mukut)
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(2.4, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: '#ffb703', metalness: 0.6, roughness: 0.3 })
    );
    crown.position.set(0, 14.8, 0.2);
    ravanaGroup.add(crown);

    // Sword in hand
    const sword = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 7.5, 0.1),
      new THREE.MeshStandardMaterial({ color: '#d4d4d4', metalness: 0.9, roughness: 0.2 })
    );
    sword.position.set(3.8, 9, 1.2);
    sword.rotation.z = -0.4;
    ravanaGroup.add(sword);

    // Bow in other hand
    const bow = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.12, 6, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: '#c48927' })
    );
    bow.position.set(-3.8, 9.5, 1.2);
    bow.rotation.z = Math.PI / 2;
    ravanaGroup.add(bow);

    // Ravana Dahan Sign
    const dahanSign = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 1.4),
      new THREE.MeshBasicMaterial({ map: createSignTexture('RAVANA DAHAN GROUND • रावण दहन', '#731414', '#ffe596'), side: THREE.DoubleSide })
    );
    dahanSign.position.set(0, 2.0, 4.2);
    ravanaGroup.add(dahanSign);

    // --- DYNAMIC PARTICLES (FIREWORKS & GLOWING EMBERS) ---
    const emberCount = 180;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount * 3; i += 3) {
      emberPos[i] = (Math.random() - 0.5) * 80;
      emberPos[i + 1] = Math.random() * 25 + 1;
      emberPos[i + 2] = (Math.random() - 0.5) * 110;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: '#ffb347',
      size: 0.28,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    scene.add(embers);

    // --- ANIMATION & PLAYER STATE ---
    let yaw = 0;
    let pitch = 0;
    let wheelAngle = 0;
    let stuntBikeAngle = 0;
    let rideElapsed = 0;
    const rideDuration = 22; // 22 seconds full panoramic ride
    let animationFrameId: number;

    // Movement speeds
    const baseSpeed = 0.17;
    const runMultiplier = 1.6;

    // Collision boundary: bounds within mela
    const minX = -38;
    const maxX = 38;
    const minZ = -75;
    const maxZ = 48;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // 1. Rotate Giant Wheel & keep gondolas hanging down
      wheelAngle += 0.006;
      rotatingWheel.rotation.z = wheelAngle;
      gondolas.forEach((g) => {
        g.rotation.z = -wheelAngle;
      });

      // 2. Rotate Maut ka Kuan Stunt Bike
      stuntBikeAngle += 0.055;
      bikeMesh.position.x = Math.cos(stuntBikeAngle) * 4.6;
      bikeMesh.position.z = Math.sin(stuntBikeAngle) * 4.6;
      bikeMesh.rotation.y = -stuntBikeAngle + Math.PI / 2;

      // 3. Gentle float for ember sparks
      const posArray = emberGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < emberCount * 3; i += 3) {
        posArray[i] += 0.04;
        if (posArray[i] > 30) {
          posArray[i] = 1;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;

      // 4. Handle Camera & Modes
      if (mode === 'ride') {
        // Ride mode: Camera locked to top gondola for 360 degree fair view
        rideElapsed += 0.016;
        const currentProgress = Math.min(100, Math.floor((rideElapsed / rideDuration) * 100));
        if (onRideProgress) onRideProgress(currentProgress);

        const currentAngle = wheelAngle + Math.PI / 2;
        const gx = 28 + Math.cos(currentAngle) * (wheelRadius + 0.5);
        const gy = 13 + Math.sin(currentAngle) * (wheelRadius + 0.5);
        camera.position.set(gx, gy + 0.2, -29);
        // Slowly look around the entire mela
        camera.lookAt(gx - Math.sin(wheelAngle * 1.5) * 40, gy - 6, -29 + Math.cos(wheelAngle * 1.5) * 40);
      } else if (mode === 'finale') {
        // Ravana Dahan cinematic view: Looking straight up at the towering 10-headed Ravana
        camera.position.set(2, 4.5, -44);
        camera.lookAt(2, 11, -60);
      } else if (mode === 'stage') {
        // Ram Leela stage view: Sitting in front row
        camera.position.set(-27, 2.2, -36);
        camera.lookAt(-27, 4.5, -43);
      } else if (mode === 'well') {
        // Maut ka kuan balcony view: Looking down into the stunt well
        camera.position.set(-23, 8.2, -20);
        camera.lookAt(-23, 4.5, -27);
      } else {
        // Standard walk mode
        if (!activeModal) {
          // Process keyboard movement
          const keys = keysRef.current;
          let moveForward = 0;
          let moveRight = 0;

          if (keys.has('KeyW') || keys.has('ArrowUp')) moveForward += 1;
          if (keys.has('KeyS') || keys.has('ArrowDown')) moveForward -= 1;
          if (keys.has('KeyA') || keys.has('ArrowLeft')) moveRight -= 1;
          if (keys.has('KeyD') || keys.has('ArrowRight')) moveRight += 1;

          // Process virtual joystick movement
          if (joystickVector.y !== 0) moveForward -= joystickVector.y;
          if (joystickVector.x !== 0) moveRight += joystickVector.x;

          const speed = (isRunning ? baseSpeed * runMultiplier : baseSpeed);

          // Apply orientation
          if (moveForward !== 0 || moveRight !== 0) {
            const forwardX = -Math.sin(yaw);
            const forwardZ = -Math.cos(yaw);
            const rightX = Math.cos(yaw);
            const rightZ = -Math.sin(yaw);

            let dx = (forwardX * moveForward + rightX * moveRight) * speed;
            let dz = (forwardZ * moveForward + rightZ * moveRight) * speed;

            // Constrain within bounds
            const newX = Math.max(minX, Math.min(maxX, camera.position.x + dx));
            const newZ = Math.max(minZ, Math.min(maxZ, camera.position.z + dz));

            camera.position.x = newX;
            camera.position.z = newZ;
            camera.position.y = 2.5; // eye height
          }
        }

        // Camera rotation from yaw/pitch
        const lookDir = new THREE.Vector3(
          -Math.sin(yaw) * Math.cos(pitch),
          Math.sin(pitch),
          -Math.cos(yaw) * Math.cos(pitch)
        );
        camera.lookAt(camera.position.clone().add(lookDir));

        // Proximity hotspot check
        let nearest: Hotspot | null = null;
        let minDist = Infinity;
        for (const spot of hotspotsRef.current) {
          const dist = Math.hypot(camera.position.x - spot.x, camera.position.z - spot.z);
          if (dist <= spot.radius && dist < minDist) {
            minDist = dist;
            nearest = spot;
          }
        }
        onHotspotChange(nearest);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // --- Input Listeners ---
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Don't drag look if clicking on UI
      if (activeModal) return;
      mouseStateRef.current.isDown = true;
      mouseStateRef.current.lastX = e.clientX;
      mouseStateRef.current.lastY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseStateRef.current.isDown || activeModal) return;
      const deltaX = e.clientX - mouseStateRef.current.lastX;
      const deltaY = e.clientY - mouseStateRef.current.lastY;
      mouseStateRef.current.lastX = e.clientX;
      mouseStateRef.current.lastY = e.clientY;

      yaw += deltaX * 0.0032;
      pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch - deltaY * 0.0032));
    };

    const handleMouseUp = () => {
      mouseStateRef.current.isDown = false;
    };

    // Touch look drag for mobile right-hand side
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isTouchingLook = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (activeModal) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientX > window.innerWidth / 2) {
          lastTouchX = touch.clientX;
          lastTouchY = touch.clientY;
          isTouchingLook = true;
          break;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchingLook || activeModal) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientX > window.innerWidth / 3) {
          const deltaX = touch.clientX - lastTouchX;
          const deltaY = touch.clientY - lastTouchY;
          lastTouchX = touch.clientX;
          lastTouchY = touch.clientY;

          yaw += deltaX * 0.004;
          pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch - deltaY * 0.004));
          break;
        }
      }
    };

    const handleTouchEnd = () => {
      isTouchingLook = false;
    };

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, activeModal]);

  return <div ref={mountRef} className="world-canvas absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />;
};
