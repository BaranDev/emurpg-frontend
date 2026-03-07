import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Skeleton,
  Typography,
  Tooltip,
  Space,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { config } from "../../config";
import { getAuthHeaders } from "../../utils/auth";

const { Text, Title } = Typography;

const AdminAccountsPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [displayedApiKey, setDisplayedApiKey] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const backendUrl = config.backendUrl;

  // ---------- Fetch admins ----------
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/admins`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 403) {
        message.error("Super-admin access required to manage admin accounts.");
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
      message.error(error.message || "Failed to load admin accounts.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // ---------- Create ----------
  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/admins`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
      if (response.status === 403) {
        message.error("Super-admin access required.");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create admin");
      }
      const data = await response.json();
      message.success(`Admin "${data.username}" created successfully.`);
      setCreateModalOpen(false);
      createForm.resetFields();
      if (data.api_key) {
        setDisplayedApiKey(data.api_key);
        setApiKeyModalOpen(true);
      }
      fetchAdmins();
    } catch (error) {
      message.error(error.message || "Failed to create admin.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Edit ----------
  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    editForm.setFieldsValue({
      username: admin.username,
      password: "",
    });
    setEditModalOpen(true);
  };

  const handleEdit = async (values) => {
    if (!editingAdmin) return;
    setSubmitting(true);
    try {
      const body = {};
      if (values.username && values.username !== editingAdmin.username) {
        body.username = values.username;
      }
      if (values.password) {
        body.password = values.password;
      }
      if (Object.keys(body).length === 0) {
        message.info("No changes to save.");
        setEditModalOpen(false);
        return;
      }
      const response = await fetch(
        `${backendUrl}/api/admin/admins/${editingAdmin._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        }
      );
      if (response.status === 403) {
        message.error("Super-admin access required.");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to update admin");
      }
      message.success("Admin updated successfully.");
      setEditModalOpen(false);
      setEditingAdmin(null);
      editForm.resetFields();
      fetchAdmins();
    } catch (error) {
      message.error(error.message || "Failed to update admin.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (admin) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/admins/${admin._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 403) {
        message.error("Super-admin access required.");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to delete admin");
      }
      message.success(`Admin "${admin.username}" deleted.`);
      fetchAdmins();
    } catch (error) {
      message.error(error.message || "Failed to delete admin.");
    }
  };

  // ---------- Reset API Key ----------
  const handleResetKey = async (admin) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/admins/${admin._id}/reset-key`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 403) {
        message.error("Super-admin access required.");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to reset API key");
      }
      const data = await response.json();
      if (data.api_key) {
        setDisplayedApiKey(data.api_key);
        setApiKeyModalOpen(true);
      }
      message.success(`API key reset for "${admin.username}".`);
    } catch (error) {
      message.error(error.message || "Failed to reset API key.");
    }
  };

  // ---------- Copy key ----------
  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(displayedApiKey);
      message.success("API key copied to clipboard.");
    } catch {
      message.error("Failed to copy. Please select and copy manually.");
    }
  };

  // ---------- Table columns ----------
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <Text strong style={{ color: "#c4a35a" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const color = role === "super_admin" ? "#faad14" : "#c4a35a";
        const label = role === "super_admin" ? "Super Admin" : "Admin";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "\u2014",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              style={{ color: "#c4a35a" }}
            />
          </Tooltip>
          <Popconfirm
            title="Reset API Key"
            description={`Generate a new API key for "${record.username}"? The old key will stop working.`}
            onConfirm={() => handleResetKey(record)}
            okText="Reset"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Reset API Key">
              <Button
                type="text"
                icon={<KeyOutlined />}
                style={{ color: "#c4a35a" }}
              />
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title="Delete Admin"
            description={`Are you sure you want to delete "${record.username}"? This cannot be undone.`}
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ---------- Render ----------
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#c4a35a", margin: 0 }}>
            Admin Accounts
          </Title>
          <Text type="secondary">
            Manage administrator accounts and API keys
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
          style={{
            backgroundColor: "#c4a35a",
            borderColor: "#c4a35a",
          }}
        >
          Create Admin
        </Button>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Table
          dataSource={admins}
          columns={columns}
          rowKey={(record) => record._id || record.username}
          pagination={false}
          locale={{ emptyText: "No admin accounts found." }}
        />
      )}

      {/* ---------- Create Modal ---------- */}
      <Modal
        title="Create Admin Account"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setCreateModalOpen(false);
                  createForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{
                  backgroundColor: "#c4a35a",
                  borderColor: "#c4a35a",
                }}
              >
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ---------- Edit Modal ---------- */}
      <Modal
        title="Edit Admin Account"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingAdmin(null);
          editForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            help="Leave blank to keep the current password"
          >
            <Input.Password placeholder="Enter new password (optional)" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingAdmin(null);
                  editForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{
                  backgroundColor: "#c4a35a",
                  borderColor: "#c4a35a",
                }}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ---------- One-Time API Key Modal ---------- */}
      <Modal
        title={
          <span style={{ color: "#c4a35a" }}>
            <KeyOutlined style={{ marginRight: 8 }} />
            API Key Created
          </span>
        }
        open={apiKeyModalOpen}
        onCancel={() => {
          setApiKeyModalOpen(false);
          setDisplayedApiKey("");
        }}
        footer={
          <Space>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopyKey}
              style={{
                backgroundColor: "#c4a35a",
                borderColor: "#c4a35a",
              }}
            >
              Copy Key
            </Button>
            <Button
              onClick={() => {
                setApiKeyModalOpen(false);
                setDisplayedApiKey("");
              }}
            >
              Close
            </Button>
          </Space>
        }
        styles={{
          content: {
            backgroundColor: "#1a1a2e",
            border: "1px solid #c4a35a33",
          },
          header: {
            backgroundColor: "#1a1a2e",
            borderBottom: "1px solid #c4a35a33",
          },
          footer: {
            backgroundColor: "#1a1a2e",
            borderTop: "1px solid #c4a35a33",
          },
        }}
      >
        <div style={{ padding: "16px 0" }}>
          <div
            style={{
              backgroundColor: "#0d0d1a",
              border: "1px solid #c4a35a44",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              wordBreak: "break-all",
            }}
          >
            <Text
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: 15,
                color: "#c4a35a",
                letterSpacing: "0.5px",
              }}
              copyable={{
                text: displayedApiKey,
                tooltips: ["Copy", "Copied!"],
              }}
            >
              {displayedApiKey}
            </Text>
          </div>
          <Text
            type="warning"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: 13,
              color: "#faad14",
            }}
          >
            This key will only be shown once. Copy it now and store it securely.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAccountsPanel;
