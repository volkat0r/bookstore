function setLocalStorage(){
    localStorage.setItem("collection", JSON.stringify(collection));
}

function getLocalStorage(){
    const collectionData = localStorage.getItem("collection");
    if (collectionData){
        try {
            return JSON.parse(collectionData);
        } catch (error) {
            console.warn("Stored collection data is invalid and will be ignored.", error);
        }
    }
    return null;
}
