const btn = document.getElementById("downloadBtn");
btn.addEventListener("click", fetchMedia);

async function fetchMedia() {
    const input = document.getElementById("urlInput");
    const url = input.value.trim();
    const loading = document.getElementById("loading");
    const resultDiv = document.getElementById("result");
    const errorCard = document.getElementById("error-msg");
    const errorText = document.getElementById("error-text");

    if (!url) return alert("Masukkan URL dulu!");

    // Reset UI
    btn.disabled = true;
    loading.classList.remove("hidden");
    resultDiv.innerHTML = "";
    errorCard.classList.add("hidden");

    try {
        const res = await fetch("/api/index", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });
        const json = await res.json();

        if (!json.success) throw new Error(json.error);

        json.data.forEach((media, index) => {
            const card = document.createElement("div");
            card.className = "media-card";

            let mediaEl = "";
            const filename = `Sann404_DL_${Date.now()}_${index}.${media.extension || "mp4"}`;

            if (media.type === "video") {
                mediaEl = `<video controls src="${media.url}" style="width:100%; border-radius:10px"></video>`;
            } else if (media.type === "image") {
                mediaEl = `<img src="${media.url}" style="width:100%; border-radius:10px">`;
            }

            card.innerHTML = `
                <div>${mediaEl}</div>
                <button onclick="forceDownload('${media.url}', '${filename}', this)">DOWNLOAD</button>
            `;

            resultDiv.appendChild(card);
        });

    } catch (err) {
        errorText.textContent = err.message;
        errorCard.classList.remove("hidden");
    } finally {
        btn.disabled = false;
        loading.classList.add("hidden");
    }
}

async function forceDownload(url, filename, btnElement) {
    const originalText = btnElement.innerText;
    btnElement.innerText = "DOWNLOADING...";
    btnElement.disabled = true;

    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    } catch {
        window.open(url, "_blank");
    } finally {
        btnElement.innerText = originalText;
        btnElement.disabled = false;
    }
}
