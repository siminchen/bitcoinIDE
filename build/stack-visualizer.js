var stackAnimationTime = 400;
var stackElementBorderWidth = 1;
var curvedness = 8;


function StackVisualizer (elemID) {
    this.name = "Bitcoin Stack Visualizer";
    this.parentID = elemID;
    this.stackID = 'stack-diagram';

    this.parentElement = $("#"+elemID);
    this.stack = new Array();
    this.createStackDiagram();
    this.animQueue = $({});
}

StackVisualizer.prototype.animToQueue = function(selector, animationprops, callback) {
    this.animQueue.queue(function(next) {
        $(selector).animate(animationprops, stackAnimationTime, next).promise().done(callback);
    });
};
 
StackVisualizer.prototype.getInfo = function() {
    return this.name;
};

StackVisualizer.prototype.push = function(value) {
	this.pushElementOnDiagram(this.createStackElement(value));
	this.stack.push(value);
};

StackVisualizer.prototype.pop = function() {
	if(this.numStackElements() == 0) {
		console.error("WARNING: Stack underflow! Attempted to pop empty stack.");
		return;
	}
	this.popElementFromDiagram();
    return this.stack.pop();
};

StackVisualizer.prototype.createStackDiagram = function() {
    console.log("Creating stack diagram...");

    this.parentElement.css({
    	'position' : 'relative',
    	'display' : 'table',
    	'height' : '90%',
    	'width' : '80%',
    	'margin' : '0 auto',

		'margin-top' : '2%',
    	//'overflow' : 'scroll'
    });

    var stackDiv = $('<div/>', {
	    id: this.stackID
	});

	//stackDiv.addClass("test-box");

	stackDiv.css({
		'height' : '100%',
		'display' : 'table-cell', //for IE8+
		'margin' : '0 auto',
		'position' : 'relative',
		'vertical-align' :'bottom',
		'overflow-y' : 'hidden',
		'background-color' : 'white',
		
		//border
		'border-style' : 'double',
		'border-color' : 'gray',
		'border-width' : '0px 5px 5px 5px',

		'-moz-border-radius-bottomright' : curvedness + 'px',
		'border-bottom-right-radius' : curvedness + 'px',
		'-moz-border-radius-bottomleft' : curvedness + 'px',
		'border-bottom-left-radius' : curvedness + 'px'
	});

	stackDiv.appendTo(this.parentElement);
	this.stackDiagram = stackDiv;
};

StackVisualizer.prototype.createStackElement = function(value) {
    var stackElement = $('<div/>', {
	    text: value
	});

	stackElement.css({
		'height' : '10%',
		'width' : '100%',
		'position' : 'relative',
		'display' : 'table', //for IE8+
		
		'padding' : '5px',
		'color' : 'white',
		'text-align' : 'center',
		'bottom' : '0',
		'background-color' : '#E89A2C',

		'border-style' : 'groove',
		'border-color' : 'white',
		'border-width' : stackElementBorderWidth+'px',

		'-moz-border-radius' : curvedness+'px',
		'border-radius' : curvedness+'px'
	});

	return stackElement;
};


StackVisualizer.prototype.pushElementOnDiagram = function(stackElement) {
	this.stackDiagram.prepend(stackElement);

	var heightToFallFrom = this.getStackRemainingHeight()*0.75;

	//Set starting state and then animation
	stackElement.css({
		'opacity' : '0.0',
		'margin' : '0',
		'bottom' : heightToFallFrom
	});

	this.animToQueue(stackElement, {
		opacity: 1.0,
		'bottom' : '0px'
	}, function(){
		//animation complete
	});

	this.top = stackElement;
};

StackVisualizer.prototype.popElementFromDiagram = function() {
	popped = this.top;
	this.top = $(this.top).next();

	var heightToFlyTo = this.getStackRemainingHeight()*0.95;

	this.animToQueue(popped, {
		opacity: 0.0,
		'bottom' : heightToFlyTo+'px'
	}, function() {
		//animation complete
		$(this).remove();
	});
	
};


StackVisualizer.prototype.getStackRemainingHeight = function() {
	return this.getStackMaxHeight() - this.getStackCurrHeight();
};

StackVisualizer.prototype.getStackMaxHeight = function() {
	var maxHeight = this.stackDiagram.height();
	return maxHeight;
};

StackVisualizer.prototype.getStackCurrHeight = function() {
	return this.numStackElements() * this.getStackElementHeight();
};

StackVisualizer.prototype.getStackElementHeight = function() {
	return $('#' + this.stackID + ' :first-child').height() + 2*stackElementBorderWidth;
};

StackVisualizer.prototype.numStackElements = function() {
	return this.stack.length;
};

StackVisualizer.prototype.size = function() {
	return this.stack.length;
};

//1-indexed from the top of the stack
StackVisualizer.prototype.peek = function(idx) {

	if(idx === undefined) {
		if(this.size() <= 0) {
			console.error("WARNING: peek() called with empty stack.");
		} else {
			return this.stack[this.size()-1];
		}
	} else {
		if(this.size()-idx < 0 || this.size()-idx >= this.size()) {
			console.error("WARNING: Index out of bounds: peek(" + idx + ") called with stack size " + this.size() + ".");
		} else {
			return this.stack[this.size()-idx];
		}
	}
};

//1-indexed from the top of the stack
StackVisualizer.prototype.remove = function(idx) {
	var arrayIndex = this.size() - idx;
	if(arrayIndex < 0 || arrayIndex >= this.size()) {
		console.error("WARNING: Index out of bounds: remove(" + idx + ") called with stack size " + this.size() + ".");
	} else {
		return this.stack.splice(arrayIndex, 1)[0];
	}
};

//1-indexed from the top of the stack
StackVisualizer.prototype.insert = function(value, idx) {
	//insert(val, 1) goes on the top of the stack
	//insert(val, 2) goes under the current top element
	var arrayIndex = this.size() - idx;
	console.log("Array index: " + arrayIndex);
	if(idx <= 0 || idx > this.size()+1) {
		console.error("WARNING: Index out of bounds: insert(" + value + "," + idx + ") called with stack size " + this.size() + ".");
	} else {
		this.stack.splice(arrayIndex+1, 0, value);
	}
};