export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: "URL tidak boleh kosong"
            });
        }

        // 🔥 GANTI API DI BAWAH DENGAN API DOWNLOADER YANG KAMU PAKAI
        const response = await fetch("https://api.tiklydown.eu.org/api/download?url=" + encodeURIComponent(url));
        const data = await response.json();

        if (!data || !data.video) {
            return res.status(400).json({
                success: false,
                error: "Video tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            data: [
                {
                    type: "video",
                    url: data.video.noWatermark,
                    quality: "HD",
                    extension: "mp4"
                }
            ]
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}
