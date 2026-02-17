import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, error: "URL tidak ditemukan" });
    }

    try {
        // Gunakan API pihak ketiga yang stabil
        const apiURL = `https://api.tiktokv2download.com/?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        if (!data || !data.data) {
            return res.status(500).json({ success: false, error: "Gagal ambil data" });
        }

        // Kirim ke frontend
        return res.status(200).json({ success: true, data: data.data });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}
