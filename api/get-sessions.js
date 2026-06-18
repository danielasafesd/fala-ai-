export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Get all session IDs
    const listRes = await fetch(`${process.env.KV_REST_API_URL}/lrange/sessions/0/99`, {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
      }
    });
    const listData = await listRes.json();
    const ids = listData.result || [];

    // Get each session
    const sessions = await Promise.all(
      ids.map(async (id) => {
        const r = await fetch(`${process.env.KV_REST_API_URL}/get/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
          }
        });
        const d = await r.json();
        try {
          return { id, ...JSON.parse(d.result) };
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
