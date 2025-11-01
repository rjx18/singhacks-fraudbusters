import { NextResponse } from "next/server";

/**
 * Fetches process instances (and their variables)
 * from Camunda 8 Operate REST API v2.
 *
 * Docs:
 *  - /v2/process-instances/search
 *  - /v2/variables/search
 */

const CAMUNDA_CLIENT_ID = process.env.CAMUNDA_CLIENT_ID!;
const CAMUNDA_CLIENT_SECRET = process.env.CAMUNDA_CLIENT_SECRET!;
const CAMUNDA_OAUTH_URL =
  process.env.CAMUNDA_OAUTH_URL || "https://login.cloud.camunda.io/oauth/token";
const CAMUNDA_CLUSTER_ID = process.env.CAMUNDA_CLUSTER_ID!;
const CAMUNDA_REGION = process.env.CAMUNDA_REGION || "sin-2";

const CAMUNDA_OPERATE_URL = `https://${CAMUNDA_REGION}.operate.camunda.io/${CAMUNDA_CLUSTER_ID}`;

// --- 1️⃣ Fetch OAuth token ---
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

// --- 2️⃣ Fetch process instances with pagination ---
async function getProcessInstances(token: string, after?: string, before?: string) {
  const url = `${CAMUNDA_OPERATE_URL}/v2/process-instances/search`;

  const page: Record<string, any> = { limit: 10 }; // adjust as needed
  if (after) page.after = after;
  if (before) page.before = before;

  const body = {
    page,
    sort: [{ field: "startDate", order: "DESC" }],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Camunda] Failed to fetch process instances:", errText);
    throw new Error(`Process instance fetch failed (${res.status})`);
  }

  const data = await res.json();
  console.log(`[Camunda] Found ${data?.items?.length ?? 0} process instances`);
  return data;
}

// --- 3️⃣ Fetch variables for a process instance ---
async function getVariablesForInstance(token: string, processInstanceKey: string | number) {
  const url = `${CAMUNDA_OPERATE_URL}/v2/variables/search`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: { processInstanceKey: processInstanceKey.toString() },
      page: { from: 0, limit: 100 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[Camunda] Failed to fetch variables for ${processInstanceKey}:`, errText);
    return [];
  }

  const data = await res.json();
  return data?.items ?? [];
}

// --- 4️⃣ Main API route ---
export async function GET(request: Request) {
  console.log("[API] /api/transactions called");

  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after") || undefined;
  const before = searchParams.get("before") || undefined;

  try {
    const token = await getAccessToken();
    const data = await getProcessInstances(token, after, before);

    const instances = data?.items ?? [];

    // Attach variables to each instance
    const transactions = await Promise.all(
      instances.map(async (p: any) => {
        const vars = await getVariablesForInstance(token, p.processInstanceKey);
        return {
          processDefinitionId: p.processDefinitionId,
          processDefinitionName: p.processDefinitionName,
          processDefinitionVersion: p.processDefinitionVersion,
          startDate: p.startDate,
          endDate: p.endDate,
          state: p.state,
          hasIncident: p.hasIncident,
          tenantId: p.tenantId,
          processInstanceKey: p.processInstanceKey,
          processDefinitionKey: p.processDefinitionKey,
          variables: vars.map((v: any) => ({
            name: v.name,
            value: v.value,
            isTruncated: v.isTruncated,
          })),
        };
      })
    );

    const pagination = {
      totalItems: data?.page?.totalItems ?? transactions.length,
      hasMoreTotalItems: data?.page?.hasMoreTotalItems ?? false,
      startCursor: data?.page?.startCursor ?? null,
      endCursor: data?.page?.endCursor ?? null,
    };

    console.log(
      `[API] Returning ${transactions.length} transactions (page: ${
        pagination.startCursor ? "cursor" : "initial"
      })`
    );

    return NextResponse.json({
      success: true,
      page: pagination,
      items: transactions,
    });
  } catch (error: any) {
    console.error("[API] Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
