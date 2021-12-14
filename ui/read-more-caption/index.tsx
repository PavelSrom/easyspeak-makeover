import { Text } from 'ui'
import Link from 'next/link'

export type ReadMoreCaptionProps = {
  children: React.ReactNode
  captionText?: string
  href?: string
}

export const ReadMoreCaption = ({
  children,
  captionText,
  href,
}: ReadMoreCaptionProps) => (
  <div>
    <div className="flex justify-between mb-1">
      <Text variant="small" className="font-medium uppercase text-inactiveGrey">
        {captionText}
      </Text>
      {href && (
        <Link href={href}>
          <Text className="font-bold uppercase text-primary" variant="small">
            More
          </Text>
        </Link>
      )}
    </div>
    {children}
  </div>
  // onNavigate={() => router.push(`/discussion/${post.id}`)}
)
