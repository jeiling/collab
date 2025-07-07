import { TextareaHTMLAttributes } from "react";

export default function TextareaField(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return <textarea {...props} className="form-base" />;
}
