export default async function handler(req, res) {
  // Set Header agar bisa diakses dari mana saja (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "URL wajib diisi" });

  try {
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720",
        filenameStyle: "basic",
        downloadMode: "video" 
      })
    });

    const data = await response.json();

    // Cobalt mengembalikan data.url jika berhasil
    if (data.url) {
      return res.status(200).json({ success: true, download_url: data.url });
    } 
    
    // Jika berupa 'picker' (biasanya di IG/TikTok slide)
    if (data.picker) {
      return res.status(200).json({ success: true, download_url: data.picker[0].url });
    }

    return res.status(400).json({ 
      success: false, 
      message: data.text || "Video tidak ditemukan atau tidak didukung." 
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server API sedang down, coba lagi nanti." });
  }
}
