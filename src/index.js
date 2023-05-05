console.log("Here in index.js")

document.addEventListener("DOMContentLoaded", () => {
    let flowers = ["peony", "rose", "sunflower", "linaria"]

    flowers.forEach(callbackFunc);

    function callbackFunc(name, idx, arr){
        console.log(name, idx, arr)
    }

    fetch( "http://localhost:3000/buttons")
    .then(result => result.json())
    .then(buttons => buttons.forEach(configureButton))
   

})

let renderOneToy = (toy) => {
    
    let toyCollection = document.getElementById("toy-collection");
   
  
    // Create a new toy card. 
    let toyDiv = document.createElement("div");
    toyDiv.className = "card";
    toyDiv.style.filter = "brightness(100%)"
    debugger
    toyDiv.style.backgroundColor = toy.color;
    toyDiv.id = `toy_${toy.id}`
  
/*    // Create the h2 heading
    let h2Tag = document.createElement("h2");
    h2Tag.innerText = toy.name;
    toyDiv.appendChild(h2Tag);
  
    // Create the img node
    let image = document.createElement("img")
    image.className = "toy-avatar"
    image.src = toy.image;
    toyDiv.appendChild(image);
  
    // Create the "likes" paragraph
    let likes = document.createElement("p");
    likes.innerText = toy.likes;
    toyDiv.appendChild(likes);
  
    // Create the like button
    let likeButton = document.createElement("button");
    likeButton.className = "like-btn";
    likeButton.id = `toy_${toy.id}`;
    likeButton.innerText = "Like ❤️";
    toyDiv.appendChild(likeButton);
 */ 
    // Now append the card div node to the to collection
    toyCollection.appendChild(toyDiv);
    debugger
 //   processLikeButtonClick(toyDiv)
  
    // renderCount++;
//    console.log(renderCount)
  
  }

function configureButton(button) {
  renderOneToy(button)
} 