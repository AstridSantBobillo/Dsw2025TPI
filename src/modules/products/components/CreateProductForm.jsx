import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Components
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';

// Services
import { createProduct } from '../services/create';

// Helpers
import { frontendErrorMessage } from '../helpers/backendError';
import { handleApiError } from '../../shared/helpers/handleApiError';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  // Mapeo de códigos -> campos
  const fieldByCode = {
    3001: 'sku',
    3002: 'cui',
    3003: 'name',
    3004: 'name',
    3005: 'description',
    3006: 'description',
    3007: 'price',
    3008: 'stock',
    9102: 'sku',
    9103: 'cui',
  };

  const setBackendFieldErrors = (full) => {
    const list = full?.errors || [];
    let matched = false;

    list.forEach((err) => {
      const field = fieldByCode[err.code];
      const message = frontendErrorMessage[err.code] || err.message;

      if (field && message) {
        setError(field, { type: 'backend', message });
        matched = true;
      }
    });

    return matched;
  };

  const onValid = async (formData) => {
    clearErrors();
    setErrorBackendMessage('');

    try {
      await createProduct(formData);
      navigate('/admin/products');
    } catch (error) {
      // Usamos handleApiError
      const { full, message, status } = handleApiError(error, {
        frontendMessages: frontendErrorMessage,
        showAlert: false,
      });

      // Aplica errores por campo
      const matched = setBackendFieldErrors(full);

      if (!matched) {
        // si no coincide ningún campo, mostrar mensaje global
        setErrorBackendMessage(message);

        if (status !== 400) {
          alert(message);
        }
      }
    }
  };

  return (
    <Card className="animate-fadeIn">
      <form
        className="
          flex flex-col gap-4
          bg-white p-4 rounded-xl
          w-full max-w-md mx-auto shadow-lg
        "
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', { required: 'SKU es requerido' ,
            pattern: {
              value: /^SKU-\d+$/,
              message: "El formato debe ser 'SKU-XXX'",
            },
          })}
        />

        <Input
          label='Código Único'
          error={errors.cui?.message}
          {...register('cui', { required: 'Código Único es requerido' ,
            pattern: {
              value: /^INT-\d+$/,
              message: "El formato debe ser 'INT-XXX'",
            },
          })}
        />

        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', { required: 'Nombre es requerido' ,
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 100,
              message: 'No debe superar los 100 caracteres',
            },
          })}
        />

        <Input
          label='Descripción'
          error={errors.description?.message}
          {...register('description', { required: 'Descripción es requerida' ,
            minLength: {
              value: 10,
              message: 'Debe tener al menos 10 caracteres',
            },
            maxLength: {
              value: 500,
              message: 'No debe superar los 500 caracteres',
            },
          })}
        />

        <Input
          label='Precio'
          type='number'
          error={errors.price?.message}
          {...register('price', {
          required: 'El precio es requerido',
          min: {
            value: 1,
            message: 'El precio debe ser mayor a cero',
          },
        })}
        />

        <Input
          label='Stock'
          type='number'
          error={errors.stock?.message}
          {...register('stock', {
          required: 'El stock es requerido',
          min: {
            value: 0,
            message: 'No puede tener un stock negativo',
          },
        })}
        />

        <div className="sm:text-end">
          <Button type="submit" className="w-full sm:w-fit">
            Crear Producto
          </Button>
        </div>

        {errorBackendMessage && (
          <span className="text-red-500">{errorBackendMessage}</span>
        )}
      </form>
    </Card>
  );
};

export default CreateProductForm;
