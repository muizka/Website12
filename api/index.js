export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ success: false });
        }

        const response = await fetch(
            "https://www.tikwm.com/api/?url=" + encodeURIComponent(url)
        );

        const result = await response.json();

        if (!result.data || !result.data.play) {
            return res.status(400).json({ success: false });
        }

        return res.status(200).json({
            success: true,
            data: [
                {
                    url: result.data.play
                }
            ]
        });

    } catch (error) {
        return res.status(500).json({ success: false });
    }
}
