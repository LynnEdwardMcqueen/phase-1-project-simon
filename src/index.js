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
    //.then((buttons) => console.log(buttons))

})


function configureButton(button) {
    console.log(button);
} 

function configureButtons(buttons) {
//    console.log(buttons)
    buttons.forEach(configureButton)
    
}