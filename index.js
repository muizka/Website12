const btn = document.getElementById("downloadBtn");

btn.addEventListener("click", async () => {

    const url = document.getElementById("urlInput").value.trim();
    const resultDiv = document.getElementById("result");
    const loading = document.getElementById("loading");
    const errorCard = document.getElementById("error-msg");
    const errorText = document.getElementById("error-text");

    if (!url) return alert("Masukkan URL dulu!");

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

        resultDiv.innerHTML = json.html;

        // penting agar embed aktif
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

    } catch (err) {
        errorText.textContent = err.message;
        errorCard.classList.remove("hidden");
    } finally {
        btn.disabled = false;
        loading.classList.add("hidden");
    }

});
