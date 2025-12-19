import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Search,
  UserPlus,
  Users,
  Shield,
  MessageSquare,
  Globe,
  Zap,
} from "lucide-react";
import { config } from "../../config";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";

const EmuconManagersPanel = () => {
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [showBulkResultModal, setShowBulkResultModal] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  // Create form
  const [newManager, setNewManager] = useState({
    clubName: "",
    clubNameTr: "",
    clubId: "",
    contactEmail: "",
  });
  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(null); // 'tr' or 'en'
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedPendingManager, setSelectedPendingManager] = useState(null);

  const backendUrl = config.backendUrl;
  const API_KEY = localStorage.getItem("apiKey");

  const fetchManagers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/emucon-managers`, {
        headers: {
          "Content-Type": "application/json",
          apiKey: API_KEY,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setManagers(data.managers || []);
      }
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, API_KEY]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleCreateManager = async () => {
    if (!newManager.clubName || !newManager.clubId) return;
    setIsCreating(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/create-emucon-manager`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
          body: JSON.stringify(newManager),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGeneratedInvite(data);
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to create manager");
      }
    } catch (error) {
      console.error("Failed to create manager:", error);
      alert("Failed to create manager");
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateAllInvites = async () => {
    setIsGeneratingAll(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/generate-all-invites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBulkResult(data);
        setShowBulkResultModal(true);
        fetchManagers();
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to generate invites");
      }
    } catch (error) {
      console.error("Failed to generate all invites:", error);
      alert("Failed to generate invites");
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handleDeleteManager = async () => {
    if (!selectedManager) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon-manager/${selectedManager.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
        }
      );

      if (response.ok) {
        fetchManagers();
        setShowDeleteConfirm(false);
        setSelectedManager(null);
      }
    } catch (error) {
      console.error("Failed to delete manager:", error);
    }
  };

  const handleRegenerateInvite = async (managerId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/regenerate-invite/${managerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGeneratedInvite(data);
        setShowCreateModal(true);
      }
    } catch (error) {
      console.error("Failed to regenerate invite:", error);
    }
  };

  const copyInviteCode = () => {
    if (generatedInvite?.inviteCode) {
      navigator.clipboard.writeText(generatedInvite.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyPendingInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const generateInvitationMessage = (manager, language) => {
    const clubName =
      language === "tr"
        ? manager.clubNameTr || manager.clubName
        : manager.clubName;
    const inviteCode = manager.inviteCode;

    // Debug logging
    console.log("Generating invitation message:", {
      manager,
      language,
      clubName,
      inviteCode,
    });

    if (!inviteCode) {
      console.error("Invite code is missing from manager object:", manager);
      return "Error: Invitation code is missing. Please contact support.";
    }

    if (language === "tr") {
      return `Merhaba ${clubName} Yönetim Kurulu Üyesi,

EMUCON etkinlik yönetim sistemine hoşgeldiniz! Bu sistem, etkinlik sırasında kulübünüzün programını kolayca yönetmenizi ve yönetim panelini kullanmanızı sağlar.

HESABINIZI OLUŞTURMAK İÇİN:

1. Tarayıcınızda https://emurpg.com/admin adresine gidin
2. Sayfanın ortasındaki "Invite Code" butonuna tıklayın
3. Davetiye Kodunuzu oradaki kutucuğa girin 
4. Kulübünüz için yeni bir şifre belirleyin
5. Hesabınız aktif olacak ve giriş yapabileceksiniz
6. Sonraki girişlerinizde kullanıcı adınızı(aşağıda bulunuyor) ve belirlediğiniz şifreyi kullanabilirsiniz

KULLANICI ADINIZ (sonraki girişler için): ${manager.clubId}
DAVETİYE KODUNUZ: ${inviteCode}

HESABINIZLA NELER YAPABİLİRSİNİZ:
- Etkinlik bilgilerini güncelleyebilir ve düzenleyebilirsiniz
- Etkinlik saatlerini ve açıklamalarını değiştirebilirsiniz
- Program değişikliklerinde katılımcıları anında bilgilendirebilirsiniz
- Yeni etkinlikler ekleyebilir veya mevcut olanları silebilirsiniz
- Katılımcı bilgilerini ve kayıt durumlarını görebilirsiniz
- Yönetim paneliniz üzerinden tüm bu işleri yapabilirsiniz

NEDEN BU SİSTEMİ KULLANIYORUZ:
EMUCON boyunca program değişiklikleri kaçınılmaz olabilir. Bu sistem sayesinde:
- Değişiklikleri hızlıca yapabilir ve herkesin güncel programı görmesini sağlayabilirsiniz
- Katılımcılar hangi etkinliğin nerede ve ne zaman olduğunu anlık takip edebilir
- Canlı section'da etkinliğin gerçek zamanlı güncellenmelerini görebilir
- Kulübünüzün standında neler olduğunu herkes kolayca görebilir
- Değişiklikleri anında yayınlayıp katılımcıları bilgilendirebilirsiniz
- Katılımcılar live bölümünde tüm kulüplerin güncel programını takip edebilir

Sorularınız için bizimle iletişime geçebilirsiniz.

EMURPG Ekibi`;
    } else {
      return `Hey ${clubName}'s Board Member,

Welcome to the EMUCON event management system! This system allows you to easily manage your club's schedule and access your management dashboard during the event.

TO CREATE YOUR ACCOUNT:

1. Go to https://emurpg.com/admin in your browser
2. Click the "Invite Code" option in the middle of the page
3. Enter your invitation code in the provided box
4. Set a new password for your club
5. Your account will be activated and you can log in
6. For future logins, use your username(provided below) and the password you set

YOUR USERNAME (for future logins): ${manager.clubId}
YOUR INVITATION CODE: ${inviteCode}

WHAT YOU CAN DO WITH YOUR ACCOUNT:
- Update and manage event details and descriptions
- Modify event times and schedules as needed
- Add new events or delete existing ones
- Instantly notify participants about any schedule changes
- View participant information and registration status
- Manage everything through your dedicated control panel

WHY WE USE THIS SYSTEM:
Schedule changes during EMUCON are sometimes unavoidable. With this system:
- You can make changes quickly and ensure everyone sees the updated schedule
- Participants can track which event is where and when in real-time
- Our live section shows real-time updates of all club events and schedules
- Everyone can easily see what's happening at your club's booth
- You can instantly broadcast changes to keep participants informed
- Participants can follow all clubs' current programs through the live section

Feel free to contact us if you have any questions.

EMURPG Team`;
    }
  };

  const copyInvitationMessage = (manager, language) => {
    const message = generateInvitationMessage(manager, language);
    navigator.clipboard.writeText(message);
    setCopiedMessage(language);
    setTimeout(() => setCopiedMessage(null), 2000);
  };

  const openMessageModal = (manager) => {
    setSelectedPendingManager(manager);
    setShowMessageModal(true);
  };

  const resetCreateModal = () => {
    setShowCreateModal(false);
    setNewManager({
      clubName: "",
      clubNameTr: "",
      clubId: "",
      contactEmail: "",
    });
    setGeneratedInvite(null);
    fetchManagers();
  };

  const filteredManagers = managers.filter(
    (m) =>
      m.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.clubId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading EMUCON managers..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-metamorphous text-xl font-bold text-amber-100">
            EMUCON Event Managers
          </h2>
          <p className="text-sm text-amber-400/60">
            Manage club representatives for EMUCON
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <AdminButton
            icon={Zap}
            variant="secondary"
            onClick={handleGenerateAllInvites}
            disabled={isGeneratingAll}
            className="w-full sm:w-auto"
          >
            {isGeneratingAll ? "Generating..." : "Generate All Invites"}
          </AdminButton>
          <AdminButton
            icon={UserPlus}
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto"
          >
            Create Manager
          </AdminButton>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by club name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-amber-900/30 bg-gray-900/50 py-2.5 pl-10 pr-4 text-amber-100 placeholder-gray-500 focus:border-amber-500/50 focus:outline-none"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl border border-amber-900/30 bg-gray-900/50 p-3 sm:p-4 text-center">
          <Users className="mx-auto mb-2 h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
          <p className="text-xl sm:text-2xl font-bold text-amber-100">
            {managers.length}
          </p>
          <p className="text-xs text-gray-400">Total Managers</p>
        </div>
        <div className="rounded-xl border border-emerald-900/30 bg-gray-900/50 p-3 sm:p-4 text-center">
          <Shield className="mx-auto mb-2 h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
          <p className="text-xl sm:text-2xl font-bold text-emerald-100">
            {managers.filter((m) => m.status === "active").length}
          </p>
          <p className="text-xs text-gray-400">Active</p>
        </div>
        <div className="rounded-xl border border-purple-900/30 bg-gray-900/50 p-3 sm:p-4 text-center">
          <RefreshCw className="mx-auto mb-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
          <p className="text-xl sm:text-2xl font-bold text-purple-100">
            {managers.filter((m) => m.status === "pending").length}
          </p>
          <p className="text-xs text-gray-400">Pending Activation</p>
        </div>
      </div>

      {/* Managers List */}
      {filteredManagers.length === 0 ? (
        <div className="rounded-xl border border-amber-900/30 bg-gray-900/50 p-8 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-amber-500/50" />
          <p className="text-gray-400">
            {searchTerm
              ? "No managers match your search."
              : "No EMUCON managers yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredManagers.map((manager) => (
            <div
              key={manager.id}
              className="rounded-xl border border-amber-900/30 bg-gray-900/50 p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div
                    className={`flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full flex-shrink-0 ${
                      manager.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm sm:text-base text-amber-100 truncate">
                        {manager.clubName}
                      </h3>
                      <span
                        className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs flex-shrink-0 ${
                          manager.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {manager.status === "active" ? "Active" : "Pending"}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-sm text-gray-400 truncate">
                      {manager.clubNameTr}{" "}
                      <span className="hidden sm:inline">-</span>{" "}
                      <span className="text-gray-500 font-mono">
                        ID: {manager.clubId}
                      </span>
                    </p>
                    {manager.username && (
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        @{manager.username}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-end pl-9 sm:pl-0">
                  {manager.status === "pending" && (
                    <>
                      <AdminButton
                        size="sm"
                        variant="ghost"
                        icon={MessageSquare}
                        onClick={() => openMessageModal(manager)}
                        className="text-xs"
                      >
                        <span className="hidden sm:inline">Copy Message</span>
                        <span className="sm:hidden">Msg</span>
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="ghost"
                        icon={RefreshCw}
                        onClick={() => handleRegenerateInvite(manager.id)}
                        className="text-xs"
                      >
                        <span className="hidden sm:inline">
                          Regenerate Code
                        </span>
                        <span className="sm:hidden">Regen</span>
                      </AdminButton>
                    </>
                  )}
                  <AdminButton
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    className="text-red-400 hover:text-red-300"
                    onClick={() => {
                      setSelectedManager(manager);
                      setShowDeleteConfirm(true);
                    }}
                  />
                </div>
              </div>

              {/* Show invite code for pending managers */}
              {manager.status === "pending" && manager.inviteCode && (
                <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-lg border border-amber-900/20 bg-amber-950/20 p-2 sm:p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-amber-400/70">
                      Invitation Code:
                    </p>
                    <code className="font-mono text-sm sm:text-lg tracking-wider sm:tracking-widest text-amber-300 break-all">
                      {manager.inviteCode}
                    </code>
                    {manager.inviteExpires && (
                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-500">
                        Exp:{" "}
                        {new Date(manager.inviteExpires).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <AdminButton
                    size="sm"
                    icon={copiedCode === manager.inviteCode ? Check : Copy}
                    onClick={() => copyPendingInviteCode(manager.inviteCode)}
                    className="w-full sm:w-auto text-xs"
                  >
                    {copiedCode === manager.inviteCode ? "Copied!" : "Copy"}
                  </AdminButton>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Manager Modal */}
      <AdminModal
        isOpen={showCreateModal}
        onClose={resetCreateModal}
        title={generatedInvite ? "Invitation Created" : "Create EMUCON Manager"}
        size="md"
      >
        {generatedInvite ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
              <Check className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
              <p className="font-medium text-emerald-200">
                Manager invitation created successfully!
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Invitation Code:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code className="flex-1 rounded-lg border border-amber-500/30 bg-gray-900 px-4 py-3 text-center font-mono text-lg sm:text-xl tracking-widest text-amber-300 break-all">
                  {generatedInvite.inviteCode}
                </code>
                <AdminButton
                  onClick={copyInviteCode}
                  icon={copiedCode ? Check : Copy}
                  className="w-full sm:w-auto"
                >
                  {copiedCode ? "Copied!" : "Copy"}
                </AdminButton>
              </div>
            </div>

            <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
              <p className="text-sm text-amber-300">
                <strong>Club:</strong> {generatedInvite.clubName}
              </p>
              <p className="mt-2 text-sm text-amber-400/70">
                Share this code with the club representative. They will use it
                to set up their account at /admin.
              </p>
              <p className="mt-2 text-xs text-amber-400/50">
                Code expires in 7 days if not activated.
              </p>
            </div>

            {/* Copy Invitation Message Buttons */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Copy complete invitation message:
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <AdminButton
                  variant="secondary"
                  icon={copiedMessage === "tr" ? Check : MessageSquare}
                  onClick={() => {
                    const messageData = {
                      clubName: generatedInvite.clubName,
                      clubNameTr:
                        newManager.clubNameTr || generatedInvite.clubName,
                      inviteCode: generatedInvite.inviteCode,
                    };
                    copyInvitationMessage(messageData, "tr");
                  }}
                >
                  {copiedMessage === "tr" ? "Kopyalandi!" : "Turkce Mesaj"}
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  icon={copiedMessage === "en" ? Check : MessageSquare}
                  onClick={() => {
                    const messageData = {
                      clubName: generatedInvite.clubName,
                      clubNameTr:
                        newManager.clubNameTr || generatedInvite.clubName,
                      inviteCode: generatedInvite.inviteCode,
                    };
                    copyInvitationMessage(messageData, "en");
                  }}
                >
                  {copiedMessage === "en" ? "Copied!" : "English Message"}
                </AdminButton>
              </div>
            </div>

            <AdminButton className="w-full" onClick={resetCreateModal}>
              Done
            </AdminButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-amber-200/80">
                  Club Name (English) *
                </label>
                <input
                  type="text"
                  value={newManager.clubName}
                  onChange={(e) =>
                    setNewManager({ ...newManager, clubName: e.target.value })
                  }
                  placeholder="e.g., Chess Club"
                  className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-2.5 text-amber-100 focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-amber-200/80">
                  Club Name (Turkish)
                </label>
                <input
                  type="text"
                  value={newManager.clubNameTr}
                  onChange={(e) =>
                    setNewManager({ ...newManager, clubNameTr: e.target.value })
                  }
                  placeholder="e.g., Satranc Kulubu"
                  className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-2.5 text-amber-100 focus:border-amber-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-amber-200/80">
                  Club ID *
                </label>
                <input
                  type="text"
                  value={newManager.clubId}
                  onChange={(e) =>
                    setNewManager({
                      ...newManager,
                      clubId: e.target.value.toLowerCase().replace(/\s/g, "-"),
                    })
                  }
                  placeholder="e.g., chess-club"
                  className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-2.5 text-amber-100 focus:border-amber-500/50 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Unique identifier (no spaces)
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-amber-200/80">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={newManager.contactEmail}
                  onChange={(e) =>
                    setNewManager({
                      ...newManager,
                      contactEmail: e.target.value,
                    })
                  }
                  placeholder="contact@club.com"
                  className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-2.5 text-amber-100 focus:border-amber-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <AdminButton
                variant="secondary"
                onClick={resetCreateModal}
                className="w-full sm:w-auto"
              >
                Cancel
              </AdminButton>
              <AdminButton
                onClick={handleCreateManager}
                disabled={!newManager.clubName || !newManager.clubId}
                loading={isCreating}
                className="w-full sm:w-auto"
              >
                Generate Invitation
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedManager(null);
        }}
        onConfirm={handleDeleteManager}
        title="Delete Manager"
        message={`Are you sure you want to remove ${selectedManager?.clubName} from EMUCON managers? This will revoke their access.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Invitation Message Modal */}
      <AdminModal
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setSelectedPendingManager(null);
          setCopiedMessage(null);
        }}
        title="Copy Invitation Message"
        size="lg"
      >
        {selectedPendingManager && (
          <div className="space-y-6">
            <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
              <p className="text-sm text-amber-300">
                <strong>Club:</strong> {selectedPendingManager.clubName}
              </p>
              <p className="text-sm text-amber-400/70">
                <strong>Code:</strong>{" "}
                <code className="font-mono tracking-wider">
                  {selectedPendingManager.inviteCode}
                </code>
              </p>
            </div>

            <p className="text-sm text-gray-400">
              Choose a language to copy the complete invitation message with
              step-by-step instructions:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Turkish Message */}
              <div className="rounded-lg border border-amber-900/30 bg-gray-900/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-400" />
                  <h4 className="font-medium text-amber-100">Turkce</h4>
                </div>
                <p className="mb-4 text-xs text-gray-400 line-clamp-3">
                  Merhaba {selectedPendingManager.clubNameTr} Yonetim Kurulu
                  Uyesi, EMUCON etkinlik yonetim sistemine hosgeldiniz...
                </p>
                <AdminButton
                  className="w-full"
                  icon={copiedMessage === "tr" ? Check : Copy}
                  onClick={() =>
                    copyInvitationMessage(selectedPendingManager, "tr")
                  }
                >
                  {copiedMessage === "tr"
                    ? "Kopyalandi!"
                    : "Turkce Mesaji Kopyala"}
                </AdminButton>
              </div>

              {/* English Message */}
              <div className="rounded-lg border border-amber-900/30 bg-gray-900/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-400" />
                  <h4 className="font-medium text-amber-100">English</h4>
                </div>
                <p className="mb-4 text-xs text-gray-400 line-clamp-3">
                  Hey {selectedPendingManager.clubName}&apos;s Board Member,
                  Welcome to the EMUCON event management system...
                </p>
                <AdminButton
                  className="w-full"
                  icon={copiedMessage === "en" ? Check : Copy}
                  onClick={() =>
                    copyInvitationMessage(selectedPendingManager, "en")
                  }
                >
                  {copiedMessage === "en" ? "Copied!" : "Copy English Message"}
                </AdminButton>
              </div>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <h5 className="mb-2 text-sm font-medium text-gray-300">
                Message Preview (
                {copiedMessage === "tr" ? "Turkish" : "English"}):
              </h5>
              <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs text-gray-400">
                {generateInvitationMessage(
                  selectedPendingManager,
                  copiedMessage || "en"
                )}
              </pre>
            </div>

            <AdminButton
              variant="secondary"
              className="w-full"
              onClick={() => {
                setShowMessageModal(false);
                setSelectedPendingManager(null);
                setCopiedMessage(null);
              }}
            >
              Close
            </AdminButton>
          </div>
        )}
      </AdminModal>

      {/* Bulk Generate Results Modal */}
      <AdminModal
        isOpen={showBulkResultModal}
        onClose={() => {
          setShowBulkResultModal(false);
          setBulkResult(null);
        }}
        title="Bulk Invite Generation Complete"
      >
        {bulkResult && (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-lg border border-emerald-900/30 bg-emerald-900/20 p-2 sm:p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                  {bulkResult.summary.created}
                </p>
                <p className="text-xs text-emerald-300">Created</p>
              </div>
              <div className="rounded-lg border border-amber-900/30 bg-amber-900/20 p-2 sm:p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold text-amber-400">
                  {bulkResult.summary.regenerated}
                </p>
                <p className="text-xs text-amber-300">Regenerated</p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 sm:p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold text-gray-400">
                  {bulkResult.summary.skipped}
                </p>
                <p className="text-xs text-gray-400">Skipped</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">
              Expires: {new Date(bulkResult.expiresAt).toLocaleDateString()}
            </p>

            {/* Created List */}
            {bulkResult.results.created.length > 0 && (
              <div className="rounded-lg border border-emerald-900/30 bg-gray-900/50 p-3">
                <h4 className="mb-2 text-sm font-medium text-emerald-400">
                  New Invitations Created ({bulkResult.results.created.length})
                </h4>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {bulkResult.results.created.map((club) => (
                    <div
                      key={club.clubId}
                      className="flex items-center justify-between rounded bg-gray-800/50 px-2 py-1 text-sm"
                    >
                      <span className="text-gray-300">{club.clubName}</span>
                      <code className="rounded bg-emerald-900/30 px-2 py-0.5 font-mono text-xs text-emerald-300">
                        {club.inviteCode}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regenerated List */}
            {bulkResult.results.regenerated.length > 0 && (
              <div className="rounded-lg border border-amber-900/30 bg-gray-900/50 p-3">
                <h4 className="mb-2 text-sm font-medium text-amber-400">
                  Codes Regenerated ({bulkResult.results.regenerated.length})
                </h4>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {bulkResult.results.regenerated.map((club) => (
                    <div
                      key={club.clubId}
                      className="flex items-center justify-between rounded bg-gray-800/50 px-2 py-1 text-sm"
                    >
                      <span className="text-gray-300">{club.clubName}</span>
                      <code className="rounded bg-amber-900/30 px-2 py-0.5 font-mono text-xs text-amber-300">
                        {club.inviteCode}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skipped List */}
            {bulkResult.results.skipped.length > 0 && (
              <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-3">
                <h4 className="mb-2 text-sm font-medium text-gray-400">
                  Skipped - Already Active ({bulkResult.results.skipped.length})
                </h4>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {bulkResult.results.skipped.map((club) => (
                    <div
                      key={club.clubId}
                      className="flex items-center justify-between rounded bg-gray-800/50 px-2 py-1 text-sm"
                    >
                      <span className="text-gray-400">{club.clubName}</span>
                      <span className="text-xs text-gray-500">
                        @{club.username}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AdminButton
              className="w-full"
              onClick={() => {
                setShowBulkResultModal(false);
                setBulkResult(null);
              }}
            >
              Close
            </AdminButton>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default EmuconManagersPanel;
