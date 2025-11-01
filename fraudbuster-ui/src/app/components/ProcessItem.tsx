import { Button } from '@headlessui/react'
import React, { ReactNode } from 'react'
import { classNames } from '../utils'
import { useRouter } from 'next/navigation'

interface ProcessItemProps {
  step: number
  maxSteps: number
  content: ReactNode
  current?: boolean
  onNext?: () => void
  onDone?: () => void
}

function ProcessItem({step, maxSteps, content, current = false, onNext, onDone}: ProcessItemProps) {

  return (
    <div className={classNames(current ? 'bg-neutral-700/90' : 'bg-neutral-700/50', 'rounded-xl p-4 space-y-4')}>
      <div className="flex w-full space-x-4">
        <div className={classNames(current ? "bg-neutral-600" : "bg-neutral-700","w-8 h-8 flex-shrink-0 bg-neutral-700 flex items-center justify-center rounded-full")}>
          {step}
        </div>
        <div className='min-h-8 items-center flex'>
          <span>
            {content}
          </span>
        </div>
      </div>
      {current && <div className="flex space-x-2 justify-end">
        {step === maxSteps ? <Button onClick={onDone} className="bg-green-800/80  hover:bg-green-800/40 px-3 py-2 font-semibold rounded-xl">
          Done
        </Button> : <Button onClick={onNext} className="bg-green-900  hover:bg-green-900/70 px-3 py-2 font-semibold rounded-xl">
          Next
        </Button> } 
      </div>}
    </div>
  )
}

export default ProcessItem