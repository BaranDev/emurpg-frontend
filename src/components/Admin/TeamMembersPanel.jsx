import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Upload,
  User,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Globe,
  AlertCircle,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import { useToast } from "../../hooks/useToast";
import { 
  AdminModal, 
  AdminButton, 
  LoadingSpinner, 
  ConfirmDialog,
  Toast 
} from "./shared";

const INITIAL_FORM = {
  name: "",
  title: "",
  description: "",
  display_order: 0,
  is_active: true,
  socials: {
    instagram: "",
    linkedin: "",
    github: "",
    youtube: "",
    discord: "",
    website: "",
  },
};

const TeamMembersPanel = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { toast, showToast, hideToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/team-members`, {
        headers: { apiKey },
      });

      if (!response.ok) throw new Error("Failed to fetch team members");

      const data = await response.json();
      const sorted = [...data].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
      );
      setMembers(sorted);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("title", formData.title);
    fd.append("description", formData.description || "");
    fd.append("display_order", formData.display_order);
    fd.append("is_active", formData.is_active);
    fd.append("socials", JSON.stringify(formData.socials));
    if (photoFile) {
      fd.append("photo", photoFile);
    }
    return fd;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/team-members`, {
        method: "POST",
        headers: { apiKey },
        body: buildFormData(),
      });

      if (!response.ok) throw new Error("Failed to create team member");

      setIsCreateModalOpen(false);
      resetForm();
      fetchMembers();
      showToast("Team member created successfully", "success");
    } catch (error) {
      console.error("Error creating team member:", error);
      showToast(error.message || "Failed to create team member", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/team-members/${selectedMember._id}`,
        {
          method: "PUT",
          headers: { apiKey },
          body: buildFormData(),
        },
      );

      if (!response.ok) throw new Error("Failed to update team member");

      setIsEditModalOpen(false);
      setSelectedMember(null);
      resetForm();
      fetchMembers();
      showToast("Team member updated successfully", "success");
    } catch (error) {
      console.error("Error updating team member:", error);
      showToast(error.message || "Failed to update team member", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (member) => {
    setConfirmDialog({
      open: true,
      title: "Delete Team Member",
      message: `Are you sure you want to delete "${member.name}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/team-members/${member._id}`,
            {
              method: "DELETE",
              headers: { apiKey },
            },
          );

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Failed to delete team member");
          }
          fetchMembers();
          showToast("Team member deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting team member:", error);
          showToast(error.message, "error");
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

  const handleReorder = async (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === members.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...members];
    const tempOrder = updated[index].display_order;
    updated[index].display_order = updated[swapIndex].display_order;
    updated[swapIndex].display_order = tempOrder;

    // Swap positions in array
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setMembers(updated);

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/team-members/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify({
            items: updated.map((m) => ({
              id: m._id,
              display_order: m.display_order,
            })),
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to reorder team members");
      }
      showToast("Order updated", "success");
    } catch (error) {
      console.error("Error reordering team members:", error);
      showToast(error.message, "error");
      fetchMembers();
    }
  };

  const resetForm = () => {
    setFormData({ ...INITIAL_FORM, socials: { ...INITIAL_FORM.socials } });
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name || "",
      title: member.title || "",
      description: member.description || "",
      display_order: member.display_order ?? 0,
      is_active: member.is_active !== false,
      socials: {
        instagram: member.socials?.instagram || "",
        linkedin: member.socials?.linkedin || "",
        github: member.socials?.github || "",
        youtube: member.socials?.youtube || "",
        discord: member.socials?.discord || "",
        website: member.socials?.website || "",
      },
    });
    setPhotoFile(null);
    setPhotoPreview(member.photo_url || null);
    setIsEditModalOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const updateSocialLink = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: value },
    }));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const renderForm = (onSubmit, submitLabel) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Photo upload */}
      <div className="flex flex-col items-center gap-3">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Photo
        </label>
        {!config.ENABLE_R2 && (
          <div className="mb-2 p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg flex items-center gap-3 w-full max-w-md">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-200/80">
              Photo uploads are temporarily disabled. Team profiles will use repository assets where available.
            </p>
          </div>
        )}
        <div className={`relative group ${!config.ENABLE_R2 ? "cursor-not-allowed" : "cursor-pointer"}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={!config.ENABLE_R2}
            className={`absolute inset-0 w-full h-full opacity-0 z-10 ${!config.ENABLE_R2 ? "cursor-not-allowed" : "cursor-pointer"}`}
          />
          <div className={`w-[120px] h-[120px] rounded-full border-2 overflow-hidden bg-gray-800 flex items-center justify-center transition-colors ${
            !config.ENABLE_R2 
              ? "border-gray-700" 
              : "border-amber-600/50 group-hover:border-amber-400"
          }`}>
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs">{config.ENABLE_R2 ? "Upload" : "Fixed"}</span>
              </div>
            )}
          </div>
          {config.ENABLE_R2 && (
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <Upload className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Name and Title */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full name"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., President, Game Master"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Short bio or description..."
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
          rows={3}
        />
      </div>

      {/* Display Order and Active Toggle */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Display Order
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Active Status
          </label>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, is_active: !formData.is_active })
            }
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              formData.is_active
                ? "bg-emerald-900/30 border-emerald-600 text-emerald-400"
                : "bg-gray-700 border-gray-600 text-gray-400"
            }`}
          >
            {formData.is_active ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Social Links
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
            <input
              type="text"
              value={formData.socials.instagram}
              onChange={(e) => updateSocialLink("instagram", e.target.value)}
              placeholder="Instagram URL"
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-blue-400 shrink-0" />
            <input
              type="text"
              value={formData.socials.linkedin}
              onChange={(e) => updateSocialLink("linkedin", e.target.value)}
              placeholder="LinkedIn URL"
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-gray-300 shrink-0" />
            <input
              type="text"
              value={formData.socials.github}
              onChange={(e) => updateSocialLink("github", e.target.value)}
              placeholder="GitHub URL"
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-400 shrink-0" />
            <input
              type="text"
              value={formData.socials.youtube}
              onChange={(e) => updateSocialLink("youtube", e.target.value)}
              placeholder="YouTube URL"
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-400 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            <input
              type="text"
              value={formData.socials.discord}
              onChange={(e) => updateSocialLink("discord", e.target.value)}
              placeholder="Discord username"
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={formData.socials.website}
              onChange={(e) => updateSocialLink("website", e.target.value)}
              placeholder="Website URL"
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <AdminButton type="submit" className="flex-1" loading={isSubmitting}>
          {submitLabel}
        </AdminButton>
        <AdminButton
          type="button"
          variant="secondary"
          onClick={() => {
            if (isEditModalOpen) {
              setIsEditModalOpen(false);
              setSelectedMember(null);
            } else {
              setIsCreateModalOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </AdminButton>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel">
            Team Members
          </h2>
          <p className="text-gray-400 text-sm">
            Manage your club&apos;s team members and their profiles
          </p>
        </div>
        <div className="flex gap-2">
          <AdminButton
            onClick={fetchMembers}
            variant="secondary"
            icon={RefreshCw}
          >
            Refresh
          </AdminButton>
          <AdminButton
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            icon={Plus}
          >
            Add Member
          </AdminButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm">Total Members</span>
          </div>
          <p className="text-2xl font-bold text-white">{members.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-emerald-500" />
            <span className="text-gray-400 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {members.filter((m) => m.is_active !== false).length}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-red-500" />
            <span className="text-gray-400 text-sm">Inactive</span>
          </div>
          <p className="text-2xl font-bold text-red-400">
            {members.filter((m) => m.is_active === false).length}
          </p>
        </div>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No team members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((member, index) => (
            <div
              key={member._id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-colors group"
            >
              <div className="p-4">
                {/* Reorder arrows */}
                <div className="flex justify-end gap-1 mb-3">
                  <button
                    onClick={() => handleReorder(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded text-gray-500 hover:text-amber-400 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(index, "down")}
                    disabled={index === members.length - 1}
                    className="p-1 rounded text-gray-500 hover:text-amber-400 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Photo / Initials */}
                <div className="flex justify-center mb-3">
                  <div className="w-20 h-20 rounded-full border-2 border-amber-600/40 overflow-hidden bg-gray-700 flex items-center justify-center">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-amber-400">
                        {getInitials(member.name)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center mb-3">
                  <h3 className="font-bold text-yellow-500 truncate">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {member.title}
                  </p>
                  {member.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {member.description}
                    </p>
                  )}
                </div>

                {/* Status tag */}
                <div className="flex justify-center mb-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border ${
                      member.is_active !== false
                        ? "bg-emerald-900/30 border-emerald-700 text-emerald-400"
                        : "bg-red-900/30 border-red-700 text-red-400"
                    }`}
                  >
                    {member.is_active !== false ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <AdminButton
                    onClick={() => openEditModal(member)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    icon={Edit3}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    onClick={() => handleDelete(member)}
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

      {/* Create Modal */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Add Team Member"
      >
        {renderForm(handleCreate, "Add Member")}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
          resetForm();
        }}
        title={`Edit: ${selectedMember?.name || ""}`}
      >
        {renderForm(handleUpdate, "Update Member")}
      </AdminModal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
      />
      {/* Toast Notification */}
      <Toast 
        {...toast}
        onClose={hideToast}
      />
    </div>
  );
};

export default TeamMembersPanel;
