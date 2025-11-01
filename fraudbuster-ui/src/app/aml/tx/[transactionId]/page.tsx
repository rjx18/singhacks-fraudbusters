import { Suspense } from "react"
import AMLFlowChart from "./AMLFlowChart"
import { AML_NODES } from "@/constants/nodes"

// Helper to fetch transaction details
async function fetchTransaction(transactionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/transactions/${transactionId}`, {
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Failed to fetch transaction ${transactionId}: ${res.status}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "Transaction fetch failed")

  return data
}

function injectVariablesIntoNodes(nodes: any[], variables: Record<string, any>) {
  const clonedNodes = structuredClone(nodes)

  // --- 1️⃣ Parse all variable JSON strings safely ---
  const parsedVars: Record<string, any> = {}
  for (const [key, val] of Object.entries(variables)) {
    if (typeof val === "string") {
      try {
        parsedVars[key] = JSON.parse(val)
      } catch {
        parsedVars[key] = val
      }
    } else {
      parsedVars[key] = val
    }
  }

  // --- 2️⃣ Flatten all test results (including non_deterministic_tests) ---
  const testResults: Record<string, boolean> = {}

  for (const [section, data] of Object.entries(parsedVars)) {
    if (data && typeof data === "object") {
      // Deterministic tests
      if (data.tests && typeof data.tests === "object") {
        for (const [testId, result] of Object.entries(data.tests)) {
          testResults[testId] = Boolean(result)
        }
      }

      // Non-deterministic test section
      if (section === "non_deterministic_tests" && typeof data === "object") {
        for (const [testId, testObj] of Object.entries(data)) {
          if (
            testObj &&
            typeof testObj === "object" &&
            typeof (testObj as any).status === "string"
          ) {
            testResults[testId] = (testObj as any).status === "pass"
          }
        }
      }
    }
  }

  // --- 3️⃣ Compute section-level results based on node definitions ---
  const sectionResults: Record<string, string> = {}

  for (const node of clonedNodes) {
    const nodeId = node.id
    if (!node.data?.items) continue

    const testIds = node.data.items.map((item: any) => item.id)
    const hasFailure = testIds.some((id: string) => testResults[id] === false)

    // If any test fails, fail the section
    if (testIds.length > 0) {
      sectionResults[nodeId] = hasFailure ? "fail" : "pass"
    }
  }

  // --- 4️⃣ Inject results back into nodes ---
  for (const node of clonedNodes) {
    const nodeId = node.id

    // Assign section result
    if (sectionResults[nodeId]) {
      node.data.overall_status = sectionResults[nodeId]
    }

    // Assign test-level result
    if (node.data.items && Array.isArray(node.data.items)) {
      node.data.items = node.data.items.map((item: any) => ({
        ...item,
        result: testResults[item.id] ?? null,
      }))
    }
  }

  return clonedNodes
}


// Main page component
export default async function TransactionPage(props: {
  params: Promise<{
    transactionId: string;
  }>;
}) {
  const params = await props.params;
  const { transactionId } = params;

  console.log(transactionId)
  
  if (!transactionId) {
    console.error("Missing transactionId in params")
    return <div className="p-6 text-red-600">Invalid transaction ID</div>
  }

  console.log("Fetching transaction for ID:", transactionId)
  const transaction = await fetchTransaction(transactionId)

  const variables = transaction.variables || {}
  const injectedNodes = injectVariablesIntoNodes(AML_NODES, variables)

  return <AMLFlowChart nodes={injectedNodes} variables={variables} />
}