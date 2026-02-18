export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
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

    // Logika pengecekan yang lebih kuat (Mencari link di berbagai tempat)
    let downloadUrl = null;

    if (data.medias && data.medias.length > 0) {
      // Cari media yang tipenya video dan memiliki URL
      const videoMedia = data.medias.find(m => m.extension === 'mp4' || m.type === 'video');
      downloadUrl = videoMedia ? videoMedia.url : data.medias[0].url;
    } else if (data.url) {
      downloadUrl = data.url;
    } else if (data.links && data.links.length > 0) {
      downloadUrl = data.links[0].link || data.links[0].url;
    }

    if (downloadUrl) {
      return res.status(200).json({
        success: true,
        download_url: downloadUrl
      });
    } else {
      // Jika masih gagal, kita kirim pesan error yang lebih detail
      return res.status(400).json({
        success: false,
        message: "API merespon tapi tidak menemukan link video. Coba link video lain."
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Koneksi ke RapidAPI bermasalah." });
  }
}
