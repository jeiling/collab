interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField = ({ label, id, error, children }: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block font-medium mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-500 mt-1"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}
    </div>
  );
};
