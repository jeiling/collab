import { create } from "zustand";
import { User, UserStore } from "@/app/types/user";

const initialUsers: User[] = [
  {
    id: 1,
    name: "陳大文",
    email: "andy.chen@commeet.co",
    isActive: true,
    description: "一位熱愛前端開發的資深軟體工程師。",
  },
  {
    id: 2,
    name: "Zack Lin",
    email: "z.lin@commeet.co",
    isActive: false,
    description: "一位熱愛後端開發的資深軟體工程師。",
  },
];

const useUserStore = create<UserStore>((set) => ({
  userName: "",
  setUserName: (name) => set({ userName: name }),
  users: initialUsers,
  addUser: (user) =>
    set((state) => ({ users: [...state.users, { ...user, id: Date.now() }] })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
  editingStatus: {},
  setEditingStatus: (recordId, users) =>
    set((state) => ({
      editingStatus: { ...state.editingStatus, [recordId]: users },
    })),
}));

export default useUserStore;
