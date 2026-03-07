import { useState, useEffect, useCallback } from "react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminButton from "./shared/AdminButton";
import AdminModal from "./shared/AdminModal";
import ConfirmDialog from "./shared/ConfirmDialog";
import LoadingSpinner from "./shared/LoadingSpinner";
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
      alert("Image is too large. Maximum size is 10MB.");
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
      } else {
        const data = await res.json();
        alert(`Upload failed: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Error uploading: ${err.message}`);
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
      } else {
        const data = await res.json();
        alert(`Error: ${data.detail || "Failed to save theme"}`);
      }
    } catch (err) {
      alert(`Error saving theme: ${err.message}`);
    }
  };

  const handleDelete = (theme) => {
    if (theme.id === "default") {
      alert("Cannot delete the master default theme.");
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
          } else {
            const data = await res.json();
            alert(`Error: ${data.detail || "Failed to delete theme"}`);
          }
        } catch (err) {
          alert(`Error deleting theme: ${err.message}`);
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
        <AdminButton onClick={handleOpenCreate} icon={Plus}>
          Create New Theme
        </AdminButton>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`shadow-lg !flex !flex-col h-full min-h-[400px] overflow-hidden relative ${theme.background_styles || "bg-gray-800"} ${theme.card_styles} ${theme.hover_animations}`}
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
            <div className="w-full h-32 overflow-hidden bg-gray-700/50 relative z-10">
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Palette className="w-12 h-12" />
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between relative z-10">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`text-xl font-bold text-center font-medieval ${
                      !theme.id || theme.id === "default"
                        ? "text-yellow-500"
                        : ""
                    }`}
                  >
                    {theme.name}
                  </h3>
                  {theme.is_default && (
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/30 uppercase tracking-widest ml-2 flex-shrink-0">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-gray-300 mb-4 text-sm mt-4">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> 2 / 5
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 4 hrs
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  className={`w-full text-center px-4 py-2 transition-colors ${theme.button_styles}`}
                  disabled
                >
                  Join Table (Preview)
                </button>
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
        }}
        size="xl"
      >
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Form Content */}
          <div className="w-full xl:flex-[2] space-y-4">
            {/* AI Prompter */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-indigo-400 font-semibold text-sm">
                  🤖 LLM Theme Generator Helper
                </h4>
                <button
                  onClick={copyPrompt}
                  className="text-indigo-300 hover:text-white flex items-center gap-1 text-xs bg-indigo-500/20 px-2 py-1 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? "Copied!" : "Copy Prompt"}
                </button>
              </div>
              <p className="text-xs text-gray-400">
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
                      Image uploads are temporarily disabled. You can still customize colors and animations.
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
                            <Upload className={`w-6 h-6 ${!config.ENABLE_R2 ? "text-gray-600" : "text-gray-400"}`} />
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
                    Optimized to WebP automatically. Recommended: dark or subtle patterns.
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

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <AdminButton type="submit" className="flex-1">
                  {isEditMode ? "Save Changes" : "Create Theme"}
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </AdminButton>
              </div>
            </form>
          </div>

          {/* Live Preview Pane */}
          <div className="w-full xl:flex-[1] xl:max-w-md border-t xl:border-t-0 xl:border-l border-gray-700 pt-6 xl:pt-0 xl:pl-6">
            <h4 className="text-gray-400 font-semibold text-sm mb-4 uppercase tracking-wider">
              Live Preview
            </h4>
            <div
              className={`shadow-lg !flex !flex-col h-[400px] overflow-hidden relative ${form.background_styles || "bg-gray-800"} ${form.card_styles} ${form.hover_animations}`}
            >
              {form.background_image_url && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={form.background_image_url}
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
              )}
              <div className="w-full h-32 overflow-hidden bg-gray-700/50 relative z-10">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <Palette className="w-12 h-12" />
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between relative z-10">
                <div>
                  <h3
                    className={`text-xl font-bold text-center font-medieval ${
                      !form.card_styles.includes("text-")
                        ? "text-yellow-500"
                        : ""
                    }`}
                  >
                    {form.name || "Theme Name Preview"}
                  </h3>
                  <div className="flex justify-between items-center text-gray-300 mb-4 text-sm mt-4">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> 2 / 5
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 4 hrs
                    </span>
                  </div>
                </div>
                <button
                  className={`w-full text-center px-4 py-2 transition-colors ${
                    form.button_styles ||
                    "bg-gray-600 text-white rounded cursor-not-allowed"
                  }`}
                  disabled
                >
                  Join Table
                </button>
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
    </div>
  );
};

export default ThemesAdminPanel;
