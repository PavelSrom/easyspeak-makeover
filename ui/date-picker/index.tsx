import {
  LocalizationProvider,
  StaticDatePicker as MuiStaticDatePicker,
  StaticDatePickerProps as MuiStaticDatePickerProps,
} from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { TextField } from '@mui/material'

export type StaticDatePickerProps = Omit<
  MuiStaticDatePickerProps,
  'renderInput'
>

export const StaticDatePicker = (props: StaticDatePickerProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <MuiStaticDatePicker
      {...props}
      renderInput={params => <TextField {...params} />}
    />
  </LocalizationProvider>
)
