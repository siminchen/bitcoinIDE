

var stepFromBeginning = function() {
    // Set a global variable to indicate the index of the command array
    env.index = 0;
    nextStep();
};


var nextStep = function() {
    var inputRegion = document.querySelector(".ace_scoller");
    var script = inputRegion.textContent;

    // Split the script based on space characters
    var commands = script.split(/\s+/);

    env.index = interpreter.nextStep(env.index);
};
