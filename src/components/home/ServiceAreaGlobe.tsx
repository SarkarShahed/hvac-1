import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  MapPin,
  Navigation,
  Sparkles,
  RotateCw,
  Zap,
  PhoneCall,
  Calendar,
  X,
  Minus,
  Maximize2,
  ChevronDown,
  ChevronUp,
  GripHorizontal,
  RotateCcw,
  ShieldCheck,
  Radio,
  Search,
  Globe2,
  Map,
  Clock,
  Thermometer,
  Users,
  Plus,
  Check,
  Filter,
  Locate,
} from 'lucide-react';
import { ALL_50_STATES, StateServiceArea } from '../../data/serviceStates';
export type { StateServiceArea };
export const SERVICE_STATES = ALL_50_STATES;

// Helper: Convert Lat/Lng to 3D Cartesian Vector on Sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Procedural Continental Landmass Mask
function isLandMass(lat: number, lng: number): boolean {
  // North America (High detail density)
  if (lat >= 15 && lat <= 72 && lng >= -168 && lng <= -52) {
    if (lat > 50 && lng < -130 && lng > -170) return true; // Alaska / Canada
    if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) return true; // Continental USA
    if (lat >= 14 && lat <= 32 && lng >= -118 && lng <= -86) return true; // Mexico
    if (lat > 60 && lng >= -75 && lng <= -12) return true; // Greenland
  }
  // South America
  if (lat >= -56 && lat <= 13 && lng >= -82 && lng <= -34) {
    if (lat < -40 && lng > -65) return true;
    if (lat >= -40 && lat <= 10 && lng >= -80 && lng <= -35) return true;
  }
  // Europe
  if (lat >= 35 && lat <= 71 && lng >= -10 && lng <= 45) {
    if (lat >= 36 && lat <= 44 && lng >= -10 && lng <= 28) return true;
    if (lat >= 44 && lat <= 60 && lng >= -5 && lng <= 35) return true;
    if (lat >= 55 && lat <= 71 && lng >= 4 && lng <= 32) return true;
    if (lat >= 50 && lat <= 60 && lng >= -11 && lng <= 2) return true;
  }
  // Africa
  if (lat >= -35 && lat <= 38 && lng >= -18 && lng <= 52) {
    if (lat >= 15 && lat <= 37 && lng >= -17 && lng <= 40) return true;
    if (lat >= -10 && lat < 15 && lng >= -15 && lng <= 45) return true;
    if (lat >= -35 && lat < -10 && lng >= 12 && lng <= 40) return true;
  }
  // Asia & Oceania
  if (lat >= 1 && lat <= 78 && lng >= 26 && lng <= 180) {
    if (lat >= 12 && lat <= 35 && lng >= 34 && lng <= 60) return true;
    if (lat >= 6 && lat <= 36 && lng >= 68 && lng <= 90) return true;
    if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) return true;
    if (lat >= 50 && lat <= 78 && lng >= 35 && lng <= 175) return true;
    if (lat >= -11 && lat <= 20 && lng >= 95 && lng <= 142) return true;
    if (lat >= 30 && lat <= 46 && lng >= 128 && lng <= 146) return true;
  }
  if (lat >= -45 && lat <= -10 && lng >= 112 && lng <= 155) {
    return true; // Australia
  }
  return false;
}

export const ServiceAreaGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [selectedState, setSelectedState] = useState<StateServiceArea | null>(SERVICE_STATES[2]); // Default Arizona HQ
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [activeTab, setActiveTab] = useState<'3d' | 'grid'>('3d');
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingCard, setIsDraggingCard] = useState(false);

  // Dropdown states for remaining 41 states / full catalog
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Globe parameters & refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const initialPositionsRef = useRef<Float32Array | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const hotspotsGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);

  // Drag rotation state for 3D Globe
  const dragRef = useRef({
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    targetRotationX: 0.45,
    targetRotationY: 1.85,
    currentRotationX: 0.45,
    currentRotationY: 1.85,
  });

  // Drag state for floating card
  const dragCardStateRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  // Smoothly rotate globe to face a specific state's lat/lng
  const focusState = useCallback((item: StateServiceArea) => {
    setSelectedState(item);
    setIsAutoRotate(false);

    // Convert lat/lng to required globe rotation
    const phi = (item.lat * Math.PI) / 180;
    const theta = ((item.lng + 90) * Math.PI) / 180;

    dragRef.current.targetRotationX = phi * 0.72;
    dragRef.current.targetRotationY = -theta;
  }, []);

  // Card pointer drag handlers
  const handleCardDragStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    const cardEl = cardRef.current;
    const secEl = sectionRef.current;
    if (!cardEl || !secEl) return;

    const cardRect = cardEl.getBoundingClientRect();
    const secRect = secEl.getBoundingClientRect();

    const currentX = cardPos !== null ? cardPos.x : cardRect.left - secRect.left;
    const currentY = cardPos !== null ? cardPos.y : cardRect.top - secRect.top;

    dragCardStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentX,
      origY: currentY,
    };
    setIsDraggingCard(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleCardDragMove = (e: React.PointerEvent) => {
    if (!dragCardStateRef.current.isDragging) return;
    e.stopPropagation();
    const deltaX = e.clientX - dragCardStateRef.current.startX;
    const deltaY = e.clientY - dragCardStateRef.current.startY;

    const secEl = sectionRef.current;
    const cardEl = cardRef.current;
    if (!secEl || !cardEl) return;

    const secRect = secEl.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();

    const maxX = Math.max(0, secRect.width - cardRect.width - 12);
    const maxY = Math.max(0, secRect.height - cardRect.height - 12);

    const targetX = Math.max(12, Math.min(maxX, dragCardStateRef.current.origX + deltaX));
    const targetY = Math.max(65, Math.min(maxY, dragCardStateRef.current.origY + deltaY));

    setCardPos({ x: targetX, y: targetY });
  };

  const handleCardDragEnd = (e: React.PointerEvent) => {
    if (dragCardStateRef.current.isDragging) {
      dragCardStateRef.current.isDragging = false;
      setIsDraggingCard(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const resetCardPosition = () => {
    setCardPos(null);
  };

  // Filtered states for search
  const filteredStates = SERVICE_STATES.filter(
    (s) =>
      s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Main Three.js Initialization and Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 320;
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'default',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const GLOBE_RADIUS = 110;

    // 4. Generate Procedural Continental Particle Point Cloud
    const TOTAL_SAMPLES = isMobile ? 10000 : 18000;
    const landPositions: number[] = [];
    const scatteredPositions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const brandMain = new THREE.Color('#FFFFFF');
    const brandSecondary = new THREE.Color('#ECEDEF');
    const brandAccent = new THREE.Color('#ECEDEF');

    for (let i = 0; i < TOTAL_SAMPLES; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / TOTAL_SAMPLES);

      const lat = 90 - (phi * 180) / Math.PI;
      const lng = ((theta * 180) / Math.PI) % 360 - 180;

      const isLand = isLandMass(lat, lng);
      // Extra particle density over USA
      const isUSA = lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66;
      const isAlaska = lat >= 54 && lat <= 71 && lng >= -170 && lng <= -130;

      if (isLand || isUSA || isAlaska || Math.random() < 0.04) {
        const pos = latLngToVector3(lat, lng, GLOBE_RADIUS);
        landPositions.push(pos.x, pos.y, pos.z);

        // Scattered initial starfield position for assembly
        const scatterRadius = GLOBE_RADIUS * (2.2 + Math.random() * 3.5);
        const randTheta = Math.random() * 2.0 * Math.PI;
        const randPhi = Math.acos(2.0 * Math.random() - 1.0);
        const sx = scatterRadius * Math.sin(randPhi) * Math.cos(randTheta);
        const sy = scatterRadius * Math.sin(randPhi) * Math.sin(randTheta);
        const sz = scatterRadius * Math.cos(randPhi);
        scatteredPositions.push(sx, sy, sz);

        // Color coding for active service coverage zones (10 states)
        const isNearServiceHub = SERVICE_STATES.some((hub) => {
          const dLat = Math.abs(hub.lat - lat);
          const dLng = Math.abs(hub.lng - lng);
          return dLat < 3.5 && dLng < 4.5;
        });

        if (isNearServiceHub) {
          colors.push(brandAccent.r, brandAccent.g, brandAccent.b);
          sizes.push(3.2 + Math.random() * 1.5);
        } else if (isUSA || isAlaska) {
          colors.push(brandMain.r, brandMain.g, brandMain.b);
          sizes.push(2.2 + Math.random() * 1.0);
        } else if (isLand) {
          const mixedColor = Math.random() > 0.45 ? brandMain : brandSecondary;
          colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
          sizes.push(1.6 + Math.random() * 1.0);
        } else {
          // Ocean particles
          colors.push(0.2, 0.25, 0.35);
          sizes.push(0.9);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    const currentPosArray = new Float32Array(scatteredPositions);
    const targetPosArray = new Float32Array(landPositions);
    initialPositionsRef.current = new Float32Array(scatteredPositions);
    targetPositionsRef.current = targetPosArray;

    geometry.setAttribute('position', new THREE.BufferAttribute(currentPosArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(new Float32Array(sizes), 1));

    // Canvas circular point texture
    const canvasPoint = document.createElement('canvas');
    canvasPoint.width = 32;
    canvasPoint.height = 32;
    const ctx = canvasPoint.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(0.7, 'rgba(255,255,255,0.3)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const pointTexture = new THREE.CanvasTexture(canvasPoint);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2.6,
      map: pointTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particlesMaterial);
    globeGroup.add(particles);
    particlesRef.current = particles;

    // 5. Dark Inner Shell Sphere
    const innerSphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 1.5, 48, 48);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#121417'),
      transparent: true,
      opacity: 0.95,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    globeGroup.add(innerSphere);

    // 6. Glowing Atmospheric Outer Halo
    const atmosphereGeo = new THREE.RingGeometry(GLOBE_RADIUS * 1.01, GLOBE_RADIUS * 1.15, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ECEDEF'),
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphere.rotation.x = Math.PI / 2;
    globeGroup.add(atmosphere);

    // 7. Pulse Beacons Group for ALL 10 STATES
    const hotspotsGroup = new THREE.Group();
    globeGroup.add(hotspotsGroup);
    hotspotsGroupRef.current = hotspotsGroup;

    SERVICE_STATES.forEach((hub) => {
      const pos = latLngToVector3(hub.lat, hub.lng, GLOBE_RADIUS + 1.2);
      const hubMarker = new THREE.Group();
      hubMarker.position.copy(pos);
      hubMarker.lookAt(0, 0, 0);

      // Outer Pulse Ring
      const ringGeo = new THREE.RingGeometry(2.0, 3.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ECEDEF'),
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      hubMarker.add(ring);

      // Center Core Dot
      const dotGeo = new THREE.CircleGeometry(1.6, 24);
      const dotMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#FFFFFF'),
        side: THREE.DoubleSide,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.z = 0.1;
      hubMarker.add(dot);

      // Vertical Beacon Beam
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#ECEDEF'),
        transparent: true,
        opacity: 0.8,
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -14),
      ]);
      const beam = new THREE.Line(lineGeo, lineMat);
      hubMarker.add(beam);

      // 3D Floating Canvas Label Sprite for State Name onto the 3D Map
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 512;
      labelCanvas.height = 128;
      const labelCtx = labelCanvas.getContext('2d');
      if (labelCtx) {
        const r = 20;
        const w = 496;
        const h = 112;
        const x = 8;
        const y = 8;

        // Dark Glass Badge Background
        labelCtx.fillStyle = 'rgba(18, 20, 23, 0.94)';
        labelCtx.strokeStyle = 'rgba(236, 237, 239, 0.95)';
        labelCtx.lineWidth = 5;
        labelCtx.beginPath();
        if (labelCtx.roundRect) {
          labelCtx.roundRect(x, y, w, h, r);
        } else {
          labelCtx.moveTo(x + r, y);
          labelCtx.lineTo(x + w - r, y);
          labelCtx.quadraticCurveTo(x + w, y, x + w, y + r);
          labelCtx.lineTo(x + w, y + h - r);
          labelCtx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          labelCtx.lineTo(x + r, y + h);
          labelCtx.quadraticCurveTo(x, y + h, x, y + h - r);
          labelCtx.lineTo(x, y + r);
          labelCtx.quadraticCurveTo(x, y, x + r, y);
          labelCtx.closePath();
        }
        labelCtx.fill();
        labelCtx.stroke();

        // State Code Badge Pill Box
        labelCtx.fillStyle = '#ECEDEF';
        const bx = 20;
        const by = 20;
        const bw = 96;
        const bh = 88;
        const br = 14;
        labelCtx.beginPath();
        if (labelCtx.roundRect) {
          labelCtx.roundRect(bx, by, bw, bh, br);
        } else {
          labelCtx.rect(bx, by, bw, bh);
        }
        labelCtx.fill();

        // State Code Text inside Gray Box
        labelCtx.fillStyle = '#121417';
        labelCtx.font = 'bold 42px system-ui, -apple-system, sans-serif';
        labelCtx.textAlign = 'center';
        labelCtx.textBaseline = 'middle';
        labelCtx.fillText(hub.code, bx + bw / 2, by + bh / 2);

        // State Name Text beside Code Box
        labelCtx.fillStyle = '#FFFFFF';
        labelCtx.font = 'bold 36px system-ui, -apple-system, sans-serif';
        labelCtx.textAlign = 'left';
        labelCtx.textBaseline = 'middle';
        labelCtx.fillText(hub.state, 136, 64);
      }

      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      labelTexture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true,
        opacity: 0.98,
        depthTest: false,
      });
      const labelSprite = new THREE.Sprite(spriteMat);
      // Floating above top of 14-unit beacon beam (-16 along local Z out from globe center)
      labelSprite.position.set(0, 0, -16);
      labelSprite.scale.set(22, 5.5, 1);
      labelSprite.renderOrder = 999;
      hubMarker.add(labelSprite);

      hubMarker.userData = { hub };
      hotspotsGroup.add(hubMarker);
    });

    // 8. Flight Paths Arcs from Arizona HQ to all other 9 States
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    const hqHub = SERVICE_STATES.find((s) => s.id === 'arizona') || SERVICE_STATES[0];
    const hqPos = latLngToVector3(hqHub.lat, hqHub.lng, GLOBE_RADIUS);

    SERVICE_STATES.filter((s) => s.id !== 'arizona').forEach((destHub) => {
      const destPos = latLngToVector3(destHub.lat, destHub.lng, GLOBE_RADIUS);

      const midPoint = hqPos
        .clone()
        .add(destPos)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(GLOBE_RADIUS * 1.15);

      const curve = new THREE.QuadraticBezierCurve3(hqPos, midPoint, destPos);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#ECEDEF'),
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(arcLine);
    });

    // 9. Particle Assembly Animation Loop
    let assembleProgress = 0;
    const assembleSpeed = 0.024;
    let animationFrameId: number | null = null;
    let isVisibleOnScreen = true;
    let clock = new THREE.Clock();

    const animate = () => {
      if (!isVisibleOnScreen || document.hidden) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Assemble interpolation
      if (assembleProgress < 1.0) {
        assembleProgress = Math.min(1.0, assembleProgress + assembleSpeed);
        const ease = 1 - Math.pow(1 - assembleProgress, 3);

        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const currentArr = posAttr.array as Float32Array;
        const initArr = initialPositionsRef.current!;
        const targetArr = targetPositionsRef.current!;

        for (let i = 0; i < currentArr.length; i++) {
          currentArr[i] = initArr[i] + (targetArr[i] - initArr[i]) * ease;
        }
        posAttr.needsUpdate = true;
      }

      // Auto rotation
      if (isAutoRotate && !dragRef.current.isDragging) {
        dragRef.current.targetRotationY += 0.0016;
      }

      // Smooth drag inertia & interpolation
      dragRef.current.currentRotationX +=
        (dragRef.current.targetRotationX - dragRef.current.currentRotationX) * 0.08;
      dragRef.current.currentRotationY +=
        (dragRef.current.targetRotationY - dragRef.current.currentRotationY) * 0.08;

      dragRef.current.targetRotationX = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, dragRef.current.targetRotationX)
      );

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = dragRef.current.currentRotationX;
        globeGroupRef.current.rotation.y = dragRef.current.currentRotationY;
      }

      // Pulse beacon animations & front-face visibility for state labels
      if (hotspotsGroupRef.current) {
        const tempWorldPos = new THREE.Vector3();
        hotspotsGroupRef.current.children.forEach((marker, idx) => {
          // Pulse outer ring (first child of marker) without distorting label text
          const ringMesh = marker.children[0];
          if (ringMesh) {
            const scale = 1 + Math.sin(elapsedTime * 4 + idx * 1.2) * 0.35;
            ringMesh.scale.set(scale, scale, 1);
          }

          // Back-face culling: hide markers on the back hemisphere of the globe
          marker.getWorldPosition(tempWorldPos);
          marker.visible = tempWorldPos.z > -15;
        });
      }

      renderer.render(scene, camera);
    };

    const startAnimate = () => {
      if (animationFrameId === null) {
        clock.start();
        animate();
      }
    };

    const stopAnimate = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Intersection Observer: Only render when visible in viewport
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting;
        if (entry.isIntersecting) {
          startAnimate();
        } else {
          stopAnimate();
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Visibility change handler (tab switch / background)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimate();
      } else if (isVisibleOnScreen) {
        startAnimate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimate();

    // 10. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initial position trigger to face Arizona HQ
    focusState(SERVICE_STATES[2]);

    return () => {
      stopAnimate();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particlesMaterial.dispose();
      pointTexture.dispose();
      renderer.dispose();
    };
  }, [focusState]);

  // Pointer & Drag Handlers for Smooth Orbit Control
  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.prevMouseX = e.clientX;
    dragRef.current.prevMouseY = e.clientY;
    setIsAutoRotate(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const deltaX = e.clientX - dragRef.current.prevMouseX;
    const deltaY = e.clientY - dragRef.current.prevMouseY;

    dragRef.current.targetRotationY += deltaX * 0.006;
    dragRef.current.targetRotationX += deltaY * 0.006;

    dragRef.current.prevMouseX = e.clientX;
    dragRef.current.prevMouseY = e.clientY;
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  // Reassemble particles trigger
  const reassembleParticles = () => {
    if (!particlesRef.current || !initialPositionsRef.current) return;
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const currentArr = posAttr.array as Float32Array;
    const initArr = initialPositionsRef.current;

    for (let i = 0; i < currentArr.length; i++) {
      currentArr[i] = initArr[i];
    }
    posAttr.needsUpdate = true;
  };

  return (
    <section
      id="service-area"
      ref={sectionRef}
      className="relative w-full max-w-[100vw] h-screen max-h-[100vh] min-h-[640px] bg-[#121417] text-white overflow-hidden select-none flex flex-col justify-between"
    >
      {/* 3D WebGL Three.js Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0 touch-none ${
          activeTab === '3d' ? 'block' : 'hidden'
        }`}
        aria-label="Interactive 3D Service Area Particle Globe with 50 US States"
      />

      {/* Top Header Overlay: 60px UPPERCASE Font Title + Search & Filter */}
      <div className="relative z-10 w-full px-4 sm:px-8 pt-6 md:pt-8 flex flex-col items-start pointer-events-none">
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2.5 px-3 py-1 bg-white/10 border border-white/15 backdrop-blur-xs text-white text-xs font-['Delight'] font-bold tracking-widest uppercase mb-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>50-State Nationwide Coverage Network</span>
            </div>

            {/* Heading: "Service Area" 60px font size capitalized */}
            <h2 className="font-['Nohemi'] font-bold text-3xl sm:text-5xl lg:text-[60px] capitalize text-white leading-none tracking-tight drop-shadow-md text-left">
              Service Area
            </h2>
          </div>

          {/* View Toggle Switcher (3D Globe vs 50-State Grid View) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121417]/85 border border-white/15 backdrop-blur-md pointer-events-auto">
            <button
              type="button"
              onClick={() => setActiveTab('3d')}
              className={`h-[32px] px-3 flex items-center gap-1.5 text-xs font-['Delight'] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === '3d'
                  ? 'bg-[#ECEDEF] text-[#121417] font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('grid')}
              className={`h-[32px] px-3 flex items-center gap-1.5 text-xs font-['Delight'] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'grid'
                  ? 'bg-[#ECEDEF] text-[#121417] font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>State Grid ({SERVICE_STATES.length})</span>
            </button>
          </div>
        </div>

        <p className="font-['Delight'] font-normal text-xs sm:text-sm text-white/70 max-w-xl text-left mt-2 pointer-events-auto">
          Explore all 50 US States on the 3D WebGL particle globe. Click any state pill or the + dropdown to orbit directly to that hub and inspect local dispatch specifications.
        </p>
      </div>

      {/* Grid View Alternate Overlay (When user switches to State Grid) */}
      {activeTab === 'grid' && (
        <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-4 overflow-y-auto pointer-events-auto">
          {/* Grid Search & Filter Header */}
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#121417]/80 p-3 border border-white/15 backdrop-blur-md">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter 50 states or cities..."
                className="w-full h-8 pl-9 pr-8 bg-white/5 border border-white/15 text-white text-xs font-['Delight'] placeholder:text-white/40 focus:outline-none focus:border-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="text-xs font-['Delight'] text-white/70">
              Showing <span className="text-white font-bold">{filteredStates.length}</span> of {SERVICE_STATES.length} US State Operations
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pb-8">
            {filteredStates.map((st) => {
              const isSelected = selectedState?.id === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    focusState(st);
                    setActiveTab('3d');
                  }}
                  className={`p-3.5 border transition-all cursor-pointer text-left group ${
                    isSelected
                      ? 'bg-white/10 border-white shadow-lg shadow-white/5'
                      : 'bg-[#121417]/85 hover:bg-white/10 border-white/15 backdrop-blur-md'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-['Nohemi'] font-bold text-sm text-white group-hover:text-zinc-300 transition-colors">
                      {st.state}
                    </span>
                    <span className="px-1.5 py-0.5 bg-white/10 text-[10px] font-['Delight'] font-bold text-zinc-300">
                      {st.code}
                    </span>
                  </div>
                  <p className="text-[11px] font-['Delight'] text-white/60 mt-1.5 line-clamp-2">
                    {st.cities}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-['Delight'] text-white/80">
                    <span className="text-white font-bold">{st.dispatchTime}</span>
                    <span>{st.technicians} Techs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Floating State Selector Chips & HUD Controls */}
      <div className="relative z-10 w-full px-4 sm:px-8 pb-5 md:pb-6 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 pointer-events-none">
        {/* Left Side: Floating Pill Navigation Bar (5 Primary States + Dropdown for All 50 States) */}
        <div className="w-full lg:max-w-4xl pointer-events-auto">
          <div className="inline-flex flex-wrap items-center gap-1.5 p-0 bg-[#121417]/90 border-none rounded-full shadow-2xl backdrop-blur-xl transition-all">
            {/* First 5 States */}
            {SERVICE_STATES.slice(0, 5).map((hub, idx) => {
              const isSelected = selectedState?.id === hub.id;
              const isSecondButton = idx === 1;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => focusState(hub)}
                  className={`h-[25px] flex items-center gap-1.5 px-3 sm:px-4 rounded-full text-xs font-['Delight'] uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                    isSecondButton ? 'border-none border-0' : ''
                  } ${
                    isSelected
                      ? 'bg-[#ECEDEF] text-[#121417] font-bold shadow-lg shadow-white/5 ring-1 ring-white/30 scale-102'
                      : 'bg-white/5 hover:bg-white/15 text-white/90 border border-transparent hover:border-white/15'
                  }`}
                >
                  <Locate
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-[#121417]' : 'text-white/60'
                    }`}
                  />
                  {hub.state}
                </button>
              );
            })}

            {/* 6th Element: Dropdown Selector for All Remaining 45 States & Full Catalog */}
            <div className="relative">
              {(() => {
                const isSelectedOutsideFirst5 =
                  selectedState &&
                  !SERVICE_STATES.slice(0, 5).some((s) => s.id === selectedState.id);

                return (
                  <button
                    ref={dropdownButtonRef}
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`h-[25px] flex items-center gap-2 px-3.5 sm:px-4 rounded-full text-xs font-['Delight'] uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                      isDropdownOpen || isSelectedOutsideFirst5
                        ? 'bg-[#ECEDEF] text-[#121417] font-bold shadow-lg shadow-white/5 ring-1 ring-white/30 scale-102'
                        : 'bg-white/10 hover:bg-[#ECEDEF] hover:text-[#121417] text-white/90 border border-white/20'
                    }`}
                    title="Explore All 50 US States"
                    aria-expanded={isDropdownOpen}
                  >
                    <Plus
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-45 text-[#121417]' : 'text-white/60'
                      }`}
                    />
                    <span className="whitespace-nowrap font-medium">
                      {isSelectedOutsideFirst5 && selectedState
                        ? `${selectedState.code} · ${selectedState.state}`
                        : `+ More States (${SERVICE_STATES.length - 5})`}
                    </span>
                    {isDropdownOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                    )}
                  </button>
                );
              })()}

              {/* Dropdown Menu Overlay */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute bottom-full mb-3 left-0 sm:left-auto md:left-0 z-40 w-[94vw] sm:w-[480px] md:w-[540px] max-w-[95vw] bg-[#121417]/98 border border-white/20 rounded-2xl backdrop-blur-xl shadow-2xl p-3.5 sm:p-4 text-left pointer-events-auto"
                >
                {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 border border-white/20 text-white">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-['Nohemi'] font-bold text-sm text-white uppercase tracking-wider">
                        All 50 US States Operations
                      </h4>
                      <p className="font-['Delight'] text-[11px] text-white/60">
                        Select any state to focus 3D globe & dispatch hub
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-7 h-7 bg-white/10 hover:bg-[#ECEDEF] text-white/70 hover:text-[#121417] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close Dropdown"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search & Region Filter Bar */}
                <div className="py-2.5 space-y-2 border-b border-white/10">
                  {/* Search Input */}
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
                    <input
                      type="text"
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      placeholder="Search 50 states, codes (TX, GA, WA, IL), or cities..."
                      className="w-full h-8 pl-8 pr-7 bg-white/5 border border-white/15 text-white text-xs font-['Delight'] placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
                      autoFocus
                    />
                    {dropdownSearch && (
                      <button
                        type="button"
                        onClick={() => setDropdownSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Region Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1">
                    {['All', 'South', 'West', 'Midwest', 'Northeast', 'Non-Contiguous'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-0.5 text-[10px] font-['Delight'] uppercase tracking-wider transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#ECEDEF] text-[#121417] font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                        }`}
                      >
                        {cat === 'Non-Contiguous' ? 'Arctic / Island' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scrollable State List Grid */}
                <div className="max-h-[240px] sm:max-h-[270px] overflow-y-auto pt-2 pr-1 space-y-1">
                  {(() => {
                    const list = SERVICE_STATES.filter((s) => {
                      const matchesCategory =
                        selectedCategory === 'All' || s.category === selectedCategory;
                      const matchesSearch =
                        !dropdownSearch.trim() ||
                        s.state.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
                        s.code.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
                        s.cities.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
                        s.specialty.toLowerCase().includes(dropdownSearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    });

                    if (list.length === 0) {
                      return (
                        <div className="py-8 text-center text-white/50 text-xs font-['Delight']">
                          No states found matching "{dropdownSearch}"
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {list.map((item) => {
                          const isItemActive = selectedState?.id === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                focusState(item);
                                setIsDropdownOpen(false);
                              }}
                              className={`p-2 flex items-center justify-between gap-1.5 border text-left transition-all cursor-pointer group ${
                                isItemActive
                                  ? 'bg-white/10 border-white text-white font-bold'
                                  : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/90'
                              }`}
                            >
                              <div className="min-w-0 flex items-center gap-1.5">
                                <span
                                  className={`px-1 py-0.5 text-[9px] font-['Delight'] font-bold ${
                                    isItemActive
                                      ? 'bg-[#ECEDEF] text-[#121417]'
                                      : 'bg-white/10 text-white/70 group-hover:bg-white group-hover:text-[#121417]'
                                  }`}
                                >
                                  {item.code}
                                </span>
                                <span className="text-[11px] font-['Nohemi'] truncate group-hover:text-zinc-300 transition-colors">
                                  {item.state}
                                </span>
                              </div>
                              {isItemActive && (
                                <Check className="w-3 h-3 text-white shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Dropdown Footer Strip */}
                <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-['Delight'] text-white/60">
                  <span>50 States Active Network</span>
                  <span className="text-white font-medium">24/7 Priority Emergency Fleet</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Right Side: Interactive 3D Globe HUD Controls */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#121417]/80 backdrop-blur-md p-1.5 border border-white/15 shrink-0">
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`h-[30px] px-2.5 flex items-center gap-1.5 text-xs font-['Delight'] uppercase tracking-wider transition-colors cursor-pointer ${
              isAutoRotate ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
            }`}
            title="Toggle Auto Spin"
          >
            <RotateCw className={`w-3 h-3 ${isAutoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Auto Spin</span>
          </button>

          <button
            type="button"
            onClick={reassembleParticles}
            className="h-[30px] px-2.5 flex items-center gap-1.5 text-xs font-['Delight'] uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Re-Assemble Particle Cloud"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span className="hidden sm:inline">Re-Assemble</span>
          </button>
        </div>
      </div>

      {/* Floating Selected State Detail Card (Draggable, Minimizable, Direct Close) */}
      {selectedState && (
        <div
          ref={cardRef}
          style={
            cardPos !== null
              ? { left: `${cardPos.x}px`, top: `${cardPos.y}px`, right: 'auto', bottom: 'auto' }
              : undefined
          }
          className={`absolute z-30 transition-shadow ${
            cardPos === null ? 'top-20 sm:top-24 right-4 sm:right-8' : ''
          } ${
            isDraggingCard ? 'shadow-2xl shadow-white/10 cursor-grabbing' : 'shadow-2xl'
          } ${
            isCardMinimized
              ? 'w-[92vw] sm:w-[360px] bg-[#121417]/95 border border-white/25 backdrop-blur-md p-3'
              : 'w-[92vw] sm:w-[390px] max-w-[420px] bg-[#121417]/95 border border-white/20 backdrop-blur-md p-4 sm:p-5 max-h-[82vh] overflow-y-auto'
          } text-left pointer-events-auto select-none`}
        >
          {/* Top Drag Handle & Controls Bar */}
          <div
            onPointerDown={handleCardDragStart}
            onPointerMove={handleCardDragMove}
            onPointerUp={handleCardDragEnd}
            className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/15 cursor-grab active:cursor-grabbing select-none group"
            title="Click and drag anywhere on this header to move card"
          >
            {/* Left: Drag Grip Handle & State Badges */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center p-1 bg-white/10 rounded-xs text-white/50 group-hover:text-white group-hover:bg-white/20 transition-colors">
                <GripHorizontal className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="inline-block px-2 py-0.5 bg-white/10 text-white text-[10px] font-['Delight'] font-bold uppercase tracking-widest border border-white/20 whitespace-nowrap">
                {selectedState.badge}
              </span>
              <span className="text-white/60 text-xs font-['Nohemi'] font-bold">
                {selectedState.code}
              </span>
            </div>

            {/* Right: Window Controls (Reset Pos, Minimize/Maximize, Direct Close) */}
            <div
              className="flex items-center gap-1 shrink-0"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Reset Position (if moved) */}
              {cardPos !== null && (
                <button
                  type="button"
                  onClick={resetCardPosition}
                  className="w-6 h-6 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Reset to default position"
                  aria-label="Reset Card Position"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}

              {/* Minimize / Maximize Button */}
              <button
                type="button"
                onClick={() => setIsCardMinimized(!isCardMinimized)}
                className="w-6 h-6 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isCardMinimized ? 'Expand Full Specs' : 'Minimize Card'}
                aria-label={isCardMinimized ? 'Expand Full Specs' : 'Minimize Card'}
              >
                {isCardMinimized ? (
                  <Maximize2 className="w-3 h-3 text-white" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
              </button>

              {/* Direct Close Button */}
              <button
                type="button"
                onClick={() => setSelectedState(null)}
                className="w-6 h-6 bg-white/10 hover:bg-[#ECEDEF] hover:text-[#121417] text-white/80 flex items-center justify-center transition-colors cursor-pointer"
                title="Direct Close (Dismiss Card)"
                aria-label="Close State Detail"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Minimized View Layout */}
          {isCardMinimized ? (
            <div
              onClick={() => setIsCardMinimized(false)}
              className="pt-2.5 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="space-y-0.5">
                <h4 className="font-['Nohemi'] font-bold text-sm text-white group-hover:text-zinc-300 transition-colors">
                  {selectedState.state} Dispatch Hub
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-['Delight'] text-white/60">
                  <span className="text-white font-bold">{selectedState.dispatchTime}</span>
                  <span>•</span>
                  <span>{selectedState.technicians} Techs</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCardMinimized(false);
                }}
                className="px-2 py-1 bg-[#ECEDEF] hover:bg-white text-[#121417] text-[10px] font-['Delight'] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3 h-3" />
                <span>Expand</span>
              </button>
            </div>
          ) : (
            /* Full Expanded View Layout */
            <>
              {/* Title & Region */}
              <div className="pt-2.5 pb-2">
                <h3 className="font-['Nohemi'] font-bold text-lg text-white leading-tight">
                  {selectedState.name}
                </h3>
                <p className="font-['Delight'] text-xs text-white/60 mt-0.5">{selectedState.region}</p>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-white/10 text-center">
                <div className="bg-white/5 p-2 border border-white/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-['Delight'] text-white/60 uppercase">
                    <Clock className="w-3 h-3 text-white" />
                    <span>Response</span>
                  </div>
                  <p className="font-['Nohemi'] font-bold text-xs text-white mt-0.5">
                    {selectedState.dispatchTime}
                  </p>
                </div>
                <div className="bg-white/5 p-2 border border-white/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-['Delight'] text-white/60 uppercase">
                    <Users className="w-3 h-3 text-white" />
                    <span>Fleet</span>
                  </div>
                  <p className="font-['Nohemi'] font-bold text-xs text-white mt-0.5">
                    {selectedState.technicians} Master Techs
                  </p>
                </div>
                <div className="bg-white/5 p-2 border border-white/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-['Delight'] text-white/60 uppercase">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    <span>Status</span>
                  </div>
                  <p className="font-['Nohemi'] font-bold text-xs text-white mt-0.5">
                    24/7 Active
                  </p>
                </div>
              </div>

              {/* Image & Description */}
              <div className="py-3 space-y-3">
                <div className="relative h-24 w-full overflow-hidden border border-white/10">
                  <img
                    src={selectedState.image}
                    alt={selectedState.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-[#121417]/90 px-2 py-0.5 text-[10px] font-['Delight'] font-bold text-white border border-white/10 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-white text-white" />
                    <span>{selectedState.warranty}</span>
                  </div>
                </div>

                <p className="font-['Delight'] font-normal text-xs text-white/80 leading-relaxed">
                  {selectedState.description}
                </p>

                {/* Climate & Engineering Specialty */}
                <div className="space-y-1.5 bg-white/5 p-2.5 border border-white/10 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-['Delight'] font-bold text-white uppercase tracking-wider">
                    <Thermometer className="w-3 h-3 text-white" />
                    <span>Climate & Engineering Specialty</span>
                  </div>
                  <p className="text-[11px] font-['Delight'] text-white/90 leading-snug">
                    {selectedState.specialty}
                  </p>
                  <p className="text-[10px] font-['Delight'] text-white/60 italic">
                    Environment: {selectedState.climateRating}
                  </p>
                </div>

                {/* Covered Major Metro Areas */}
                <div className="space-y-1 bg-white/5 p-2.5 border border-white/10 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-['Delight'] font-bold text-white uppercase tracking-wider">
                    <Navigation className="w-3 h-3 text-white" />
                    <span>Covered Metro Areas & Cities</span>
                  </div>
                  <p className="text-[11px] font-['Delight'] text-white/70 leading-snug">
                    {selectedState.cities}
                  </p>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-3 border-t border-white/15 flex items-center gap-2">
                <a
                  href={`tel:${selectedState.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 h-[34px] flex items-center justify-center gap-1.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-['Delight'] font-bold uppercase tracking-wider transition-colors cursor-pointer select-none"
                >
                  <PhoneCall className="w-3 h-3 text-white" />
                  <span>Call Dispatch</span>
                </a>

                <a
                  href="#estimate"
                  className="flex-1 h-[34px] flex items-center justify-center gap-1.5 px-3 bg-[#ECEDEF] hover:bg-white text-[#121417] text-xs font-['Nohemi'] font-bold uppercase tracking-wider transition-colors cursor-pointer select-none shadow-md"
                >
                  <Calendar className="w-3 h-3 text-[#121417]" />
                  <span>Book Online</span>
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* Re-open Info Button if Card Was Closed */}
      {!selectedState && (
        <button
          type="button"
          onClick={() => {
            setSelectedState(SERVICE_STATES[2]);
            setIsCardMinimized(false);
          }}
          className="absolute top-20 sm:top-24 right-4 sm:right-8 z-20 px-3.5 py-2 bg-[#121417]/90 hover:bg-[#ECEDEF] hover:text-[#121417] border border-white/20 text-white text-xs font-['Delight'] uppercase tracking-wider backdrop-blur-md shadow-xl flex items-center gap-2 transition-all cursor-pointer pointer-events-auto select-none"
        >
          <MapPin className="w-3.5 h-3.5 text-white" />
          <span>Show Hub Detail Card</span>
        </button>
      )}
    </section>
  );
};
