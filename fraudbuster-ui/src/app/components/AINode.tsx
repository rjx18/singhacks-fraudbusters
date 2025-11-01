'use client'

import React, { useEffect, useRef } from 'react'
import { Handle, Position } from '@xyflow/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faExclamationTriangle,
  faBolt,
  faCircleXmark,
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { classNames } from '@/utils'

interface AIAssessment {
  overall_risk_score: number
  priority_level: number
  final_status: 'pass' | 'fail' | undefined
  risk_rating: 'low' | 'medium' | 'high'
}

interface AINodeProps {
  label?: string
  clickable?: boolean
  editMode?: boolean
  assessment?: AIAssessment | undefined
}

export default function AINode({
  id,
  data: { label = 'AI Advisor', clickable = true, editMode = false, assessment },
}: {
  id: string
  data: AINodeProps
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nodeParam = searchParams.get('node')
  const isNodeSelected = nodeParam === id
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Raise z-index when selected
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

  // --- Color schemes ---
  const riskColors: Record<string, string> = {
    low: 'bg-green-50 border-green-300 text-green-800',
    medium: 'bg-amber-50 border-amber-300 text-amber-800',
    high: 'bg-red-50 border-red-300 text-red-800',
  }

  // --- Determine icons for status ---
  const statusIcon =
    assessment?.final_status === 'pass'
      ? faCheckCircle
      : assessment?.final_status === 'fail'
      ? faCircleXmark
      : faExclamationTriangle

  const statusColor =
    assessment?.final_status === 'pass'
      ? 'bg-green-50 border-green-300 text-green-700'
      : assessment?.final_status === 'fail'
      ? 'bg-red-50 border-red-300 text-red-700'
      : 'bg-zinc-50 border-zinc-300 text-zinc-700'

  const statusLabel =
    assessment?.final_status === 'pass'
      ? 'Pass'
      : assessment?.final_status === 'fail'
      ? 'Fail'
      : 'Unknown'

  return (
    <div
      ref={rootRef}
      onClick={clickable ? selectNode : undefined}
      className={classNames(
        'rounded-xl border shadow-sm p-3 text-sm transition w-[14rem] select-none cursor-pointer',
        'bg-blue-50 border-blue-300 text-blue-900',
        isNodeSelected ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
      )}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-2">
        <h6 className="font-semibold text-[9pt] flex items-center gap-1">
          <FontAwesomeIcon icon={faBolt} className="text-blue-600 w-3.5 h-3.5" />
          <span>{label}</span>
        </h6>

        {assessment ? (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-600 w-4 h-4"
            title="AI Advisor completed"
          />
        ) : (
          <FontAwesomeIcon
            icon={faEllipsisH}
            className="text-amber-500 w-4 h-4"
            title="Queued"
          />
        )}
      </div>

      {/* ===== Assessment Summary ===== */}
      {assessment ? (
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {/* Risk Score */}
          <div className="flex flex-col items-center justify-center px-2 py-1 rounded-md bg-zinc-100 border border-zinc-300 text-zinc-700 w-[5rem]">
            <span className="text-[10px] uppercase">Risk Score</span>
            <span className="font-semibold text-[13px]">{assessment.overall_risk_score}</span>
          </div>

          {/* Priority */}
          <div className="flex flex-col items-center justify-center px-2 py-1 rounded-md bg-zinc-100 border border-zinc-300 text-zinc-700 w-[5rem]">
            <span className="text-[10px] uppercase">Priority</span>
            <span className="font-semibold text-[13px]">{assessment.priority_level}</span>
          </div>

          {/* Status */}
          <div
            className={classNames(
              'flex flex-col items-center justify-center px-2 py-1 rounded-md border w-[5rem]',
              statusColor
            )}
          >
            <span className="text-[10px] uppercase">Status</span>
            <div className="flex items-center gap-1 font-semibold text-[13px]">
              <FontAwesomeIcon icon={statusIcon} />
              <span>{statusLabel}</span>
            </div>
          </div>

          {/* Risk Level */}
          <div
            className={classNames(
              'flex flex-col items-center justify-center px-2 py-1 rounded-md border w-[5rem]',
              riskColors[assessment.risk_rating]
            )}
          >
            <span className="text-[10px] uppercase">Risk</span>
            <span className="font-semibold text-[13px] capitalize">
              {assessment.risk_rating}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-2 p-2 rounded-md bg-amber-50 border border-amber-300 text-amber-700 text-xs text-center">
          Queued...
        </div>
      )}

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
