import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-delete-dialog"
    >
      <DialogTitle id="confirm-delete-dialog">Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this task? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
