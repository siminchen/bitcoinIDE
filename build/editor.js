//console.log("BITCOIN IDE! YEAH!");

var stackVisualizer;

/* All javascript manipulation for the page goes in here: */
$( document ).ready(function() {
	/* All javascript manipulation for the page goes in here */

	//$("#stack-visualizer").text(editor.getSession().getValue());

	stackVisualizer = new StackVisualizer("stack-visualizer");
	stackVisualizer.push("STACK VALUE TEST1");
	stackVisualizer.push("STACK VALUE TEST2");
	stackVisualizer.push("STACK VALUE TEST3");
	p = stackVisualizer.pop();
	stackVisualizer.pop();
	stackVisualizer.push("STACK VALUE TEST4");
	p = stackVisualizer.remove(2);
	stackVisualizer.insert("STACK VALUE TEST5", 2);
	p = stackVisualizer.remove(3);
	p = stackVisualizer.pop();
	stackVisualizer.push("STACK VALUE TEST6");
});