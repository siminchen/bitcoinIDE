// JS Module for the Bitcoin debugger
// Usage: First instantiate ScriptDebugger.
//        To run the script from beginning to the end, call runFromBeginning()
//        To step to the next command, call nextStep()
//        To continue execution till the end, call continueExecution() 

function ScriptDebugger() {
    this.pause = 1000; // Number of milliseconds of pause between commands
    this.visibleStack = new StackVisualizer("stack-visualizer");
//    this.hiddenStack = new StackVisualizer("stack-visualizer", true); // set the hidden flag to true
	this.hiddenStack = 0;
    this.interpreter = new interpreter();
    this.firstStep = true;
    this.initialize();
}


// This function is called when the class is instantiated,
// when the function runFromBeginning is called, or when
// the end of a script has been reached.
ScriptDebugger.prototype.initialize = function() {
    var script = editor.getSession().getValue();
    // Split the script based on space characters
    this.commands = script.split(/\s+/);
    // this.visibleStack.clear();
    // this.hiddenStack.clear();
    this.index = 0; // The current index in the commands array to execute
    this.needToInitialize = false;

    console.log(this.hiddenStack);
    this.visibleStack.clear();
    //    this.hiddenStack.clear();

    // Display the next opcode to execute                                                                                   
    $( "#next-opcode-container" ).text(this.commands[this.index]);
};

ScriptDebugger.prototype.runFromBeginning = function() {
    this.initialize();

    while (this.index != -1 && this.index != -2) {
	this.nextStep();
    }

    this.needToInitialize = true;
};


ScriptDebugger.prototype.nextStep = function(){
    if (this.needToInitialize) {
	this.initialize();
    }  

    if (this.firstStep) {
	this.initialize();
	this.firstStep = false;
    }

    this.index = this.interpreter.nextStep(this.visibleStack, this.hiddenStack, this.commands, this.index);    
    console.log("index " + this.index);
    if (this.index == -1) {
	$( "#next-opcode-container").text("Execution unsuccessful");
	$( "#next-opcode-container").css("background-color", "red");
	this.needToInitialize = true;
    } else if (this.index == -2) {
	$( "#next-opcode-container").text("Execution successful");
	$( "#next-opcode-container").css("background-color", "green");
	this.needToInitialize = true;
    } else {
	// Display the next opcode to execute
	$( "#next-opcode-container" ).text(this.commands[this.index]);
    }
};


ScriptDebugger.prototype.continueExecution = function() {
    if (this.needToInitialize == true) {
	this.initialize();
    }

    while (this.index != -1 && this.index != -2) {
	this.nextStep();
    }

    this.needToInitialize = true;

};
