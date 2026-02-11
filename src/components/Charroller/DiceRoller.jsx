import { useState, useCallback } from "react";
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
  criticalMax = 20,
  hasAdvantage = false,
  hasDisadvantage = false
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);

  // Determine effective advantage state (disadvantage cancels advantage)
  const effectiveAdvantage = hasAdvantage && !hasDisadvantage;
  const effectiveDisadvantage = hasDisadvantage && !hasAdvantage;

  const handleRoll = useCallback(() => {
    setIsRolling(true);
    setResult(null);
    
    // Animate for 800ms then show result
    setTimeout(() => {
      let rollResult;
      
      // If advantage/disadvantage on a d20 roll, roll twice
      if ((effectiveAdvantage || effectiveDisadvantage) && notation.includes("d20")) {
        const roll1 = rollDice(notation);
        const roll2 = rollDice(notation);
        
        if (effectiveAdvantage) {
          // Take higher roll
          rollResult = roll1.rolls[0] >= roll2.rolls[0] ? roll1 : roll2;
          rollResult.advantageRolls = [roll1.rolls[0], roll2.rolls[0]];
          rollResult.usedAdvantage = true;
        } else {
          // Take lower roll
          rollResult = roll1.rolls[0] <= roll2.rolls[0] ? roll1 : roll2;
          rollResult.disadvantageRolls = [roll1.rolls[0], roll2.rolls[0]];
          rollResult.usedDisadvantage = true;
        }
      } else {
        rollResult = rollDice(notation);
      }
      
      setResult(rollResult);
      setIsRolling(false);
      
      if (onRoll) {
        onRoll(rollResult);
      }
    }, 800);
  }, [notation, onRoll, effectiveAdvantage, effectiveDisadvantage]);

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
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(90deg) rotateY(45deg); }
          50% { transform: rotateX(180deg) rotateY(90deg); }
          75% { transform: rotateX(270deg) rotateY(135deg); }
          100% { transform: rotateX(360deg) rotateY(180deg); }
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
          animation: dice-roll 0.8s ease-in-out;
        }
        .critical-success {
          animation: explode 0.5s ease-out;
        }
        .critical-fail {
          animation: shake 0.5s ease-out;
        }
      `}</style>
      
      <button
        onClick={handleRoll}
        disabled={isRolling}
        className={`
          relative flex flex-col items-center gap-2 p-4 rounded-xl
          transition-all duration-200 min-w-[120px]
          ${isRolling ? "cursor-wait" : "hover:scale-105 cursor-pointer"}
          ${getCriticalClass()}
        `}
        style={{
          background: result?.isCriticalSuccess 
            ? "linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(202, 138, 4, 0.2))"
            : result?.isCriticalFail
            ? "linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.2))"
            : "rgba(30, 58, 95, 0.5)",
          border: result?.isCriticalSuccess
            ? "2px solid #eab308"
            : result?.isCriticalFail
            ? "2px solid #dc2626"
            : "1px solid rgba(74, 158, 255, 0.3)",
          boxShadow: result?.isCriticalSuccess
            ? "0 0 30px rgba(234, 179, 8, 0.5)"
            : result?.isCriticalFail
            ? "0 0 30px rgba(220, 38, 38, 0.5)"
            : "none"
        }}
      >
        {/* Roll name */}
        <span className="text-xs text-silver-dark font-medium uppercase tracking-wide">
          {rollName}
        </span>
        
        {/* Dice display */}
        <div 
          className={`
            w-14 h-14 rounded-lg flex items-center justify-center
            font-bold text-xl
            ${isRolling ? "dice-rolling" : ""}
          `}
          style={{
            background: "rgba(74, 158, 255, 0.15)",
            border: "1px solid rgba(74, 158, 255, 0.4)"
          }}
        >
          {isRolling ? (
            <span className="text-arcane-glow">?</span>
          ) : result ? (
            <span 
              className={
                result.isCriticalSuccess ? "text-yellow-400" :
                result.isCriticalFail ? "text-red-500" :
                "text-white"
              }
            >
              {result.total}
            </span>
          ) : (
            <span className="text-silver-dark">{notation}</span>
          )}
        </div>
        
        {/* Advantage/Disadvantage indicator */}
        {(hasAdvantage || hasDisadvantage) && (
          <div className={`text-xs font-medium ${hasAdvantage && !hasDisadvantage ? "text-green-400" : "text-red-400"}`}>
            {hasAdvantage && !hasDisadvantage ? "Advantage" : 
             hasDisadvantage && !hasAdvantage ? "Disadvantage" : "Normal"}
          </div>
        )}
        
        {/* Roll breakdown */}
        {result && !isRolling && (
          <div className="text-xs text-silver-dark">
            {result.advantageRolls ? (
              <span>({result.advantageRolls.join(", ")}) → {result.rolls[0]}</span>
            ) : result.disadvantageRolls ? (
              <span>({result.disadvantageRolls.join(", ")}) → {result.rolls[0]}</span>
            ) : (
              result.rolls.join(" + ")
            )}
            {result.modifier !== 0 && (
              <span>{result.modifier > 0 ? " + " : " - "}{Math.abs(result.modifier)}</span>
            )}
          </div>
        )}
        
        {/* Critical text */}
        {result?.isCriticalSuccess && (
          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded-full">
            CRIT!
          </span>
        )}
        {result?.isCriticalFail && (
          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
            FAIL
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
  criticalMax: PropTypes.number,
  hasAdvantage: PropTypes.bool,
  hasDisadvantage: PropTypes.bool
};

export { parseDice, rollDice };
export default DiceRoller;
