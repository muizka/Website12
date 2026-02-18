export default async function handler(req, res) {
  // CORS Headers agar bisa diakses browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "URL tidak boleh kosong!" });

  try {
    const response = await fetch("https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
        "x-rapidapi-key": "c0b993f899msh6e607c9913ae6afp132ca3jsnff2daf0bcdeb"
      },
      body: JSON.stringify({ url: url })
    });

    const data = await response.json();

    // LOGIKA PENCARIAN LINK (Struktur API Social Download All-In-One)
    let finalDownloadUrl = null;

    if (data && data.medias && data.medias.length > 0) {
      // 1. Cari yang kualitasnya paling bagus (paling atas biasanya terbaik)
      // 2. Utamakan yang ada videonya (bukan hanya audio)
      const bestMedia = data.medias.find(m => m.extension === 'mp4') || data.medias[0];
      finalDownloadUrl = bestMedia.url;
    }

    if (finalDownloadUrl) {
      return res.status(200).json({
        success: true,
        download_url: finalDownloadUrl,
        title: data.title || "Video Berhasil Diambil"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "API tidak menemukan link video di dalam postingan ini."
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi gangguan koneksi ke RapidAPI." 
    });
  }
}
