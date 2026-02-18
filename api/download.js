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
    let finalUrl = null;

    // STRATEGI PENCARIAN LINK (DEEP SEARCH)
    // 1. Cek di dalam array 'medias' (Standar API ini)
    if (data.medias && Array.isArray(data.medias) && data.medias.length > 0) {
      // Cari yang ada videonya, jika tidak ada ambil yang pertama
      const videoOnly = data.medias.find(m => m.extension === 'mp4' || m.type === 'video');
      finalUrl = videoOnly ? videoOnly.url : data.medias[0].url;
    } 
    // 2. Cek jika link ada di root (beberapa API menaruhnya di sini)
    else if (data.url) {
      finalUrl = data.url;
    }
    // 3. Cek jika link ada di dalam objek 'result'
    else if (data.result && data.result.url) {
      finalUrl = data.result.url;
    }

    if (finalUrl) {
      // Pastikan URL menggunakan HTTPS
      if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;

      return res.status(200).json({
        success: true,
        download_url: finalUrl
      });
    } else {
      // Jika benar-benar kosong, kita kirimkan pesan dari API-nya langsung
      return res.status(400).json({
        success: false,
        message: data.message || "Video tidak ditemukan atau link tidak didukung."
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server API sedang bermasalah." });
  }
}
