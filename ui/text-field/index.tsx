import { forwardRef } from 'react'
import clsx from 'clsx'
import { Field, FastField, FieldProps, FastFieldProps } from 'formik'
import {
  TextField as MuiTextField,
  StandardTextFieldProps,
} from '@mui/material'

export type TextFieldProps = Omit<
  StandardTextFieldProps,
  'name' | 'variant'
> & {
  name: string
  fast?: boolean
  onAfterChange?: () => void | Promise<void>
}

// TODO: hover and focus background
// TODO: type-safe 'name' prop synced with icons?
export const TextField: React.ForwardRefExoticComponent<TextFieldProps> =
  forwardRef<HTMLDivElement, TextFieldProps>(
    (
      { name, fast, onAfterChange, fullWidth = true, className, ...rest },
      ref
    ) => {
      const FieldComponent = fast ? FastField : Field

      return (
        <FieldComponent name={name}>
          {({
            field: { onChange, ...fieldRest },
            meta,
            form,
          }: FieldProps | FastFieldProps) => (
            <MuiTextField
              ref={ref}
              {...rest}
              {...fieldRest}
              fullWidth={fullWidth}
              variant="standard"
              className={clsx('relative', {
                [className!]: !!className,
              })}
              onChange={e => {
                onChange(e)
                onAfterChange?.()
                form.setFieldTouched(name, true)
              }}
              error={!!meta.error && meta.touched}
              helperText={meta.touched ? meta.error : ''}
              FormHelperTextProps={{
                ...rest.FormHelperTextProps,
                className: 'absolute -bottom-5',
              }}
            />
          )}
        </FieldComponent>
      )
    }
  )

TextField.displayName = 'TextField'
