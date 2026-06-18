export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = req.body;
    const id = `session:${Date.now()}`;

    const response = await fetch(`${process.env.KV_REST_API_URL}/set/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value: JSON.stringify(session) })
    });

    // Also add to index list
    await fetch(`${process.env.KV_REST_API_URL}/lpush/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value: id })
    });

    return res.status(200).json({ ok: true, id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
