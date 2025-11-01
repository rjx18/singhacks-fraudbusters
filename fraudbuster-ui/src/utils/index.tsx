import { Position, MarkerType } from '@xyflow/react';
import yaml from 'js-yaml'
import React, { Children, isValidElement, ReactNode, ReactElement, JSXElementConstructor } from 'react';
import AzureLogo from '../components/AzureLogo';
import AWSLogo from '../components/AWSLogo';

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: any, targetNode: any) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
    intersectionNode.measured;
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.measured.width / 2;
  const y1 = targetPosition.y + targetNode.measured.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: any, intersectionPoint: any) {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.measured.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.measured.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: any, target: any) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export function safeAccess(object: any, path: any[], defaultValue: any = null) {
  return object
    ? path.reduce(
        (accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : defaultValue),
        object
      )
    : defaultValue
}

export function extractOtherNodeName(edgeId: string, selectedId: string, viaJarvis: boolean = false) {
  const ids = edgeId.split('-'); // Split the string by '-'
  
  // Check which part of the split string matches the givenId
  if (ids[0] === selectedId) {
    return {
      id: ids[1],
      type: 'outbound'
    }; // If the first part matches, return the second
  } else if (ids[1] === selectedId) {
    return {
      id: viaJarvis ? `jarvis/${ids[0]}` : ids[0],
      type: 'inbound'
    }; // If the second part matches, return the first
  } else {
    return null; // If givenId is not found, return null
  }
}

export function extractNodeNames(edgeId: string, viaJarvis: boolean = false) {
  const ids = edgeId.split('-'); // Split the string by '-'
  
  const source = viaJarvis ? `jarvis/${ids[0]}` : ids[0]

  const target = ids[1]

  return [source, target]
}

export function getSortedEdgeInfoName(edgeInfoKey: string) {
  const [source, target] = extractNodeNames(edgeInfoKey)

  const stringArray = [source, target];

  stringArray.sort((a, b) => a.localeCompare(b));

  return stringArray.join('-');
}

export function adjustValue(current: number, max: number, change: number) {
  // Add the change to the current value
  let newValue = current + change;

  // Use the modulus operator to ensure the result is within the range 0 to max
  newValue = ((newValue % max) + max) % max;

  return newValue;
}

function extractTextFromChildren(children: ReactNode): string[] {
  let textArray: string[] = [];

  // Recursively process each child
  Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      // If it's a string, add it directly
      textArray.push(child.trim());
    } else if (isValidElement(child) && child.props && child.props.children) {
      // If it has children, recursively extract the text
      textArray.push(...extractTextFromChildren(child.props.children));
    }
  });

  return textArray.filter((text) => text.length > 0); // Filter out empty strings
}

// Main function to convert the ReactNode to YAML format
export function generateYamlFromReactNode(reactNode: ReactNode): string {
  const extractedText = extractTextFromChildren(reactNode);

  // Prepare the YAML structure
  type YamlStructure = { [key: string]: string[] }[];
  const yamlStructure: YamlStructure = [];
  let currentHeader: string | null = null;

  extractedText.forEach((text) => {
    if (!currentHeader) {
      currentHeader = text;
      yamlStructure.push({ [currentHeader]: [] });
    } else {
      const lastEntry = yamlStructure[yamlStructure.length - 1];
      lastEntry[currentHeader].push(text);
      currentHeader = null;
    }
  });

  // Convert the structure to YAML
  const yamlOutput = yaml.dump(yamlStructure);
  return yamlOutput;
}

export function fastSmoothScroll(target: any, duration = 200) {
  const start = window.scrollY;
  const end = target.offsetTop;
  const distance = end - start;
  const startTime = performance.now();

  function scroll() {
    const currentTime = performance.now();
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1); // Ensure it doesn't exceed 1
    window.scrollTo(0, start + distance * progress);

    if (timeElapsed < duration) {
      requestAnimationFrame(scroll);
    }
  }

  scroll();
}

interface ElementProps {
  className?: string;
  children?: ElementData | ElementData[] | string | null | undefined;
  [key: string]: any;
}

interface ElementData {
  type?: keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
  component?: string; // Add a `component` field to represent custom components
  key?: React.Key | null;
  ref?: React.Ref<any> | null;
  props: ElementProps;
}

const componentMap: { [key: string]: JSXElementConstructor<any> } = {
  AzureLogo,
  AWSLogo
  // Add other components here as needed
};

function renderJSX(elementData: ElementData | string | null): ReactElement | string | null {
  if (!elementData) return null;
  if (typeof elementData === 'string') return elementData;

  const { type, component, props, key } = elementData;

  // Determine the type for React.createElement
  const elementType = component ? componentMap[component] : type;
  if (!elementType) {
    console.error('Invalid element type or component:', type || component);
    return null;
  }

  const { children, ...otherProps } = props || {};

  return React.createElement(
    elementType,
    { key, ...otherProps },
    Array.isArray(children)
      ? children.map((child) => renderJSX(child))
      : children !== undefined ? renderJSX(children) : null
  );
}

function isValidReactElement(element: any): element is React.ReactElement {
  return React.isValidElement(element);
}

// Type guard to check for displayName
function hasDisplayName(type: any): type is { displayName: string } {
  return typeof type === 'function' && 'displayName' in type;
}

// Main parseJSX function
function parseJSX(element: React.ReactNode): any {
  // Base case: If the element is a string or number, return it directly
  if (typeof element === 'string' || typeof element === 'number') {
    return element;
  }

  // If element is not a valid React element, return null (or handle as needed)
  if (!isValidReactElement(element)) {
    return null;
  }

  const { type, key, props } = element;
  const ref = 'ref' in element ? element.ref : null;

  // Identify if the element type is a custom component or standard HTML element
  const isCustomComponent = typeof type === 'function' || typeof type === 'object';
  
  // Use displayName if available, or fallback to the function name, or "UnknownComponent"
  const elementType = isCustomComponent
    ? (hasDisplayName(type) ? type.displayName : type.name) || "UnknownComponent"
    : type;

  // Parse the props, handling `children` separately
  const parsedProps: any = {};
  Object.entries(props).forEach(([propName, propValue]) => {
    if (propName === 'children') {
      // Recursively parse children
      parsedProps[propName] = Array.isArray(propValue)
        ? propValue.map((child) => parseJSX(child)) // If children is an array, parse each child
        : parseJSX(propValue as React.ReactNode); // Otherwise, parse the single child
    } else {
      // For other props, add them directly (you can add custom serialization logic here if needed)
      parsedProps[propName] = propValue;
    }
  }); 

  // Return JSON-compatible structure
  return {
    type: elementType,
    key: key || null,
    ref: ref || null,
    props: parsedProps,
  };
}

export function convertJSXToNodes(nodes: any[]): any[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      children: parseJSX(node.data.children) // Convert children to JSON-compatible structure
    },
  }));
}

// Function to traverse nodes array and convert each node's `data.children` to JSX
export function convertNodesToJSX(nodes: any[]): any[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      children: renderJSX(node.data.children), // Convert `children` to JSX using renderJSX
    },
  }));
}