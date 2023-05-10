console.log("Here in index.js")
let configureButtons = false;
let context = null;
let waveforms = ["sine", "square", "sawtooth", "triangle"];
let oscillatorNode
let userPlaybackWatchdog
let highScore


let sequence = {
    array: [], 
    index: 0,
    userPlaybackIndex: 0,
   }
let sequenceDuration

let buttonData = []
let domLoaded = false

window.addEventListener('load', init, false);
function init() {
    try {
        context = new AudioContext();
    }
    catch(e) {
    alert('Web Audio API is not supported in this browser');
    }
}

document.addEventListener("DOMContentLoaded", () => {
   domLoaded = true  
   console.log("domLoaded")

  // This is a button to configure Simonish buttons
  const addBtn = document.querySelector("#config-btn");
  const configureButtonsContainer = document.querySelector("#config-container");
  debugger
  // configureButtonsContainer.style.display = "block";
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    debugger
    configureButtons = !configureButtons;
    if (configureButtons) {
        clearLoserX()
        configureButtonsContainer.style.display = "block";
    } else {
        configureButtonsContainer.style.display = "none";
    }
  });
   
})



 fetch( "http://localhost:3000/buttons")
.then(result => result.json())
.then(buttons => {
 
    // Make sure the DOM is loaded before configuring the buttons
    // while(domLoaded === false) {}
    buttons.forEach(renderOneButton)
    buttons.forEach(preloadButtonFormFields)
    buttonData = Array.from(buttons)

    // Now that the game is all set up, add the event listener for the start button.
    let startGameButton = document.getElementById("start-game");
    startGameButton.addEventListener("click", startGame)
 
    // Once game has started, disable configure buttons

   
})
.catch(e => console.log(e))

fetch ("http://localhost:3000/highScore/1")
.then(result => result.json())
.then(highScoreResult => {
    debugger
    console.log(highScoreResult)
    highScore = highScoreResult.score;
    updateHighScoreDisplay();
})

functionPreloadButtonFormFields() {
    f
}
    
function patchHost(url, bodyData) {
    console.log(url)
    console.log(bodyData)
    fetch(url, {
        method: "PATCH",
        headers: {
          'Content-Type': "application/json"
         },
        body: JSON.stringify(bodyData)
      })
      .then(res => res.json())
      .then(updatedRes => console.log(updatedRes))
      .catch(err => console.log(err))
  

}


console.log("Configured")

function startGame()
{
    // Turn of the strike x from the failing game
    clearLoserX()
    // Reset the game.
    sequence.index = 0;
    sequence.userPlaybackIndex = 0;
    sequence.array = [];

    initiateSequence()
}

function updateHighScoreDisplay() {
    let highScoreElement = document.getElementById("high-score")
    highScoreElement.innerText = `High Score: ${highScore}`
}

function processLoss() {
    displayLoserX()
    generateLoserSound();

    // Update the high score display if the record is broken
    if (sequence.array.length > highScore) {
        highScore = sequence.array.length
        updateHighScoreDisplay();
        patchHost("http://localhost:3000/highScore/1", {score: highScore})
        
    }

}

function userPlaybackTimeout( ) {
    
    processLoss()
}
function restoreButtonUserSequence()
{
    let button = document.getElementById(`button_${sequence.array[sequence.userPlaybackIndex]}`)
    button.style.filter = "brightness(50%)";
    // oscillatorNode.stop();
    if (sequence.userPlaybackIndex === sequence.index) {
        // The user has successfully repeated the sequence.  Repeat the 
        // sequence and add 1 more to it.  Delay 1 second before initiating the sequence.
        setTimeout( initiateSequence, 1000);
    } else {
        // Set up to look for the user's input on the next item in the sequence
        sequence.userPlaybackIndex++;    
        userPlaybackWatchdog = setTimeout(userPlaybackTimeout, 2000);

    }
}

function clearLoserX() {
    let failureStrike = document.getElementById("loser-x")
    failureStrike.style.display = "none"

}
function displayLoserX() {
    let failureStrike = document.getElementById("loser-x")

    failureStrike.style.display = "block"

}
function checkUserPlayback(event) {
    // The id of the element is "button_${id}".  Use slice to get rid of "button_"
    let id = parseInt(event.target.id.slice(7));

    clearTimeout(userPlaybackWatchdog);
    if (id === sequence.array[sequence.userPlaybackIndex] ) {
        
        generateSoundForButton(false) 
        // let the brightness rip!
        event.target.style.filter = "brightness(200%)"
        // Leave the button bright for 200 milliseconds before looking for the next item in the sequence.
        setTimeout(restoreButtonUserSequence, 200)
    } else {
             
        // TODO - fix this
        processLoss()
    }

}


function initializeUserPlayback() {
       // Clear the user related sequence information
    sequence.userPlaybackIndex = 0;
    // Kick off the timeout timer
    userPlaybackWatchdog = setTimeout(userPlaybackTimeout, 2000);
}
function sequenceComplete() {
    return(sequence.index === (sequence.array.length - 1) )
}

function clearButtonInSequence() {

    let button = document.getElementById(`button_${sequence.array[sequence.index]}`)
    button.style.filter = "brightness(50%)"
    // oscillatorNode.stop() 

    if (sequenceComplete()) {
        console.log("sequence complete")
        initializeUserPlayback()

    }
}

function generateLoserSound() {
    let oscillatorNode = context.createOscillator();
    let gainNode = context.createGain();
    oscillatorNode.frequency.value = 73.42;
    oscillatorNode.type = "square"
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 3)
    oscillatorNode.connect(gainNode);
    gainNode.connect(context.destination);
    oscillatorNode.start(0);
}

function generateSoundForButton(hostSequenceActive) {
    let oscillatorNode = context.createOscillator();
    let gainNode = context.createGain();
    // Retrieve the desired waveform and frequency associated with this button.

    console.log(buttonData)
    let buttonDataIndex
    // The buttons are indexed from 1, but the buttonData array is indexed from 0.
    if (hostSequenceActive ) {
        buttonDataIndex = sequence.array[sequence.index] - 1
    } else {
        buttonDataIndex = sequence.array[sequence.userPlaybackIndex] - 1
    }

    oscillatorNode.frequency.value = buttonData[buttonDataIndex].frequency
    // The waveform is different from the frequency.  The stored value is an index
    // into a lookup table that has a string that describes the waveform.
    oscillatorNode.type = waveforms[buttonData[buttonDataIndex].waveform]
    d =  waveforms[buttonData[sequence.array[sequence.index] - 1].waveform]


    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1)
    oscillatorNode.connect(gainNode);
    gainNode.connect(context.destination);
    oscillatorNode.start(0);
}
function nextButtonInSequence() {
    
    sequence.index++;
    let button = document.getElementById(`button_${sequence.array[sequence.index]}`)
    button.style.filter = "brightness(200%)"
    generateSoundForButton(true)

//    if (context === null) {
//        context = new AudioContext();
//    }


    if (sequenceComplete() === false) {

        setTimeout(nextButtonInSequence, sequenceDuration)
    }

    // Set the current button back to it's non-bright color.
    setTimeout(clearButtonInSequence,(3 * sequenceDuration/4));

}

function initiateSequence() {

    
   if (sequence.array.length != 0) {
        sequence.index = sequence.array.length;
    }
    // Create a random number from 0 to 5
    sequence.array.push(Math.floor(Math.random() * 6))
    // Add 1 since the buttons are numbered from 1 to 6
    sequence.array[sequence.index]++;

    // Update the score display

    let scoreDisplay = document.getElementById("score")
    scoreDisplay.innerText = `Score: ${sequence.array.length}`
 
    if (sequence.array.length <= 6) {
        sequenceDuration = 1000
    } else if (sequence.array.length < 10) {
        sequenceDuration = 700
    } else {
        sequenceDuration = 400
    }

    
    // Boundary condition for the 0th member of the sequence
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
    buttonDiv.addEventListener("click", checkUserPlayback)

 
    // Now append the card div node to the to collection
    buttonCollection.appendChild(buttonDiv);

  
}
