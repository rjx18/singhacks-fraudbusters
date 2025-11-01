'use client'

import React, { useEffect, useRef } from 'react'
import { Handle, Position } from '@xyflow/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faUserCheck,
  faUserXmark,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { classNames } from '@/utils'

interface AIAssessment {
  overall_risk_score: number
  priority_level: number
  final_status: 'pass' | 'fail' // ← pass = no review, fail = needs review
  risk_level: 'low' | 'medium' | 'high'
}

interface Review {
  approve_tx: boolean
  mark_suspicious: boolean
  reason: string
}

interface ReviewNodeProps {
  label?: string
  clickable?: boolean
  editMode?: boolean
  assessment?: AIAssessment | undefined
  review?: Review | undefined
}

export default function ReviewNode({
  id,
  data: {
    label = 'AI Review',
    clickable = true,
    editMode = false,
    assessment,
    review,
  },
}: {
  id: string
  data: ReviewNodeProps
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nodeParam = searchParams.get('node')
  const isNodeSelected = nodeParam === id
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrapper = rootRef.current?.closest<HTMLElement>('.react-flow__node')
    if (wrapper) queueMicrotask(() => (wrapper.style.zIndex = isNodeSelected ? '9999' : '3'))
  }, [isNodeSelected])

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

  /**
   * States:
   * - no-assessment: AI hasn't run or errored
   * - cleared: AI says pass → no review needed
   * - pending: AI says fail & no review yet → review needed
   * - reviewed: AI says fail & review present → show outcome
   */
  const getState = () => {
    if (!assessment) return 'no-assessment'
    if (assessment.final_status === 'pass') return 'cleared'
    if (assessment.final_status === 'fail' && !review) return 'pending'
    if (assessment.final_status === 'fail' && review) return 'reviewed'
    return 'unknown'
  }

  const state = getState()

  const stateStyles: Record<string, string> = {
    'no-assessment': 'bg-zinc-50 border-zinc-300 text-zinc-600',
    cleared: 'bg-green-50 border-green-300 text-green-800',
    pending: 'bg-amber-50 border-amber-300 text-amber-800',
    reviewed: review?.approve_tx
      ? 'bg-green-50 border-green-300 text-green-800'
      : 'bg-red-50 border-red-300 text-red-800',
  }

  const icons: Record<string, React.ReactNode> = {
    'no-assessment': <FontAwesomeIcon icon={faQuestionCircle} className="text-zinc-400 w-4 h-4" />,
    cleared: <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 w-4 h-4" />,
    pending: <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 w-4 h-4" />,
    reviewed: review?.approve_tx ? (
      <FontAwesomeIcon icon={faUserCheck} className="text-green-600 w-4 h-4" />
    ) : (
      <FontAwesomeIcon icon={faUserXmark} className="text-red-600 w-4 h-4" />
    ),
  }

  return (
    <div
      ref={rootRef}
      onClick={clickable ? selectNode : undefined}
      className={classNames(
        'rounded-xl border shadow-sm p-3 text-sm transition w-[14rem] select-none cursor-pointer',
        stateStyles[state],
        isNodeSelected ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h6 className="font-semibold text-[9pt] flex items-center gap-1">
          {icons[state]}
          <span>{label}</span>
        </h6>
      </div>

      {/* Content */}
      {state === 'no-assessment' && (
        <div className="text-xs text-center text-zinc-500">Awaiting AI assessment...</div>
      )}

      {state === 'cleared' && (
        <div className="text-xs text-center p-2 rounded-md bg-green-100/70 border border-green-200">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-green-700" />
          No review needed — AI cleared
        </div>
      )}

      {state === 'pending' && (
        <div className="text-xs text-center p-2 rounded-md bg-amber-100 border border-amber-200">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 text-amber-600" />
          Review needed — <div className="font-bold">Click to enter</div>
        </div>
      )}

      {state === 'reviewed' && review && (
        <div className="text-xs space-y-1 font-medium">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <span
              className={classNames(
                'font-semibold',
                review.approve_tx ? 'text-green-700' : 'text-red-700'
              )}
            >
              {review.approve_tx ? 'Approved' : 'Rejected'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Suspicious:</span>
            <span
              className={classNames(
                'font-semibold',
                review.mark_suspicious ? 'text-red-700' : 'text-zinc-700'
              )}
            >
              {review.mark_suspicious ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="mt-2 p-2 rounded-md bg-zinc-100 border text-zinc-700 text-[11px]">
            <span className="block font-semibold mb-0.5 text-[10px] uppercase text-zinc-500">
              Reason
            </span>
            {review.reason}
          </div>
        </div>
      )}

      {/* Handles */}
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
