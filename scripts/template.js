function getCollectionItemTemplate(itemIndex){
    return `
    <article class="collectionItem colItem-${itemIndex}">
        <div class="coverInfo">
            <img src="${collection[itemIndex].pictureSrc}" alt="Cover ${collection[itemIndex].album}">
            <div class="favorite"><button class="favBtn" onclick="favoriteItem(${itemIndex})"><img src="./assets/icons/star_inactive.svg" class="inactive" alt="not Favorite Icon"><img src="./assets/icons/star_active.svg" class="active" alt="Favorite Icon"></button></div>
            <div class="albumName">${collection[itemIndex].album}</div>
        </div>
        <div class="itemInfo">
            <div class="priceLike">
                <div class="price">~${collection[itemIndex].price} €</div>
                <div class="likeArea"><span class="like">${collection[itemIndex].likes}</span> <button class="likeBtn" onclick="likeCounter(${itemIndex})"><img src="./assets/icons/thumb_inactive.svg" alt="give some love"></button></div>
            </div>
            <div class="bandInfo">
                <h2>${collection[itemIndex].band}</h2>
                <p>${collection[itemIndex].released}</p>
                <div class="genre"></div>
            </div>
            <div class="comments">
                <h3>Comments:</h3>
                <table class="commentArea">
                </table>
                <div class="commentInput">
                <input type="text" class="comment" placeholder="Write a comment...">
                <button class="send" onclick="sendComment(${itemIndex})"><img src="./assets/icons/send_inactive.svg" alt="send comment"></button>
            </div>
        </div>
    </article>`
}

function getCollectionCommentTemplate(itemIndex, commentIndex){
    return `
        <tr>
            <td class="commentor">${collection[itemIndex].comments[commentIndex].name}:</td>
            <td class="comment">${collection[itemIndex].comments[commentIndex].comment}</td>
        </tr>
    `
}