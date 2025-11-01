'use client'

import { ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import SystemNode from './components/SystemNode'
import CustomBezierEdge from './components/CustomEdge'
import FloatingEdge, { SourceRightEdge, TargetRightEdge } from './components/FloatingEdge'
import { useMemo } from 'react'
import { AML_EDGES, AML_NODES } from '@/constants/nodes'
import InfoPanel from './components/InfoPanel'

export default function AMLPage() {
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
    <>
      <main className="relative w-screen h-screen bg-zinc-50">
        <ReactFlow
          colorMode="light"
          maxZoom={4}
          nodes={AML_NODES}
          edges={AML_EDGES}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={defaultViewport}
        >
          <Background />
          <Controls className="!text-zinc-800 !fill-zinc-800" />
        </ReactFlow>

        {/* === InfoPanel appears when ?rule=XYZ === */}
        <div className="absolute top-4 right-4 z-[9999]">
          <InfoPanel />
        </div>
      </main>
    </>
  )
}
