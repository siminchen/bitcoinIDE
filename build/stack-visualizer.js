var stackAnimationTime = 400;
var stackElementBorderWidth = 1;

function StackVisualizer (elemID) {
    this.name = "Bitcoin Stack Visualizer";
    this.parentID = elemID;
   // this.grandparentID = ;
    this.stackID = 'stack-diagram';

    this.parentElement = $("#"+elemID);
    this.stack = new Array();
    this.createStackDiagram();
}
 
StackVisualizer.prototype.getInfo = function() {
    return this.name;
};

StackVisualizer.prototype.push = function(value) {
	this.pushElementOnDiagram(this.createStackElement(value));
	this.stack.push(value);
};

StackVisualizer.prototype.pop = function() {
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
    	//'overflow' : 'scroll'
    });

    var stackDiv = $('<div/>', {
	    id: this.stackID
	});

	stackDiv.addClass("test-box");

	stackDiv.css({
		'height' : '100%',
		//'width' : '10%',
		'display' : 'table-cell', //for IE8+
		'margin' : '0 auto',
		'position' : 'relative',
		'vertical-align' :'bottom',
		'overflow-y' : 'hidden'
	});

	stackDiv.appendTo(this.parentElement);
	this.stackDiagram = stackDiv;
};

StackVisualizer.prototype.createStackElement = function(value) {
	// var parentWidth = this.element.width();
	// var stackElementWidth = 0.95;

    var stackElement = $('<div/>', {
	    text: value
	});

	//stackElement.addClass("test-box");

	stackElement.css({
		'height' : '10%',
		'width' : '100%',
		'position' : 'relative',
		'display' : 'table', //for IE8+
		//'margin-left' : '50%', //parentWidth/2

		'color' : 'white',
		'text-align' : 'center',
		'bottom' : '0',
		'background-color' : 'blue',
		'border-style' : 'solid',
		'border-width' : stackElementBorderWidth+'px'
	});

	return stackElement;
};


StackVisualizer.prototype.pushElementOnDiagram = function(stackElement) {
	this.stackDiagram.prepend(stackElement);

	var heightToFallFrom = this.getStackRemainingHeight()*0.75;

	//console.log(maxHeight);
	console.log('Num elements: ' + this.numStackElements());
	console.log('Each elem height: ' + this.getStackElementHeight());
	console.log('Max height: ' + this.getStackMaxHeight());
	console.log('Current height: ' + this.getStackCurrHeight());
	console.log('Remaining height: ' + this.getStackRemainingHeight());

	//Set starting state and then animation
	stackElement.css({
		'opacity' : '0.0',
		'margin' : '0',
		'border-width' : '1px',
		'bottom' : heightToFallFrom
		//'margin-bottom' : '10px'//maxHeight+'px'
	}).animate({
		opacity: 1.0,
		'bottom' : '0px'
		//'margin-bottom' : '0'
	}, stackAnimationTime, function() {
		//animation complete
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


StackVisualizer.prototype.popElementFromDiagram = function() {
	popped = $('#' + this.stackID + ' :first-child');

	var heightToFlyTo = this.getStackRemainingHeight()*0.95;

	popped.animate({
		opacity: 0.0,
		'bottom' : heightToFlyTo+'px'
	}, stackAnimationTime, function() {
		//animation complete
		popped.remove();
	});
	
};