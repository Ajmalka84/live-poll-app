export const API_BASE = "http://localhost:5001";

export async function fetchPolls() {
  const res = await fetch(`${API_BASE}/api/polls`);
  if (!res.ok) throw new Error("Failed to fetch polls");
  return res.json();
}

export async function fetchPoll(id) {
  const res = await fetch(`${API_BASE}/api/polls/${id}`);
  if (!res.ok) throw new Error("Failed to fetch poll");
  return res.json();
}

export async function vote(pollId, optionId) {
  const res = await fetch(
    `${API_BASE}/api/polls/${pollId}/options/${optionId}/vote`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Vote failed");
  }
  return res.json();
}

export async function unvote(pollId, optionId) {
  const res = await fetch(
    `${API_BASE}/api/polls/${pollId}/options/${optionId}/unvote`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Unvote failed");
  }
  return res.json();
}

// export async function createPoll(question, options) {
//   const res = await fetch(`${API_BASE}/api/polls`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ question, options }),
//   });
//   if (!res.ok) {
//     const body = await res.json().catch(() => ({}));
//     throw new Error(body.error || "Create poll failed");
//   }
//   return res.json();
// }

export async function createPoll(question, options) {
  const res = await fetch(`${API_BASE}/api/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, options }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Create poll failed");
  }
  return res.json();
}
