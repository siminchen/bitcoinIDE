//console.log("BITCOIN IDE! YEAH!");

var stackVisualizer;
var scriptDebugger;

/* All javascript manipulation for the page goes in here: */
$( document ).ready(function() {
	/* All javascript manipulation for the page goes in here */

	//$("#stack-visualizer").text(editor.getSession().getValue());

	//stackVisualizer = new StackVisualizer("stack-visualizer");
	// stackVisualizer2 = new StackVisualizer("stack-visualizer", true);
	//stackVisualizer.push("STACK VALUE TEST1");
	//stackVisualizer.push("STACK VALUE TEST2 ");
	//stackVisualizer.push("STACK VALUE TEST3");
	//stackVisualizer.remove(2);
	//stackVisualizer.pop();
	//stackVisualizer.insert("STACK VALUE TEST2", 2);
	//stackVisualizer.push("STACK VALUE TEST2");
	//stackVisualizer.push("STACK VALUE TEST3");
	// stackVisualizer.push("STACK VALUE TEST3");
	//stackVisualizer.insert("STACK VALUE TEST11",4);
	//stackVisualizer.remove(4);
	// stackVisualizer.push("STACK VALUE TEST7");
	// stackVisualizer.insert("STACK VALUE TEST8",4);
	// p = stackVisualizer.pop();
	// stackVisualizer.pop();
	// stackVisualizer.pop();
	// stackVisualizer.push("STACK VALUE TEST9");
	// stackVisualizer.push("STACK VALUE TEST4.5");
	// p = stackVisualizer.remove(6);
	// stackVisualizer.insert("STACK VALUE TEST5", 3);
	// p = stackVisualizer.remove(2);
	// p = stackVisualizer.pop();
	// stackVisualizer.insert("STACK VALUE T", 2);
	// stackVisualizer.insert("STACK VALUE MIDDLE", 3);
	// stackVisualizer.insert("STACK VALUE MIDDLE", 3);
	// stackVisualizer.push("STACK VALUE TEST6");
	// stackVisualizer.pop();
	// stackVisualizer.pop();
	// stackVisualizer.pop();
	// stackVisualizer.pop();
	// stackVisualizer.pop();
	// stackVisualizer.pop();
	// stackVisualizer.pop();

	// stackVisualizer.clear();
	// console.log(stackVisualizer.stack);


	// Attach event listeners to the assemble and disassemble button
	$( "body" ).delegate( "#assemble-button", "click", function() {
		var script = editor.getSession().getValue();
		$(".assembly-content").val(assembleToHex(script));
	});

	$( "body" ).delegate( "#disassemble-button", "click", function() {
		var hex = $(".assembly-content").val();
		editor.getSession().setValue(disassembleFromHex(hex));
	});

	// Attach event listeners to the debugging buttons
	scriptDebugger = new ScriptDebugger();
	$( "body" ).delegate( "#run-button", "click", function() {
		scriptDebugger.runFromBeginning();
	});

	$( "body" ).delegate( "#next-button", "click", function() {
		scriptDebugger.nextStep();
	});

	$( "body" ).delegate( "#continue-button", "click", function() {
		scriptDebugger.continueExecution();
	});

	// Attach event listeners to the toggling between assembly and script
	$( "body" ).delegate( "#editor-tab-assembly", "click", function() {
		if(!$("#editor").hasClass("assembly")) {
			var script = editor.getSession().getValue();
			editor.setValue(assembleToHex(script), -1); //-1 for cursor at start, 1 for end
			$("#editor").addClass("assembly");
			$("#editor").removeClass("script");
		}
	});

	$( "body" ).delegate( "#editor-tab-script", "click", function() {
		if(!$("#editor").hasClass("script")) {
			var hex = editor.getSession().getValue();
			editor.setValue(disassembleFromHex(hex), -1); //-1 for cursor at start, 1 for end
			$("#editor").addClass("script");
			$("#editor").removeClass("assembly");
		}
	});

	//Hide the slider after a delay
	setTimeout(function() {
		$("#stack-visualizer-holder").trigger("mouseout");
	}, 400);
});