const DISCOGS_CONFIG = {
    enabled: true,
    username: "",
    token: "",
    folderId: 0,
    page: 1,
    perPage: 100
};

async function hydrateCollection(){
    const localCollection = getLocalStorage();

    if (!isDiscogsConfigured()) {
        if (Array.isArray(localCollection) && localCollection.length > 0) {
            collection = localCollection;
        }
        return;
    }

    try {
        const discogsReleases = await fetchDiscogsCollection();
        collection = mapDiscogsCollectionToUiModel(discogsReleases, localCollection);
        setLocalStorage();
    } catch (error) {
        console.warn("Discogs data could not be loaded. Falling back to local/static collection.", error);
        if (Array.isArray(localCollection) && localCollection.length > 0) {
            collection = localCollection;
        }
    }
}

function isDiscogsConfigured(){
    return DISCOGS_CONFIG.enabled && DISCOGS_CONFIG.username.trim() !== "";
}

async function fetchDiscogsCollection(){
    const username = encodeURIComponent(DISCOGS_CONFIG.username.trim());
    const params = new URLSearchParams({
        page: String(DISCOGS_CONFIG.page),
        per_page: String(DISCOGS_CONFIG.perPage)
    });

    if (DISCOGS_CONFIG.token.trim() !== "") {
        params.set("token", DISCOGS_CONFIG.token.trim());
    }

    const endpoint = `https://api.discogs.com/users/${username}/collection/folders/${DISCOGS_CONFIG.folderId}/releases?${params.toString()}`;
    const response = await fetch(endpoint, { method: "GET" });

    if (!response.ok) {
        throw new Error(`Discogs request failed with status ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload.releases) ? payload.releases : [];
}

function mapDiscogsCollectionToUiModel(releases, localCollection){
    const localStateById = createLocalStateMap(localCollection);

    return releases.map((item) => {
        const info = item.basic_information || {};
        const id = buildDiscogsItemId(item);
        const localState = localStateById.get(id) || {};
        const genres = normalizeGenres(info.styles, info.genres);

        return {
            _id: id,
            album: info.title || "Unknown Album",
            band: joinArtistNames(info.artists),
            favorite: Boolean(localState.favorite),
            likes: Number.isFinite(localState.likes) ? localState.likes : 0,
            liked: Boolean(localState.liked),
            price: Number.isFinite(item.lowest_price) ? item.lowest_price : 0,
            released: info.year || "-",
            genre: genres,
            pictureSrc: info.cover_image || "./assets/icons/favIcon.svg",
            comments: Array.isArray(localState.comments) ? localState.comments : []
        };
    });
}

function createLocalStateMap(localCollection){
    const stateMap = new Map();
    if (!Array.isArray(localCollection)) {
        return stateMap;
    }

    for (const item of localCollection) {
        const key = item._id || `${item.album || ""}|${item.band || ""}`;
        stateMap.set(key, {
            favorite: Boolean(item.favorite),
            likes: Number(item.likes),
            liked: Boolean(item.liked),
            comments: Array.isArray(item.comments) ? item.comments : []
        });
    }
    return stateMap;
}

function buildDiscogsItemId(item){
    const releaseId = item.id || "unknown";
    const instanceId = item.instance_id || 0;
    return `discogs-${releaseId}-${instanceId}`;
}

function joinArtistNames(artists){
    if (!Array.isArray(artists) || artists.length === 0) {
        return "Unknown Artist";
    }

    return artists
        .map((artist) => artist.name)
        .filter(Boolean)
        .join(", ");
}

function normalizeGenres(styles, genres){
    const styleList = Array.isArray(styles) ? styles : [];
    const genreList = Array.isArray(genres) ? genres : [];
    const merged = [...styleList, ...genreList].filter(Boolean);
    const uniqueGenres = [...new Set(merged)];
    return uniqueGenres.length > 0 ? uniqueGenres : ["Unknown Genre"];
}
