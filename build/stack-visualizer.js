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
	this.stack.push(value);
	this.pushElementOnDiagram(this.createStackElement(value));
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

	stackElement.addClass("test-box");

	stackElement.css({
		'height' : '10%',
		'width' : '100%',
		'position' : 'relative',
		'display' : 'table', //for IE8+
		//'margin-left' : '50%', //parentWidth/2

		'color' : 'white',
		'text-align' : 'center',
		'bottom' : '0',
		'background-color' : 'blue'
	});

	return stackElement;
};

var stackAnimationTime = 400;

StackVisualizer.prototype.pushElementOnDiagram = function(stackElement) {
	this.stackDiagram.prepend(stackElement);

	maxHeight = this.stackDiagram.height();
	maxHeight -= maxHeight*0.50;

	console.log(maxHeight);

	//Set starting state and then animation
	stackElement.css({
		'opacity' : '0.0',
		'margin' : '0',
		'border-width' : '1px',
		//'margin-bottom' : '10px'//maxHeight+'px'
	}).animate({
		opacity: 1.0,
		//'margin-bottom' : '0'
	}, stackAnimationTime, function() {
		//animation complete
	});
};

StackVisualizer.prototype.popElementFromDiagram = function() {
	popped = $('#' + this.stackID + ' :first-child');

	popped.animate({
		opacity: 0.0,
		//'margin-bottom' : '0'
	}, stackAnimationTime, function() {
		//animation complete
		popped.remove();
	});
	
};