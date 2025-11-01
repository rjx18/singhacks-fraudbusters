'use client'

import React, { useEffect, useRef } from 'react'
import { Handle, Position } from '@xyflow/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faTimesCircle,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { classNames } from '@/utils'

interface AIAssessment {
  overall_risk_score: number
  priority_level: number
  final_status: 'pass' | 'fail'
  risk_level: 'low' | 'medium' | 'high'
}

interface TransactionPassedNodeProps {
  label?: string
  clickable?: boolean
  editMode?: boolean
  assessment?: AIAssessment | undefined
}

export default function TransactionPassedNode({
  id,
  data: {
    label = 'Transaction Passed',
    clickable = true,
    editMode = false,
    assessment,
  },
}: {
  id: string
  data: TransactionPassedNodeProps
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nodeParam = searchParams.get('node')
  const isNodeSelected = nodeParam === id
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Bring selected node to front
  useEffect(() => {
    const wrapper = rootRef.current?.closest<HTMLElement>('.react-flow__node')
    if (wrapper) queueMicrotask(() => (wrapper.style.zIndex = isNodeSelected ? '9999' : '3'))
  }, [isNodeSelected])

  // Node selection
  const selectNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    const params = new URLSearchParams(searchParams.toString())
    if (nodeParam === id) {
      params.delete('node')
    } else {
      params.set('node', id)
      params.delete('rule')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // === Determine visual state ===
  const getState = () => {
    if (!assessment) return 'no-assessment'
    if (assessment.final_status === 'fail') return 'disabled'
    if (assessment.final_status === 'pass') return 'passed'
    return 'unknown'
  }

  const state = getState()

  // === Style mappings ===
  const stateStyles: Record<string, string> = {
    disabled: 'bg-transparent border border-zinc-300 opacity-50 text-zinc-600',
    passed: 'bg-green-50 border-green-300 text-green-800',
    'no-assessment': 'bg-zinc-50 border-zinc-300 text-zinc-600',
  }

  const icons: Record<string, React.ReactNode> = {
    passed: <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 w-5 h-5" />,
    disabled: <FontAwesomeIcon icon={faTimesCircle} className="text-zinc-400 w-4 h-4" />,
    'no-assessment': <FontAwesomeIcon icon={faQuestionCircle} className="text-zinc-400 w-4 h-4" />,
  }

  return (
    <div
      ref={rootRef}
      onClick={clickable ? selectNode : undefined}
      className={classNames(
        'rounded-xl border shadow-sm p-3 text-sm transition w-[14rem] select-none cursor-pointer flex flex-col items-center justify-center',
        stateStyles[state],
        isNodeSelected ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
      )}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        {icons[state]}
        {state === 'passed' && <h6 className="font-semibold text-[9pt]">{label}</h6>}

        {state === 'passed' && (
          <div className="text-xs text-green-700 font-medium">
            All AML checks cleared successfully ✅
          </div>
        )}

        {state === 'disabled' && (
          <div className="text-xs text-zinc-500 font-medium">
            Transaction did not pass AI assessment
          </div>
        )}

        {state === 'no-assessment' && (
          <div className="text-xs text-zinc-500 font-medium">
            Awaiting AI assessment...
          </div>
        )}
      </div>

      {/* === Handles === */}
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
          <FontAwesomeIcon icon={faArrowLeft} className="text-blue-700 w-2 h-2 pointer-events-none" />
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
          <FontAwesomeIcon icon={faArrowRight} className="text-blue-700 w-2 h-2 pointer-events-none" />
        )}
      </Handle>
    </div>
  )
}
