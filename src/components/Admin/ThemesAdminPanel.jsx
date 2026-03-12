import { useState, useEffect, useCallback } from "react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import { useToast } from "../../hooks/useToast";
import {
  AdminButton,
  AdminModal,
  ConfirmDialog,
  LoadingSpinner,
  Toast,
} from "./shared";
import {
  Plus,
  Edit2,
  Trash2,
  Palette,
  Copy,
  Check,
  Users,
  Clock,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  XCircle,
} from "lucide-react";

const ThemesAdminPanel = () => {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    background_styles: "",
    background_image_url: "",
    card_styles: "",
    hover_animations: "",
    button_styles: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchThemes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/themes`, {
        headers: { apiKey },
      });
      if (res.ok) {
        const data = await res.json();
        setThemes(data);
      } else {
        setError("Failed to fetch themes.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const resetForm = () => {
    setForm({
      name: "",
      background_styles: "",
      background_image_url: "",
      card_styles: "",
      hover_animations: "",
      button_styles: "",
    });
    setIsEditMode(false);
    setSelectedThemeId(null);
    setIsUploading(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (theme) => {
    setForm({
      name: theme.name,
      background_styles: theme.background_styles || "",
      background_image_url: theme.background_image_url || "",
      card_styles: theme.card_styles,
      hover_animations: theme.hover_animations,
      button_styles: theme.button_styles,
    });
    setSelectedThemeId(theme.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("Image is too large. Maximum size is 10MB.", "warning");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${backendUrl}/api/admin/themes/upload`, {
        method: "POST",
        headers: { apiKey },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, background_image_url: data.url }));
        showToast("Image uploaded successfully", "success");
      } else {
        const data = await res.json();
        throw new Error(data.detail || "Upload failed");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, background_image_url: "" }));
  };

  const cleanClasses = (str) => {
    if (!str) return "";
    // Guardrail: Remove classes that alter dimensions or layout flow
    const blockedPatterns = [
      "w-",
      "h-",
      "min-w-",
      "max-w-",
      "min-h-",
      "max-h-",
      "flex",
      "grid",
      "block",
      "inline",
      "hidden",
      "absolute",
      "relative",
      "fixed",
      "sticky",
      "top-",
      "left-",
      "right-",
      "bottom-",
      "inset-",
      "p-",
      "px-",
      "py-",
      "pt-",
      "pb-",
      "m-",
      "mx-",
      "my-",
      "mt-",
      "mb-",
      "translate-",
      "scale-",
      "columns-",
      "float-",
      "clear-",
    ];

    // Looks for specific prefixes or standalone words
    // Correctly handles the '!' (important) prefix and uses \s|^ for boundaries
    const regex = new RegExp(
      `(?:^|\\s)!?(${blockedPatterns.join("|")})\\S*`,
      "gi",
    );
    return str.replace(regex, "").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enforce guardrail on all theme fields
    const cleanedForm = {
      ...form,
      card_styles: cleanClasses(form.card_styles),
      hover_animations: cleanClasses(form.hover_animations),
      button_styles: cleanClasses(form.button_styles),
      background_styles: cleanClasses(form.background_styles),
    };

    try {
      const url = isEditMode
        ? `${backendUrl}/api/admin/themes/${selectedThemeId}`
        : `${backendUrl}/api/admin/themes`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          apiKey,
        },
        body: JSON.stringify(cleanedForm),
      });

      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchThemes();
        showToast(isEditMode ? "Theme updated" : "Theme created", "success");
      } else {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save theme");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = (theme) => {
    if (theme.id === "default") {
      showToast("Cannot delete the master default theme.", "warning");
      return;
    }
    setConfirmDialog({
      open: true,
      title: "Delete Theme",
      message: `Are you sure you want to delete "${theme.name}"? Tables using this theme will revert to the default theme.`,
      onConfirm: async () => {
        try {
          const res = await fetch(
            `${backendUrl}/api/admin/themes/${theme.id}`,
            {
              method: "DELETE",
              headers: { apiKey },
            },
          );
          if (res.ok) {
            fetchThemes();
            showToast("Theme deleted", "success");
          } else {
            const data = await res.json();
            throw new Error(data.detail || "Failed to delete theme");
          }
        } catch (err) {
          showToast(err.message, "error");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const copyPrompt = () => {
    const prompt = `I want to create a visually stunning TailwindCSS theme for a card component. 

Please provide exactly five snippets. For each snippet, provide a brief label and then the content inside a markdown code block so I can easily copy them.

Provide them in this EXACT order:
1) Theme Name (a creative name for this theme).
2) Card Styles (Tailwind classes for the card structure, borders, shadows, text colors).
3) Background Styles (Tailwind classes for the overall page background, e.g. bg-gray-900 or gradients).
4) Hover Animations (Tailwind classes for transformations like hover:scale-105).
5) Button Styles (Tailwind classes for the button background, hover states, rounded status).

IMPORTANT RULES:
- Use clear, descriptive Tailwind classes.
- DO NOT use any width, height, or sizing classes (e.g., NO w-*, h-*, min-*, max-*).
- DO NOT use margin or padding that could change the card's overall footprint.
- Output ONLY the classes or name. DO NOT include JSON keys, quotes, or colons inside the code blocks.
- Present each field like this:
   Field Name
   \`\`\`
   content here
   \`\`\``;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderThemePreviewCard = (theme, nameOverride = null) => {
    const hasTextClass = (theme.card_styles || "").includes("text-");
    const titleClass = hasTextClass ? "" : "text-amber-100";
    const bodyMutedClass = hasTextClass ? "opacity-75" : "text-stone-400";
    const bodyStrongClass = hasTextClass ? "" : "text-stone-200";
    const secondaryButtonClass = theme.button_styles
      ? `${theme.button_styles} opacity-85`
      : "bg-indigo-950/60 text-indigo-300 border border-indigo-500/30";

    return (
      <div
        className={`relative !flex !flex-col h-full min-h-[420px] overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${theme.background_styles || "bg-gray-800"} ${theme.card_styles || ""} ${theme.hover_animations || ""}`}
      >
        {theme.background_image_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={theme.background_image_url}
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        )}

        <div className="flex flex-col h-full relative z-10">
          <div className="w-full h-36 overflow-hidden relative bg-black/20">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <Palette className="w-10 h-10" />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.45) 100%)",
              }}
            />
          </div>

          <div className="p-5 flex-grow flex flex-col gap-2">
            <h3
              className={`text-base font-cinzel font-semibold text-center leading-snug ${titleClass}`}
            >
              {nameOverride || theme.name}
            </h3>

            <p className="text-center">
              <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-400/25 text-xs">
                EN
              </span>
            </p>

            <p className={`text-xs text-center ${bodyMutedClass}`}>
              Quest Master: <span className={bodyStrongClass}>Arin</span>
            </p>

            <p className={`text-xs text-center ${bodyMutedClass}`}>
              ⏱ ~240 minutes
            </p>

            <p className="text-center">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-400/25 text-xs">
                5 total seats available
              </span>
            </p>
          </div>

          <div
            className="p-3"
            style={{
              background: "rgba(0, 0, 0, 0.22)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex gap-2">
              <button
                className={`flex-1 text-center text-sm px-3 py-2 rounded-lg border transition-all duration-200 ${theme.button_styles || "bg-gray-700 text-white border-gray-600"}`}
                disabled
              >
                Register
              </button>
              <button
                className={`text-center text-sm px-3 py-2 rounded-lg border transition-all duration-200 ${secondaryButtonClass}`}
                disabled
              >
                Game Info
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-lg">
        <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          Error Loading Themes
        </h3>
        <p className="text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel flex items-center gap-3">
            <Palette className="w-8 h-8 text-yellow-500" />
            Table Themes
          </h2>
          <p className="text-gray-400 mt-1">
            Manage visual appearances for event tables
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AdminButton onClick={handleOpenCreate} icon={Plus}>
            Create New Theme
          </AdminButton>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {themes.map((theme) => (
          <div key={theme.id} className="space-y-3">
            <div className="relative">
              {renderThemePreviewCard(theme)}
              {theme.is_default && (
                <span className="absolute top-3 right-3 z-20 text-[10px] bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30 uppercase tracking-widest">
                  Default
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <AdminButton
                onClick={() => handleOpenEdit(theme)}
                variant="secondary"
                className="flex-1"
                size="sm"
                icon={Edit2}
              >
                Edit
              </AdminButton>
              {theme.id !== "default" && (
                <AdminButton
                  onClick={() => handleDelete(theme)}
                  variant="danger"
                  className="flex-1"
                  size="sm"
                  icon={Trash2}
                >
                  Delete
                </AdminButton>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
          setShowMobilePreview(false);
        }}
        size="xl"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Content */}
          <div className="w-full lg:flex-[2] space-y-4">
            {/* AI Prompter */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 sm:p-4 rounded-lg">
              <div className="flex justify-between items-center gap-2">
                <h4 className="text-indigo-400 font-semibold text-sm">
                  🤖 LLM Theme Generator Helper
                </h4>
                <button
                  onClick={copyPrompt}
                  className="flex-shrink-0 text-indigo-300 hover:text-white flex items-center gap-1 text-xs bg-indigo-500/20 px-2 py-1 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? "Copied!" : "Copy Prompt"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 hidden sm:block">
                Copy the prompt and paste it into ChatGPT/Claude. Then paste the
                resulting JSON values into the fields below to see a live
                preview.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Theme Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g. The Enchanted Forest"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Card Styles (Tailwind Classes)
                </label>
                <textarea
                  value={form.card_styles}
                  onChange={(e) =>
                    setForm({ ...form, card_styles: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none font-mono text-sm"
                  rows="2"
                  placeholder="bg-green-900 border border-green-500 rounded-xl shadow-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Background Styles (Tailwind Classes)
                </label>
                <input
                  type="text"
                  value={form.background_styles}
                  onChange={(e) =>
                    setForm({ ...form, background_styles: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none font-mono text-sm"
                  placeholder="bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Background Image
                </label>
                {!config.ENABLE_R2 && (
                  <div className="mb-3 p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-200/80">
                      Image uploads are temporarily disabled. You can still
                      customize colors and animations.
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {form.background_image_url ? (
                    <div className="relative group">
                      <img
                        src={form.background_image_url}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg transition-colors ${
                        !config.ENABLE_R2
                          ? "border-gray-700 bg-gray-800/50 cursor-not-allowed"
                          : "border-gray-600 cursor-pointer hover:border-yellow-500"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-2">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                        ) : (
                          <>
                            <Upload
                              className={`w-6 h-6 ${!config.ENABLE_R2 ? "text-gray-600" : "text-gray-400"}`}
                            />
                            <span className="text-[10px] text-gray-500 mt-1 uppercase">
                              {config.ENABLE_R2 ? "Upload" : "Fixed"}
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading || !config.ENABLE_R2}
                      />
                    </label>
                  )}
                  <div className="text-xs text-gray-500 italic max-w-[200px]">
                    Optimized to WebP automatically. Recommended: dark or subtle
                    patterns.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Hover Animations (Tailwind Classes)
                </label>
                <textarea
                  value={form.hover_animations}
                  onChange={(e) =>
                    setForm({ ...form, hover_animations: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none font-mono text-sm"
                  rows="2"
                  placeholder="transition-all transform hover:-translate-y-2 hover:shadow-green-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Button Styles (Tailwind Classes)
                </label>
                <textarea
                  value={form.button_styles}
                  onChange={(e) =>
                    setForm({ ...form, button_styles: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none font-mono text-sm"
                  rows="2"
                  placeholder="bg-green-600 hover:bg-green-500 text-white rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-700">
                <AdminButton
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                    setShowMobilePreview(false);
                  }}
                >
                  Cancel
                </AdminButton>
                <AdminButton type="submit" className="flex-1">
                  {isEditMode ? "Save Changes" : "Create Theme"}
                </AdminButton>
              </div>
            </form>
          </div>

          {/* Live Preview Pane */}
          <div className="w-full lg:flex-[1] lg:max-w-sm">
            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setShowMobilePreview((v) => !v)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-2.5 rounded-lg mb-3 text-sm font-cinzel text-amber-200/70 transition-colors"
              style={{
                background: "rgba(120,80,10,0.18)",
                border: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              <span>Live Preview</span>
              <span
                className="text-xs transition-transform duration-200"
                style={{
                  display: "inline-block",
                  transform: showMobilePreview
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                ▾
              </span>
            </button>

            {/* Always visible on lg+, toggled on smaller */}
            <div
              className={`${showMobilePreview ? "block" : "hidden"} lg:block`}
            >
              <h4 className="hidden lg:block text-gray-400 font-semibold text-sm mb-4 uppercase tracking-wider border-l border-gray-700 pl-6">
                Live Preview
              </h4>
              <div className="lg:pl-6 lg:border-l lg:border-gray-700">
                {renderThemePreviewCard(
                  {
                    id: selectedThemeId || "preview",
                    name: form.name || "Theme Name Preview",
                    background_styles: form.background_styles || "",
                    background_image_url: form.background_image_url || "",
                    card_styles: form.card_styles || "",
                    hover_animations: form.hover_animations || "",
                    button_styles: form.button_styles || "",
                    is_default: false,
                  },
                  form.name || "Theme Name Preview",
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
      {/* Toast Notification */}
      <Toast {...toast} onClose={hideToast} />
    </div>
  );
};

export default ThemesAdminPanel;
