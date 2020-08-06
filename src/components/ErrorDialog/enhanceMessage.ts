// This function is used to provide error messages to the user that are
// different than the error messages provided by the SDK.
export default function enhanceMessage(message = '', code?: number) {
  switch (code) {
    case 20101:
    case 53405:
    case 20104:
      return 'Se ha perdido la conexión a internet. Vuelva a ingresar a la llamada.';
    case 53118:
      return 'Reunión finalizada: han superado el tiempo máximo de llamada.';
    default:
      return message;
  }
}
