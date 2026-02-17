export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ success: false, error: "URL kosong" });
        }

        const apiURL = `https://api.tiktokv2download.com/?url=${encodeURIComponent(url)}`;

        const response = await fetch(apiURL);

        if (!response.ok) {
            return res.status(500).json({ success: false, error: "API pihak ketiga gagal" });
        }

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({ success: false, error: "Response bukan JSON (API rusak)" });
        }

        if (!data || !data.data) {
            return res.status(500).json({ success: false, error: "Format API berubah atau kosong" });
        }

        return res.status(200).json({
            success: true,
            data: data.data
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server crash: " + err.message
        });
    }
}
