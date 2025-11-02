import { NextResponse } from "next/server";

/**
 * Completes a user task (review) for a given process instance in Camunda 8 Operate.
 *
 * Flow:
 *  1️⃣ Get OAuth token
 *  2️⃣ Search for user tasks by processInstanceKey
 *  3️⃣ Complete the first user task with provided review data
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

// --- 2️⃣ Find the user task for the process instance ---
async function findUserTask(token: string, processInstanceKey: string) {
  const url = `${CAMUNDA_OPERATE_URL}/v2/user-tasks/search`;

  const body = {
    sort: [{ field: "creationDate", order: "ASC" }],
    filter: { processInstanceKey },
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
    console.error("[Camunda] Failed to search user tasks:", errText);
    throw new Error(`User task search failed (${res.status})`);
  }

  const data = await res.json();
  return data?.items?.[0];
}

// --- 3️⃣ Complete the user task ---
async function completeUserTask(token: string, userTaskKey: string, review: any) {
  const url = `${CAMUNDA_OPERATE_URL}/v2/user-tasks/${userTaskKey}/completion`;

  const body = {
    variables: {
      review,
    },
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
    console.error("[Camunda] Failed to complete user task:", errText);
    throw new Error(`User task completion failed (${res.status})`);
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

// --- 4️⃣ Main API route ---
export async function POST(req: Request, { params }: { params: Promise<{ transactionId: string }> }) {
  const { transactionId } = await params
  console.log(`[API] /api/transaction/${transactionId}/review called`);

  try {
    const reviewBody = await req.json();
    const { approve_tx, mark_suspicious, reason } = reviewBody;

    if (
      typeof approve_tx !== "boolean" ||
      typeof mark_suspicious !== "boolean" ||
      typeof reason !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid review body format" },
        { status: 400 }
      );
    }

    const processInstanceKey = transactionId;
    const token = await getAccessToken();

    console.log(`[Camunda] Fetching user task for processInstanceKey=${processInstanceKey}`);
    const userTask = await findUserTask(token, processInstanceKey);

    if (!userTask?.userTaskKey) {
      return NextResponse.json(
        { success: false, error: "No user task found for this process instance." },
        { status: 404 }
      );
    }

    console.log(`[Camunda] Completing user task ${userTask.userTaskKey} with review data`);

    console.log("[Camunda] userTaskKey:", userTask?.userTaskKey);
    console.log("[Camunda] processInstanceKey:", processInstanceKey);
    const completeResult = await completeUserTask(token, userTask.userTaskKey, reviewBody);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      userTaskKey: userTask.userTaskKey,
      camundaResponse: completeResult,
    });
  } catch (error: any) {
    console.error("[API] Error submitting review:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
