// #region Initial Load
function init(){
    getLocalStorage();
    renderCollectionItems();
}
// #endregion

// #region Render-Collection (JSON)
function renderCollectionItems(){
    const collectionRef = document.getElementById("collection");

    for(let indexItem = 0; indexItem < collection.length; indexItem++){
        collectionRef.innerHTML += getCollectionItemTemplate(indexItem);
        likeChecker(indexItem);
        genreItems(indexItem);
        renderComments(indexItem);
    }
}

// #endregion

// #region Like-Functionality
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
    setLocalStorage(indexItem);
}
// #endregion

// #region Comment-Functionality
function renderComments(indexItem){
    const commentRef = document.querySelector(`.colItem-${indexItem} table.commentArea`);
    const commentsArr = collection[indexItem].comments;

    commentRef.innerHTML = "";

    for(commentIndex = 0; commentIndex < commentsArr.length; commentIndex++){
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
    setLocalStorage(indexItem);
    renderComments(indexItem);
}
// #endregion

// #region Genre-Functionality
function genreItems(indexItem){
    const genreList = document.querySelector(`.colItem-${indexItem} div.genre`);
    const genreArr = collection[indexItem].genre;
    let genreSpans = '';

    for(genreIndex = 0; genreIndex < genreArr.length; genreIndex++){
        genreSpans += `<span>${genreArr[genreIndex]}</span>`;
    }
    genreList.innerHTML = genreSpans;
}
// #endregion

// #region Favorite-Functionality
function favoriteItem(indexFavItem){
    const favBtn =  document.querySelector(`.colItem-${indexFavItem} .favBtn`);
    favBtn.classList.toggle("active");
}
// #endregion

// #region LocalStorage-Functionality
function setLocalStorage(){
    localStorage.setItem("collection", JSON.stringify(collection));
}

function getLocalStorage(){
    const collectionData = localStorage.getItem("collection");
    if (collectionData){
        collection = JSON.parse(collectionData);
    }
}
// #endregion
