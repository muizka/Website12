export default async function handler(req, res) {
  // Aktifkan CORS agar frontend bisa memanggil API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "Link video tidak ada!" });
  }

  try {
    // Endpoint v10 terbaru
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",
        filenameStyle: "basic",
        downloadMode: "video",
        youtubeVideoCodec: "h264" // Agar kompatibel di semua HP
      }),
    });

    const data = await response.json();

    // Cobalt v10 mengembalikan objek dengan property 'status' dan 'url'
    if (data.status === 'stream' || data.status === 'redirect' || data.url) {
      return res.status(200).json({
        success: true,
        download_url: data.url
      });
    } else if (data.status === 'picker') {
      // Jika link berisi banyak media (Carousel IG), ambil yang pertama
      return res.status(200).json({
        success: true,
        download_url: data.picker[0].url
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.text || "Video tidak bisa diproses oleh server."
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Gagal menyambung ke mesin pengunduh." });
  }
}
