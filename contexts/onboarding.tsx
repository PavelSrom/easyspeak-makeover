import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TooltipRenderProps } from 'react-joyride'
import { Button, Text } from 'ui'
import { ONBOARDING_STEPS } from 'utils/onboarding-steps'
import { useLayout } from './page-layout'

const JoyrideNoSSR = dynamic(() => import('react-joyride'), { ssr: false })

type ContextProps = {
  shown: boolean
  setShown: React.Dispatch<React.SetStateAction<boolean>>
}

const OnboardingContext = createContext<ContextProps>({} as ContextProps)

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const router = useRouter()
  const { activeTab, setActiveTab } = useLayout()
  const [run, setRun] = useState<boolean>(false)
  const [shown, setShown] = useState<boolean>(false)
  const [stepIndex, setStepIndex] = useState<number>(0)

  const Tooltip = memo(({ index, step, tooltipProps }: TooltipRenderProps) => (
    <div className="p-4 bg-white max-w-xs rounded-md top-0" {...tooltipProps}>
      <Text variant="h2">{step.title}</Text>
      <Text>{step.content}</Text>

      <div className="flex justify-between items-center mt-2">
        <Text variant="caption">
          Step {index + 1} of {ONBOARDING_STEPS.length}
        </Text>
        <Button
          color="secondary"
          onClick={() => {
            if (index === ONBOARDING_STEPS.length - 1) {
              // onboarding finished => save to local storage
              localStorage.setItem('member-onboarded', 'true')
            }

            setStepIndex(prev => prev + 1)
          }}
        >
          {index === ONBOARDING_STEPS.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  ))

  useEffect(() => {
    if (stepIndex === 1) router.push('/profile')
    if (stepIndex === 3) router.push('/discussion')
    if (stepIndex === 4) router.push('/club')
    if (stepIndex === 5) router.push('/meetings')
    if (stepIndex === 7) setActiveTab(0)
    if (stepIndex === 8) setActiveTab(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  // find out if user already went through onboarding
  useEffect(() => {
    const onboarding = localStorage.getItem('member-onboarded')

    setRun(onboarding !== 'true')
  }, [])

  // remount joyride on each tab or page change
  useEffect(() => {
    setShown(false)

    const timeout = setTimeout(() => {
      setShown(true)
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [activeTab, router.pathname])

  const value: ContextProps = useMemo(
    () => ({ shown, setShown }),
    [shown, setShown]
  )

  return (
    <OnboardingContext.Provider value={value}>
      {shown ? (
        <JoyrideNoSSR
          run={run}
          continuous
          showProgress
          showSkipButton
          hideBackButton
          disableCloseOnEsc
          disableOverlayClose
          steps={ONBOARDING_STEPS}
          stepIndex={stepIndex}
          styles={{ options: { zIndex: 10000 } }}
          tooltipComponent={Tooltip}
          floaterProps={{ placement: 'top' }}
        />
      ) : null}
      {children}
    </OnboardingContext.Provider>
  )
}

type OnboardingOptions = {
  shown?: boolean
}

export const useOnboarding = ({ shown }: OnboardingOptions): void => {
  const { setShown, ...context } = useContext(OnboardingContext)
  if (!context)
    throw new Error('useOnboarding must be used within OnboardingProvider')

  // remount joyride on 'shown' change
  useEffect(() => {
    setShown(false)

    const timeout = setTimeout(() => {
      if (shown === true) setShown(true)
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [shown, setShown])
}
