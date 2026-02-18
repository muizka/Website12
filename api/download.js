export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL kosong!" });
  }

  try {
    // Menggunakan API Cobalt (Sangat stabil untuk YT, TikTok, IG)
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",
        filenameStyle: "basic"
      }),
    });

    const data = await response.json();

    // Jika berhasil (status 'stream', 'redirect', atau 'picker' untuk multi-video)
    if (data.url || data.picker) {
      return res.status(200).json({
        success: true,
        download_url: data.url || (data.picker && data.picker[0].url),
        title: "Video Berhasil Ditemukan"
      });
    } else {
      // Jika Cobalt memberikan pesan error spesifik
      return res.status(400).json({ 
        success: false, 
        message: data.text || "Format video tidak didukung atau video private." 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi gangguan koneksi ke server downloader." 
    });
  }
}
