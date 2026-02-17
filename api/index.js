// api/index.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// POST /api
router.post("/", async (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ success: false, error: "URL kosong" });

    try {
        // Contoh API publik gratis TikTok (tikwm.com)
        const apiUrl = `https://api.tikwm.com/v1/video?url=${encodeURIComponent(url)}`;

        const apiRes = await fetch(apiUrl);
        const json = await apiRes.json();

        if (json.success && json.data && json.data.play) {
            // kirim hasil ke frontend
            res.json({
                success: true,
                data: [
                    {
                        url: json.data.play, // link video tanpa watermark
                        type: "video",
                        extension: "mp4",
                        quality: "HD",
                        thumbnail: json.data.cover
                    }
                ]
            });
        } else {
            res.json({ success: false, error: "Video tidak ditemukan / API gagal" });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: "Terjadi kesalahan server" });
    }
});

export default router;
