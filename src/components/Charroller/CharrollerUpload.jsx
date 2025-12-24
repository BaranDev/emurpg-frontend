import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Upload, FileText, X, Loader2, Sparkles } from "lucide-react";

/**
 * CharrollerUpload - PDF upload component with drag-and-drop
 * Handles file selection, validation, and upload state
 */
const CharrollerUpload = ({ onFileSelect, onProcess, isLoading, selectedFile, onClearFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const validateAndSelectFile = (file) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a PDF file");
      return;
    }
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      alert("File size must be less than 20MB");
      return;
    }
    onFileSelect(file);
  };

  const handleClick = () => {
    if (!isLoading && !selectedFile) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".pdf"
        className="hidden"
      />
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative p-8 rounded-xl transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center min-h-[200px]
          ${isDragging ? "scale-102" : ""}
          ${selectedFile ? "cursor-default" : "hover:border-arcane-glow"}
        `}
        style={{
          background: isDragging 
            ? "rgba(74, 158, 255, 0.15)"
            : "rgba(30, 58, 95, 0.4)",
          border: isDragging 
            ? "2px dashed #4a9eff"
            : selectedFile 
              ? "2px solid rgba(74, 158, 255, 0.5)"
              : "2px dashed rgba(74, 158, 255, 0.3)",
          boxShadow: isDragging
            ? "0 0 30px rgba(74, 158, 255, 0.3)"
            : "none"
        }}
      >
        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-arcane-glow animate-spin" />
            <p className="text-silver-light">Processing your character sheet...</p>
            <p className="text-silver-dark text-sm">This may take a few seconds</p>
          </div>
        ) : selectedFile ? (
          // File selected state
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(74, 158, 255, 0.2)" }}
            >
              <FileText className="w-8 h-8 text-arcane-glow" />
            </div>
            <div className="text-center">
              <p className="text-silver-light font-medium">{selectedFile.name}</p>
              <p className="text-silver-dark text-sm">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFile();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 
                           hover:bg-red-500/10 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
              {onProcess && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProcess();
                  }}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                             text-white transition-all hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #4a9eff, #2d5a87)"
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Process
                </button>
              )}
            </div>
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(74, 158, 255, 0.15)",
                border: "1px solid rgba(74, 158, 255, 0.3)"
              }}
            >
              <Upload className="w-8 h-8 text-arcane-glow" />
            </div>
            <div className="text-center">
              <p className="text-silver-light font-medium mb-1">
                Drop your character sheet here
              </p>
              <p className="text-silver-dark text-sm">
                or click to browse (PDF only, max 20MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CharrollerUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  onProcess: PropTypes.func,
  isLoading: PropTypes.bool,
  selectedFile: PropTypes.object,
  onClearFile: PropTypes.func.isRequired
};

export default CharrollerUpload;
