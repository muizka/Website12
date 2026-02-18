export default async function handler(req, res) {
  // CORS Headers agar frontend bisa akses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL kosong!" });
  }

  try {
    // Memanggil API Cobalt terbaru (v10)
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",     // Opsi: "360", "720", "1080", "max"
        filenameStyle: "basic",   // Opsi: "classic", "basic", "nerdy"
        downloadMode: "video",    // Memastikan ambil video+audio
        youtubeVideoCodec: "h264" // Biar bisa diputar di semua HP
      })
    });

    const data = await response.json();

    // Cobalt v10 mengembalikan status 'stream', 'redirect', atau 'picker'
    if (data.url || data.status === 'stream' || data.status === 'redirect') {
      return res.status(200).json({
        success: true,
        download_url: data.url
      });
    } else if (data.status === 'picker') {
      // Jika link berisi banyak media (seperti IG Carousel)
      return res.status(200).json({
        success: true,
        download_url: data.picker[0].url 
      });
    } else {
      // Menangkap pesan error spesifik dari API
      return res.status(400).json({
        success: false,
        message: data.text || "API menolak link ini. Pastikan link publik."
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Gagal menyambung ke mesin pengunduh v10." 
    });
  }
}
