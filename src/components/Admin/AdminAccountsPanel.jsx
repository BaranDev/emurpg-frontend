import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  Copy,
  Shield,
  Crown,
  Calendar,
  Loader2,
} from "lucide-react";
import { config } from "../../config";
import { getAuthHeaders } from "../../utils/auth";
import { useToast } from "../../hooks/useToast";
import {
  AdminModal,
  AdminButton,
  ConfirmDialog,
  LoadingSpinner,
  Toast,
} from "./shared";

const AdminAccountsPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [displayedApiKey, setDisplayedApiKey] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [createForm, setCreateForm] = useState({ username: "", password: "" });
  const [editForm, setEditForm] = useState({ username: "", password: "" });

  const { toast, showToast, hideToast } = useToast();

  const backendUrl = config.backendUrl;

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, title: "", message: "", onConfirm: null });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "\u2014";
    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime())
      ? "\u2014"
      : parsed.toLocaleDateString();
  };

  // ---------- Fetch admins ----------
  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/admins`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 403) {
        showToast(
          "Super-admin access required to manage admin accounts.",
          "error",
        );
        setAdmins([]);
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch admins");
      }
      const data = await response.json();
      setAdmins(Array.isArray(data) ? data : data.admins || []);
    } catch (error) {
      showToast(error.message || "Failed to load admin accounts.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, showToast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const resetCreateForm = () => {
    setCreateForm({ username: "", password: "" });
  };

  const resetEditForm = () => {
    setEditForm({ username: "", password: "" });
  };

  // ---------- Create ----------
  const handleCreate = async (e) => {
    e.preventDefault();
    const username = createForm.username.trim();
    const password = createForm.password.trim();

    if (!username || !password) {
      showToast("Username and password are required.", "warning");
      return;
    }

    setSubmittingAction(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/admins`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (response.status === 403) {
        showToast("Super-admin access required.", "error");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create admin");
      }
      const data = await response.json();
      showToast(`Admin "${data.username}" created successfully.`, "success");
      setIsCreateModalOpen(false);
      resetCreateForm();
      if (data.api_key) {
        setDisplayedApiKey(data.api_key);
        setIsApiKeyModalOpen(true);
      }
      fetchAdmins();
    } catch (error) {
      showToast(error.message || "Failed to create admin.", "error");
    } finally {
      setSubmittingAction(false);
    }
  };

  // ---------- Edit ----------
  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setEditForm({
      username: admin.username,
      password: "",
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;

    const username = editForm.username.trim();
    const password = editForm.password.trim();
    setSubmittingAction(true);

    try {
      const body = {};
      if (username && username !== editingAdmin.username) {
        body.username = username;
      }
      if (password) {
        body.password = password;
      }

      if (Object.keys(body).length === 0) {
        showToast("No changes to save.", "info");
        setIsEditModalOpen(false);
        setEditingAdmin(null);
        resetEditForm();
        return;
      }

      const response = await fetch(
        `${backendUrl}/api/admin/admins/${editingAdmin._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        },
      );
      if (response.status === 403) {
        showToast("Super-admin access required.", "error");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to update admin");
      }
      showToast("Admin updated successfully.", "success");
      setIsEditModalOpen(false);
      setEditingAdmin(null);
      resetEditForm();
      fetchAdmins();
    } catch (error) {
      showToast(error.message || "Failed to update admin.", "error");
    } finally {
      setSubmittingAction(false);
    }
  };

  // ---------- Delete ----------
  const performDelete = async (admin) => {
    setSubmittingAction(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/admins/${admin._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );
      if (response.status === 403) {
        showToast("Super-admin access required.", "error");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to delete admin");
      }
      showToast(`Admin "${admin.username}" deleted.`, "success");
      await fetchAdmins();
    } catch (error) {
      showToast(error.message || "Failed to delete admin.", "error");
    } finally {
      closeConfirmDialog();
      setSubmittingAction(false);
    }
  };

  const openDeleteConfirm = (admin) => {
    setConfirmDialog({
      open: true,
      title: "Delete Admin",
      message: `Are you sure you want to delete "${admin.username}"? This cannot be undone.`,
      onConfirm: () => performDelete(admin),
    });
  };

  // ---------- Reset API Key ----------
  const handleResetKey = async (admin) => {
    setSubmittingAction(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/admins/${admin._id}/reset-key`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );
      if (response.status === 403) {
        showToast("Super-admin access required.", "error");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to reset API key");
      }
      const data = await response.json();
      if (data.api_key) {
        setDisplayedApiKey(data.api_key);
        setIsApiKeyModalOpen(true);
      }
      showToast(`API key reset for "${admin.username}".`, "success");
    } catch (error) {
      showToast(error.message || "Failed to reset API key.", "error");
    } finally {
      setSubmittingAction(false);
    }
  };

  // ---------- Copy key ----------
  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(displayedApiKey);
      showToast("API key copied to clipboard.", "success");
    } catch {
      showToast("Failed to copy. Please select and copy manually.", "error");
    }
  };

  const { totalAdmins, superAdmins, regularAdmins } = useMemo(() => {
    const total = admins.length;
    const supers = admins.filter(
      (admin) => admin.role === "super_admin",
    ).length;
    return {
      totalAdmins: total,
      superAdmins: supers,
      regularAdmins: total - supers,
    };
  }, [admins]);

  // ---------- Render ----------
  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-cinzel text-2xl font-bold text-amber-100">
            Admin Accounts
          </h2>
          <p className="text-sm text-gray-400">
            Manage super-admin protected accounts and rotate keys safely.
          </p>
        </div>

        <AdminButton
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto"
        >
          Create Admin
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-800/30 bg-gray-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-amber-100">
            <Shield className="h-5 w-5 text-amber-400" />
            {totalAdmins}
          </p>
        </div>

        <div className="rounded-xl border border-amber-800/30 bg-gray-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Super Admins
          </p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-amber-100">
            <Crown className="h-5 w-5 text-amber-400" />
            {superAdmins}
          </p>
        </div>

        <div className="rounded-xl border border-amber-800/30 bg-gray-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Admins
          </p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-amber-100">
            <Shield className="h-5 w-5 text-amber-400" />
            {regularAdmins}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-amber-900/40 bg-gray-900/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-900/30 text-sm">
            <thead className="bg-amber-950/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Username
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-900/20">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <LoadingSpinner
                      size="md"
                      message="Loading admin accounts..."
                    />
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr
                    key={admin._id || admin.username}
                    className="hover:bg-amber-950/10"
                  >
                    <td className="px-4 py-3 text-amber-200">
                      {admin.username}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${
                          admin.role === "super_admin"
                            ? "border-amber-500/60 bg-amber-700/20 text-amber-300"
                            : "border-amber-700/60 bg-amber-900/20 text-amber-200"
                        }`}
                      >
                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-amber-400/80" />
                        {formatDate(admin.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-amber-700/40 p-2 text-amber-300 transition hover:bg-amber-900/30"
                          title="Edit"
                          onClick={() => openEditModal(admin)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="rounded-lg border border-amber-700/40 p-2 text-amber-300 transition hover:bg-amber-900/30"
                          title="Reset API key"
                          onClick={() => handleResetKey(admin)}
                          disabled={submittingAction}
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="rounded-lg border border-red-700/40 p-2 text-red-400 transition hover:bg-red-950/40"
                          title="Delete"
                          onClick={() => openDeleteConfirm(admin)}
                          disabled={submittingAction}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Create Modal ---------- */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetCreateForm();
        }}
        title="Create Admin Account"
        size="sm"
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              value={createForm.username}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="Enter username"
              required
              className="w-full rounded-lg border border-amber-800/40 bg-gray-950 px-3 py-2 text-sm text-amber-100 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter password"
              required
              className="w-full rounded-lg border border-amber-800/40 bg-gray-950 px-3 py-2 text-sm text-amber-100 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetCreateForm();
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" loading={submittingAction}>
              Create
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* ---------- Edit Modal ---------- */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAdmin(null);
          resetEditForm();
        }}
        title="Edit Admin Account"
        size="sm"
      >
        <form className="space-y-4" onSubmit={handleEdit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              value={editForm.username}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="Enter username"
              required
              className="w-full rounded-lg border border-amber-800/40 bg-gray-950 px-3 py-2 text-sm text-amber-100 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={editForm.password}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Leave blank to keep current password"
              className="w-full rounded-lg border border-amber-800/40 bg-gray-950 px-3 py-2 text-sm text-amber-100 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingAdmin(null);
                resetEditForm();
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" loading={submittingAction}>
              Save Changes
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* ---------- One-Time API Key Modal ---------- */}
      <AdminModal
        isOpen={isApiKeyModalOpen}
        onClose={() => {
          setIsApiKeyModalOpen(false);
          setDisplayedApiKey("");
        }}
        title="API Key Created"
        size="sm"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-700/40 bg-gray-950 p-4">
            <code className="break-all text-sm text-amber-200">
              {displayedApiKey}
            </code>
          </div>

          <p className="text-center text-xs text-amber-300">
            This key is shown once. Copy and store it securely.
          </p>

          <div className="flex justify-end gap-3">
            <AdminButton icon={Copy} type="button" onClick={handleCopyKey}>
              Copy Key
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsApiKeyModalOpen(false);
                setDisplayedApiKey("");
              }}
            >
              Close
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={submittingAction}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {submittingAction && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-lg border border-amber-700/50 bg-gray-900/90 px-3 py-2 text-xs text-amber-200 shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      )}
    </div>
  );
};

export default AdminAccountsPanel;
