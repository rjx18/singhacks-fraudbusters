import { EdgeLabelRenderer, getBezierPath, Position, useInternalNode } from '@xyflow/react';
import colors from 'tailwindcss/colors'
import { classNames, getEdgeParams } from '@/app/utils';

function FloatingEdge({ id, source, target, markerEnd, style, data }: any) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const getColor = () => {
    if (data !== undefined) {
      if (data.color === 'inbound') return colors.cyan[600];
      if (data.color  === 'outbound') return colors.red[600];
    }
    return colors.neutral[500];
  }

  const markerId = `arrow-${id}`;

  return (
    <g className="react-flow__edge">
      {/* Define the marker inside an <svg> */}
      <svg>
        <defs>
          <marker
            id={markerId}
            markerWidth="3"
            markerHeight="3"
            refX="3"
            refY="1.5"
            orient="auto"
          >
            <polygon points="0 0, 3 1.5, 0 3" fill={getColor()} />
          </marker>
        </defs>
      </svg>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerId})`}
        style={{...style, 
          stroke: getColor(), 
          opacity: data && data.transparent ? "20%" : "80%",
        }}
      />
      { data && data.label && <EdgeLabelRenderer>
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
      </EdgeLabelRenderer>}
    </g>
  );
}


export function TargetRightEdge({ id, source, target, markerEnd, style, data }: any) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: Position.Right,
    targetX: targetNode.internals.positionAbsolute.x + (targetNode.measured.width || 0),
    targetY: targetNode.internals.positionAbsolute.y + (targetNode.measured.height || 0) / 3,
  });

  const getColor = () => {
    if (data !== undefined) {
      if (data.color === 'inbound') return colors.cyan[600];
      if (data.color  === 'outbound') return colors.red[600];
    }
    return colors.neutral[500];
  }

  const markerId = `arrow-${id}`;

  return (
    <g className="react-flow__edge">
      {/* Define the marker inside an <svg> */}
      <svg>
        <defs>
          <marker
            id={markerId}
            markerWidth="3"
            markerHeight="3"
            refX="3"
            refY="1.5"
            orient="auto"
          >
            <polygon points="0 0, 3 1.5, 0 3" fill={getColor()} />
          </marker>
        </defs>
      </svg>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerId})`}
        style={{...style, 
          stroke: getColor(), 
          opacity: data && data.transparent ? "20%" : "80%",
        }}
      />
      { data && data.label && <EdgeLabelRenderer>
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
      </EdgeLabelRenderer>}
    </g>
  );
}

export function SourceRightEdge({ id, source, target, markerEnd, style, data }: any) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sourceNode.internals.positionAbsolute.x + (sourceNode.measured.width || 0),
    sourceY: sourceNode.internals.positionAbsolute.y + 2 * (sourceNode.measured.height || 0) / 3,
    sourcePosition: Position.Right,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const getColor = () => {
    if (data !== undefined) {
      if (data.color === 'inbound') return colors.cyan[600];
      if (data.color  === 'outbound') return colors.red[600];
    }
    return colors.neutral[500];
  }

  const markerId = `arrow-${id}`;

  return (
    <g className="react-flow__edge">
      {/* Define the marker inside an <svg> */}
      <svg>
        <defs>
          <marker
            id={markerId}
            markerWidth="3"
            markerHeight="3"
            refX="3"
            refY="1.5"
            orient="auto"
          >
            <polygon points="0 0, 3 1.5, 0 3" fill={getColor()} />
          </marker>
        </defs>
      </svg>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerId})`}
        style={{...style, 
          stroke: getColor(), 
          opacity: data && data.transparent ? "20%" : "80%",
        }}
      />
      { data && data.label && <EdgeLabelRenderer>
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
      </EdgeLabelRenderer>}
    </g>
  );
}

export default FloatingEdge;
