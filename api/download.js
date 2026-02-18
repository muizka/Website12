export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "URL kosong!" });

  try {
    // Kita gunakan API TikWM untuk TikTok (sangat stabil) 
    // atau API pengunduh universal lainnya
    let apiUrl = "";
    
    if (url.includes("tiktok.com")) {
      apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    } else {
      // Untuk platform lain, kita gunakan instance Cobalt yang jarang dipakai (Mirror)
      apiUrl = `https://cobalt.api.perv.cat/api/json`; 
    }

    if (url.includes("tiktok.com")) {
      const resp = await fetch(apiUrl);
      const result = await resp.json();
      if (result.data) {
        return res.status(200).json({ 
          success: true, 
          download_url: "https://www.tikwm.com" + result.data.play 
        });
      }
    } else {
      // Request ke Mirror Cobalt yang lebih sepi
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url, videoQuality: "720" })
      });
      const result = await resp.json();
      if (result.url) {
        return res.status(200).json({ success: true, download_url: result.url });
      }
    }

    throw new Error("Gagal mengambil data");
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Server cadangan juga sedang sibuk. Coba link video lain atau tunggu sebentar." 
    });
  }
}
