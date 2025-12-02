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

  // Mapea códigos de error del backend a campos del formulario
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

  const onValid = async (formData) => {

    setErrorBackendMessage('');
    clearErrors(); // por si venían errores previos

    try {
  await createProduct(formData);
  navigate('/admin/products');
} catch (err) {
  const result = handleApiError(err, {
    frontendMessages: frontendErrorMessage,
    showAlert: false, // evitamos alert por ahora
  });

  // Intentamos mapear errores de campo
  const matched = result.full?.errors?.some((error) => {
    const field = fieldByCode[error.code];
    const message = frontendErrorMessage[error.code] || error.message;

    if (field && message) {
      setError(field, { type: 'backend', message });
      return true;
    }

    return false;
  });

  if (!matched) {
    // Si no se pudo mapear ningún error a campos, ahora sí mostramos mensaje general
    setErrorBackendMessage(result.message); // ← Esto solo si no hubo errores de campo

    if (result.status !== 400) {
      // solo en errores más serios (500, 404, etc.)
      alert(result.message);
    }
  }
}
  
  };

  return (
    <Card className="animate-fadeIn">
      <form
        className='
          flex
          flex-col
          gap-20
          p-8
          sm:gap-4
        '
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
          })}
        />
        <Input
          label='Código Único'
          error={errors.cui?.message}
          {...register('cui', {
            required: 'Código Único es requerido',
          })}
        />
        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />
        <Input
          label='Descripción'
          error={errors.description?.message}
          {...register('description', {
            required: 'Descripción es requerida',
          })}
        />
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          {...register('price', {
            min: {
              value: 0,
              message: 'No puede tener un precio negativo',
            },
          })}
        />
        <Input
          label='Stock'
          error={errors.stock?.message}
          {...register('stock', {
            min: {
              value: 0,
              message: 'No puede tener un stock negativo',
            },
          })}
        />
        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'>Crear Producto</Button>
        </div>

        {errorBackendMessage && <span className='text-red-500'>{errorBackendMessage}</span>}
      </form>
    </Card>
  );
};

export default CreateProductForm;
