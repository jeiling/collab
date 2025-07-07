import { SelectHTMLAttributes } from "react";

export default function SelectField(
  props: SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select {...props} className="form-base">
      {props.children}
    </select>
  );
}
