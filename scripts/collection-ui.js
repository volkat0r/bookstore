function renderCollectionItems(){
    const collectionRef = document.getElementById("collection");
    collectionRef.innerHTML = "";

    for(let indexItem = 0; indexItem < collection.length; indexItem++){
        collectionRef.innerHTML += getCollectionItemTemplate(indexItem);
        likeChecker(indexItem);
        genreItems(indexItem);
        renderComments(indexItem);
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
}
