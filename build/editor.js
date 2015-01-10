//console.log("BITCOIN IDE! YEAH!");

var stackVisualizer;

/* All javascript manipulation for the page goes in here: */
$( document ).ready(function() {
	/* All javascript manipulation for the page goes in here */

	//$("#stack-visualizer").text(editor.getSession().getValue());

	stackVisualizer = new StackVisualizer("stack-visualizer");
	stackVisualizer.push("STACK VALUE TEST1");
	stackVisualizer.push("STACK VALUE TEST2");
	// p = stackVisualizer.pop();
	// p = stackVisualizer.pop();
	// stackVisualizer.push("STACK VALUE TEST3");
	// p = stackVisualizer.pop();
	

	// stackVisualizer.push("STACK VALUE TEST3");
	// p = stackVisualizer.pop();
	// stackVisualizer.push("STACK VALUE TEST1");
	// stackVisualizer.push("STACK VALUE TEST2");
	// stackVisualizer.push("STACK VALUE TEST1");
	// p = stackVisualizer.pop();
	// p = stackVisualizer.pop();
	// p = stackVisualizer.pop();
	// p = stackVisualizer.pop();
	// stackVisualizer.push("STACK VALUE TEST2");
	// stackVisualizer.push("STACK VALUE TEST2");
});