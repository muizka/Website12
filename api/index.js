export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ success: false, error: "URL kosong" });
        }

        const response = await fetch(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
            return res.status(500).json({ success: false, error: "Gagal ambil data TikTok" });
        }

        const data = await response.json();

        return res.status(200).json({
            success: true,
            html: data.html
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server error: " + err.message
        });
    }
}
