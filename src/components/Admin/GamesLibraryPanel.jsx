import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  Clock,
  Users,
  Image,
  Video,
  FileText,
  AlertCircle,
  Gamepad2,
  Upload,
  XCircle,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";

const GamesLibraryPanel = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    avg_play_time: 60,
    min_players: 1,
    max_players: 8,
    image_url: "",
    guide_text: "",
    guide_video_url: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Maximum size is 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${backendUrl}/api/admin/games/upload`, {
        method: "POST",
        headers: { apiKey },
        body: fd,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, image_url: data.url }));
      } else {
        const data = await res.json();
        throw new Error(data.detail || "Upload failed");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => setFormData((prev) => ({ ...prev, image_url: "" }));

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/games`, {
        headers: { apiKey },
      });

      if (!response.ok) throw new Error("Failed to fetch games");

      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create game");

      setIsCreateModalOpen(false);
      resetForm();
      fetchGames();
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Failed to create game");
    }
  };

  const handleUpdateGame = async (e) => {
    e.preventDefault();
    if (!selectedGame) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/games/${selectedGame.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to update game");

      setIsEditModalOpen(false);
      setSelectedGame(null);
      resetForm();
      fetchGames();
    } catch (error) {
      console.error("Error updating game:", error);
      alert("Failed to update game");
    }
  };

  const handleDeleteGame = async (game) => {
    setConfirmDialog({
      open: true,
      title: "Delete Game",
      message: `Are you sure you want to delete "${game.name}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/games/${game.id}`,
            {
              method: "DELETE",
              headers: { apiKey },
            },
          );

          if (!response.ok) throw new Error("Failed to delete game");
          fetchGames();
        } catch (error) {
          console.error("Error deleting game:", error);
          alert("Failed to delete game");
        }
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      avg_play_time: 60,
      min_players: 1,
      max_players: 8,
      image_url: "",
      guide_text: "",
      guide_video_url: "",
    });
  };

  const openEditModal = (game) => {
    setSelectedGame(game);
    setFormData({
      id: game.id,
      name: game.name,
      avg_play_time: game.avg_play_time || 60,
      min_players: game.min_players || 1,
      max_players: game.max_players || 8,
      image_url: game.image_url || "",
      guide_text: game.guide_text || "",
      guide_video_url: game.guide_video_url || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (game) => {
    setSelectedGame(game);
    setIsViewModalOpen(true);
  };

  const filteredGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel">
            Games Library
          </h2>
          <p className="text-gray-400 text-sm">
            Manage your board games and RPG collection
          </p>
        </div>
        <div className="flex gap-2">
          <AdminButton
            onClick={fetchGames}
            variant="secondary"
            icon={RefreshCw}
          >
            Refresh
          </AdminButton>
          <AdminButton onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
            Add Game
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm">Total Games</span>
          </div>
          <p className="text-2xl font-bold text-white">{games.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Image className="w-4 h-4 text-blue-500" />
            <span className="text-gray-400 text-sm">With Images</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {games.filter((g) => g.image_url).length}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-4 h-4 text-purple-500" />
            <span className="text-gray-400 text-sm">With Videos</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {games.filter((g) => g.guide_video_url).length}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-green-500" />
            <span className="text-gray-400 text-sm">With Guides</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {games.filter((g) => g.guide_text).length}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
        />
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No games found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-colors group"
            >
              <div className="relative h-40 bg-gray-900">
                {game.image_url ? (
                  <img
                    src={game.image_url}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/300/200?grayscale";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gamepad2 className="w-16 h-16 text-gray-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-yellow-500 mb-2 truncate">
                  {game.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{game.avg_play_time || 0} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>
                      {game.min_players || 1} - {game.max_players || 8} players
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">ID: {game.id}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <AdminButton
                    onClick={() => openViewModal(game)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    View
                  </AdminButton>
                  <AdminButton
                    onClick={() => openEditModal(game)}
                    variant="secondary"
                    size="sm"
                    icon={Edit3}
                  />
                  <AdminButton
                    onClick={() => handleDeleteGame(game)}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Game Modal */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Add New Game"
      >
        <form onSubmit={handleCreateGame} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Game ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                placeholder="e.g., dnd-5e, catan"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Game Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Dungeons & Dragons"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Play Time (min)
              </label>
              <input
                type="number"
                value={formData.avg_play_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avg_play_time: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Min Players
              </label>
              <input
                type="number"
                value={formData.min_players}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_players: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Players
              </label>
              <input
                type="number"
                value={formData.max_players}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_players: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image
            </label>
            {!config.ENABLE_R2 && (
              <div className="mb-3 p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-200/80">
                  Image uploads are temporarily disabled.
                </p>
              </div>
            )}
            <div className="flex items-center gap-4">
              {formData.image_url ? (
                <div className="relative group">
                  <img
                    src={formData.image_url}
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
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500" />
                    ) : (
                      <>
                        <Upload
                          className={`w-6 h-6 ${
                            !config.ENABLE_R2
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="text-[10px] text-gray-500 mt-1 uppercase">
                          {config.ENABLE_R2 ? "Upload" : "Disabled"}
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
                Optimized to WebP automatically. Max 5 MB.
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Guide Text
            </label>
            <textarea
              value={formData.guide_text}
              onChange={(e) =>
                setFormData({ ...formData, guide_text: e.target.value })
              }
              placeholder="Game description and how to play..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Guide Video URL
            </label>
            <input
              type="text"
              value={formData.guide_video_url}
              onChange={(e) =>
                setFormData({ ...formData, guide_video_url: e.target.value })
              }
              placeholder="https://www.youtube.com/embed/..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <AdminButton type="submit" className="flex-1">
              Add Game
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Edit Game Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGame(null);
          resetForm();
        }}
        title={`Edit Game: ${selectedGame?.name || ""}`}
      >
        <form onSubmit={handleUpdateGame} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Game ID
              </label>
              <input
                type="text"
                value={formData.id}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Game Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Play Time (min)
              </label>
              <input
                type="number"
                value={formData.avg_play_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avg_play_time: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Min Players
              </label>
              <input
                type="number"
                value={formData.min_players}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_players: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Players
              </label>
              <input
                type="number"
                value={formData.max_players}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_players: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image
            </label>
            {!config.ENABLE_R2 && (
              <div className="mb-3 p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-200/80">
                  Image uploads are temporarily disabled.
                </p>
              </div>
            )}
            <div className="flex items-center gap-4">
              {formData.image_url ? (
                <div className="relative group">
                  <img
                    src={formData.image_url}
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
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500" />
                    ) : (
                      <>
                        <Upload
                          className={`w-6 h-6 ${
                            !config.ENABLE_R2
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="text-[10px] text-gray-500 mt-1 uppercase">
                          {config.ENABLE_R2 ? "Upload" : "Disabled"}
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
                Optimized to WebP automatically. Max 5 MB.
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Guide Text
            </label>
            <textarea
              value={formData.guide_text}
              onChange={(e) =>
                setFormData({ ...formData, guide_text: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Guide Video URL
            </label>
            <input
              type="text"
              value={formData.guide_video_url}
              onChange={(e) =>
                setFormData({ ...formData, guide_video_url: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <AdminButton type="submit" className="flex-1">
              Update Game
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedGame(null);
                resetForm();
              }}
            >
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* View Game Modal */}
      <AdminModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedGame(null);
        }}
        title={selectedGame?.name || ""}
        size="lg"
      >
        {selectedGame && (
          <div className="space-y-6">
            {selectedGame.image_url && (
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={selectedGame.image_url}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/600/300?grayscale";
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {selectedGame.avg_play_time || 0}
                </p>
                <p className="text-sm text-gray-400">minutes</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {selectedGame.min_players || 1} -{" "}
                  {selectedGame.max_players || 8}
                </p>
                <p className="text-sm text-gray-400">players</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <Gamepad2 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-lg font-mono text-white truncate">
                  {selectedGame.id}
                </p>
                <p className="text-sm text-gray-400">ID</p>
              </div>
            </div>

            {selectedGame.guide_text && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Game Guide
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap bg-gray-800/50 rounded-lg p-4">
                  {selectedGame.guide_text}
                </p>
              </div>
            )}

            {selectedGame.guide_video_url && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video Guide
                </h4>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src={selectedGame.guide_video_url}
                    className="w-full h-full"
                    allowFullScreen
                    title="Game guide video"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <AdminButton
                onClick={() => openEditModal(selectedGame)}
                className="flex-1"
                icon={Edit3}
              >
                Edit Game
              </AdminButton>
              <AdminButton
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDeleteGame(selectedGame);
                }}
                variant="danger"
                icon={Trash2}
              >
                Delete
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
      />
    </div>
  );
};

export default GamesLibraryPanel;
