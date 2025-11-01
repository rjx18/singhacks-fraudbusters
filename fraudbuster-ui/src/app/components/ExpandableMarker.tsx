import { ArrowRightIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Accordion from './Accordion'

interface ExpandableMarkerProps {
  nodeFrom: string
  nodeTo: string
  items: string[]
}

function ExpandableMarker({nodeFrom, nodeTo, items}: ExpandableMarkerProps) {
  return (
    <div className="flex flex-col space-y-1 w-[5.5rem]">
      <div className="flex flex-col justify-center">
        <Accordion 
          key={`${nodeFrom}-${nodeTo}-accordion`} 
          title={<h6 className="space-x-1 flex items-center font-bold text-[6pt] font-bold">
              <span>
              {nodeFrom}
            </span>
            <ArrowRightIcon className="w-2 h-2" />
            <span>
              {nodeTo}
            </span>
          </h6>} 
          id={`${nodeFrom}-${nodeTo}-accordion`} 
          active={false}
        >
          <div className="text-[5pt] font-medium text-neutral-800 space-y-1">
            {
              items.map((i) => <div className="bg-gray-100 rounded py-1 px-1.5 shadow"><span>{i}</span></div>)
            }
          </div>
        </Accordion>
      </div>
    </div>
  )
}

export default ExpandableMarker