import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function LoadExampleDialog({ open, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Load Example Configuration?</DialogTitle>
      <DialogContent>
        Load example configuration with demo chat endpoint and sample application details? Current
        settings will be replaced.
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Load Example
        </Button>
      </DialogActions>
    </Dialog>
  );
}
