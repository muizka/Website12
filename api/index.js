export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ success: false, error: "URL kosong" });
        }

        // Gunakan oEmbed resmi TikTok
        const oembed = await fetch(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
        );

        if (!oembed.ok) {
            return res.status(500).json({ success: false, error: "Gagal ambil data TikTok" });
        }

        const data = await oembed.json();

        return res.status(200).json({
            success: true,
            data: [
                {
                    type: "video",
                    url: url
                }
            ]
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server crash: " + err.message
        });
    }
}
