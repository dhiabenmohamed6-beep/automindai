const API_URL = (process.env.NEXT_PUBLIC_API_URL || '/_/backend/api').replace(/\/$/, '');

export async function fetchAPI(endpoint: string) {
  const res = await fetch(`${API_URL}/${endpoint}/`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function postAPI(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to post');
  return res.json();
}

export async function putAPI(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to put');
  return res.json();
}

export async function patchAPI(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to patch');
  return res.json();
}

export async function deleteAPI(endpoint: string) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function adminFetch(endpoint: string, token: string) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function adminPost(endpoint: string, token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to post');
  return res.json();
}

export async function adminPut(endpoint: string, token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to put');
  return res.json();
}

export async function adminPatch(endpoint: string, token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to patch');
  return res.json();
}

export async function adminDelete(endpoint: string, token: string) {
  const res = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function adminLogin(username: string, password: string) {
  return postAPI('admin/login', { username, password });
}

export async function calculateEstimate(data: {
  category: string;
  scope: string;
  timeline: string;
}) {
  return postAPI('estimate', data);
}

export async function submitContact(data: {
  full_name: string;
  email: string;
  service: string;
  message: string;
}) {
  return postAPI('contact', data);
}

export async function sendChatMessage(message: string, history: { role: string; content: string }[]) {
  return postAPI('chat', { message, history });
}

export async function generateDemo(toolId: string, values: Record<string, string>) {
  return postAPI('demo', { toolId, values });
}

export async function generateAISolution(data: {
  business_name: string;
  industry: string;
  challenge: string;
}) {
  return postAPI('ai-lab', data);
}
