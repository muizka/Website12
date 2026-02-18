export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL tidak boleh kosong!" });
  }

  try {
    const response = await fetch("https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
        "x-rapidapi-key": "c0b993f899msh6e607c9913ae6afp132ca3jsnff2daf0bcdeb" // Key kamu sudah terpasang
      },
      body: JSON.stringify({ url: url })
    });

    const data = await response.json();

    // Struktur API ini biasanya mengembalikan array 'medias'
    if (data && data.medias && data.medias.length > 0) {
      // Kita ambil link dengan kualitas tertinggi (biasanya indeks pertama)
      return res.status(200).json({
        success: true,
        download_url: data.medias[0].url,
        title: data.title || "Video Berhasil Diambil"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Video tidak ditemukan atau link tidak didukung."
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan pada server API." 
    });
  }
}
