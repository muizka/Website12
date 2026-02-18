export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL tidak boleh kosong!" });
  }

  try {
    // Kita gunakan Cobalt API yang paling stabil saat ini
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Meniru browser asli agar tidak diblokir
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://cobalt.tools",
        "Referer": "https://cobalt.tools/"
      },
      body: JSON.stringify({
        url: url,
        videoQuality: "720", // Standar agar tidak lemot
        audioFormat: "mp3",
        removeWtm: true     // Mencoba menghapus watermark jika tersedia
      }),
    });

    const data = await response.json();

    // Cobalt mengembalikan status "stream" atau "redirect" jika berhasil
    if (data.url) {
      return res.status(200).json({
        success: true,
        download_url: data.url
      });
    } else if (data.status === "error") {
      return res.status(400).json({ 
        success: false, 
        message: "API Error: " + (data.text || "Video tidak didukung.") 
      });
    } else {
      throw new Error("Respon API tidak dikenal");
    }

  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server sedang sibuk atau link tidak valid. Coba lagi nanti." 
    });
  }
}
