export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    // Get all session IDs
    const listRes = await fetch(`${url}/lrange/sessions/0/99`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listRes.json();
    const ids = listData.result || [];

    // Get each session
    const sessions = await Promise.all(
      ids.map(async (id) => {
        const r = await fetch(`${url}/get/${encodeURIComponent(id)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const d = await r.json();
        try {
          const parsed = JSON.parse(d.result);
          return { id, ...parsed };
        } catch {
          return null;
        }
      })
    );

    return res.status(200).json(sessions.filter(Boolean));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
