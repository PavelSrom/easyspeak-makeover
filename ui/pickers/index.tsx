import {
  LocalizationProvider,
  StaticDatePicker as MuiStaticDatePicker,
  StaticDatePickerProps as MuiStaticDatePickerProps,
  TimePicker as MuiTimePicker,
  TimePickerProps as MuiTimePickerProps,
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

export type TimePickerProps = Omit<MuiTimePickerProps, 'renderInput'>

export const TimePicker = (props: TimePickerProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <MuiTimePicker
      {...props}
      minutesStep={5}
      views={['hours', 'minutes']}
      renderInput={params => <TextField {...params} variant="standard" />}
    />
  </LocalizationProvider>
)
