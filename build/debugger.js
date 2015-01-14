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

// Split the script into an array of tokens,
// treating everything within < > as one token.
// Returns: an array of commands
ScriptDebugger.prototype.splitScript = function(script) {
    script = script.trim();
    var commands = new Array();

    for (var i = 0; i < script.length; i++) {
	var curr = script[i];
	var comm = ""; 

	// Ignore white space characters
	if (/\s/.test(curr)) {
	    continue;
	}

	// If the command is a string literal, keep search for its end
	if (curr == "<") {
	    while (script[i] != ">" && i < script.length) {
		comm += script[i];
		i++;
	    }
	    comm += ">";
	    commands.push(comm);
	    continue;
	}

        // An opcode or a hex constant
	while (!(/\s/.test(script[i])) && i < script.length) {
	    comm += script[i];
	    i++;
       	}
	commands.push(comm.toUpperCase());

    }
    
    return commands;

}


// This function is called when the class is instantiated,
// when the function runFromBeginning is called, or when
// the end of a script has been reached.
ScriptDebugger.prototype.initialize = function() {
    var script = editor.getSession().getValue();
    // Split the script based on space characters
    this.commands = this.splitScript(script);

    this.index = 0; // The current index in the commands array to execute
    this.needToInitialize = false;

    this.visibleStack.clear();
    this.hiddenStack.clear();

    // Display the next opcode to execute                                                                                   
    $( "#next-opcode-container" ).text(this.commands[this.index]);
    $( "#next-opcode-container").css({"background-color": "#dddddd", "color":"black"});
    $( "#current-execution-pass").animate({ 'opacity': '0.0' });
    $( "#current-execution-fail").animate({ 'opacity': '0.0' });

    $(" .next-opcode ").animate({ 'opacity': '1.0' }, 300);
};


// Returns true if the script is valid and false otherwise
// Also notifies the user by setting the next opcode container
ScriptDebugger.prototype.validate = function() {
    if (!this.interpreter.validateScript(this.commands)) {
    $(" .next-opcode ").animate({ 'opacity': '0.0' }, 300);
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

    if (this.index == -2) { // Execution Success
	this.needToInitialize = true;
	// If the top of the stack isn't true (non-zero), this means the execution failed
	if (this.visibleStack.peek() == 0) {
	    this.index = -1;
	} else {
        $(" .next-opcode ").animate({ 'opacity': '0.0' });
	    $( "#next-opcode-container").text("Execution successful");
	    // $( "#next-opcode-container").css({"background-color": "green", "color":"white"});
        $( "#next-opcode-container" ).animate({
            "backgroundColor": "green",
            "color":"white"}, 100);
	    $( "#current-execution-pass").animate({ 'opacity': '1.0' });
	    $( "#current-execution-fail").animate({ 'opacity': '0.0' });
        this.visibleStack.highlightCompletion(true);
	}
    }

    if (this.index == -1) { // Execution Failure
    $(" .next-opcode ").animate({ 'opacity': '0.0' });
	$( "#next-opcode-container").text("Execution unsuccessful");
	// $( "#next-opcode-container").css({"background-color": "red", "color":"white"});
    $( "#next-opcode-container" ).animate({
            "backgroundColor": "red",
            "color":"white"} , 100);
	$( "#current-execution-fail").animate({ 'opacity': '1.0' });
	$( "#current-execution-pass").animate({ 'opacity': '0.0' });
	this.visibleStack.highlightCompletion(false);
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
