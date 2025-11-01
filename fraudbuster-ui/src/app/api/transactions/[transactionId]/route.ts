import { NextResponse } from "next/server"

const CAMUNDA_CLIENT_ID = process.env.CAMUNDA_CLIENT_ID!
const CAMUNDA_CLIENT_SECRET = process.env.CAMUNDA_CLIENT_SECRET!
const CAMUNDA_OAUTH_URL =
  process.env.CAMUNDA_OAUTH_URL || "https://login.cloud.camunda.io/oauth/token"
const CAMUNDA_CLUSTER_ID = process.env.CAMUNDA_CLUSTER_ID!
const CAMUNDA_REGION = process.env.CAMUNDA_REGION || "sin-2"
const CAMUNDA_OPERATE_URL = `https://${CAMUNDA_REGION}.operate.camunda.io/${CAMUNDA_CLUSTER_ID}`

// --- Helper: fetch OAuth token ---
async function getAccessToken() {
  const res = await fetch(CAMUNDA_OAUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      audience: "operate.camunda.io",
      client_id: CAMUNDA_CLIENT_ID,
      client_secret: CAMUNDA_CLIENT_SECRET,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("[Camunda] OAuth error:", err)
    throw new Error("Failed to fetch Camunda OAuth token")
  }

  const data = await res.json()
  return data.access_token as string
}

// --- Fetch process instance details ---
async function getProcessInstance(token: string, processInstanceKey: string) {
  const url = `${CAMUNDA_OPERATE_URL}/v2/process-instances/${processInstanceKey}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error(`[Camunda] Failed to fetch process instance ${processInstanceKey}:`, errText)
    throw new Error(`Failed to fetch process instance (${res.status})`)
  }

  const data = await res.json()
  return data
}

// --- Fetch variables for the instance ---
async function getVariables(token: string, processInstanceKey: string) {
  const url = `${CAMUNDA_OPERATE_URL}/v2/variables/search`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: { processInstanceKey },
      page: { from: 0, limit: 200 },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error(`[Camunda] Failed to fetch variables for ${processInstanceKey}:`, errText)
    throw new Error(`Variable fetch failed (${res.status})`)
  }

  const data = await res.json()
  return data?.items ?? []
}

// --- Main GET handler ---

export async function GET(_: Request, { params }: { params: Promise<{ transactionId: string }> }) {
  const { transactionId } = await params
  console.log(`[API] /api/transactions/${transactionId} called`)

  try {
    const token = await getAccessToken()

    // Fetch process details and variables in parallel
    const [processInstance, variables] = await Promise.all([
      getProcessInstance(token, transactionId),
      getVariables(token, transactionId),
    ])

    // Convert variables list to key/value map
    const variableMap = Object.fromEntries(
      variables.map((v: any) => [v.name, v.isTruncated ? "(truncated)" : v.value])
    )

    // Try to parse “data” field if it contains a JSON object
    let parsedData: Record<string, any> | null = null
    if (variableMap.data) {
      try {
        parsedData = typeof variableMap.data === "string"
          ? JSON.parse(variableMap.data)
          : variableMap.data
      } catch {
        console.warn(`[Camunda] Could not parse data variable for ${transactionId}`)
      }
    }

    return NextResponse.json({
      success: true,
      processInstanceKey: transactionId,
      processInstance,
      variables: variableMap,
      data: parsedData,
    })
  } catch (error: any) {
    console.error("[API] Error fetching transaction details:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
