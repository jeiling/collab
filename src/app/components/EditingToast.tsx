import useUserStore from "@/app/store/useUserStore";
import { createPortal } from "react-dom";

export default function EditingToast({ recordId }: { recordId: number }) {
  const { editingStatus } = useUserStore();
  const users = editingStatus[recordId]?.filter(Boolean);

  if (!users || users.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-blue-300 text-blue-800 rounded-xl shadow-lg px-4 py-3 w-80 text-sm font-medium animate-fade-in">
        正在編輯的使用者：
        <span className="font-semibold">{users.join(", ")}</span>
      </div>
    </div>,
    document.body
  );
}
