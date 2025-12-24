import PropTypes from "prop-types";
import { Sword, Ghost, Compass, Wand2 } from "lucide-react";

/**
 * CharrollerSystemSelector - TTRPG system selection component
 * Allows users to choose which game system they're using
 */

const SYSTEMS = [
  {
    id: "dnd5e",
    name: "D&D 5e",
    fullName: "Dungeons & Dragons 5th Edition",
    icon: Sword,
    color: "#dc2626",
    description: "The world's greatest roleplaying game"
  },
  {
    id: "pathfinder2e",
    name: "Pathfinder 2e",
    fullName: "Pathfinder 2nd Edition",
    icon: Compass,
    color: "#2563eb",
    description: "Epic fantasy adventure"
  },
  {
    id: "coc",
    name: "Call of Cthulhu",
    fullName: "Call of Cthulhu 7th Edition",
    icon: Ghost,
    color: "#16a34a",
    description: "Cosmic horror investigation"
  },
  {
    id: "fate",
    name: "Fate Core",
    fullName: "Fate Core System",
    icon: Wand2,
    color: "#9333ea",
    description: "Narrative-driven roleplay"
  }
];

const CharrollerSystemSelector = ({ selectedSystem, onSystemChange }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-xl font-cinzel text-silver-light mb-6 text-center">
        Choose Your TTRPG System
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SYSTEMS.map((system) => {
          const Icon = system.icon;
          const isSelected = selectedSystem === system.id;
          
          return (
            <button
              key={system.id}
              onClick={() => onSystemChange(system.id)}
              className={`
                relative p-4 rounded-xl transition-all duration-300
                flex flex-col items-center gap-3 text-center
                ${isSelected ? "scale-105" : "hover:scale-102"}
              `}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${system.color}33, ${system.color}11)`
                  : "rgba(30, 58, 95, 0.4)",
                border: isSelected 
                  ? `2px solid ${system.color}`
                  : "2px solid rgba(74, 158, 255, 0.2)",
                boxShadow: isSelected 
                  ? `0 0 20px ${system.color}40`
                  : "none"
              }}
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `${system.color}22`,
                  border: `1px solid ${system.color}55`
                }}
              >
                <Icon 
                  className="w-6 h-6" 
                  style={{ color: isSelected ? system.color : "#c0c0c0" }}
                />
              </div>
              
              {/* Name */}
              <span 
                className="font-semibold text-sm"
                style={{ color: isSelected ? system.color : "#e8e8e8" }}
              >
                {system.name}
              </span>
              
              {/* Description (hidden on mobile) */}
              <span className="hidden md:block text-xs text-silver-dark">
                {system.description}
              </span>
              
              {/* Selected indicator */}
              {isSelected && (
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                  style={{ background: system.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

CharrollerSystemSelector.propTypes = {
  selectedSystem: PropTypes.string.isRequired,
  onSystemChange: PropTypes.func.isRequired
};

export { SYSTEMS };
export default CharrollerSystemSelector;
