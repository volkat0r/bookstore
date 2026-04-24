// #region Config
const PRICE_BATCH_SIZE = 10;
const PRICE_BATCH_DELAY_MS = 11000; // 10 req / 11s ≈ 55/min — safely under Discogs rate limit of 60/min
// #endregion

// #region Public Entry Point
async function loadMarketplacePrices(){
    const btn = document.getElementById("loadPricesBtn");
    const itemsWithId = collection
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item._releaseId);

    if (itemsWithId.length === 0) {
        if (btn) btn.textContent = "No releases found";
        return;
    }

    setPricesBtnState(btn, "loading", `Loading… 0 / ${itemsWithId.length}`);

    let loaded = 0;
    const total = itemsWithId.length;

    for (let batchStart = 0; batchStart < itemsWithId.length; batchStart += PRICE_BATCH_SIZE) {
        const batch = itemsWithId.slice(batchStart, batchStart + PRICE_BATCH_SIZE);

        await Promise.all(batch.map(async ({ item, index }) => {
            try {
                const stats = await fetchMarketplaceStats(item._releaseId);
                const median = stats?.median;
                const lowest = stats?.lowest_price?.value;

                if (typeof median === "number" && median > 0) {
                    collection[index].price = Math.round(median * 100) / 100;
                } else if (typeof lowest === "number" && lowest > 0) {
                    collection[index].price = Math.round(lowest * 100) / 100;
                }

                updatePriceInDom(index);
            } catch (_) {
                // silently skip failed individual requests
            } finally {
                loaded++;
                setPricesBtnState(btn, "loading", `Loading… ${loaded} / ${total}`);
            }
        }));

        const isLastBatch = batchStart + PRICE_BATCH_SIZE >= itemsWithId.length;
        if (!isLastBatch) {
            await delay(PRICE_BATCH_DELAY_MS);
        }
    }

    setLocalStorage();
    setPricesBtnState(btn, "done", `✓ ${total} prices loaded`);
}
// #endregion

// #region Discogs Marketplace Fetch
async function fetchMarketplaceStats(releaseId){
    const params = new URLSearchParams();

    if (DISCOGS_CONFIG.token.trim() !== "") {
        params.set("token", DISCOGS_CONFIG.token.trim());
    }

    const endpoint = `https://api.discogs.com/marketplace/stats/${releaseId}?${params.toString()}`;
    const response = await fetch(endpoint, { method: "GET" });

    if (!response.ok) return null;
    return response.json();
}
// #endregion

// #region DOM Helpers
function updatePriceInDom(indexItem){
    const priceEl = document.querySelector(`.colItem-${indexItem} .price`);
    if (!priceEl) return;

    const p = collection[indexItem].price;
    priceEl.textContent = p > 0 ? `~${p.toFixed(2)} €` : `– €`;
    priceEl.classList.add("price--updated");
}

function setPricesBtnState(btn, state, label){
    if (!btn) return;
    btn.textContent = label;
    btn.disabled = (state === "loading" || state === "done");
    btn.dataset.state = state;
}
// #endregion

// #region Utilities
function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
// #endregion
