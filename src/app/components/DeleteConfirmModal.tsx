"use client";
import Modal from "./ui/Modal";
import useUserStore from "@/app/store/useUserStore";
import { User } from "@/app/types/user";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  user,
}: DeleteConfirmModalProps) {
  const { deleteUser } = useUserStore();

  const handleDelete = () => {
    deleteUser(user.id);
    onClose();
  };

  return (
    <Modal open={open} title="確認刪除" onCancel={onClose} onOk={handleDelete}>
      <p>你確定要刪除 {user?.name || ""} 嗎？此操作無法復原。</p>
    </Modal>
  );
}
