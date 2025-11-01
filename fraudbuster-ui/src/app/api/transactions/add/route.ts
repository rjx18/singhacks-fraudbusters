import { NextResponse } from "next/server";

/**
 * Starts new process instances in Camunda 8 using the provided CSV data.
 * Endpoint: /api/transactions/add
 *
 * Expected payload:
 * {
 *   "data": [
 *     { "transaction_id": "T123", "amount": 1000, "currency": "USD" },
 *     { "transaction_id": "T124", "amount": 2000, "currency": "SGD" }
 *   ]
 * }
 *
 * Docs:
 *  - /v2/process-instances (POST)
 */

const CAMUNDA_CLIENT_ID = process.env.CAMUNDA_CLIENT_ID!;
const CAMUNDA_CLIENT_SECRET = process.env.CAMUNDA_CLIENT_SECRET!;
const CAMUNDA_OAUTH_URL =
  process.env.CAMUNDA_OAUTH_URL || "https://login.cloud.camunda.io/oauth/token";
const CAMUNDA_CLUSTER_ID = process.env.CAMUNDA_CLUSTER_ID!;
const CAMUNDA_REGION = process.env.CAMUNDA_REGION || "sin-2";
const CAMUNDA_OPERATE_URL = `https://${CAMUNDA_REGION}.operate.camunda.io/${CAMUNDA_CLUSTER_ID}`;

// === 1️⃣ Get OAuth Token ===
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
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Camunda] OAuth error:", errText);
    throw new Error("Failed to fetch Camunda OAuth token");
  }

  const data = await res.json();
  return data.access_token as string;
}

// === 2️⃣ Start Process Instance ===
async function startProcessInstance(token: string, variables: Record<string, any>) {
  const url = `${CAMUNDA_OPERATE_URL}/v2/process-instances`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      processDefinitionId: "Process_17jntkm",
      variables: {
        "data": variables
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Camunda] Failed to start process instance:", errText);
    throw new Error(`Failed to start process instance (${res.status})`);
  }

  const data = await res.json();
  console.log(`[Camunda] Started process instance ${data?.processInstanceKey}`);
  return data;
}

// === 3️⃣ POST /api/transactions/add ===
export async function POST(request: Request) {
  console.log("[API] /api/transactions/add called");

  try {
    const body = await request.json();
    const csvData = body.data;

    if (!Array.isArray(csvData)) {
      return NextResponse.json(
        { success: false, error: "Invalid data format — expected an array of objects." },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    // Process each row sequentially (or parallel if preferred)
    const results = [];
    for (const row of csvData) {
      try {
        const instance = await startProcessInstance(token, row);
        results.push({
          success: true,
          processInstanceKey: instance?.processInstanceKey,
          variables: row,
        });
      } catch (err: any) {
        console.error("[Camunda] Error starting process:", err.message);
        results.push({
          success: false,
          error: err.message,
          variables: row,
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("[API] Error in /api/transactions/add:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
