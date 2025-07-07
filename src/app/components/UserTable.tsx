"use client";

import { useState } from "react";
import Table from "./ui/Table";
import UserFormModal from "./UserFormModal";
import Modal from "./ui/Modal";
import useUserStore from "@/app/store/useUserStore";
import useWebSocket from "@/app/hooks/useWebsocket";
import { User } from "@/app/types/user";

type UserTableProps = {
  dataSource: User[];
};

export const UserTable = ({ dataSource }: UserTableProps) => {
  const { deleteUser } = useUserStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const { sendStartEditing, sendStopEditing } = useWebSocket();

  const openCreate = () => {
    setMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEdit = (user: User) => {
    setMode("edit");
    setSelectedUser(user);
    sendStartEditing(user.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (mode === "edit" && selectedUser) {
      sendStopEditing(selectedUser.id);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteUser(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          新增使用者
        </button>
      </div>
      <Table<User>
        columns={[
          { title: "名稱", dataIndex: "name", key: "name" },
          { title: "Email", dataIndex: "email", key: "email" },
          {
            title: "狀態",
            key: "isActive",
            render: (_, record) => (
              <span
                className={record.isActive ? "text-green-600" : "text-gray-400"}
              >
                {record.isActive ? "啟用" : "停用"}
              </span>
            ),
          },
          { title: "描述", dataIndex: "description", key: "description" },
          {
            title: "操作",
            key: "actions",
            render: (_, record) => (
              <div className="space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => openEdit(record)}
                >
                  編輯
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => setConfirmDelete(record)}
                >
                  刪除
                </button>
              </div>
            ),
          },
        ]}
        dataSource={dataSource}
        rowKey={(record) => record.id}
      />

      <UserFormModal
        open={isModalOpen}
        onClose={closeModal}
        mode={mode}
        user={selectedUser || undefined}
      />

      <Modal
        open={!!confirmDelete}
        title="確定要刪除這位使用者嗎？"
        onCancel={() => setConfirmDelete(null)}
        onOk={handleDelete}
      >
        <p>{confirmDelete?.name} 將被刪除。</p>
      </Modal>
    </div>
  );
};
