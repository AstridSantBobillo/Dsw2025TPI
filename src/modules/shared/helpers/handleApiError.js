import { mapBackendError } from './mapBackendError';

const DEFAULT_MESSAGE = 'Ocurrió un error inesperado';

export function handleApiError(errorLike, options = {}) {
  const {
    showAlert = true,
    setErrorMessage,
    frontendMessages = {},
  } = options;

  const mapped = mapBackendError(errorLike, frontendMessages);

  const {
    frontendErrorMessage,
    backendMessage,
    title,
    status,
  } = mapped;

  const finalMessage =
    frontendErrorMessage ||
    backendMessage ||
    title ||
    DEFAULT_MESSAGE;

  // Mostrar alertas globales si se desea
  if (showAlert) {
    switch (status) {
      case 404:
        alert('Recurso no encontrado');
        break;
      case 401:
        alert('Acceso no autorizado');
        break;
      case 412:
        alert('Condiciones no cumplidas');
        break;
      case 500:
        alert('Error interno del servidor');
        break;
      default:
        alert(finalMessage);
        break;
    }
  }

  // Si se quiere setear mensaje manualmente
  if (setErrorMessage) {
    setErrorMessage(finalMessage);
  }

  return {
    message: finalMessage,
    status,
    full: mapped,
  };
}
