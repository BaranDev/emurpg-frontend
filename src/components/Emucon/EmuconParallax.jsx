import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import forestSilhouette from "../../assets/images/forest-silhouette.svg";
import emurpgLogo from "../../assets/logo/LOGO_WHITE.png";

// Transition duration for parallax animations in milliseconds
const TRANSITION_MS = 800;

// Define keyframes for each section (0-7)
// Each keyframe defines the exact state of the parallax at that section
// forestY: 0 = forests visible, positive = forests moved down (camera looking up at sky)
const SECTION_KEYFRAMES = [
  {
    // Section 0: Hero - Dawn/Early Morning
    name: "hero",
    skyProgress: 0,
    sunY: 10,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 120,
    moonOpacity: 0,
    moonScale: 0.5,
    cloudOpacity: 1,
    cloudY: 0,
    starsOpacity: 0,
    forestY: 0, // Forests fully visible
    forestBrightness: 0.35,
    forestOpacity: 0.4,
  },
  {
    // Section 1: About - Morning
    name: "about",
    skyProgress: 0.08,
    sunY: 15,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 115,
    moonOpacity: 0,
    moonScale: 0.55,
    cloudOpacity: 0.95,
    cloudY: 2,
    starsOpacity: 0,
    forestY: 0, // Forests still visible
    forestBrightness: 0.38,
    forestOpacity: 0.45,
  },
  {
    // Section 2: Stats - Mid Morning
    name: "stats",
    skyProgress: 0.15,
    sunY: 22,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 108,
    moonOpacity: 0,
    moonScale: 0.6,
    cloudOpacity: 0.88,
    cloudY: 4,
    starsOpacity: 0,
    forestY: 0, // Forests still visible
    forestBrightness: 0.42,
    forestOpacity: 0.5,
  },
  {
    // Section 3: Features - Late Morning
    name: "features",
    skyProgress: 0.25,
    sunY: 30,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 100,
    moonOpacity: 0,
    moonScale: 0.65,
    cloudOpacity: 0.75,
    cloudY: 6,
    starsOpacity: 0,
    forestY: 5, // Forests starting to move down
    forestBrightness: 0.48,
    forestOpacity: 0.55,
  },
  {
    // Section 4: Visitors - Afternoon
    name: "visitors",
    skyProgress: 0.45,
    sunY: 45,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 85,
    moonOpacity: 0.05,
    moonScale: 0.72,
    cloudOpacity: 0.5,
    cloudY: 10,
    starsOpacity: 0.05,
    forestY: 12, // Forests moving down (camera panning up)
    forestBrightness: 0.52,
    forestOpacity: 0.6,
  },
  {
    // Section 5: Schedule - Dusk
    name: "schedule",
    skyProgress: 0.65,
    sunY: 60,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 65,
    moonOpacity: 0.4,
    moonScale: 0.85,
    cloudOpacity: 0.2,
    cloudY: 15,
    starsOpacity: 0.3,
    forestY: 25, // Forests mostly gone (camera looking at sky)
    forestBrightness: 0.58,
    forestOpacity: 0.5,
  },
  {
    // Section 6: Contact - Evening
    name: "contact",
    skyProgress: 0.82,
    sunY: 100,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 45,
    moonOpacity: 0.8,
    moonScale: 0.95,
    cloudOpacity: 0,
    cloudY: 20,
    starsOpacity: 0.7,
    forestY: 40, // Forests almost off screen
    forestBrightness: 0.65,
    forestOpacity: 0.35,
  },
  {
    // Section 7: Footer - Night (Moon Landing)
    name: "footer",
    skyProgress: 1,
    sunY: 110,
    sunOpacity: 1,
    sunScale: 1,
    moonY: 25,
    moonOpacity: 1,
    moonScale: 1.1,
    cloudOpacity: 0,
    cloudY: 25,
    starsOpacity: 1,
    forestY: 60, // Forests off screen (full sky view with moon)
    forestBrightness: 0.72,
    forestOpacity: 0.2,
  },
];

// Section IDs to observe
const SECTION_IDS = [
  "emucon-section-hero",
  "emucon-section-about",
  "emucon-section-stats",
  "emucon-section-features",
  "emucon-section-visitors",
  "emucon-section-schedule",
  "emucon-section-contact",
  "emucon-section-footer",
];

const EmuconParallax = () => {
  const [aspectRatio, setAspectRatio] = useState(
    typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1
  );
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);

  // Animated values state - these are the actual rendered values
  const [animatedValues, setAnimatedValues] = useState(SECTION_KEYFRAMES[0]);

  // Animation state stored in a single ref to avoid closure issues
  const animationRef = useRef(null);
  const targetSectionRef = useRef(0);
  const animStateRef = useRef({
    currentValues: { ...SECTION_KEYFRAMES[0] },
    targetValues: { ...SECTION_KEYFRAMES[0] },
    isAnimating: false,
  });

  // Track last frame time for frame-rate independent smoothing
  const lastFrameTimeRef = useRef(null);

  // Single animation loop using frame-rate independent smoothing
  const runAnimationFrame = useCallback((currentTime) => {
    const state = animStateRef.current;
    const c = state.currentValues;
    const t = state.targetValues;

    // Calculate delta time (capped to prevent huge jumps on tab switch)
    const deltaTime = lastFrameTimeRef.current
      ? Math.min(currentTime - lastFrameTimeRef.current, 100)
      : 16.67;
    lastFrameTimeRef.current = currentTime;

    // Frame-rate independent smoothing factor
    // TRANSITION_MS controls how long it takes to reach ~95% of target
    const smoothingFactor = 1 - Math.exp((-deltaTime * 3) / TRANSITION_MS);

    // Smooth interpolation with frame-rate independence
    const smoothLerp = (current, target) => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0001) return target;
      const result = current + diff * smoothingFactor;
      return result;
    };

    const newValues = {
      name: t.name,
      skyProgress: smoothLerp(c.skyProgress, t.skyProgress),
      sunY: smoothLerp(c.sunY, t.sunY, "sunY"),
      sunOpacity: smoothLerp(c.sunOpacity, t.sunOpacity, "sunOpacity"),
      sunScale: smoothLerp(c.sunScale, t.sunScale, "sunScale"),
      moonY: smoothLerp(c.moonY, t.moonY, "moonY"),
      moonOpacity: smoothLerp(c.moonOpacity, t.moonOpacity, "moonOpacity"),
      moonScale: smoothLerp(c.moonScale, t.moonScale, "moonScale"),
      cloudOpacity: smoothLerp(c.cloudOpacity, t.cloudOpacity),
      cloudY: smoothLerp(c.cloudY, t.cloudY),
      starsOpacity: smoothLerp(c.starsOpacity, t.starsOpacity),
      forestY: smoothLerp(c.forestY, t.forestY),
      forestBrightness: smoothLerp(c.forestBrightness, t.forestBrightness),
      forestOpacity: smoothLerp(c.forestOpacity, t.forestOpacity),
    };

    // Check if we've reached the target (ALL values must be close enough)
    const sunYCheck = Math.abs(newValues.sunY - t.sunY) < 0.1;
    const sunOpacityCheck =
      Math.abs(newValues.sunOpacity - t.sunOpacity) < 0.01;
    const sunScaleCheck = Math.abs(newValues.sunScale - t.sunScale) < 0.01;
    const moonYCheck = Math.abs(newValues.moonY - t.moonY) < 0.1;
    const moonOpacityCheck =
      Math.abs(newValues.moonOpacity - t.moonOpacity) < 0.01;
    const moonScaleCheck = Math.abs(newValues.moonScale - t.moonScale) < 0.01;
    const hasReachedTarget =
      Math.abs(newValues.skyProgress - t.skyProgress) < 0.001 &&
      sunYCheck &&
      sunOpacityCheck &&
      sunScaleCheck &&
      moonYCheck &&
      moonOpacityCheck &&
      moonScaleCheck &&
      Math.abs(newValues.cloudOpacity - t.cloudOpacity) < 0.01 &&
      Math.abs(newValues.cloudY - t.cloudY) < 0.1 &&
      Math.abs(newValues.starsOpacity - t.starsOpacity) < 0.01 &&
      Math.abs(newValues.forestY - t.forestY) < 0.1 &&
      Math.abs(newValues.forestBrightness - t.forestBrightness) < 0.01 &&
      Math.abs(newValues.forestOpacity - t.forestOpacity) < 0.01;

    // Update current values
    state.currentValues = newValues;
    setAnimatedValues(newValues);

    if (hasReachedTarget) {
      // Snap to exact target values
      state.currentValues = { ...t };
      setAnimatedValues({ ...t });
      state.isAnimating = false;
      animationRef.current = null;
      lastFrameTimeRef.current = null;
    } else {
      // Continue animation
      animationRef.current = requestAnimationFrame(runAnimationFrame);
    }
  }, []);

  // Function to set a new target (animation will naturally approach it)
  const setAnimationTarget = useCallback(
    (targetKeyframe) => {
      const state = animStateRef.current;
      state.targetValues = targetKeyframe;

      // Start animation loop if not already running
      if (!state.isAnimating) {
        state.isAnimating = true;
        lastFrameTimeRef.current = null; // Reset timing for smooth start
        animationRef.current = requestAnimationFrame(runAnimationFrame);
      }
      // If already animating, just update target - loop will pick it up
    },
    [runAnimationFrame]
  );

  // When activeSection changes, set new target
  useEffect(() => {
    const targetKeyframe = SECTION_KEYFRAMES[activeSection];
    if (targetKeyframe && targetSectionRef.current !== activeSection) {
      targetSectionRef.current = activeSection;
      setAnimationTarget(targetKeyframe);
    }
  }, [activeSection, setAnimationTarget]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Memoize stars and fireflies to prevent re-generation on each render
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 50}%`,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      })),
    []
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${50 + Math.random() * 40}%`,
        size: Math.random() * 4 + 3,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 4,
      })),
    []
  );

  useEffect(() => {
    // Create a style element to override global backgrounds with !important
    const styleEl = document.createElement("style");
    styleEl.id = "emucon-parallax-override";
    styleEl.textContent = `
      html, body, #root, #app-wrapper {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    const handleResize = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Intersection Observer to detect active section
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Trigger when section is in the middle 20% of viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = SECTION_IDS.indexOf(entry.target.id);
          if (sectionIndex !== -1) {
            setActiveSection(sectionIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Wait for DOM to be ready and observe sections
    const observeSections = () => {
      SECTION_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    };

    // Initial observation
    observeSections();
    // Re-observe after a short delay in case sections are dynamically rendered
    const timeoutId = setTimeout(observeSections, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      clearTimeout(timeoutId);
      const overrideStyle = document.getElementById("emucon-parallax-override");
      if (overrideStyle) {
        overrideStyle.remove();
      }
    };
  }, []);

  // Day to night transition colors
  const skyColors = {
    dayTop: "#87CEEB",
    dayMid: "#98D8C8",
    dayBottom: "#3A7B5C",
    nightTop: "#0a1628",
    nightMid: "#1a2e1a",
    nightBottom: "#0d1f0d",
  };

  // Interpolate colors based on animated progress
  const lerpColor = (color1, color2, t) => {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    const r1 = (c1 >> 16) & 255,
      g1 = (c1 >> 8) & 255,
      b1 = c1 & 255;
    const r2 = (c2 >> 16) & 255,
      g2 = (c2 >> 8) & 255,
      b2 = c2 & 255;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Use animated progress for sky colors (already interpolated smoothly)
  const progress = animatedValues.skyProgress;
  const easedProgress = progress * progress * (3 - 2 * progress);

  const currentSkyTop = lerpColor(
    skyColors.dayTop,
    skyColors.nightTop,
    easedProgress
  );
  const currentSkyMid = lerpColor(
    skyColors.dayMid,
    skyColors.nightMid,
    easedProgress
  );
  const currentSkyBottom = lerpColor(
    skyColors.dayBottom,
    skyColors.nightBottom,
    easedProgress
  );

  // Adjust gradient stops based on aspect ratio
  const isWideScreen = aspectRatio > 1.2;
  const isVeryWideScreen = aspectRatio > 1.6;

  let gradientMidStop, gradientBottomStop;
  if (isVeryWideScreen) {
    gradientMidStop = 15;
    gradientBottomStop = 35;
  } else if (isWideScreen) {
    gradientMidStop = 20;
    gradientBottomStop = 40;
  } else {
    gradientMidStop = 35;
    gradientBottomStop = 60;
  }

  // Use animated values (smoothly interpolated by requestAnimationFrame)
  const {
    sunY,
    sunOpacity,
    sunScale,
    moonY,
    moonOpacity,
    moonScale,
    cloudOpacity,
    cloudY,
    starsOpacity,
    forestY,
    forestBrightness,
    forestOpacity,
  } = animatedValues;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none"
    >
      {/* LAYER 1: Sky gradient */}
      <div
        className="absolute inset-0 z-[1] min-h-screen"
        style={{
          background: `linear-gradient(180deg, ${currentSkyTop} 0%, ${currentSkyMid} ${gradientMidStop}%, ${currentSkyBottom} ${gradientBottomStop}%, ${currentSkyBottom} 100%)`,
        }}
      />

      {/* LAYER 2: Stars */}
      <div className="absolute inset-0 z-[2]" style={{ opacity: starsOpacity }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${2 + star.delay}s ease-in-out ${
                star.delay
              }s infinite`,
            }}
          />
        ))}
      </div>

      {/* LAYER 3: Sun */}
      <div
        className="absolute z-[3] right-[15%] transform-gpu will-change-transform"
        style={{
          opacity: sunOpacity,
          transform: `translateY(${sunY}vh)`,
        }}
      >
        {/* Scale is applied on an inner wrapper so position anchoring stays stable */}
        <div
          className="relative origin-center"
          style={{ transform: `scale(${sunScale})` }}
        >
          <div
            className="absolute -inset-20 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,223,100,0.4) 0%, rgba(255,180,50,0.1) 50%, transparent 70%)",
            }}
          />
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #FFF5B8 0%, #FFD93D 50%, #F5A623 100%)",
              boxShadow:
                "0 0 60px rgba(255,200,50,0.6), 0 0 120px rgba(255,180,50,0.3)",
            }}
          />
        </div>
      </div>

      {/* LAYER 4: Clouds */}
      <div
        className="absolute inset-0 z-[4]"
        style={{
          opacity: cloudOpacity,
          transform: `translateY(${cloudY}vh)`,
        }}
      >
        <div
          className="absolute"
          style={{
            top: "8%",
            left: "18%",
          }}
        >
          <svg width="200" height="80" viewBox="0 0 200 80">
            <ellipse
              cx="60"
              cy="50"
              rx="50"
              ry="25"
              fill="rgba(255,255,255,0.8)"
            />
            <ellipse
              cx="100"
              cy="40"
              rx="60"
              ry="35"
              fill="rgba(255,255,255,0.9)"
            />
            <ellipse
              cx="150"
              cy="50"
              rx="45"
              ry="25"
              fill="rgba(255,255,255,0.8)"
            />
          </svg>
        </div>
        <div
          className="absolute"
          style={{
            top: "15%",
            right: "25%",
          }}
        >
          <svg width="180" height="70" viewBox="0 0 180 70">
            <ellipse
              cx="50"
              cy="45"
              rx="40"
              ry="22"
              fill="rgba(255,255,255,0.7)"
            />
            <ellipse
              cx="90"
              cy="35"
              rx="55"
              ry="30"
              fill="rgba(255,255,255,0.85)"
            />
            <ellipse
              cx="140"
              cy="45"
              rx="35"
              ry="20"
              fill="rgba(255,255,255,0.7)"
            />
          </svg>
        </div>
        <div
          className="absolute"
          style={{
            top: "25%",
            left: "45%",
          }}
        >
          <svg width="150" height="60" viewBox="0 0 150 60">
            <ellipse
              cx="40"
              cy="40"
              rx="35"
              ry="18"
              fill="rgba(255,255,255,0.6)"
            />
            <ellipse
              cx="75"
              cy="30"
              rx="45"
              ry="25"
              fill="rgba(255,255,255,0.75)"
            />
            <ellipse
              cx="115"
              cy="40"
              rx="30"
              ry="18"
              fill="rgba(255,255,255,0.6)"
            />
          </svg>
        </div>
      </div>

      {/* LAYER 5: Moon with Logo */}
      <div
        className="absolute left-1/2 z-[5] transform-gpu will-change-transform"
        style={{
          opacity: moonOpacity,
          transform: `translateX(-50%) translateY(${moonY}vh)`,
        }}
      >
        {/* Split translate and scale to avoid scale affecting centering math */}
        <div
          className="relative origin-center"
          style={{ transform: `scale(${moonScale})` }}
        >
          <div
            className="absolute -inset-16 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(200,220,255,0.3) 0%, rgba(150,180,220,0.1) 50%, transparent 70%)",
            }}
          />
          <div
            className="relative w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #F0F8FF 0%, #D4E5F7 40%, #A8C5E2 100%)",
              boxShadow:
                "0 0 40px rgba(200,220,255,0.5), 0 0 80px rgba(150,180,220,0.3), inset -10px -10px 30px rgba(100,130,170,0.2)",
            }}
          >
            <img
              src={emurpgLogo}
              alt="EMURPG"
              draggable={false}
              className="w-20 h-20 md:w-28 md:h-28 object-contain select-none"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
                opacity: 0.9,
              }}
            />
          </div>
        </div>
      </div>

      {/* LAYER 6: Far forest */}
      <div
        className="absolute bottom-0 left-0 z-10 w-full h-[70vh] min-h-[400px] md:h-[75vh] lg:h-[80vh]"
        style={{
          transform: `translateY(${forestY * 1.8}vh) scale(1.5)`,
        }}
      >
        <img
          src={forestSilhouette}
          alt=""
          draggable={false}
          className="w-full h-full object-cover object-bottom select-none"
          style={{
            opacity: forestOpacity,
            filter: `brightness(${forestBrightness}) blur(3px)`,
          }}
        />
      </div>

      {/* LAYER 7: Middle forest */}
      <div
        className="absolute bottom-0 left-0 z-[11] w-full h-[65vh] min-h-[350px] md:h-[70vh] lg:h-[75vh]"
        style={{
          transform: `translateY(${forestY * 1.2}vh) scale(1.2)`,
        }}
      >
        <img
          src={forestSilhouette}
          alt=""
          draggable={false}
          className="w-full h-full object-cover object-bottom select-none"
          style={{
            opacity: forestOpacity + 0.1,
            filter: `brightness(${forestBrightness + 0.05}) blur(1px)`,
          }}
        />
      </div>

      {/* LAYER 8: Near forest */}
      <div
        className="absolute bottom-0 left-0 z-[12] w-full h-[60vh] min-h-[320px] md:h-[65vh] lg:h-[70vh]"
        style={{
          transform: `translateY(${forestY}vh)`,
        }}
      >
        <img
          src={forestSilhouette}
          alt=""
          draggable={false}
          className="w-full h-full object-cover object-bottom select-none"
          style={{
            opacity: forestOpacity + 0.2,
            filter: `brightness(${forestBrightness + 0.1})`,
          }}
        />
      </div>

      {/* LAYER 9: Fireflies */}
      <div
        className="absolute inset-0 z-[13]"
        style={{ opacity: starsOpacity }}
      >
        {fireflies.map((fly) => (
          <div
            key={fly.id}
            className="absolute rounded-full"
            style={{
              left: fly.left,
              top: fly.top,
              width: `${fly.size}px`,
              height: `${fly.size}px`,
              background:
                "radial-gradient(circle, rgba(232,212,139,0.9) 0%, rgba(201,162,39,0.4) 50%, transparent 70%)",
              boxShadow: `0 0 ${fly.size * 2}px rgba(232,212,139,0.6)`,
              animation: `fireflyFloat ${fly.duration}s ease-in-out ${fly.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* LAYER 10: Mist */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[14] h-[30vh] min-h-[150px] md:h-[35vh] lg:h-[40vh] opacity-60"
        style={{
          background: `linear-gradient(to top, ${currentSkyBottom} 0%, transparent 100%)`,
        }}
      />
      {/* LAYER 11: Foreground Blur, slowly goes to 0.5 opacity from 0.1 */}
      <div className="absolute inset-0 z-[15] blur-3xl bg-black opacity-30" />

      {/* CSS Keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fireflyFloat {
          0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.3; }
          25% { transform: translate(15px, -10px) scale(1.1); opacity: 1; }
          50% { transform: translate(-8px, -20px) scale(1); opacity: 0.5; }
          75% { transform: translate(20px, -8px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default EmuconParallax;
