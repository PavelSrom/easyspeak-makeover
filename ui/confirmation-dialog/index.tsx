import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from '@mui/material'
import { Button } from '../button'
import { Text } from '../text'

type Props = Omit<DialogProps, 'open' | 'onClose'> & {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<unknown>
  loading?: boolean
  title?: string
  description?: string
  confirmText?: string
}

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action is irreversible!',
  loading = false,
  confirmText = 'Confirm',
  ...rest
}: Props) => (
  <Dialog {...rest} open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle className="pb-0">{title}</DialogTitle>
    <DialogContent>
      <Text>{description}</Text>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" onClick={onClose}>
        Cancel
      </Button>
      <Button
        loading={loading}
        variant="contained"
        color="secondary"
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
)
