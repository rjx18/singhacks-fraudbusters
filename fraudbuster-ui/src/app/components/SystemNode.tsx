'use client'

import React, { useCallback } from 'react'
import { Handle, Node, Position } from '@xyflow/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faArrowDown, faArrowsTurnToDots, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../utils';
import { useRouter } from 'next/navigation';

interface SystemNodeProps {
  clickable?: boolean
  editMode: boolean
  transparent: boolean
  className: string
  children: any
}

function SystemNode({id, data: {clickable = true, editMode, transparent, className, children} }: {id: string, data: SystemNodeProps}) {

  const router = useRouter()
  
  return (
    <div className={`${className} ${transparent ? "opacity-10" : "opacity-80"}`} onClick={() => {if (clickable) router.push(`/${id}`)}}>
      {/* <Handle type="target" position={Position.Top} /> */}
      {children}
      <Handle type="target" isConnectableEnd={editMode} isConnectableStart={editMode} position={Position.Bottom} id="a" className={classNames(!editMode ? '!left-[25%] !bg-transparent !w-0 !h-0 !border-0' : '!left-[25%] !bg-white !rounded-full !w-4 !h-4 !border-white !flex !justify-center !items-center shadow-lg')}>
        {editMode && <FontAwesomeIcon icon={faArrowUp} className='text-blue-700 w-2 h-2 pointer-events-none'/>}
      </Handle>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectableEnd={editMode} 
        isConnectableStart={editMode} 
        className={classNames(!editMode ? '!left-[75%] !bg-transparent !w-0 !h-0 !border-0' : '!left-[25%] !bg-white !rounded-full !w-4 !h-4 !border-white !flex !justify-center !items-center shadow-lg')}
        id="b"
        style={{ left: "unset" }}
      >
        {editMode && <FontAwesomeIcon icon={faArrowDown} className='text-blue-700 w-2 h-2 pointer-events-none'/>}
      </Handle>
    </div>
  )
}

export default SystemNode