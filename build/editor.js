//console.log("BITCOIN IDE! YEAH!");



/* All javascript manipulation for the page goes in here: */
$( document ).ready(function() {
	/* All javascript manipulation for the page goes in here */

	//$("#stack-visualizer").text(editor.getSession().getValue());

	var stackVisualizer = new StackVisualizer("stack-visualizer");
	stackVisualizer.push("STACK VALUE TEST");
	p = stackVisualizer.pop();
	console.log(p);
});