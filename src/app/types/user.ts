import { z } from "zod";

export type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  description: string;
};

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, "使用者名稱需為 2 到 10 字")
    .max(10, "使用者名稱需為 2 到 10 字"),
  email: z.string().email("Email 格式錯誤"),
  isActive: z.boolean(),
  description: z
    .string()
    .min(5, "描述需為 5 到 200 字")
    .max(200, "描述需為 5 到 200 字"),
});

export interface UserStore {
  userName: string;
  setUserName: (name: string) => void;
  users: User[];
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
  editingStatus: Record<number, string[]>;
  setEditingStatus: (recordId: number, users: string[]) => void;
}

export type WebSocketEvent =
  | { type: "start_editing"; payload: { recordId: number; userName: string } }
  | { type: "stop_editing"; payload: { recordId: number; userName: string } }
  | {
      type: "editing_status_update";
      payload: { recordId: number; users: string[] };
    };
