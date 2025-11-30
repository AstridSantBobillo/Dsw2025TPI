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

function LoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singin(formData.username, formData.password);

      if (error) {
        const detailedMessages = (error.errors || [])
          .map((err) => frontendErrorMessage[err.code] || err.message)
          .filter(Boolean);

        setErrorMessages(detailedMessages);
        setErrorMessage(
          error.frontendErrorMessage
          || detailedMessages[0]
          || error.backendMessage
          || 'Llame a soporte',
        );

        return;
      }

      if (onSuccess) return onSuccess();

      navigate('/admin/home');
    } catch (error) {
      const backendError = error.backendError;

      if (backendError) {
        const detailedMessages = (backendError.errors || [])
          .map((e) => frontendErrorMessage[e.code] || e.message)
          .filter(Boolean);

        setErrorMessages(detailedMessages);
        setErrorMessage(
          backendError.frontendErrorMessage
          || detailedMessages[0]
          || backendError.backendMessage
          || 'Llame a soporte',
        );

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
            aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            <EyeIcon open={showPassword} />
          </button>
        }
      />

      <div className="flex flex-col gap-4">
        <Button type="submit">Iniciar Sesion</Button>

        {!onSuccess && (
          <Button
            type="button"
            onClick={() => navigate('/register')}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Registrarse
          </Button>
        )}
      </div>

        {errorMessages.length > 0 ? (
        <ul className="text-red-500 text-sm space-y-1">
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      ) : errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
    </form>
  );
}

export default LoginForm;
