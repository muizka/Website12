export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "URL kosong!" });

  try {
    // Trik: Mengikuti redirect jika link berupa link pendek (vt.tiktok atau short link IG)
    const expandedResponse = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const finalRealUrl = expandedResponse.url || url;

    const response = await fetch("https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
        "x-rapidapi-key": "c0b993f899msh6e607c9913ae6afp132ca3jsnff2daf0bcdeb"
      },
      body: JSON.stringify({ url: finalRealUrl })
    });

    const data = await response.json();

    // Debugging: Kita cari link di semua kemungkinan properti API
    let downloadUrl = null;

    if (data.medias && data.medias.length > 0) {
      // Cari kualitas terbaik atau mp4
      const quality = data.medias.find(m => m.quality === 'hd' || m.extension === 'mp4') || data.medias[0];
      downloadUrl = quality.url;
    } else if (data.url) {
      downloadUrl = data.url;
    }

    if (downloadUrl) {
      return res.status(200).json({ success: true, download_url: downloadUrl });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Video ditemukan tapi link unduh tidak tersedia. Pastikan video tidak di-private." 
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Terjadi gangguan pada server API RapidAPI." });
  }
}
