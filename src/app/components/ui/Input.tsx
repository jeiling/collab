import { InputHTMLAttributes } from "react";

export default function InputField(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className="form-base" />;
}
