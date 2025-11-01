import { Button } from '@headlessui/react'
import React, { ReactNode } from 'react'
import styles from './index.module.css'
import { classNames } from '@/utils'

function TimelinePanel() {

  return (
    <div className={classNames("w-full h-full bg-neutral-800 shadow-md rounded-xl overflow-y-auto", styles.timelinePanel)}>
    </div>
  )
}

export default TimelinePanel