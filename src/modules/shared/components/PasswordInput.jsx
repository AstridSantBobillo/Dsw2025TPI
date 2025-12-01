import { useState } from "react";

// Components
import Input from "./Input";
import EyeIcon from "./EyeIcon";

export default function PasswordInput({
  label = "Contraseña",
  error,
  compact,
  registerProps = {},
  id,
  name,
  placeholder,
  disabled,
}) {
  const [show, setShow] = useState(false);

  return (
    <Input
      label={label}
      compact={compact}
      type={show ? "text" : "password"}
      error={error}
      id={id}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      {...registerProps}
      suffix={
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="h-10 w-10 flex items-center justify-center rounded border bg-gray-50 hover:bg-gray-100 hover:scale-110 active:scale-95 transition-transform duration-200"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <EyeIcon open={show} />
        </button>
      }
    />
  );
}
