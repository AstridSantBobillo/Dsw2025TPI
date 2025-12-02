import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

//Hooks
import useAuth from '../hook/useAuth';

//Components
import Input from '../../shared/components/Input';
import PasswordInput from '../../shared/components/PasswordInput';
import Button from '../../shared/components/Button';

//Helpers
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

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

      <PasswordInput
        label="Contraseña"
        compact
        error={errors.password?.message}
        registerProps={register('password', { required: 'La contraseña es obligatoria' })}
      />

      <div className="flex flex-col gap-4">
        <Button type="submit">Iniciar Sesion</Button>

        {!onSuccess && (
          <Button
            type="button"
            onClick={() => navigate('/register')}
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
