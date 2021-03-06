import clsx from 'clsx'

type Variant =
  | 'h1'
  | 'h1_light'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'body2'
  | 'small'
  | 'caption'
type ReturnElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'label'

const elements: Record<Variant, ReturnElement> = {
  h1: 'h1',
  h1_light: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  body2: 'p',
  small: 'small',
  caption: 'label',
}

const classes: Record<Variant, string> = {
  h1: 'text-2xl font-regular',
  h1_light: 'text-2xl font-light',
  h2: 'text-xl font-medium',
  h3: 'text-xl font-regular',
  h4: 'text-l font-medium',
  body: 'text-base font-light body',
  body2: 'text-sm font-light body',
  small: 'text-xs font-light body',
  caption: 'text-xs font-regular uppercase',
}

export type TextProps = {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export const Text = ({ children, variant = 'body', className }: TextProps) => {
  const Element = elements[variant]

  return (
    <Element
      className={clsx(classes[variant], {
        [className!]: !!className,
      })}
    >
      {children}
    </Element>
  )
}
