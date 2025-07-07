"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "./ui/Modal";
import Input from "./ui/Input";
import SelectField from "./ui/SelectField";
import TextareaField from "./ui/TextareaField";
import { FormField } from "./FormField";

import useUserStore from "@/app/store/useUserStore";
import useWebSocket from "@/app/hooks/useWebsocket";
import { User, userFormSchema } from "@/app/types/user";
import { useDebouncedEffect } from "@/app/hooks/useDebouncedEffect";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user?: User;
}

type FormData = z.infer<typeof userFormSchema>;
const getDraftKey = (userId: number) => `draft_user_${userId}`;

export default function UserFormModal({ open, onClose, mode, user }: Props) {
  const { addUser, updateUser } = useUserStore();
  const { sendStartEditing, sendStopEditing } = useWebSocket(() => {});
  const [draftApplied, setDraftApplied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      isActive: true,
      description: "",
    },
  });

  const watchedFields = useWatch({ control });

  useDebouncedEffect(
    () => {
      if (mode === "edit" && user && open) {
        const draftKey = getDraftKey(user.id);
        localStorage.setItem(draftKey, JSON.stringify(watchedFields));
      }
    },
    [watchedFields],
    3000
  );

  useEffect(() => {
    if (open) {
      if (mode === "edit" && user) {
        const draftKey = getDraftKey(user.id);
        const draft = localStorage.getItem(draftKey);
        if (draft) {
          try {
            reset(JSON.parse(draft));
            setDraftApplied(true);
            return;
          } catch {
            console.warn("草稿解析失敗");
          }
        }
        reset({
          name: user.name,
          email: user.email,
          isActive: user.isActive,
          description: user.description,
        });
        setDraftApplied(false);
      } else if (mode === "create") {
        reset({
          name: "",
          email: "",
          isActive: true,
          description: "",
        });
        setDraftApplied(false);
      }
    }
  }, [open, mode, user, reset]);

  useEffect(() => {
    if (open && mode === "edit" && user) {
      sendStartEditing(user.id);
    }
    return () => {
      if (mode === "edit" && user) {
        sendStopEditing(user.id);
      }
    };
  }, [open, mode, user, sendStartEditing, sendStopEditing]);

  const onSubmit = (data: FormData) => {
    if (mode === "create") {
      addUser(data);
    } else if (mode === "edit" && user) {
      updateUser(user.id, data);
      localStorage.removeItem(getDraftKey(user.id));
    }
    onClose();
  };

  const handleRestoreOriginal = () => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        description: user.description,
      });
      setDraftApplied(false);
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "新增使用者" : "編輯使用者"}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okDisabled={!isValid || isSubmitting}
    >
      <form className="space-y-4" noValidate>
        {draftApplied && mode === "edit" && user && (
          <div className="flex justify-between items-center bg-yellow-50 border border-yellow-300 text-yellow-800 px-3 py-2 rounded text-sm">
            <span>已載入草稿內容</span>
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={handleRestoreOriginal}
            >
              恢復原本資料
            </button>
          </div>
        )}

        <FormField id="name" label="使用者名稱" error={errors.name?.message}>
          <Input
            id="name"
            {...register("name")}
            maxLength={10}
            placeholder="2-10 字"
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
        </FormField>

        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="example@mail.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </FormField>

        <FormField id="isActive" label="狀態" error={errors.isActive?.message}>
          <SelectField
            id="isActive"
            {...register("isActive", {
              setValueAs: (v) => v === "true",
            })}
          >
            <option value="true">啟用</option>
            <option value="false">停用</option>
          </SelectField>
        </FormField>

        <FormField
          id="description"
          label="描述"
          error={errors.description?.message}
        >
          <TextareaField
            id="description"
            maxLength={200}
            rows={4}
            placeholder="5-200 字"
            {...register("description")}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "desc-error" : undefined}
          />
        </FormField>
      </form>
    </Modal>
  );
}
