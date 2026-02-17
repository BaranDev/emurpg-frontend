import { useState } from "react";
import PropTypes from "prop-types";
import { Sparkles, Loader2 } from "lucide-react";

/**
 * CharrollerDescribe - Text input for character generation from description
 * Allows users to describe their character in natural language
 */
const CharrollerDescribe = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (description.trim().length >= 10) {
      onSubmit(description.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const examplePrompts = [
    "A grumpy dwarf blacksmith who secretly loves poetry",
    "An elven ranger with a mysterious past and a pet owl",
    "A halfling rogue who used to be a chef",
    "A human paladin seeking redemption for past mistakes"
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
          relative rounded-xl transition-all duration-300
          ${focused ? "ring-2 ring-arcane-glow/50" : ""}
        `}
        style={{
          background: "rgba(30, 58, 95, 0.4)",
          border: "2px solid rgba(74, 158, 255, 0.3)"
        }}
      >
        {/* Text area */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Describe your character..."
          className="
            w-full h-40 p-4 bg-transparent text-silver-light resize-none
            placeholder-silver-dark outline-none
          "
        />
        
        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-silver-dark">
          {description.length} characters
        </div>
      </div>
      
      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || description.trim().length < 10}
        className={`
          w-full mt-4 py-3 px-6 rounded-lg font-semibold
          flex items-center justify-center gap-2
          transition-all duration-300
          ${isLoading || description.trim().length < 10
            ? "opacity-50 cursor-not-allowed"
            : "hover:-translate-y-0.5"
          }
        `}
        style={{
          background: "linear-gradient(135deg, #9333ea, #7c3aed)",
          color: "white",
          boxShadow: description.trim().length >= 10 
            ? "0 0 20px rgba(147, 51, 234, 0.3)"
            : "none"
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Character...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Character
          </>
        )}
      </button>
      
      {/* Helper text */}
      <p className="text-center text-silver-dark text-sm mt-3">
        Press Ctrl+Enter to generate
      </p>
      
      {/* Example prompts */}
      <div className="mt-6">
        <p className="text-silver-dark text-sm mb-3">Need inspiration? Try:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setDescription(prompt)}
              disabled={isLoading}
              className="
                px-3 py-1.5 rounded-full text-xs text-silver-light
                transition-colors hover:bg-arcane-light/20
              "
              style={{
                background: "rgba(30, 58, 95, 0.6)",
                border: "1px solid rgba(74, 158, 255, 0.2)"
              }}
            >
              {prompt.length > 40 ? prompt.substring(0, 40) + "..." : prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

CharrollerDescribe.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default CharrollerDescribe;
