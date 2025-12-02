const frontendErrorMessage = {
  // Productos (3000s)
  3001: "Por favor verifique SKU. El formato soportado es 'SKU-XXXX' seguido de 3 a 10 dígitos",
  3002: "Por favor verifique el codigo interno. El formato soportado es 'INT-XXXX' seguido de 3 a 10 dígitos",
  3003: 'El nombre es obligatorio entre 3 y 100 dígitos ',
  3004: 'El nombre tiene un formato inválido',
  3005: 'La descripción debe tener entre 10 y 500 caracteres',
  3006: 'La descripción tiene un formato inválido',
  3007: 'El precio debe ser mayor a cero',
  3008: 'El stock debe ser mayor a cero',

  // Unique constraints (BadRequest 9000s)
  9102: 'El SKU ya está en uso',
  9103: 'El código interno ya está en uso',
  9601: 'No hay productos disponibles con los filtros seleccionados',
};

export {
  frontendErrorMessage,
};
