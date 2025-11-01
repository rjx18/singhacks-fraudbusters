'use client'

import React, { useEffect, useRef } from 'react'
import { Handle, Position } from '@xyflow/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCheckCircle, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { classNames } from '@/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface SystemNodeProps {
  clickable?: boolean
  editMode?: boolean
  transparent?: boolean
  className?: string
  label?: string
  overall_status?: 'pass' | 'needs_advice' | 'fail' | 'unknown'
  items?: { id: string; name: string; result?: boolean | null }[]
}

export default function SystemNode({
  id,
  data: {
    clickable = true,
    editMode = false,
    transparent = false,
    className = '',
    label,
    overall_status = 'unknown',
    items = [],
  },
}: {
  id: string
  data: SystemNodeProps
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nodeParam = searchParams.get('node')
  const ruleParam = searchParams.get('rule')
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Determine selection relationships
  const isRuleInNode = items.some((item) => item.id === ruleParam)
  const isNodeSelected = nodeParam === id || isRuleInNode
  const hasAnySelection = Boolean(nodeParam || ruleParam)

  // Adjust z-index on selection
  useEffect(() => {
    const wrapper = rootRef.current?.closest<HTMLElement>('.react-flow__node')
    if (wrapper) queueMicrotask(() => (wrapper.style.zIndex = isNodeSelected ? '9999' : '3'))
  }, [isNodeSelected])

  // === Color mapping ===
  const statusColors: Record<string, string> = {
    pass: 'bg-green-50 border-green-300 text-green-800',
    needs_advice: 'bg-amber-50 border-amber-300 text-amber-800',
    fail: 'bg-red-50 border-red-300 text-red-800',
    unknown: 'bg-zinc-50 border-zinc-300 text-zinc-800',
  }

  const statusIcons: Record<string, React.ReactNode> = {
    pass: <FontAwesomeIcon icon={faCheckCircle} className="w-3.5 h-3.5 text-green-600" />,
    needs_advice: <FontAwesomeIcon icon={faExclamationCircle} className="w-3.5 h-3.5 text-amber-500" />,
    fail: <FontAwesomeIcon icon={faTimesCircle} className="w-3.5 h-3.5 text-red-500" />,
    unknown: <div className="w-3 h-3 rounded-full bg-zinc-400" />,
  }

  // Select node
  const selectNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    const params = new URLSearchParams(searchParams.toString())
    if (nodeParam === id) {
      params.delete('node')
      params.delete('rule')
    } else {
      params.set('node', id)
      params.delete('rule')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Select rule
  const handleRuleClick = (e: React.MouseEvent, ruleId: string) => {
    e.stopPropagation()
    const params = new URLSearchParams(searchParams.toString())
    params.set('node', id)
    params.set('rule', ruleId)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div
      ref={rootRef}
      onClick={clickable ? selectNode : undefined}
      className={classNames(
        className,
        'rounded-xl border shadow-sm px-3 py-2 text-sm transition w-[13rem] select-none cursor-pointer',
        statusColors[overall_status],
        hasAnySelection
          ? isNodeSelected
            ? 'opacity-100'
            : 'opacity-40'
          : 'opacity-95',
        isNodeSelected ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
      )}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <h6 className="font-semibold text-[9pt] break-words flex items-center gap-1">
          {statusIcons[overall_status]}
          <span>{label}</span>
        </h6>
        {items.length > 0 && (
          <div
            className="ml-1 text-zinc-500 hover:text-zinc-700 focus:outline-none flex items-center"
            onClick={(e) => {
              e.stopPropagation()
              selectNode(e)
            }}
          >
            {isNodeSelected ? (
              <ChevronDownIcon className="w-3 h-3 pointer-events-none" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 pointer-events-none" />
            )}
          </div>
        )}
      </div>

      {/* ===== Expandable Rules ===== */}
      {isNodeSelected && items.length > 0 && (
        <div className="mt-2 space-y-1 text-[8pt] font-medium text-neutral-800 max-h-48 overflow-auto">
          {items.map((item) => {
            const isRuleSelected = ruleParam === item.id

            // Determine icon based on item.result (true=pass, false=fail, null=advice)
            let icon: React.ReactNode
            if (item.result === true) icon = statusIcons['pass']
            else if (item.result === false) icon = statusIcons['fail']
            else icon = statusIcons['needs_advice']

            return (
              <div
                key={item.id}
                className={classNames(
                  'rounded px-1.5 py-1 shadow-sm transition cursor-pointer whitespace-pre-wrap break-words flex items-center gap-1',
                  isRuleSelected
                    ? 'bg-amber-100 shadow-inner'
                    : 'bg-gray-100 hover:bg-gray-200'
                )}
                onClick={(e) => handleRuleClick(e, item.id)}
                title={item.id}
              >
                {icon}
                <span>{item.name}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* ===== Handles ===== */}
      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className={classNames(
          !editMode
            ? '!bg-transparent !w-0 !h-0 !border-0'
            : '!bg-white !rounded-full !w-3 !h-3 border border-zinc-400 shadow-sm flex justify-center items-center'
        )}
      >
        {editMode && (
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-blue-700 w-2 h-2 pointer-events-none"
          />
        )}
      </Handle>

      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className={classNames(
          !editMode
            ? '!bg-transparent !w-0 !h-0 !border-0'
            : '!bg-white !rounded-full !w-3 !h-3 border border-zinc-400 shadow-sm flex justify-center items-center'
        )}
      >
        {editMode && (
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-blue-700 w-2 h-2 pointer-events-none"
          />
        )}
      </Handle>
    </div>
  )
}
