// api/download.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL tidak boleh kosong!" });
  }

  try {
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720", // Kualitas standar agar proses cepat
      }),
    });

    const data = await response.json();

    if (data.url) {
      return res.status(200).json({
        success: true,
        download_url: data.url
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.text || "Video tidak ditemukan atau platform tidak didukung."
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server API sedang bermasalah." });
  }
}
