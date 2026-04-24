let showFavOnly = false;

function renderCollectionItems(indices){
    const collectionRef = document.getElementById("collection");
    collectionRef.innerHTML = "";

    const list = Array.isArray(indices) ? indices : collection.map((_, i) => i);

    for(const itemIndex of list){
        collectionRef.innerHTML += getCollectionItemTemplate(itemIndex);
        likeChecker(itemIndex);
        favoriteChecker(itemIndex);
        genreItems(itemIndex);
        renderComments(itemIndex);
    }
}

function setCollectionStatus(type, message){
    const statusRef = document.getElementById("collection-status");
    if (!statusRef) {
        return;
    }

    statusRef.className = `collectionStatus ${type}`;
    statusRef.textContent = message;
    statusRef.hidden = false;
}

function applyFiltersAndRender(){
    const query = document.getElementById("search").value.toLowerCase().trim();
    const sort = document.getElementById("sort").value;

    let indices = collection.map((_, i) => i);

    if(query){
        indices = indices.filter(i =>
            collection[i].album.toLowerCase().includes(query) ||
            collection[i].band.toLowerCase().includes(query)
        );
    }

    if(showFavOnly){
        indices = indices.filter(i => collection[i].favorite);
    }

    if(sort === "year-asc")   indices.sort((a, b) => (collection[a].released || 0) - (collection[b].released || 0));
    if(sort === "year-desc")  indices.sort((a, b) => (collection[b].released || 0) - (collection[a].released || 0));
    if(sort === "price-asc")  indices.sort((a, b) => collection[a].price - collection[b].price);
    if(sort === "price-desc") indices.sort((a, b) => collection[b].price - collection[a].price);

    renderCollectionItems(indices);

    const countRef = document.getElementById("result-count");
    if(countRef) countRef.textContent = `${indices.length} of ${collection.length} records`;
}

function toggleFavFilter(){
    showFavOnly = !showFavOnly;
    const btn = document.getElementById("favFilter");
    btn.classList.toggle("active", showFavOnly);
    applyFiltersAndRender();
}

function likeCounter(indexItem){
    const colItem = collection[indexItem];
    const likeRef = document.querySelector(`.colItem-${indexItem} span.like`);
    if(colItem.liked){
        colItem.likes--;
        colItem.liked = false;
    } else {
        colItem.likes++;
        colItem.liked = true;
    }
    likeRef.innerText = colItem.likes;
    likeChecker(indexItem);
}

function likeChecker(indexItem){
    const likeRef = document.querySelector(`.colItem-${indexItem} .likeArea`);
    let likeBool = collection[indexItem].liked;
    if(likeBool === true){
        likeRef.classList.add("liked");
    } else {
        likeRef.classList.remove("liked");
    }
    setLocalStorage();
}

function favoriteChecker(indexItem){
    const favBtn = document.querySelector(`.colItem-${indexItem} .favBtn`);
    if(collection[indexItem].favorite){
        favBtn.classList.add("active");
    } else {
        favBtn.classList.remove("active");
    }
}

function renderComments(indexItem){
    const commentRef = document.querySelector(`.colItem-${indexItem} table.commentArea`);
    const commentsArr = collection[indexItem].comments;

    commentRef.innerHTML = "";

    for(let commentIndex = 0; commentIndex < commentsArr.length; commentIndex++){
        commentRef.innerHTML += getCollectionCommentTemplate(indexItem, commentIndex);
    }
}

function sendComment(indexItem){
    const commentInputRef = document.querySelector(`.colItem-${indexItem} input.comment`);
    const inputValue = commentInputRef.value;
    const commentsArr = collection[indexItem].comments;
    if (inputValue === "") return;

    commentsArr.push({name: "Admin", comment: inputValue});
    commentInputRef.value = "";
    setLocalStorage();
    renderComments(indexItem);
}

function genreItems(indexItem){
    const genreList = document.querySelector(`.colItem-${indexItem} div.genre`);
    const genreArr = collection[indexItem].genre;
    let genreSpans = "";

    for(let genreIndex = 0; genreIndex < genreArr.length; genreIndex++){
        genreSpans += `<span>${genreArr[genreIndex]}</span>`;
    }
    genreList.innerHTML = genreSpans;
}

function favoriteItem(indexFavItem){
    const favBtn = document.querySelector(`.colItem-${indexFavItem} .favBtn`);
    favBtn.classList.toggle("active");
    collection[indexFavItem].favorite = favBtn.classList.contains("active");
    setLocalStorage();
}
