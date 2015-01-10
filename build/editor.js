//console.log("BITCOIN IDE! YEAH!");

var stackVisualizer;

/* All javascript manipulation for the page goes in here: */
$( document ).ready(function() {
	/* All javascript manipulation for the page goes in here */

	//$("#stack-visualizer").text(editor.getSession().getValue());

	stackVisualizer = new StackVisualizer("stack-visualizer");
	stackVisualizer.push("STACK VALUE TEST");
	stackVisualizer.push("STACK VALUE TEST2");
	//p = stackVisualizer.pop();
	//console.log(p);
});