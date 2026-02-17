const input = document.getElementById('urlInput');
const btn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const errorCard = document.getElementById('error-msg');
const errorText = document.getElementById('error-text');

btn.addEventListener('click', fetchMedia);

async function fetchMedia() {
    const url = input.value.trim();
    if (!url) return;

    btn.disabled = true;
    loading.style.display = 'block';
    resultDiv.innerHTML = '';
    errorCard.style.display = 'none';

    try {
        // Menggunakan API publik TikTok downloader (misal: TikTok API demo)
        const response = await fetch(`https://api.tiktokv2download.com/?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!data.success || !data.video) throw new Error('Video tidak ditemukan atau link invalid.');

        renderResult([{ type: 'video', url: data.video }]);

    } catch (err) {
        errorText.textContent = err.message;
        errorCard.style.display = 'block';
    } finally {
        btn.disabled = false;
        loading.style.display = 'none';
    }
}

function renderResult(medias) {
    medias.forEach((media, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const ext = media.extension || 'mp4';
        const filename = `SevenDL_${Date.now()}_${index}.${ext}`;
        let mediaPreview = '';

        if (media.type === 'video') {
            mediaPreview = `<video controls src="${media.url}"></video>`;
        } else if (media.type === 'image') {
            mediaPreview = `<img src="${media.url}">`;
        } else if (media.type === 'audio') {
            mediaPreview = `<audio controls src="${media.url}"></audio>`;
        }

        card.innerHTML = `
            <div class="result-header">
                <span>${media.type.toUpperCase()}</span>
                <span>SUCCESS</span>
            </div>
            <div class="result-body">
                ${mediaPreview}
                <div style="margin-top:10px; font-size:0.8rem; border-top:1px dashed #ccc; padding-top:5px;">
                    > FILENAME: ${filename} <br>
                    > SIZE: UNKNOWN
                </div>
                <button class="cyber-button" onclick="forceDownload('${media.url}', '${filename}', this)">
                    DOWNLOAD NOW
                </button>
            </div>
        `;
        resultDiv.appendChild(card);
    });
}

async function forceDownload(url, filename, btnElement) {
    const originalText = btnElement.innerText;
    btnElement.innerText = "DOWNLOADING...";
    btnElement.disabled = true;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error");

        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

    } catch (err) {
        console.error(err);
        window.open(url, '_blank');
    } finally {
        btnElement.innerText = originalText;
        btnElement.disabled = false;
    }
}
