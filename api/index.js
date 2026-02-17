<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Seven Downloader</title>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("https://images.unsplash.com/photo-1501785888041-af3ef285b470") no-repeat center center/cover;
}

.container {
    background: rgba(0, 0, 0, 0.65);
    padding: 40px;
    width: 90%;
    max-width: 500px;
    border-radius: 15px;
    text-align: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

h1 {
    color: white;
    margin-bottom: 20px;
    font-size: 28px;
}

p {
    color: #ddd;
    font-size: 14px;
    margin-bottom: 25px;
}

input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: none;
    outline: none;
    margin-bottom: 15px;
    font-size: 14px;
}

button {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(45deg, #ff512f, #dd2476);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

button:hover {
    transform: scale(1.05);
    opacity: 0.9;
}

.video-preview {
    margin-top: 20px;
    display: none;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
}

.footer {
    margin-top: 20px;
    font-size: 12px;
    color: #bbb;
}
</style>
</head>
<body>

<div class="container">
    <h1>Seven Video Downloader</h1>
    <p>Download video tanpa watermark dengan mudah</p>

    <input type="text" id="url" placeholder="Tempel link TikTok di sini">
    <button onclick="download()">Download Sekarang</button>

    <video class="video-preview" id="preview" controls></video>

    <div class="footer">
        © 2026 Seven Downloader
    </div>
</div>

<script>
async function download() {
    const url = document.getElementById("url").value;
    const preview = document.getElementById("preview");
    const btn = document.querySelector("button");

    if (!url) {
        alert("Masukkan link dulu!");
        return;
    }

    btn.innerText = "Memproses...";
    btn.disabled = true;

    try {
        const res = await fetch("/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await res.json();

        if (data.success && data.data[0].url) {
            // Tampilkan preview video
            preview.src = data.data[0].url;
            preview.style.display = "block";

            // Otomatis bisa klik download di browser
            // window.open(data.data[0].url, "_blank"); // optional
        } else {
            alert("Gagal download, coba lagi.");
        }
    } catch (err) {
        alert("Terjadi kesalahan.");
    }

    btn.innerText = "Download Sekarang";
    btn.disabled = false;
}
</script>

</body>
</html>
