// JS Module for the Bitcoin debugger
// Usage: First instantiate ScriptDebugger.
//        To run the script from beginning to the end, call runFromBeginning()
//        To step to the next command, call nextStep()
//        To continue execution till the end, call continueExecution() 

function ScriptDebugger() {
    this.pause = 1000; // Number of milliseconds of pause between commands
    this.initialize();
    this.visibleStack = new StackVisualizer("visible");
    this.hiddenStack = new StackVisualizer("hidden");
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
};

ScriptDebugger.prototype.runFromBeginning = function() {
    this.initialize();

    while (this.index != -1 && this.index != -2) {
	this.nextStep();
    }

    this.needToInitialize = true;
};


ScriptDebugger.prototype.nextStep = function(){
    if (this.needToInitialize == true) {
	this.initialize();
    }  
    //
    if (this.index != 5) {
	this.index += 1;
    } else {
	this.index = -1;
    }
    console.log(this.index);
    //this.index = interpreter.nextStep(this.visibleStack, this.hiddenStack, this.commands, this.index);
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