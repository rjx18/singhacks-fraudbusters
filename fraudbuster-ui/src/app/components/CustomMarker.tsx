import { ArrowRightIcon } from '@heroicons/react/24/outline'
import React, { ReactNode } from 'react'
import Accordion from './Accordion'
import { classNames } from '@/utils'

interface CustomMarkerProps {
  title: string
  markerKey: string
  badge?: string
  step?: number
  children?: ReactNode
  badgeClassNames?: string
}

function CustomMarker({markerKey, title, children, badge, badgeClassNames = "", step}: CustomMarkerProps) {
  return (
    <div className="flex flex-col space-y-1 w-[6rem]">
      <div>
        {step && <div className="absolute top-[calc(0%-0.6rem)] left-[calc(0%-0.5rem)] text-[8pt] bg-white rounded-full font-bold w-5 h-5 justify-center items-center flex shadow">
          {step}
        </div>}
        {badge && <div className="absolute top-[calc(0%-0.6rem)] right-[calc(0%-0.5rem)] text-[6pt] bg-white rounded-full font-bold py-[2px] px-1 justify-center items-center flex shadow">
          <span className={classNames(badgeClassNames, 'bg-gradient-to-br from-green-500 to-green-900 inline-block text-transparent bg-clip-text')}>{badge}</span>
        </div>}
      </div>
      <div className="flex flex-col justify-center">
        <Accordion 
          key={`${markerKey}-marker`} 
          title={<h6 className="space-x-1 flex items-center font-bold text-[9pt] leading-4 font-bold">
            <span className='bg-gradient-to-br from-pink-500 to-pink-900 inline-block text-transparent bg-clip-text'>
              {title}
            </span>
          </h6>} 
          id={`${markerKey}-marker`} 
          active={false}
        >
          {children && <div className="w-full text-[5pt] font-medium text-neutral-800 space-y-1">
            {
              children
            }
          </div>}
        </Accordion>
      </div>
    </div>
  )
}

export default CustomMarker