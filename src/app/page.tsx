"use client";

import { useEffect, useState } from "react";
import NameInputModal from "@/app/components/NameInputModal";
import EditingToast from "@/app/components/EditingToast";
import useUserStore from "@/app/store/useUserStore";
import { UserTable } from "./components/UserTable";

export default function Home() {
  const [open, setOpen] = useState(false);
  const userName = useUserStore((state) => state.userName);
  const setUserName = useUserStore((state) => state.setUserName);
  const users = useUserStore((state) => state.users);
  const editingStatus = useUserStore((state) => state.editingStatus);

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [setUserName]);

  const handleConfirm = (name: string) => {
    setUserName(name);
    sessionStorage.setItem("userName", name);
    setOpen(false);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 sm:px-20 font-[family-name:var(--font-geist-sans)] max-w-5xl mx-auto">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <NameInputModal open={open} onFinish={handleConfirm} />
        {userName && (
          <div className="w-full flex justify-center">
            <h1 className="text-2xl font-bold">歡迎, {userName}!</h1>
          </div>
        )}
        <UserTable dataSource={users} />
        {Object.entries(editingStatus).map(
          ([recordId, users]) =>
            users.length > 0 && (
              <EditingToast key={recordId} recordId={Number(recordId)} />
            )
        )}
      </main>
    </div>
  );
}
