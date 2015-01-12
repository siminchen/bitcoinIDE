// JS Module for the Bitcoin debugger
// Usage: First instantiate ScriptDebugger.
//        To run the script from beginning to the end, call runFromBeginning()
//        To step to the next command, call nextStep()
//        To continue execution till the end, call continueExecution() 

function ScriptDebugger() {
    this.pause = 1000; // Number of milliseconds of pause between commands
    this.visibleStack = new StackVisualizer("stack-visualizer");
    this.hiddenStack = new StackVisualizer("stack-visualizer", true); // set the hidden flag to true
    this.interpreter = new interpreter();
    this.initialize();
}


// This function is called when the class is instantiated,
// when the function runFromBeginning is called, or when
// the end of a script has been reached.
ScriptDebugger.prototype.initialize = function() {
    var script = editor.getSession().getValue();
    // Split the script based on space characters
    this.commands = script.split(/\s+/);

    this.index = 0; // The current index in the commands array to execute
    this.needToInitialize = false;

    this.visibleStack.clear();
    this.hiddenStack.clear();

    // Display the next opcode to execute                                                                                   
    $( "#next-opcode-container" ).text(this.commands[this.index]);
    $( "#next-opcode-container").css({"background-color": "#dddddd", "color":"black"});
    $( "#current-execution-pass").animate({ 'opacity': '0.0' });
    $( "#current-execution-fail").animate({ 'opacity': '0.0' });
};


// Returns true if the script is valid and false otherwise
// Also notifies the user by setting the next opcode container
ScriptDebugger.prototype.validate = function() {
    if (!this.interpreter.validateScript(this.commands)) {
	$( "#next-opcode-container").text("The script is invalid");
	$( "#next-opcode-container").css("background-color", "orange");
	this.needToInitialize = true;
	return false;
    }
    return true;
}

ScriptDebugger.prototype.runFromBeginning = function() {
    this.initialize();
    if (!this.validate()) {
	return;
    }

    while (this.index != -1 && this.index != -2) {
	this.nextStep();
    }

    this.needToInitialize = true;
};


ScriptDebugger.prototype.nextStep = function(){
    if (this.needToInitialize) {
	this.initialize();
	if (!this.validate()) {
	    return;
	}
    }  

    this.index = this.interpreter.nextStep(this.visibleStack, this.hiddenStack, this.commands, this.index);    
    
    if (this.index == -1) { // Execution Failure
	$( "#next-opcode-container").text("Execution unsuccessful");
	$( "#next-opcode-container").css({"background-color": "red", "color":"white"});
    $( "#current-execution-fail").animate({ 'opacity': '1.0' });
    $( "#current-execution-pass").animate({ 'opacity': '0.0' });
	this.needToInitialize = true;
    } else if (this.index == -2) { // Execution Success
	$( "#next-opcode-container").text("Execution successful");
	$( "#next-opcode-container").css({"background-color": "green", "color":"white"});
    $( "#current-execution-pass").animate({ 'opacity': '1.0' });
    $( "#current-execution-fail").animate({ 'opacity': '0.0' });
	this.needToInitialize = true;
    } else {
	// Display the next opcode to execute
	$( "#next-opcode-container" ).text(this.commands[this.index]);
    }
};


ScriptDebugger.prototype.continueExecution = function() {
    if (!this.validate()) {
        return;
    }

    while (this.index != -1 && this.index != -2) {
	this.nextStep();
    }

    this.needToInitialize = true;

};
