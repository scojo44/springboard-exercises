function countdown(start) {
    let step = start;
    
    // Make the first step appear after the return value in the console...
    setTimeout(function() { // ...by queueing it up to run after countdown() exits
        console.log(start);
    }, 1);

    // Log the remaining steps
    const timerID = setInterval(logCountdownStep, 1000);
    
    function logCountdownStep() {
        step--;
        if(step > 0)
            console.log(step);
        else {
            console.log("DONE!");
            clearInterval(timerID);
        }
    }
}

function randomGame() {
    let tries = 0;
    const intervalID = setInterval(drawNumber, 1000);

    function drawNumber() {
        const random = Math.random();
        tries++;
        console.log(`You reach into the bag and pull out a small slip of paper with ${random} written on it.`);

        if(random > .75){
            clearInterval(intervalID);
            console.log(`${tries} tries to get a number greater than .75`);
        }
    }
}