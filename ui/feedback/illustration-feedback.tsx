import { ClassNamesProps } from '@emotion/react'
import { Paper } from '@mui/material'
import { Button, Text } from 'ui'

export type IllustrationFeedbackProps = {
  title?: string
  message: string
  illustration?: {
    src: string
    height: number
    width: number
  }
  alt?: string
  onNavigate?: () => void
  buttonText?: string
  illustrationStyles?: string
}

export const IllustrationFeedback = ({
  title,
  message,
  illustration,
  alt,
  onNavigate,
  buttonText,
  illustrationStyles,
}: IllustrationFeedbackProps) => (
  <div className="p-5 flex justify-center">
    <div className="w-full sm:w-3/4 text-center flex flex-col gap-y-2">
      <div>
        {title && <Text variant="h3">{title}</Text>}
        <Text variant="body">{message}</Text>
      </div>
      {illustration && (
        <div className="flex justify-center">
          <div className={illustrationStyles || 'w-full sm:w-3/4'}>
            <img src={illustration.src} alt={alt || 'Feedback illustration'} />
          </div>
        </div>
      )}
      {onNavigate && (
        <Button onClick={onNavigate} color="secondary">
          {buttonText || 'See more'}
        </Button>
      )}
    </div>
  </div>
)
