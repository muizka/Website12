export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL diperlukan" });
  }

  try {
    // Kita gunakan layanan pihak ketiga yang stabil untuk parsing video
    // Contoh: Menggunakan API dari ddownr atau sejenisnya (untuk edukasi)
    const apiUrl = `https://api.vyt.monster/v1/info?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.links) {
      // Mengambil link download pertama yang tersedia
      const downloadLink = data.links[0].url;

      return res.status(200).json({
        success: true,
        title: data.title || "Video Download",
        download_url: downloadLink
      });
    } else {
      throw new Error("Video tidak ditemukan atau private");
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: "Gagal memproses video. Pastikan link valid." 
    });
  }
}
