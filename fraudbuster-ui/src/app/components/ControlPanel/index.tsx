import { useShowJARVISConnectionToggle } from '@/app/contexts/Nodes'
import { Switch } from '@headlessui/react'
import { CircleStackIcon } from '@heroicons/react/24/outline'
import React from 'react'

function ControlPanel() {
  const [showJARVISConnections, { toggleShowJARVISConnections }] = useShowJARVISConnectionToggle()

  return (
    <div>
      <div className="px-4 py-4 flex space-x-4 items-center bg-neutral-800 rounded-xl">
        <h6 className="flex space-x-2 items-center">
          <CircleStackIcon className="h-5 w-5" />
          <span>
            Show JARVIS Connections
          </span>
        </h6>
        
        <Switch
          checked={showJARVISConnections}
          onChange={() => toggleShowJARVISConnections()}
          className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-auto"
        >
          <span className="sr-only">Use setting</span>
          <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md bg-neutral-600" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute mx-auto h-4 w-9 rounded-full bg-neutral-400 transition-colors duration-200 ease-in-out group-data-[checked]:bg-blue-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-neutral-400 bg-neutral-200 shadow ring-0 transition-transform duration-200 ease-in-out group-data-[checked]:translate-x-5"
          />
        </Switch>
      </div>
    </div>
  )
}

export default ControlPanel