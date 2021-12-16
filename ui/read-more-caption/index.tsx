import { Text } from 'ui'

export type ReadMoreCaptionProps = {
  children: React.ReactNode
  captionText?: string
  onNavigate?: () => void
}

export const ReadMoreCaption = ({
  children,
  captionText,
  onNavigate,
}: ReadMoreCaptionProps) => (
  <div>
    <div className="flex justify-between mb-1">
      <Text variant="small" className="font-medium uppercase text-inactiveGrey">
        {captionText}
      </Text>
      {onNavigate && (
        // eslint-disable-next-line
        <div onClick={onNavigate}>
          <Text className="font-bold uppercase text-primary" variant="small">
            More
          </Text>
        </div>
      )}
    </div>
    {children}
  </div>
)
