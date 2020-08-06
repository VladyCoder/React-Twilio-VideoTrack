import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import enhanceMessage from './enhanceMessage';
import { TwilioError } from 'twilio-video';

interface ErrorDialogProps {
  dismissError: Function;
  error: TwilioError | null;
}

function ErrorDialog({ dismissError, error }: PropsWithChildren<ErrorDialogProps>) {
  const { message, code } = error || {};
  const enhancedMessage = enhanceMessage(message, code);

  if (code === 53118) {
    return (
      <Dialog open={error !== null} onClose={() => dismissError()} fullWidth={true} maxWidth="xs">
        <DialogTitle>Reunión Finalizada</DialogTitle>
        <DialogContent>
          <DialogContentText>Han superado el tiempo máximo de llamada</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dismissError()} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={error !== null} onClose={() => dismissError()} fullWidth={true} maxWidth="xs">
      <DialogTitle>Ha ocurrido un error</DialogTitle>
      <DialogContent>
        <DialogContentText>{enhancedMessage}</DialogContentText>
        {code && (
          <pre>
            <code>Código de error: {code}</code>
          </pre>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dismissError()} color="primary" autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorDialog;
