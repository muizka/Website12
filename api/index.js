export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: "URL kosong" });
    }

    // Pakai endpoint yang lebih stabil
    const api = await fetch(
      "https://www.tikwm.com/api/?url=" + encodeURIComponent(url)
    );

    const data = await api.json();

    if (!data || !data.data || !data.data.play) {
      return res.status(400).json({
        success: false,
        message: "Video tidak ditemukan"
      });
    }

    return res.status(200).json({
      success: true,
      data: [
        {
          url: data.data.play,
          thumbnail: data.data.cover
        }
      ]
    });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}
