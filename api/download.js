export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "URL kosong!" });

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

    // Mencari link video di dalam struktur medias
    let finalUrl = null;

    if (data && data.medias && data.medias.length > 0) {
      // Prioritas 1: Cari yang tipenya video dan kualitas tinggi
      const video = data.medias.find(m => m.type === 'video' || m.extension === 'mp4');
      if (video) {
        finalUrl = video.url;
      } else {
        // Prioritas 2: Ambil apa saja yang tersedia di index pertama
        finalUrl = data.medias[0].url;
      }
    }

    if (finalUrl) {
      return res.status(200).json({
        success: true,
        download_url: finalUrl
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "API tidak menemukan video. Pastikan link bukan video private."
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Kesalahan server API." });
  }
}
