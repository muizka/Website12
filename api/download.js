export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL tidak ditemukan" });
  }

  try {
    // Kita menggunakan Cobalt API yang mendukung YT, TikTok, IG, FB
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",
      }),
    });

    const data = await response.json();

    if (data.status === "stream" || data.status === "picker" || data.status === "redirect") {
      return res.status(200).json({
        success: true,
        download_url: data.url,
        title: "Video Siap Diunduh"
      });
    } else {
      return res.status(400).json({ success: false, message: "Gagal mengambil video. Coba link lain." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
}
