import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

//Hooks
import useAuth from '../hook/useAuth';

//Components
import PasswordInput from '../../shared/components/PasswordInput';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

//Helpers
import { frontendErrorMessage } from '../helpers/backendError';
import { handleApiError } from '../../shared/helpers/handleApiError';

function RegisterForm({ onSuccess, fixedRole }) {

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useForm();

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
       const code = err.code ?? null;
const field = fieldByCode[code];
const message = frontendErrorMessage[code] || err.message;

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
      handleApiError(error, {
        frontendMessages: frontendErrorMessage,
        setErrorMessage,
        showAlert: false,
      });
    }

    return;
  }

  if (onSuccess) return onSuccess();

  navigate('/login');
} catch (err) {
  const result = handleApiError(err, {
    frontendMessages: frontendErrorMessage,
    setErrorMessage,
    showAlert: true,
  });

  // Si vino con errores específicos, intentá mapearlos también
  if (result.full?.errors?.length > 0) {
    setFieldErrorsFromBackend(result.full);
  }
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

      <PasswordInput
        label="Contraseña"
        compact
        registerProps={register('password', { required: 'La contraseña es obligatoria' })}
        error={errors.password?.message}
      />

      <PasswordInput
        label="Confirmar Contraseña"
        compact
        registerProps= {register('confirmPassword', {
          required: 'Confirmación obligatoria',
          validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      {!fixedRole && (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-black">Rol</label>
          <select
            className="text-sm border rounded-lg p-2 text-gray-700"
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
