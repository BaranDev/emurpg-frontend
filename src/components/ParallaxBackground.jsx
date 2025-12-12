import { useEffect, useRef } from "react";

const ParallaxBackground = () => {
  const owlRef = useRef(null);
  const moonRef = useRef(null);
  const tree1Ref = useRef(null);
  const tree2Ref = useRef(null);
  const firefliesRef = useRef(null);
  const starsRef = useRef(null);
  const mistRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Parallax speeds (different speeds create depth)
      if (owlRef.current) {
        owlRef.current.style.transform = `translateY(${
          scrollY * 0.3
        }px) translateX(${Math.sin(scrollY * 0.001) * 20}px)`;
        owlRef.current.style.opacity = Math.max(
          0.1,
          1 - scrollY / (windowHeight * 2)
        );
      }

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
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Medieval Owl SVG
  const OwlSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out, opacity 0.1s ease-out" }}
    >
      {/* Owl Body */}
      <ellipse cx="100" cy="120" rx="60" ry="50" fill="#4B5563" opacity="0.3" />
      <ellipse cx="100" cy="120" rx="50" ry="40" fill="#6B7280" opacity="0.2" />

      {/* Owl Head */}
      <circle cx="100" cy="80" r="45" fill="#374151" opacity="0.25" />

      {/* Eyes */}
      <circle cx="85" cy="75" r="12" fill="#FCD34D" opacity="0.4" />
      <circle cx="115" cy="75" r="12" fill="#FCD34D" opacity="0.4" />
      <circle cx="85" cy="75" r="6" fill="#1F2937" opacity="0.6" />
      <circle cx="115" cy="75" r="6" fill="#1F2937" opacity="0.6" />

      {/* Beak */}
      <path d="M 100 85 L 95 95 L 105 95 Z" fill="#F59E0B" opacity="0.5" />

      {/* Wings */}
      <ellipse cx="70" cy="110" rx="20" ry="30" fill="#4B5563" opacity="0.2" />
      <ellipse cx="130" cy="110" rx="20" ry="30" fill="#4B5563" opacity="0.2" />

      {/* Decorative feathers */}
      <path
        d="M 100 100 L 90 110 L 100 115 L 110 110 Z"
        fill="#6B7280"
        opacity="0.15"
      />
    </svg>
  );

  // Scroll SVG
  const ScrollSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 120 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      {/* Scroll body */}
      <rect
        x="20"
        y="30"
        width="80"
        height="100"
        rx="5"
        fill="#6B7280"
        opacity="0.15"
      />
      <rect
        x="25"
        y="35"
        width="70"
        height="90"
        rx="3"
        fill="#9CA3AF"
        opacity="0.1"
      />

      {/* Scroll top curl */}
      <path
        d="M 20 30 Q 60 20 100 30"
        stroke="#9CA3AF"
        strokeWidth="2"
        fill="none"
        opacity="0.2"
      />
      <ellipse cx="60" cy="25" rx="8" ry="5" fill="#6B7280" opacity="0.15" />

      {/* Scroll bottom curl */}
      <path
        d="M 20 130 Q 60 140 100 130"
        stroke="#9CA3AF"
        strokeWidth="2"
        fill="none"
        opacity="0.2"
      />
      <ellipse cx="60" cy="135" rx="8" ry="5" fill="#6B7280" opacity="0.15" />

      {/* Text lines */}
      <line
        x1="35"
        y1="50"
        x2="85"
        y2="50"
        stroke="#D1D5DB"
        strokeWidth="1"
        opacity="0.1"
      />
      <line
        x1="35"
        y1="65"
        x2="85"
        y2="65"
        stroke="#D1D5DB"
        strokeWidth="1"
        opacity="0.1"
      />
      <line
        x1="35"
        y1="80"
        x2="85"
        y2="80"
        stroke="#D1D5DB"
        strokeWidth="1"
        opacity="0.1"
      />
    </svg>
  );

  // Shield SVG
  const ShieldSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      {/* Shield shape */}
      <path
        d="M 50 10 Q 20 15 15 40 Q 15 70 30 100 Q 40 115 50 120 Q 60 115 70 100 Q 85 70 85 40 Q 80 15 50 10 Z"
        fill="#4B5563"
        opacity="0.15"
      />
      <path
        d="M 50 15 Q 25 18 20 40 Q 20 65 32 92 Q 40 108 50 112 Q 60 108 68 92 Q 80 65 80 40 Q 75 18 50 15 Z"
        fill="#6B7280"
        opacity="0.1"
      />

      {/* Cross decoration */}
      <line
        x1="50"
        y1="40"
        x2="50"
        y2="80"
        stroke="#FCD34D"
        strokeWidth="2"
        opacity="0.3"
      />
      <line
        x1="35"
        y1="60"
        x2="65"
        y2="60"
        stroke="#FCD34D"
        strokeWidth="2"
        opacity="0.3"
      />
    </svg>
  );

  // Tree SVG
  const TreeSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 200 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      {/* Tree trunk */}
      <rect
        x="90"
        y="250"
        width="20"
        height="150"
        fill="#3F4E5A"
        opacity="0.4"
      />

      {/* Tree branches/foliage - multiple layers */}
      <path
        d="M 100 200 Q 60 180 50 220 Q 40 250 60 280 Q 50 300 70 320 Q 40 340 80 360 L 100 350 Q 120 360 160 340 Q 180 320 150 300 Q 170 280 150 250 Q 140 220 100 200 Z"
        fill="#1E293B"
        opacity="0.3"
      />
      <path
        d="M 100 180 Q 70 160 60 200 Q 50 230 70 260 Q 55 280 80 300 Q 50 320 95 310 Q 120 320 150 300 Q 170 280 150 250 Q 140 210 100 180 Z"
        fill="#334155"
        opacity="0.25"
      />
      <path
        d="M 100 160 Q 80 140 70 180 Q 60 210 80 240 Q 65 260 90 280 Q 70 300 100 290 Q 130 300 140 280 Q 150 250 130 210 Q 120 170 100 160 Z"
        fill="#475569"
        opacity="0.2"
      />
    </svg>
  );

  // Moon SVG
  const MoonSVG = ({ innerRef, className }) => (
    <svg
      ref={innerRef}
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "transform 0.1s ease-out" }}
    >
      {/* Moon glow */}
      <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)" />
      <circle cx="100" cy="100" r="70" fill="rgba(255,255,255,0.15)" />

      {/* Moon surface */}
      <circle cx="100" cy="100" r="60" fill="#E2E8F0" opacity="0.9" />

      {/* Moon craters */}
      <circle cx="85" cy="85" r="8" fill="#CBD5E1" opacity="0.6" />
      <circle cx="115" cy="100" r="6" fill="#CBD5E1" opacity="0.5" />
      <circle cx="100" cy="120" r="5" fill="#CBD5E1" opacity="0.4" />
      <ellipse cx="90" cy="110" rx="4" ry="6" fill="#CBD5E1" opacity="0.5" />
    </svg>
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient - deep night sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950" />

      {/* Additional depth layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />

      {/* Moon - Large and prominent */}
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-white/10 via-white/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Stars layer - more stars for magical night */}
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
                  : "rgba(200,220,255,0.6)",
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${2 + Math.random() * 4}s infinite`,
              boxShadow: "0 0 2px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* Fireflies - magical floating lights */}
      <div ref={firefliesRef} className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={`firefly-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
              width: "4px",
              height: "4px",
              backgroundColor: "rgba(255,255,200,0.8)",
              boxShadow:
                "0 0 8px rgba(255,255,200,0.6), 0 0 16px rgba(255,255,200,0.4)",
              animation: `fireflyFloat ${
                8 + Math.random() * 12
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Trees - Forest silhouette */}
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

      {/* Owl - Main parallax element */}
      <div
        className="absolute hidden md:block"
        style={{
          top: "15%",
          right: "5%",
          width: "200px",
          height: "200px",
        }}
      >
        <OwlSVG innerRef={owlRef} className="w-full h-full" />
      </div>

      {/* Misty fog layers */}
      <div ref={mistRef} className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent" />
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
        
        @keyframes moonGlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ParallaxBackground;
