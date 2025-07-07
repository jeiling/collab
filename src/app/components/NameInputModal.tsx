"use client";
import { useEffect, useState } from "react";
import Modal from "./ui/Modal";

export default function NameInputModal({
  open,
  onFinish,
}: {
  open: boolean;
  onFinish: (name: string) => void;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("userName");
    if (saved) {
      onFinish(saved);
    }
  }, [onFinish]);

  const handleConfirm = () => {
    sessionStorage.setItem("userName", name);
    onFinish(name);
  };

  return (
    <Modal
      open={open}
      title="請輸入您的名稱"
      onCancel={() => {}}
      onOk={handleConfirm}
      isShowCancel={false}
      okDisabled={name.trim() === "" || name.length < 2 || name.length > 20}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 text-base font-medium text-[#2d2d2d] bg-white border-[1.5px] border-slate-300 rounded-[10px] outline-none transition duration-200 ease-in-out focus:border-blue-500 focus:shadow-[0_0_6px_2px_rgba(59,130,246,0.4)]"
      />
    </Modal>
  );
}
