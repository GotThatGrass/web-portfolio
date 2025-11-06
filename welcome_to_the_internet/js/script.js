document.addEventListener("DOMContentLoaded", () => {
    const secret = document.getElementById("secret");

    // Reveal immediately if already unlocked
    if (sessionStorage.getItem("secretRevealed") === "true") {
        secret.style.display = "block";
    }

    const clicked = {
        daniel: sessionStorage.getItem("clicked_daniel") === "true",
        jingrong: sessionStorage.getItem("clicked_jingrong") === "true",
        shoshana: sessionStorage.getItem("clicked_shoshana") === "true"
    };

    function checkReveal() {
        const allClicked = Object.values(clicked).every(v => v === true);

        if (allClicked && sessionStorage.getItem("secretRevealed") !== "true") {
            secret.style.display = "block";
            sessionStorage.setItem("secretRevealed", "true");
            alert("🎉 You found the secret website! 🎉");
        } else if (allClicked) {
            secret.style.display = "block";
        }
    }

    function setupClick(name, selector) {
        const el = document.querySelector(selector);
        if (!el) return;

        el.addEventListener("click", (e) => {
            e.preventDefault();
            clicked[name] = true;
            sessionStorage.setItem(`clicked_${name}`, "true");
            checkReveal();

            const href = el.closest("a")?.href;
            if (href) {
                setTimeout(() => {
                    window.location.href = href;
                }, 100);
            }
        });
    }

    setupClick("daniel", ".daniel img");
    setupClick("jingrong", ".jingrong img");
    setupClick("shoshana", ".shoshana img");
});
