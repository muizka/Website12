// api/download.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL tidak boleh kosong" });
  }

  try {
    // Di sini kamu bisa mengintegrasikan API pihak ketiga seperti RapidAPI 
    // atau library downloader khusus.
    // Contoh response sukses:
    res.status(200).json({
      success: true,
      title: "Video Ditemukan",
      download_url: url // Ini harusnya link file .mp4 asli
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses video" });
  }
}
