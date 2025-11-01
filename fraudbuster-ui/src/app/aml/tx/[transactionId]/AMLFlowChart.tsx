'use client'

import { ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import CustomBezierEdge from '../../../components/CustomEdge'
import FloatingEdge, { SourceRightEdge, TargetRightEdge } from '../../../components/FloatingEdge'
import SystemNode from '../../../components/SystemNode'
import InfoPanel from '../../../components/InfoPanel'
import { useMemo } from 'react'
import { AML_EDGES } from '@/constants/nodes'

interface AMLFlowChartProps {
  nodes: any[]
  variables: Record<string, any>
}

export default function AMLFlowChart({ nodes, variables }: AMLFlowChartProps) {
  const nodeTypes = useMemo(() => ({ systemNode: SystemNode }), [])
  const edgeTypes = useMemo(
    () => ({
      custom: CustomBezierEdge,
      floating: FloatingEdge,
      targetright: TargetRightEdge,
      sourceright: SourceRightEdge,
    }),
    []
  )

  const defaultViewport = { x: 500, y: 50, zoom: 0.75 }

  return (
    <main className="relative w-screen h-screen bg-zinc-100">
      <ReactFlow
        colorMode="light"
        maxZoom={4}
        nodes={nodes}
        edges={AML_EDGES} // Replace with AML_EDGES if desired
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
      >
        <Background />
        <Controls className="!text-zinc-800 !fill-zinc-800" />
      </ReactFlow>

      {/* === InfoPanel === */}
      <div className="absolute top-4 right-4 z-[9999]">
        <InfoPanel variables={variables} />
      </div>
    </main>
  )
}
