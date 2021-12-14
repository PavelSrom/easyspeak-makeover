import {
  LocalizationProvider,
  StaticDatePicker as MuiStaticDatePicker,
  StaticDatePickerProps as MuiStaticDatePickerProps,
  DateTimePicker,
  MobileDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'

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

export type DateTimePickerProps = Omit<MuiDateTimePickerProps, 'renderInput'>

export const TimePicker = (props: DateTimePickerProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  useEffect(() => {
    setIsMobile(!!('ontouchstart' in window || navigator.maxTouchPoints))
  }, [isMobile])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {isMobile ? (
        <MobileDateTimePicker
          {...props}
          minutesStep={5}
          renderInput={params => <TextField {...params} variant="standard" />}
        />
      ) : (
        <DateTimePicker
          {...props}
          minutesStep={5}
          renderInput={params => <TextField {...params} variant="standard" />}
        />
      )}
    </LocalizationProvider>
  )
}
