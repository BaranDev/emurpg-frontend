import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * DiceRoller - Animated dice rolling component
 * Handles dice rolling with special effects for critical rolls
 */

// Parse dice notation like "1d20+5", "2d6", "4dF+2", "d100"
const parseDice = (notation) => {
  if (!notation || typeof notation !== "string") {
    return { count: 1, sides: 20, modifier: 0, isFudge: false };
  }
  
  const clean = notation.trim().toLowerCase();
  
  // Fudge dice for Fate
  if (clean.includes("df")) {
    const match = clean.match(/(\d*)df([+-]\d+)?/);
    return {
      count: parseInt(match?.[1]) || 4,
      sides: 0,
      modifier: parseInt(match?.[2]) || 0,
      isFudge: true
    };
  }
  
  // Percentile
  if (clean === "d100" || clean === "d%") {
    return { count: 1, sides: 100, modifier: 0, isFudge: false };
  }
  
  // Standard dice notation
  const match = clean.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (match) {
    return {
      count: parseInt(match[1]) || 1,
      sides: parseInt(match[2]),
      modifier: parseInt(match[3]) || 0,
      isFudge: false
    };
  }
  
  return { count: 1, sides: 20, modifier: 0, isFudge: false };
};

// Roll dice and get results
const rollDice = (notation) => {
  const { count, sides, modifier, isFudge } = parseDice(notation);
  
  const rolls = [];
  let total = 0;
  
  if (isFudge) {
    // Fudge dice: -1, 0, or +1
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * 3) - 1;
      rolls.push(roll);
      total += roll;
    }
  } else {
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
  }
  
  return {
    notation,
    rolls,
    modifier,
    total: total + modifier,
    isCriticalSuccess: !isFudge && sides === 20 && count === 1 && rolls[0] === 20,
    isCriticalFail: !isFudge && sides === 20 && count === 1 && rolls[0] === 1,
    isFudgeCritical: isFudge && (total === count || total === -count)
  };
};

const DiceRoller = ({ 
  notation = "1d20", 
  rollName = "Roll", 
  onRoll,
  criticalMin = 1,
  criticalMax = 20
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [rollingDisplay, setRollingDisplay] = useState(null);

  const parsed = parseDice(notation);

  useEffect(() => {
    if (!isRolling) return;
    const interval = setInterval(() => {
      if (parsed.isFudge) {
        setRollingDisplay(["-", "0", "+"][Math.floor(Math.random() * 3)]);
      } else {
        setRollingDisplay(Math.floor(Math.random() * (parsed.sides || 20)) + 1);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [isRolling, parsed.sides, parsed.isFudge]);

  const handleRoll = useCallback(() => {
    setIsRolling(true);
    setResult(null);
    setRollingDisplay(null);
    
    // Animate for 800ms then show result
    setTimeout(() => {
      const rollResult = rollDice(notation);
      setResult(rollResult);
      setIsRolling(false);
      setRollingDisplay(null);
      if (onRoll) onRoll(rollResult);
    }, 800);
  }, [notation, onRoll]);

  const getCriticalClass = () => {
    if (!result) return "";
    if (result.isCriticalSuccess) return "critical-success";
    if (result.isCriticalFail) return "critical-fail";
    if (result.isFudgeCritical && result.total > 0) return "critical-success";
    if (result.isFudgeCritical && result.total < 0) return "critical-fail";
    return "";
  };

  return (
    <>
      <style>{`
        @keyframes dice-roll {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
          50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
          75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg); }
          100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg); }
        }
        @keyframes dice-land {
          0% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        @keyframes explode {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .dice-rolling {
          animation: dice-roll 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }
        .dice-landed {
          animation: dice-land 0.35s ease-out;
        }
        .critical-success { animation: explode 0.5s ease-out; }
        .critical-fail { animation: shake 0.5s ease-out; }
      `}</style>
      
      <button
        onClick={handleRoll}
        disabled={isRolling}
        className={`
          relative flex flex-col items-center gap-1.5 px-3 py-3 min-w-[100px]
          border-2 border-double rounded
          transition-all duration-200
          ${isRolling ? "cursor-wait" : "hover:scale-[1.02] hover:brightness-110 cursor-pointer active:scale-[0.98]"}
          ${getCriticalClass()}
        `}
        style={{
          background: result?.isCriticalSuccess
            ? "linear-gradient(180deg, rgba(202,138,4,0.35), rgba(139,69,19,0.4))"
            : result?.isCriticalFail
            ? "linear-gradient(180deg, rgba(127,29,29,0.4), rgba(69,10,10,0.5))"
            : "linear-gradient(180deg, rgba(61,40,23,0.9), rgba(42,26,15,0.95))",
          borderColor: result?.isCriticalSuccess
            ? "#c9a227"
            : result?.isCriticalFail
            ? "#991b1b"
            : "#5c3d2e",
          boxShadow: result?.isCriticalSuccess
            ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 12px rgba(201,162,39,0.4)"
            : result?.isCriticalFail
            ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 12px rgba(220,38,38,0.3)"
            : "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)"
        }}
      >
        {/* Roll name - D&D style label */}
        <span className="font-cinzel text-[10px] text-amber-200/80 tracking-widest uppercase">
          {rollName}
        </span>
        
        {/* Dice face - carved/inset look, perspective wrapper for 3D roll */}
        <div className="perspective-[120px] w-12 h-12" style={{ perspectiveOrigin: "center center" }}>
          <div
            className={`
              w-full h-full rounded-sm flex items-center justify-center
              font-cinzel font-bold text-lg
              ${isRolling ? "dice-rolling" : result && !isRolling ? "dice-landed" : ""}
            `}
            style={{
              background: "linear-gradient(145deg, rgba(26,26,26,0.9), rgba(15,15,15,0.95))",
              border: "1px solid rgba(92,61,46,0.8)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(201,162,39,0.15)",
              backfaceVisibility: "hidden"
            }}
          >
            {isRolling ? (
              <span className="text-amber-400/90 tabular-nums">{rollingDisplay ?? "?"}</span>
            ) : result ? (
            <span
              className={
                result.isCriticalSuccess ? "text-amber-300 drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]" :
                result.isCriticalFail ? "text-red-400" :
                "text-amber-100"
              }
            >
              {result.total}
            </span>
          ) : (
            <span className="text-amber-200/60 text-sm">{notation}</span>
          )}
          </div>
        </div>
        
        {/* Roll breakdown */}
        {result && !isRolling && (
          <div className="font-cinzel text-[10px] text-amber-200/50 tracking-wide">
            {result.rolls.join(" + ")}
            {result.modifier !== 0 && (
              <span>{result.modifier > 0 ? " + " : " − "}{Math.abs(result.modifier)}</span>
            )}
          </div>
        )}
        
        {/* Critical badges */}
        {result?.isCriticalSuccess && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 font-cinzel text-[9px] font-bold bg-amber-500 text-amber-950 rounded-sm border border-amber-400">
            CRIT
          </span>
        )}
        {result?.isCriticalFail && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 font-cinzel text-[9px] font-bold bg-red-800 text-red-200 rounded-sm border border-red-600">
            FUMBLE
          </span>
        )}
      </button>
    </>
  );
};

DiceRoller.propTypes = {
  notation: PropTypes.string,
  rollName: PropTypes.string,
  onRoll: PropTypes.func,
  criticalMin: PropTypes.number,
  criticalMax: PropTypes.number
};

export { parseDice, rollDice };
export default DiceRoller;
