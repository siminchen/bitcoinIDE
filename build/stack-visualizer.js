var stackAnimationTime = 400;
var stackElementBorderWidth = 1;
var curvedness = 8;
var percentHeightToFallFrom = 0.95;
var percentHeightToFlyUp = 0.95;


function StackVisualizer (elemID) {
    this.name = "Bitcoin Stack Visualizer";
    this.parentID = elemID;
    this.stackID = 'stack-diagram';

    this.parentElement = $("#"+elemID);
    this.stack = new Array();
    this.createStackDiagram();
    this.animQueue = $({});
}

StackVisualizer.prototype.animToQueue = function(selector, animationprops, callback, concurrentFunc, args) {
    this.animQueue.queue(function(next) {
    	if(concurrentFunc !== undefined) {
    		// concurrentFunc(args);
    		$.when( newSelector = concurrentFunc(args) ).done(function() {
    			console.log("Animating for " + selector + " : " + $(selector).text());
    			console.log("RET: " + newSelector);
    			if(newSelector != undefined)
    			{
    				selector = newSelector;
    			}
		       $(selector).animate(animationprops, stackAnimationTime, next).promise().done(callback);
			});
    	} else {
    		console.log("Animating for " + selector + " : " + $(selector).text());
	        $(selector).animate(animationprops, stackAnimationTime, next).promise().done(callback);
	    }
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
	// this.stackDiagram.prepend(stackElement);

	var heightToFallFrom = this.getStackRemainingHeight()*percentHeightToFallFrom;
	var stackSelector = '#' + this.stackID;

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
		// this.top = stackElement;
	}, function(a) {
		$(stackSelector).prepend(stackElement);
		a.top = stackElement;
	}, this);

	// this.top = stackElement;
};

StackVisualizer.prototype.popElementFromDiagram = function() {
	//popped = this.top;
	poppedSelector = '#' + this.stackID + ' :first-child';

	var heightToFlyTo = this.getStackRemainingHeight()*percentHeightToFlyUp;

	console.log("Top: " + this.top.text());

	var top = this.top;

	this.animToQueue(poppedSelector, {
		opacity: 0.0,
		'bottom' : heightToFlyTo+'px'
	}, function() {
		//animation complete
		$(this).remove();
	}, function(a) {
		var poppedTop = a.top;
		console.log("Now popping: " + $(poppedSelector).text());
		console.log("Original Top: " + a.top.text());
		a.top = $(a.top).next();
		console.log("New Top: " + a.top.text());

		return poppedTop;
	}, this);
	
};

//1-indexed from top
StackVisualizer.prototype.removeElementFromDiagram = function(idx) {
	if(idx == 1) { //removing top element
		this.popElementFromDiagram();
	} else {
		popped = $('#' + this.stackID + ' :nth-child(' + idx + ')');
	}

	//console.log(popped.text());

	var heightToFlyTo = this.getStackRemainingHeight()*percentHeightToFlyUp;

	popped.css({
		padding: "0"
	});

	poppedSelector = '#' + this.stackID + ' :nth-child(' + idx + ')';
	this.animToQueue(poppedSelector, {
		'opacity' : '0.0',
		'bottom' : heightToFlyTo+'px'
	}, function() {
		//animation complete
		$(this).animate({
			"height": "toggle",
			'font-size': '0',
		}, stackAnimationTime, function(){
			$(this).remove();
		});
	}, function(){
		//concurrent function
		console.log($(poppedSelector).text());
		//get nth sibling of the current top
		//return sibling
	});
};

//1-indexed from top
StackVisualizer.prototype.insertElementInDiagram = function(stackElement, idx) {

	if(idx == 1) { //inserting new top element
		this.pushElementOnDiagram(stackElement);
	} else {
		var heightToFallFrom = this.getStackRemainingHeight()*percentHeightToFallFrom;
		var padding = this.top.css("padding");

		//Set starting state and then animation
		stackElement.css({
			'opacity' : '0.0',
			'margin' : '0',
			'bottom' : heightToFallFrom,
			'padding' : '0',
			'font-size' : '0',
			'height' : '0'
		});

		//Append element
		//$('#' + this.stackID + ' :nth-child(' + idx + ')').after(stackElement);
		var appendSelector = '#' + this.stackID + ' :nth-child(' + idx + ')';
		
		this.animToQueue(stackElement, {
			"height": "10%",
			'font-size' : '100%',
			// 'opacity' : '1.0',
			// 'bottom' : '0px',
			'padding' : padding
		}, function() {
			//when this animation is done
			$(this).animate({
				'opacity' : '1.0',
				'bottom' : '0px',
			}, stackAnimationTime);
		}, function() {
			// console.log(stackElement.text());
			// console.log(appendSelector);
			$(appendSelector).after(stackElement);
		});
	}
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
		this.removeElementFromDiagram(idx);
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
		this.insertElementInDiagram(this.createStackElement(value), idx);
	}
};