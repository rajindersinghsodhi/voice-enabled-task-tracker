import React from "react";
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Label } from "@/components/ui/label"; // Optional Label

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  classNameInput?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  className,
  classNameInput
}) => {
  return (
    <div className={`flex flex-col gap-1 cursor-pointer ${className || ""}`}>
      {label && <Label className="font-medium text-base">{label}</Label>}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${classNameInput}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
