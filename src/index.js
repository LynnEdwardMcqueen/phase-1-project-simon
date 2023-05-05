console.log("Here in index.js")
let sequence = {
    array: [], 
    index: 0
   }
let sequenceDuration


let domLoaded = false

document.addEventListener("DOMContentLoaded", () => {
   domLoaded = true  
   console.log("domLoaded")
   
})


 fetch( "http://localhost:3000/buttons")
.then(result => result.json())
.then(buttons => {
 
    // Make sure the DOM is loaded before configuring the buttons
    while(domLoaded === false) {}
    buttons.forEach(renderOneButton)
    initiateSequence()
    // Start game or configure buttons

    // Once game has started, disable configure buttons

   
})
.catch(e => console.log(e))
    



console.log("Configured")

function sequenceComplete() {
    return(sequence.index === (sequence.array.length - 1) )
}

function clearButtonInSequence() {

    let button = document.getElementById(`button_${sequence.array[sequence.index]}`)
    button.style.filter = "brightness(50%)"

    if (sequenceComplete()) {
        if (sequence.array.length < 50) {
            initiateSequence()
        }

        console.log("sequence complete")
    }
}

function nextButtonInSequence() {
    
    sequence.index++;
    let button = document.getElementById(`button_${sequence.array[sequence.index]}`)
    button.style.filter = "brightness(200%)"

    if (sequenceComplete() === false) {
        setTimeout(nextButtonInSequence, sequenceDuration)
    }
    setTimeout(clearButtonInSequence,(3 * sequenceDuration/4));

}

function initiateSequence() {

    
    debugger
   if (sequence.array.length != 0) {
        sequence.index = sequence.array.length;
    }
    // Create a random number from 0 to 5
    sequence.array.push(Math.floor(Math.random() * 6))
    // Add 1 since the buttons are numbered from 1 to 6
    sequence.array[sequence.index]++;
 
    sequence.array = [1,2,3,4,5,6]
    sequence.index = 0;
    if (sequence.array.length <= 6) {
        sequenceDuration = 1000
    } else if (sequence.array.length < 10) {
        sequenceDuration = 700
    } else {
        sequenceDuration = 400
    }

    

    sequence.index = -1;
    nextButtonInSequence();

    
}


let renderOneButton = (button) => {
    
    let buttonCollection = document.getElementById("button-collection");
   
  
    // Create a new button card. 
    let buttonDiv = document.createElement("div");
    buttonDiv.className = "card";
    buttonDiv.style.filter = "brightness(50%)"
    buttonDiv.style.backgroundColor = button.color;
    buttonDiv.id = `button_${button.id}`

  
   // Create the h2 heading
//    let h2Tag = document.createElement("h2");
//    h2Tag.innerText = toy.name;
//    toyDiv.appendChild(h2Tag);
  
//    // Create the img node
//    let image = document.createElement("img")
//    image.className = "toy-avatar"
//    image.src = toy.image;
//    toyDiv.appendChild(image);
  
//    // Create the "likes" paragraph
//    let likes = document.createElement("p");
//    likes.innerText = toy.likes;
//    toyDiv.appendChild(likes);
  
    // Create the like button
//    let likeButton = document.createElement("button");
//    likeButton.className = "like-btn";
//    likeButton.id = `toy_${toy.id}`;
//    likeButton.innerText = "Like ❤️";
//    toyDiv.appendChild(likeButton);
 
    // Now append the card div node to the to collection
    buttonCollection.appendChild(buttonDiv);
 //   processLikeButtonClick(toyDiv)
  
    // renderCount++;
//    console.log(renderCount)
  
}
