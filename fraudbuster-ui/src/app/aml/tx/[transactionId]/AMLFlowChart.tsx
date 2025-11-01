'use client'

import { ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import CustomBezierEdge from '../../../components/CustomEdge'
import FloatingEdge, { SourceRightEdge, TargetRightEdge } from '../../../components/FloatingEdge'
import SystemNode from '../../../components/SystemNode'
import InfoPanel from '../../../components/InfoPanel'
import { useMemo } from 'react'
import AINode from '@/app/components/AINode'
import ReviewNode from '@/app/components/ReviewNode'
import TransactionPassedNode from '@/app/components/TransactionPassedNode'
import ReviewPanel from '@/app/components/ReviewPanel'

interface AMLFlowChartProps {
  transactionId: string
  nodes: any[]
  edges: any[]
  variables: Record<string, any>
}

export default function AMLFlowChart({ transactionId, nodes, edges, variables }: AMLFlowChartProps) {
  const nodeTypes = useMemo(() => ({ systemNode: SystemNode, aiNode: AINode, reviewNode: ReviewNode, transactionPassedNode: TransactionPassedNode }), [])
  const edgeTypes = useMemo(
    () => ({
      custom: CustomBezierEdge,
      floating: FloatingEdge,
      targetright: TargetRightEdge,
      sourceright: SourceRightEdge,
    }),
    []
  )

  const defaultViewport = { x: 100, y: 200, zoom: 1 }

  return (
    <main className="relative w-screen h-screen bg-zinc-100">
      <ReactFlow
        colorMode="light"
        maxZoom={4}
        nodes={nodes}
        edges={edges} // Replace with AML_EDGES if desired
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

      <div className="absolute top-4 right-4 z-[9999]">
        <ReviewPanel transactionId={transactionId} variables={variables} />
      </div>
    </main>
  )
}
