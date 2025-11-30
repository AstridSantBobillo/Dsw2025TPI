import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

const EyeIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 transition-transform duration-200"
  >
    {open ? (
      <>
        <path d="M1 12s4.5-7 11-7 11 7 11 7-4.5 7-11 7-11-7-11-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.73 5.08A9.12 9.12 0 0 1 12 5c6.5 0 11 7 11 7a20.3 20.3 0 0 1-4.22 4.88" />
        <path d="M6.61 6.61C3.95 8.28 2 12 2 12a20.33 20.33 0 0 0 5.62 5.92" />
        <path d="M9.5 9.5a3 3 0 0 1 4.26 4.26" />
      </>
    )}
  </svg>
);

function RegisterForm({ onSuccess, fixedRole }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useForm();

  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const onValid = async ({ username, password, email, role }) => {
    setErrorMessage('');
    clearErrors();
    const finalRole = fixedRole ?? role;

    const setFieldErrorsFromBackend = (backendError) => {
      const fieldByCode = {
        9101: ['username', 'email'],
        2001: ['username'],
        2002: ['email'],
        2003: ['email'],
        2004: ['password'],
        2005: ['password'],
        2006: ['password'],
        2007: ['password'],
        2008: ['password'],
        7001: ['role'],
        9201: ['role'],
        9202: ['role'],
      };

      let hasFieldMatch = false;

      (backendError?.errors || []).forEach((err) => {
        const field = fieldByCode[err.code];
        const message = frontendErrorMessage[err.code] || err.message;

         if (field && message) {
          const fieldList = Array.isArray(field) ? field : [field];
          fieldList.forEach((field) => {
            setError(field, { type: 'backend', message });
          });
          hasFieldMatch = true;
        }
      });

      return hasFieldMatch;
    };

    try {
      const { error } = await registerUser(username, password, email, finalRole);

      if (error) {
        const matched = setFieldErrorsFromBackend(error);

        if (!matched) {
          setErrorMessage(
            error.frontendErrorMessage
            || error.backendMessage
            || 'No se pudo completar el registro',
          );
        }

        return;
      }

      if (onSuccess) return onSuccess();

      navigate('/login');
    } catch (err) {
      const backendError = err.backendError;

      if (backendError) {
        const matched = setFieldErrorsFromBackend(backendError);

        if (!matched) {
          setErrorMessage(
            backendError.frontendErrorMessage
            || backendError.backendMessage
            || 'Llame a soporte',
          );
        }

        return;
      }

      setErrorMessage('Llame a soporte');
    }
  };

  return (
    <form
      className="
        flex flex-col gap-4
        bg-white
        p-4
        rounded-xl
        w-full
        max-w-md
        mx-auto
        animate-slideUp
        shadow-lg
      "
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label="Usuario"
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        {...register('email', { required: 'Email es obligatorio' })}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        compact
        type={showPassword ? 'text' : 'password'}
        {...register('password', { required: 'La contraseña es obligatoria' })}
        error={errors.password?.message}
        suffix={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="h-10 w-10 flex items-center justify-center rounded border bg-gray-50 hover:bg-gray-100 hover:scale-110 active:scale-95 transition-transform duration-200"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <EyeIcon open={showPassword} />
          </button>
        }
      />

      <Input
        label="Confirmar Contraseña"
        compact
        type={showPassword ? 'text' : 'password'}
        {...register('confirmPassword', {
          required: 'Confirmación obligatoria',
          validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
        suffix={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="h-10 w-10 flex items-center justify-center rounded border bg-gray-50 hover:bg-gray-100 hover:scale-110 active:scale-95 transition-transform duration-200"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <EyeIcon open={showPassword} />
          </button>
        }
      />

      {!fixedRole && (
        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-gray-600">Rol</label>

          <select
            className="border rounded-lg p-2 text-gray-700"
            {...register('role', { required: 'El rol es obligatorio' })}
          >
            <option value="Client">Cliente</option>
            <option value="Admin">Admin</option>
          </select>

          {errors.role?.message && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 text-center text-sm">{errorMessage}</p>
      )}

      <Button type="submit">Registrarse</Button>

      {!onSuccess && (
        <Button type="button" onClick={() => navigate('/login')}>
          Iniciar Sesion
        </Button>
      )}
    </form>
  );
}

export default RegisterForm;
