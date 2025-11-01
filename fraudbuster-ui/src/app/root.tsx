'use client'

import { ReactFlow, Controls, Background, NodeProps, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SystemNode from './components/SystemNode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomBezierEdge from './components/CustomEdge';
import FloatingEdge, { SourceRightEdge, TargetRightEdge } from './components/FloatingEdge';
// import { useNodesAndEdges } from '@/app/contexts/Nodes'
import ControlPanel from './components/ControlPanel';

export default function RootPage() {
  const nodeTypes = useMemo(() => ({ systemNode: SystemNode }), []);

  const edgeTypes = useMemo(() => ({ custom: CustomBezierEdge, floating: FloatingEdge, targetright: TargetRightEdge, sourceright: SourceRightEdge }), []);

  const defaultViewport = { x: 500, y: 50, zoom: 0.75 };

  const [nodes, edges, { handleUpdateNodes, handleUpdateEdges }] = useNodesAndEdges()

  // useEffect(() => {
  //   setNodes([...initialNodes, ...nodes])
  // }, [initialNodes])

  // useEffect(() => {
  //   setEdges([...initialEdges, ...edges])
  // }, [initialEdges])

  const onNodesChange = 
    (changes: any) => {
      handleUpdateNodes(changes)
    }

  const onEdgesChange = useCallback(
    (changes: any) => {
      handleUpdateEdges(changes)
    },
    [],
  );

  return (
    <>  
      <div>
        <main className="w-screen h-screen">
          <div style={{ height: '100%' }}>
            <ReactFlow 
              colorMode="dark" 
              maxZoom={4} 
              nodes={nodes} 
              // onNodesChange={onNodesChange}
              edges={edges}
              // onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes} 
              edgeTypes={edgeTypes} 
              defaultViewport={defaultViewport}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </main>
      </div>
      <div className='absolute top-4 left-4'>
        <ControlPanel />
      </div>
    </>
  );
}
