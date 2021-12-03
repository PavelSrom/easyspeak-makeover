import clsx from 'clsx'

type Variant = 'h1' | 'h1_light' | 'h2' | 'body' | 'body2' | 'caption'
type ReturnElement = 'h1' | 'h2' | 'p' | 'span'

const elements: Record<Variant, ReturnElement> = {
  h1: 'h1',
  h1_light: 'h1',
  h2: 'h2',
  body: 'p',
  body2: 'p',
  caption: 'span',
}

const classes: Record<Variant, string> = {
  h1: 'text-2xl font-semibold',
  h1_light: 'text-2xl font-light',
  h2: 'text-xl font-semibold',
  body: 'text-base font-light',
  body2: 'text-sm font-light',
  caption: 'text-xs font-light',
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
