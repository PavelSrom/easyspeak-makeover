import { forwardRef } from 'react'
import clsx from 'clsx'
import { Field, FastField, FieldProps, FastFieldProps } from 'formik'
import {
  TextField as MuiTextField,
  StandardTextFieldProps,
  InputAdornment,
} from '@mui/material'
import { TextFieldName } from 'types/helpers'
import { textFieldIcons } from 'utils/text-field-icons'
import {styled} from '@mui/material/styles'
import { theme } from 'styles/theme'

export type TextFieldProps = Omit<
  StandardTextFieldProps,
  'name' | 'variant'
> & {
  name: TextFieldName
  fast?: boolean
  onAfterChange?: () => void | Promise<void>
}

// TODO: hover and focus background
const StyledMuiTextField = styled(MuiTextField)({
  '& .MuiSvgIcon-root': {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.primary.main,
    borderRadius: '0.2em',
  },
  '& .MuiInput-root': {
    borderRadius: '0.5em 0.5em 0 0',
    padding: '0.5em'
  },
  '& .MuiInput-root:hover': {
    backgroundColor: theme.palette.info.light,
  },
  '& .MuiInputLabel-root': {
    textTransform: 'uppercase',
    fontSize: '0.8em'
  },
  '& .MuiInput-underline:after': {
    border: '0.5px solid' + theme.palette.neutral.main,
  }
});

// TODO: type-safe 'name' prop synced with icons?
export const TextField: React.ForwardRefExoticComponent<TextFieldProps> =
  forwardRef<HTMLDivElement, TextFieldProps>(
    (
      { name, fast, onAfterChange, fullWidth = true, className, ...rest },
      ref
    ) => {
      const FieldComponent = fast ? FastField : Field
      const FieldIcon = textFieldIcons[name]

      return (
        <FieldComponent name={name}>
          {({
            field: { onChange, ...fieldRest },
            meta,
            form,
          }: FieldProps | FastFieldProps) => (
            <StyledMuiTextField
              ref={ref}
              {...rest}
              {...fieldRest}
              fullWidth={fullWidth}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FieldIcon />
                  </InputAdornment>
                ),
              }}
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
                className: '-bottom-5',
              }}
            />
          )}
        </FieldComponent>
      )
    }
  )

TextField.displayName = 'TextField'

