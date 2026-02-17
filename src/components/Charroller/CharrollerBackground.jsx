import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * CharrollerBackground - Blue magical forest parallax background
 * Adapted from ParallaxBackground with blue/arcane color scheme
 */
const CharrollerBackground = () => {
  const moonRef = useRef(null);
  const tree1Ref = useRef(null);
  const tree2Ref = useRef(null);
  const firefliesRef = useRef(null);
  const starsRef = useRef(null);
  const mistRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (moonRef.current) {
        moonRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }

      if (tree1Ref.current) {
        tree1Ref.current.style.transform = `translateY(${scrollY * 0.6}px)`;
      }

      if (tree2Ref.current) {
        tree2Ref.current.style.transform = `translateY(${scrollY * 0.55}px)`;
      }

      if (firefliesRef.current) {
        firefliesRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }

      if (starsRef.current) {
        starsRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }

      if (mistRef.current) {
        mistRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Magical Scroll/Tome SVG
  const ScrollSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 120 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      <rect x="20" y="30" width="80" height="100" rx="5" fill="#4a9eff" opacity="0.1" />
      <rect x="25" y="35" width="70" height="90" rx="3" fill="#74b4ff" opacity="0.08" />
      <path d="M 20 30 Q 60 20 100 30" stroke="#4a9eff" strokeWidth="2" fill="none" opacity="0.15" />
      <ellipse cx="60" cy="25" rx="8" ry="5" fill="#4a9eff" opacity="0.1" />
      <path d="M 20 130 Q 60 140 100 130" stroke="#4a9eff" strokeWidth="2" fill="none" opacity="0.15" />
      <ellipse cx="60" cy="135" rx="8" ry="5" fill="#4a9eff" opacity="0.1" />
      <line x1="35" y1="50" x2="85" y2="50" stroke="#74b4ff" strokeWidth="1" opacity="0.08" />
      <line x1="35" y1="65" x2="85" y2="65" stroke="#74b4ff" strokeWidth="1" opacity="0.08" />
      <line x1="35" y1="80" x2="85" y2="80" stroke="#74b4ff" strokeWidth="1" opacity="0.08" />
    </svg>
  );

  // Dice SVG
  const DiceSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      <rect x="15" y="15" width="70" height="70" rx="10" fill="#4a9eff" opacity="0.12" />
      <circle cx="35" cy="35" r="5" fill="#74b4ff" opacity="0.2" />
      <circle cx="65" cy="35" r="5" fill="#74b4ff" opacity="0.2" />
      <circle cx="50" cy="50" r="5" fill="#74b4ff" opacity="0.2" />
      <circle cx="35" cy="65" r="5" fill="#74b4ff" opacity="0.2" />
      <circle cx="65" cy="65" r="5" fill="#74b4ff" opacity="0.2" />
    </svg>
  );

  // Tree SVG (Blue tinted)
  const TreeSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 200 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      <rect x="90" y="250" width="20" height="150" fill="#1e3a5f" opacity="0.4" />
      <path
        d="M 100 200 Q 60 180 50 220 Q 40 250 60 280 Q 50 300 70 320 Q 40 340 80 360 L 100 350 Q 120 360 160 340 Q 180 320 150 300 Q 170 280 150 250 Q 140 220 100 200 Z"
        fill="#0d1f33"
        opacity="0.35"
      />
      <path
        d="M 100 180 Q 70 160 60 200 Q 50 230 70 260 Q 55 280 80 300 Q 50 320 95 310 Q 120 320 150 300 Q 170 280 150 250 Q 140 210 100 180 Z"
        fill="#132238"
        opacity="0.3"
      />
      <path
        d="M 100 160 Q 80 140 70 180 Q 60 210 80 240 Q 65 260 90 280 Q 70 300 100 290 Q 130 300 140 280 Q 150 250 130 210 Q 120 170 100 160 Z"
        fill="#1e3a5f"
        opacity="0.25"
      />
    </svg>
  );

  // Moon SVG (Blue glow)
  const MoonSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      <circle cx="100" cy="100" r="80" fill="rgba(74,158,255,0.1)" />
      <circle cx="100" cy="100" r="70" fill="rgba(74,158,255,0.15)" />
      <circle cx="100" cy="100" r="60" fill="#E2E8F0" opacity="0.9" />
      <circle cx="85" cy="85" r="8" fill="#CBD5E1" opacity="0.6" />
      <circle cx="115" cy="100" r="6" fill="#CBD5E1" opacity="0.5" />
      <circle cx="100" cy="120" r="5" fill="#CBD5E1" opacity="0.4" />
      <ellipse cx="90" cy="110" rx="4" ry="6" fill="#CBD5E1" opacity="0.5" />
    </svg>
  );

  ScrollSVG.propTypes = { innerRef: PropTypes.object, className: PropTypes.string };
  DiceSVG.propTypes = { innerRef: PropTypes.object, className: PropTypes.string };
  TreeSVG.propTypes = { innerRef: PropTypes.object, className: PropTypes.string };
  MoonSVG.propTypes = { innerRef: PropTypes.object, className: PropTypes.string };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient - deep blue magical sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#132238] to-[#1e3a5f]" />

      {/* Additional depth layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />

      {/* Moon */}
      <div
        className="absolute"
        style={{
          top: "8%",
          right: "10%",
          width: "180px",
          height: "180px",
        }}
      >
        <MoonSVG innerRef={moonRef} className="w-full h-full" />
      </div>

      {/* Moonlight rays */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-blue-300/10 via-blue-400/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Stars layer */}
      <div ref={starsRef} className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor:
                Math.random() > 0.7
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(150,200,255,0.6)",
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${2 + Math.random() * 4}s infinite`,
              boxShadow: "0 0 2px rgba(100,180,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* Blue Fireflies */}
      <div ref={firefliesRef} className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`firefly-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
              width: "4px",
              height: "4px",
              backgroundColor: "rgba(100,180,255,0.8)",
              boxShadow:
                "0 0 8px rgba(74,158,255,0.6), 0 0 16px rgba(74,158,255,0.4)",
              animation: `fireflyFloat ${
                8 + Math.random() * 12
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative Scroll - Left Side */}
      <div
        className="absolute hidden md:block"
        style={{
          top: "25%",
          left: "5%",
          width: "80px",
          height: "110px",
          opacity: 0.6,
        }}
      >
        <ScrollSVG className="w-full h-full" />
      </div>

      {/* Decorative Dice - Right Side */}
      <div
        className="absolute hidden md:block"
        style={{
          top: "60%",
          right: "8%",
          width: "70px",
          height: "70px",
          opacity: 0.5,
        }}
      >
        <DiceSVG className="w-full h-full" />
      </div>

      {/* Trees */}
      <div
        ref={tree1Ref}
        className="absolute hidden lg:block"
        style={{
          bottom: "0",
          left: "0",
          width: "300px",
          height: "500px",
        }}
      >
        <TreeSVG innerRef={tree1Ref} className="w-full h-full" />
      </div>

      <div
        ref={tree2Ref}
        className="absolute hidden lg:block"
        style={{
          bottom: "0",
          right: "0",
          width: "280px",
          height: "480px",
        }}
      >
        <TreeSVG innerRef={tree2Ref} className="w-full h-full" />
      </div>

      {/* Misty fog layers */}
      <div ref={mistRef} className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0a1628]/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fireflyFloat {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% { 
            transform: translate(20px, -30px) scale(1.2);
            opacity: 1;
          }
          50% { 
            transform: translate(-15px, -50px) scale(0.9);
            opacity: 0.8;
          }
          75% { 
            transform: translate(10px, -20px) scale(1.1);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};

export default CharrollerBackground;
