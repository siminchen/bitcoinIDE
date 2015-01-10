function StackVisualizer (elemID) {
    this.name = "Bitcoin Stack Visualizer";

    this.element = $("#"+elemID);
    this.stack = new Array();
    this.createStackDiagram();
}
 
StackVisualizer.prototype.getInfo = function() {
    return this.name;
};

StackVisualizer.prototype.push = function(value) {
	this.stack.push(value);
};

StackVisualizer.prototype.pop = function() {
    return this.stack.pop();
};

StackVisualizer.prototype.createStackDiagram = function() {
    console.log("Creating stack diagram...");

    var myDiv = $('<div/>', {
	    id: 'foo',
	    text: 'This is where the diagram will go!'
	}).addClass("test-box");

	myDiv.css({
		'height' : '100%',
		'width' : '80%',
		'display' : 'table', //for IE8+
		'margin' : '0 auto'
	});

	myDiv.appendTo(this.element);
};