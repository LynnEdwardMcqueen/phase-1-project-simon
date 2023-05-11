let configureButtons = false;

// These are used for the sound generation.
let context = null;
let waveforms = ["sine", "square", "sawtooth", "triangle"];
let oscillatorNode

// This is the watch dog timeout that is active during the user playback of the sequence
let userPlaybackWatchdog
let highScore

// This enables/disables the submit for the button configuration
let submitEnabled = true
let gameButtonsListenerEnabled = false
let startButtonListenerEnabled = true;

// This is the state information for the game.  The array keeps a record of the 
// buttons in the sequence.  index is the current button on the game's presentation
// of the sequence to the user.  The userPlaybackIndex is the current button in the sequence
// that the user is playing.
let sequence = {
    array: [], 
    index: 0,
    userPlaybackIndex: 0,
   }

// This holds the time in milliseconds to display the button when the host is presenting the
// sequence to the user.  It becomes reduced as the game goes on.
let sequenceDuration

// This is the data loaded from the server for each button.  There are 3 pieces of information:
// 1) The frequency of the sound activated when the button is clicked, 2) The waveform of the 
// activated sound, and 3) the color of the button.
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
 

  // This is a button to configure Simonish buttons
  const addBtn = document.querySelector("#config-btn");
   
   addBtn.addEventListener("click", () => {
    // hide & seek with the form
    configureButtons = !configureButtons;
    if (configureButtons) {
        clearLoserX()
        displayButtonConfigForm();
    } else {
        clearButtonConfigForm();
    }
  });
})



 fetch( "http://localhost:3000/buttons")
.then(result => result.json())
.then(buttons => {
 
    buttons.forEach(renderOneButton)
    buttons.forEach(preloadButtonFormFields)
    createSubmitEventListeners();
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
    highScore = highScoreResult.score;
    updateHighScoreDisplay();
})

function createSubmitEventListeners() {
    // There are 6 submit buttons.  They all have id's of the form id ="buttonx-submit" where x
    // is a number 1 - 5

    for (i = 0; i < 6; i++) {
        
        // Add 1 to i since the forms are indexed from 1.
        document.getElementById(`button${i+1}-form`).addEventListener("submit",(event) => {   
            if (submitEnabled === true) {
                event.preventDefault();
                // event.target is the DOM node of the submit button.  
                // Extract the index of the submit
                let index = event.target.id.slice(6,7);

                let j=0;
                // The waveform data is in a radio button.  Go through all the buttons and determine
                // which one is checked.  The waveform is translated to a number 0-3 (i.e., sine = 0, square = 1, 
                // sawtooth = 2, triangle = 3)
                for (const waveForm of waveforms) {
                    if (document.getElementById(`button${index}-${waveForm}`).checked === true) {
                        break;
                    }
                    j++;
                }
                // Update the button frequency
                buttonData[index - 1].waveform = j;

                // The frequency input id's are of the format "button-x-freq"
                buttonData[index - 1].frequency = document.getElementById(`button-${index}-freq`).value;
               
                // The color pull down id's are of the format "buttonx-color" where x = 1 to 6.
                buttonData[index - 1].color = document.getElementById(`button${index}-color`).value;
                
                // Update the color on the actual button
                let buttonCandidate = document.getElementById(`button_${buttonData[index - 1].id}`)
                buttonCandidate.style.backgroundColor = buttonData[index - 1].color
                                
                const bodyData = {color: buttonData[index - 1].color, frequency: buttonData[index - 1].frequency, waveform: buttonData[index - 1].waveform };
                patchHost(`http://localhost:3000/buttons/${index}`, bodyData)

            }
        })
        
    }
}
function preloadButtonFormFields(buttonInfo) {

    // Configure the waveform radio buttons
    switch(buttonInfo.waveform) {
        case 0:
            document.getElementById(`button${buttonInfo.id}-sine`).checked = true;
            break
        case 1:
            document.getElementById(`button${buttonInfo.id}-square`).checked = true;
            break
        case 2:
            document.getElementById(`button${buttonInfo.id}-sawtooth`).checked = true;
            break;
        case 3:
            document.getElementById(`button${buttonInfo.id}-triangle`).checked = true;
            break;
    } 

    // Populate the color pull down menu
    document.getElementById(`button${buttonInfo.id}-color`).value = buttonInfo.color

    // Fill in the frequency 
    document.getElementById(`button-${buttonInfo.id}-freq`).value = buttonInfo.frequency

}
    
function patchHost(url, bodyData) {
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
    if (startButtonListenerEnabled) {
        console.log("StartGame")
        // Turn of the strike x from the failing game
        clearLoserX()
        // Turn off the button configuration forms
        clearButtonConfigForm()
        // Don't allow the user to initiate a new game while starting this one.
        disableGameStartButtonListener()

        // Reset the game state
        sequence.index = 0;
        sequence.userPlaybackIndex = 0;
        sequence.array = [];

        initiateSequence()
    }
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
    disableGameButtonsListener()
    enableGameStartButtonListener( )


}

function userPlaybackTimeout( ) {
    processLoss();
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


function enableGameStartButtonListener() {
    console.log("Game St EN")
    startButtonListenerEnabled = true;
}

function disableGameStartButtonListener() {
    startButtonListenerEnabled = false;
}

function enableGameButtonsListener() {
    gameButtonsListenerEnabled = true;
}

function disableGameButtonsListener() {
    gameButtonsListenerEnabled = false;
}
function clearButtonConfigForm() {
    const configureButtonsContainer = document.querySelector("#config-container");
    configureButtonsContainer.style.display = "none";
}

function displayButtonConfigForm() {
    const configureButtonsContainer = document.querySelector("#config-container");
    configureButtonsContainer.style.display = "block";
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
    if (gameButtonsListenerEnabled)
    {
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
            processLoss()
        }
    }
}


function initializeUserPlayback() {
    enableGameButtonsListener();
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
        initializeUserPlayback()

    }
}

function generateLoserSound() {
    let oscillatorNode = context.createOscillator();
    let gainNode = context.createGain();
    oscillatorNode.frequency.value = 73.42;
    oscillatorNode.type = "square"
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 2)
    oscillatorNode.connect(gainNode);
    gainNode.connect(context.destination);
    oscillatorNode.start(0);

}

function generateSoundForButton(hostSequenceActive) {
    let oscillatorNode = context.createOscillator();
    let gainNode = context.createGain();
    // Retrieve the desired waveform and frequency associated with this button.

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
    
    disableGameButtonsListener();
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
