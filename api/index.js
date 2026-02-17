export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL tidak boleh kosong"
            });
        }

        // Panggil API tikwm
        const response = await fetch(
            "https://api.tikwm.com/v1/video?url=" + encodeURIComponent(url)
        );

        const data = await response.json();

        if (!data || !data.data || !data.data.play) {
            return res.status(400).json({
                success: false,
                message: "Video tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            data: [
                {
                    url: data.data.play,
                    thumbnail: data.data.cover
                }
            ]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
