function StackVisualizer (elemID) {
    this.name = "Bitcoin Stack Visualizer";
    this.parentID = elemID;
    this.stackID = 'stack-diagram';

    this.element = $("#"+elemID);
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

    var stackDiv = $('<div/>', {
	    id: this.stackID,
	    text: 'This is where the diagram will go!'
	});

	stackDiv.addClass("test-box");

	stackDiv.css({
		'height' : '100%',
		'width' : '80%',
		'display' : 'table', //for IE8+
		'margin' : '0 auto',
		'position' : 'relative',
		'vertical-align' :'bottom'
	});

	stackDiv.appendTo(this.element);
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
		'display' : 'table', //for IE8+
		//'margin-left' : '50%', //parentWidth/2

		'color' : 'white',
		//'position' : 'absolute',
		'text-align' : 'center',
		'bottom' : '0',
		'background-color' : 'blue'
	});


	return stackElement;
};


StackVisualizer.prototype.pushElementOnDiagram = function(stackElement) {
	this.stackDiagram.prepend(stackElement);
};

StackVisualizer.prototype.popElementFromDiagram = function() {
	console.log('#'+this.elemID+':first-child');
	$('#' + this.stackID + ' :first-child').remove();
};