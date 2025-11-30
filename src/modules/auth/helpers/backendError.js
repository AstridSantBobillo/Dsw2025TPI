const frontendErrorMessage = {
  // RegisterValidator (2000s)
  2001: 'El nombre de usuario debe contener al menos 4 caracteres',
  2002: 'El email es obligatorio',
  2003: 'Formato de email inválido',
  2004: 'La contraseña debe tener más caracteres',
  2005: 'La contraseña debe incluir al menos un número',
  2006: 'La contraseña debe incluir al menos una mayúscula',
  2007: 'La contraseña debe incluir al menos una minúscula',
  2008: 'La contraseña debe incluir al menos un carácter especial',
  
  // Roles / authorization
  7001: 'Rol inválido para esta operación',

    // Identity / UserManager
  8001: 'No se pudo completar la operación de identidad. Intenta nuevamente.',

  // Unique constraints (BadRequest 9000s)
  9101: 'El nombre de usuario/email ya está en uso',

  // Role assignment (BadRequest 9200s)
  9201: 'No tiene un rol asignado',
  9202: 'No se pudo asignar un rol al usuario',

  // LoginValidator (Unathorized 9000s)
  9301: 'Usuario y/o contraseña no son correctos',

};

export {
  frontendErrorMessage,
};
