export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = req.body;
    const id = `session:${Date.now()}`;
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    // Save session data
    await fetch(`${url}/set/${encodeURIComponent(id)}/${encodeURIComponent(JSON.stringify(session))}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    // Add ID to list
    await fetch(`${url}/lpush/sessions/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.status(200).json({ ok: true, id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
