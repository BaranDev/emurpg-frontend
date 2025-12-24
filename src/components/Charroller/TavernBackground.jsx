import { useEffect, useRef } from "react";

/**
 * TavernBackground - Warm, cozy tavern-themed parallax background
 * Features wood textures, candlelight, warmth for character manager
 */
const TavernBackground = () => {
  const candlesRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (candlesRef.current) {
        candlesRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient - warm tavern colors */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #2a1a0f 0%, #3d2817 40%, #4a2f1a 70%, #2a1a0f 100%)"
        }}
      />

      {/* Wood grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(139, 69, 19, 0.15) 3px,
            rgba(139, 69, 19, 0.15) 6px
          )`
        }}
      />

      {/* Warm ambient glow from center */}
      <div 
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]"
        style={{
          background: "radial-gradient(ellipse, rgba(255, 170, 51, 0.15) 0%, rgba(255, 136, 0, 0.08) 40%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />

      {/* Candle glow spots */}
      <div ref={candlesRef} className="absolute inset-0">
        {/* Left candle */}
        <div 
          className="absolute left-[10%] top-[20%] w-32 h-32"
          style={{
            background: "radial-gradient(circle, rgba(255, 170, 51, 0.4) 0%, rgba(255, 136, 0, 0.2) 30%, transparent 70%)",
            animation: "candleFlicker 3s ease-in-out infinite"
          }}
        />
        {/* Right candle */}
        <div 
          className="absolute right-[15%] top-[15%] w-24 h-24"
          style={{
            background: "radial-gradient(circle, rgba(255, 170, 51, 0.35) 0%, rgba(255, 136, 0, 0.15) 30%, transparent 70%)",
            animation: "candleFlicker 2.5s ease-in-out infinite 0.5s"
          }}
        />
        {/* Center table candle */}
        <div 
          className="absolute left-1/2 top-[40%] -translate-x-1/2 w-40 h-40"
          style={{
            background: "radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, rgba(255, 170, 51, 0.15) 40%, transparent 70%)",
            animation: "candleFlicker 4s ease-in-out infinite 1s"
          }}
        />
      </div>

      {/* Floating dust particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor: "rgba(255, 220, 180, 0.4)",
              animation: `dustFloat ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative corner shadows (vignette) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(20, 10, 5, 0.6) 100%)"
        }}
      />

      {/* Shelf silhouettes - decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
        <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0,100 L0,60 Q50,55 100,60 L100,40 L200,40 L200,60 Q250,55 300,60 L300,50 L400,50 L400,60 L1200,60 L1200,100 Z"
            fill="#1a0f08"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes candleFlicker {
          0%, 100% { 
            opacity: 0.8; 
            transform: scale(1);
          }
          25% { 
            opacity: 1; 
            transform: scale(1.05);
          }
          50% { 
            opacity: 0.85; 
            transform: scale(0.98);
          }
          75% { 
            opacity: 0.95; 
            transform: scale(1.02);
          }
        }
        
        @keyframes dustFloat {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% { 
            transform: translate(15px, -20px);
            opacity: 0.5;
          }
          50% { 
            transform: translate(-10px, -40px);
            opacity: 0.4;
          }
          75% { 
            transform: translate(5px, -25px);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default TavernBackground;
