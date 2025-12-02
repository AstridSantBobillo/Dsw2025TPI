const frontendErrorMessage = {
  // Orders (4000s)
  4001: 'La orden debe estar asociada a un cliente válido   ',
  4002: 'La dirección de envío es obligatoria',
  4003: 'El formato de la dirección de envío es incorrecto',
  4004: 'La dirección no debe exceder los 256 caracteres',
    4005: 'La dirección de facturación es obligatoria',
    4006: 'El formato de la dirección de facturación es incorrecto',
    4007: 'La dirección no debe exceder los 256 caracteres',
    4008: 'El formato de notas adicionales es incorrecto',
    4009: 'Debe haber al menos un ítem en la orden',

    //Order Items (500s)
    5001: 'Debe haber un producto válido en el detalle de la orden',
    5002: 'La cantidad del producto en el detalle de la orden debe ser mayor a cero',
    5003: 'La cantidad del producto en el detalle de la orden no puede ser mayor a 100 unidades',
    5004: 'La cantidad solicitada debe ser un número entero',

    //Bad Request (9000s)
    9001: 'Estado inválido para la orden',

  // Invalid Operations (9400s)
    9401: 'Stock insuficiente para completar la orden',
    9402: 'No se puede cambiar el estado de una orden',
    9403: 'El detalle de la orden no puede ser vacío',
    9404: 'No se puede enviar una orden vacía',

    // Not Found (9500s)
    9501: 'El cliente asociado a la orden no existe',
    9502: 'El producto solicitado no existe en la orden',
    9503: 'La orden solicitada no existe',
    9504: 'No se encuentran detalles para la orden solicitada',

    //Preconditions (9700s)
    9701: 'No se puede crear una orden sin cliente asociado',

};

export {
  frontendErrorMessage,
};
