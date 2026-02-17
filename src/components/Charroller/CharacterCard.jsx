import { useState } from "react";
import PropTypes from "prop-types";
import { Sword, Ghost, Compass, Wand2, Play, Trash2, Clock, X, AlertTriangle } from "lucide-react";

/**
 * CharacterCard - Individual character display card with tavern theme
 * Includes delete confirmation dialog
 */

const SYSTEM_ICONS = {
  dnd5e: Sword,
  pathfinder2e: Compass,
  coc: Ghost,
  fate: Wand2,
};

const SYSTEM_COLORS = {
  dnd5e: "#dc2626",
  pathfinder2e: "#2563eb",
  coc: "#16a34a",
  fate: "#9333ea",
};

const CharacterCard = ({ 
  character, 
  onPlay, 
  onDelete,
  isCompact = false 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const SystemIcon = SYSTEM_ICONS[character.system] || Sword;
  const systemColor = SYSTEM_COLORS[character.system] || "#dc2626";
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    onDelete(character.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={handleCancelDelete}
    >
      <div 
        className="w-full max-w-sm p-6 rounded-xl animate-in fade-in zoom-in duration-200"
        style={{
          background: "linear-gradient(135deg, rgba(61, 40, 23, 0.98), rgba(42, 26, 15, 0.98))",
          border: "2px solid rgba(239, 68, 68, 0.5)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with warning icon */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(239, 68, 68, 0.2)" }}
          >
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-cinzel text-white">Delete Character?</h3>
            <p className="text-sm text-tavern-parchmentDark">This cannot be undone</p>
          </div>
        </div>
        
        {/* Character info */}
        <div 
          className="p-4 rounded-lg mb-5 flex items-center gap-3"
          style={{ 
            background: "rgba(139, 69, 19, 0.2)",
            border: "1px solid rgba(139, 69, 19, 0.3)"
          }}
        >
          {/* Mini portrait */}
          <div 
            className="w-12 h-12 rounded-lg flex-shrink-0 bg-cover bg-center"
            style={{
              backgroundImage: character.portrait_url 
                ? `url(${character.portrait_url})` 
                : undefined,
              background: !character.portrait_url 
                ? `linear-gradient(135deg, ${systemColor}33, ${systemColor}11)` 
                : undefined,
            }}
          >
            {!character.portrait_url && (
              <div className="w-full h-full flex items-center justify-center">
                <SystemIcon className="w-6 h-6" style={{ color: systemColor }} />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-cinzel text-tavern-parchment truncate">
              {character.character_name || "Unknown Hero"}
            </p>
            <p className="text-xs text-tavern-parchmentDark truncate">
              {character.class || character.occupation || "Adventurer"}
              {character.level ? ` • Lv. ${character.level}` : ""}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancelDelete}
            className="flex-1 py-3 px-4 rounded-lg font-medium transition-all
                       text-tavern-parchment hover:bg-white/10"
            style={{
              background: "rgba(139, 69, 19, 0.2)",
              border: "1px solid rgba(139, 69, 19, 0.4)"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="flex-1 py-3 px-4 rounded-lg font-medium transition-all
                       flex items-center justify-center gap-2 text-white
                       hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              border: "1px solid rgba(220, 38, 38, 0.6)"
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (isCompact) {
    return (
      <>
        <div 
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:scale-102"
          style={{
            background: "linear-gradient(135deg, rgba(61, 40, 23, 0.9), rgba(42, 26, 15, 0.9))",
            border: "1px solid rgba(139, 69, 19, 0.5)",
          }}
          onClick={() => onPlay(character)}
        >
          {/* Portrait */}
          <div 
            className="w-12 h-12 rounded-lg flex-shrink-0 bg-cover bg-center"
            style={{
              backgroundImage: character.portrait_url 
                ? `url(${character.portrait_url})` 
                : undefined,
              background: !character.portrait_url 
                ? `linear-gradient(135deg, ${systemColor}33, ${systemColor}11)` 
                : undefined,
            }}
          >
            {!character.portrait_url && (
              <div className="w-full h-full flex items-center justify-center">
                <SystemIcon className="w-6 h-6" style={{ color: systemColor }} />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-cinzel text-tavern-parchment truncate">
              {character.character_name || "Unknown Hero"}
            </h4>
            <p className="text-xs text-tavern-parchmentDark truncate">
              {character.class || character.occupation || character.high_concept || "Adventurer"}
            </p>
          </div>
          
          {/* System badge */}
          <div 
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{ 
              background: `${systemColor}22`,
              color: systemColor,
              border: `1px solid ${systemColor}44`
            }}
          >
            {character.system?.toUpperCase() || "DND"}
          </div>
        </div>
        
        {showDeleteConfirm && <DeleteConfirmModal />}
      </>
    );
  }

  return (
    <>
      <div 
        className="rounded-xl overflow-hidden transition-all hover:scale-102 hover:shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(61, 40, 23, 0.95), rgba(42, 26, 15, 0.95))",
          border: "2px solid rgba(139, 69, 19, 0.6)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Portrait */}
        <div 
          className="h-40 bg-cover bg-center relative"
          style={{
            backgroundImage: character.portrait_url 
              ? `url(${character.portrait_url})` 
              : undefined,
            background: !character.portrait_url 
              ? `linear-gradient(135deg, ${systemColor}33, ${systemColor}11)` 
              : undefined,
          }}
        >
          {!character.portrait_url && (
            <div className="absolute inset-0 flex items-center justify-center">
              <SystemIcon className="w-16 h-16 opacity-50" style={{ color: systemColor }} />
            </div>
          )}
          
          {/* System badge */}
          <div 
            className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold"
            style={{ 
              background: `${systemColor}`,
              color: "white",
            }}
          >
            {character.system_name || character.system?.toUpperCase() || "D&D"}
          </div>
          
          {/* Gradient overlay */}
          <div 
            className="absolute inset-x-0 bottom-0 h-20"
            style={{
              background: "linear-gradient(to top, rgba(42, 26, 15, 1), transparent)"
            }}
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-cinzel text-lg text-tavern-parchment mb-1">
            {character.character_name || "Unknown Hero"}
          </h3>
          
          <div className="flex flex-wrap gap-2 text-xs text-tavern-parchmentDark mb-3">
            {character.class && <span>{character.class}</span>}
            {character.level && <span>Lv. {character.level}</span>}
            {character.race && <span>{character.race}</span>}
            {character.occupation && <span>{character.occupation}</span>}
            {character.high_concept && <span>{character.high_concept}</span>}
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-tavern-parchmentDark mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(character.last_played)}
            </span>
            {character.play_count > 0 && (
              <span>{character.play_count} sessions</span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onPlay(character)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium
                       text-white transition-all hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${systemColor}, ${systemColor}cc)`,
              }}
            >
              <Play className="w-4 h-4" />
              Play
            </button>
            
            <button
              onClick={handleDeleteClick}
              className="px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 
                         hover:text-red-300 transition-colors"
              title="Delete character"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {showDeleteConfirm && <DeleteConfirmModal />}
    </>
  );
};

CharacterCard.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.string,
    character_name: PropTypes.string,
    system: PropTypes.string,
    system_name: PropTypes.string,
    portrait_url: PropTypes.string,
    class: PropTypes.string,
    level: PropTypes.number,
    race: PropTypes.string,
    occupation: PropTypes.string,
    high_concept: PropTypes.string,
    last_played: PropTypes.string,
    play_count: PropTypes.number,
  }).isRequired,
  onPlay: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
};

export default CharacterCard;
