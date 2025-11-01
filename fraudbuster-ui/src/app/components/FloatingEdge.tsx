'use client'

import { EdgeLabelRenderer, getBezierPath, Position } from '@xyflow/react'
import colors from 'tailwindcss/colors'
import { useSearchParams } from 'next/navigation'

type EdgeProps = {
  id: string
  source: string
  target: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition?: Position
  targetPosition?: Position
  data?: any
  style?: React.CSSProperties
  className?: string
}

/**
 * Get edge color based on data
 */
function getColor(data?: any) {
  const status = data?.status

  if (status === 'pass') return colors.green[300]       // ✅ Passed checks
  if (status === 'fail') return colors.red[600]         // ❌ Failed checks
  if (status === 'needs_advice') return colors.amber[300] // ⚠️ Needs manual review / advice

  return colors.zinc[400] // default neutral
}

/**
 * Smooth vertical offset for more natural Bezier curvature
 */
function getAdjustedY(sourceY: number, targetY: number) {
  const dy = targetY - sourceY
  const yOffset = Math.max(Math.min(dy * 0.1, 20), -20)
  return {
    adjustedSourceY: sourceY + yOffset / 2,
    adjustedTargetY: targetY - yOffset / 2,
  }
}

/**
 * Compute edge opacity based on selected node
 */
function useEdgeOpacity(source: string, target: string) {
  const searchParams = useSearchParams()
  const selectedNode = searchParams.get('node')

  // No node selected → all visible
  if (!selectedNode) return '80%'

  // Highlight edges connected to selected node
  if (selectedNode === source || selectedNode === target) return '80%'

  // Fade unrelated edges
  return '20%'
}

/**
 * Default Floating Edge (Right → Left)
 */
export default function FloatingEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  className,
}: EdgeProps) {
  const { adjustedSourceY, adjustedTargetY } = getAdjustedY(sourceY, targetY)
  const color = getColor(data)
  const opacity = useEdgeOpacity(source, target)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY: adjustedSourceY,
    targetX,
    targetY: adjustedTargetY,
    sourcePosition: sourcePosition ?? Position.Right,
    targetPosition: targetPosition ?? Position.Left,
  })

  const markerId = `arrow-${id}`
  const strokeDasharray = style?.strokeDasharray ?? '5 15'
  const strokeWidth = style?.strokeWidth ?? 2

  return (
    <g className="react-flow__edge">
      <svg>
        <defs>
          <marker id={markerId} markerWidth="3" markerHeight="3" refX="3" refY="1.5" orient="auto">
            <polygon points="0 0, 3 1.5, 0 3" fill={color} />
          </marker>
        </defs>
      </svg>

      <path
        id={id}
        d={edgePath}
        markerEnd={`url(#${markerId})`}
        className={`react-flow__edge-path ${className ?? ''}`}
        style={{
          ...style,
          stroke: color,
          strokeWidth,
          strokeDasharray,
          fill: 'none',
          opacity,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            key={`${markerId}-label`}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="nodrag nopan rounded-md pointer-events-auto bg-neutral-200 opacity-90 px-1 pt-1 text-neutral-800 shadow z-10 hover:z-20 hover:opacity-100"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  )
}

/**
 * Edge variant: TargetRightEdge (forces target to connect at RIGHT)
 */
export function TargetRightEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  className,
}: EdgeProps) {
  const { adjustedSourceY, adjustedTargetY } = getAdjustedY(sourceY, targetY)
  const color = getColor(data)
  const opacity = useEdgeOpacity(source, target)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY: adjustedSourceY,
    targetX,
    targetY: adjustedTargetY,
    sourcePosition: sourcePosition ?? Position.Right,
    targetPosition: Position.Right,
  })

  const markerId = `arrow-${id}`
  const strokeDasharray = style?.strokeDasharray ?? '5 15'
  const strokeWidth = style?.strokeWidth ?? 2

  return (
    <g className="react-flow__edge">
      <svg>
        <defs>
          <marker id={markerId} markerWidth="3" markerHeight="3" refX="3" refY="1.5" orient="auto">
            <polygon points="0 0, 3 1.5, 0 3" fill={color} />
          </marker>
        </defs>
      </svg>

      <path
        id={id}
        d={edgePath}
        markerEnd={`url(#${markerId})`}
        className={`react-flow__edge-path ${className ?? ''}`}
        style={{
          ...style,
          stroke: color,
          strokeWidth,
          strokeDasharray,
          fill: 'none',
          opacity,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            key={`${markerId}-label`}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="nodrag nopan rounded-md pointer-events-auto bg-neutral-200 opacity-90 px-1 pt-1 text-neutral-800 shadow z-10 hover:z-20 hover:opacity-100"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  )
}

/**
 * Edge variant: SourceRightEdge (forces source to leave from RIGHT)
 */
export function SourceRightEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  className,
}: EdgeProps) {
  const { adjustedSourceY, adjustedTargetY } = getAdjustedY(sourceY, targetY)
  const color = getColor(data)
  const opacity = useEdgeOpacity(source, target)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY: adjustedSourceY,
    targetX,
    targetY: adjustedTargetY,
    sourcePosition: Position.Right,
    targetPosition: targetPosition ?? Position.Left,
  })

  const markerId = `arrow-${id}`
  const strokeDasharray = style?.strokeDasharray ?? '5 15'
  const strokeWidth = style?.strokeWidth ?? 2

  return (
    <g className="react-flow__edge">
      <svg>
        <defs>
          <marker id={markerId} markerWidth="3" markerHeight="3" refX="3" refY="1.5" orient="auto">
            <polygon points="0 0, 3 1.5, 0 3" fill={color} />
          </marker>
        </defs>
      </svg>

      <path
        id={id}
        d={edgePath}
        markerEnd={`url(#${markerId})`}
        className={`react-flow__edge-path ${className ?? ''}`}
        style={{
          ...style,
          stroke: color,
          strokeWidth,
          strokeDasharray,
          fill: 'none',
          opacity,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            key={`${markerId}-label`}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="nodrag nopan rounded-md pointer-events-auto bg-neutral-200 opacity-90 px-1 pt-1 text-neutral-800 shadow z-10 hover:z-20 hover:opacity-100"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  )
}
