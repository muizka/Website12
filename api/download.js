export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "URL kosong!" });

  // Daftar server Cobalt (Jika satu diblokir Vercel, bisa ganti ke yang lain)
  // Kamu bisa mencoba mengganti domain di bawah jika masih 'Oops'
  const COBALT_API = "https://api.cobalt.tools/api/json"; 

  try {
    const response = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",
        downloadMode: "video",
        youtubeVideoCodec: "h264",
        noWatermark: true
      })
    });

    // Jika server Cobalt merespon tapi error (seperti v7 shut down)
    if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
            success: false, 
            message: "Server pengunduh sedang sibuk/update. Coba lagi 1 menit lagi." 
        });
    }

    const data = await response.json();

    if (data.url || data.status === 'stream') {
      return res.status(200).json({ success: true, download_url: data.url });
    } else if (data.status === 'picker') {
      return res.status(200).json({ success: true, download_url: data.picker[0].url });
    } else {
      return res.status(400).json({ success: false, message: data.text || "Video tidak ditemukan." });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: "Koneksi terputus. Coba gunakan link lain." });
  }
}
