export default async function handler(req, res) {
  // Mengizinkan akses dari domain manapun (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL video tidak ditemukan!" });
  }

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
        filenameStyle: "basic"
      })
    });

    const data = await response.json();

    // Jika berhasil (Cobalt mengembalikan status stream, redirect, atau picker)
    if (data.url) {
      return res.status(200).json({ success: true, download_url: data.url });
    } else if (data.picker) {
      // Jika berisi banyak file (misal IG Carousel) ambil yang pertama
      return res.status(200).json({ success: true, download_url: data.picker[0].url });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: data.text || "Video tidak ditemukan. Pastikan link publik!" 
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Down. Coba lagi nanti." });
  }
}
