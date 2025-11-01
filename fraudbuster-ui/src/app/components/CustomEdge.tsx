import ReactFlow, { getBezierPath, EdgeProps  } from '@xyflow/react';

const CustomBezierEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {

  const control1XRatio = sourceX > targetX ? 6 : 5
  const control2XRatio = sourceX > targetX ? 5 : 6

  // Calculate two control points to smooth the curve and make it more rounded
  const controlPoint1X = (control1XRatio * (sourceX + targetX)) / 11; // 1/3rd distance from source
  const controlPoint1Y = sourceY + 50; // Offset upward to create curvature

  const controlPoint2X = (control2XRatio * (sourceX + targetX)) / 11; // 2/3rd distance from source
  const controlPoint2Y = targetY + 50; // Offset upward for a symmetrical curve

  // Create a cubic Bezier path with two control points for a more rounded curve
  const edgePath = `M${sourceX},${sourceY} C${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${targetX},${targetY}`;

  return (
    <g className="react-flow__edge">
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} />
      {data && data.label as any && (
        <text>
          <textPath href={`#${id}`} style={{ fontSize: 12 }} startOffset="50%" textAnchor="middle">
            {data.label as any}
          </textPath>
        </text>
      )}
    </g>
  );
};

export default CustomBezierEdge