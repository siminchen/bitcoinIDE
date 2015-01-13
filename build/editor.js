//console.log("BITCOIN IDE! YEAH!");

var stackVisualizer;
var scriptDebugger;

/* All javascript manipulation for the page goes in here: */
$( document ).ready(function() {
	/* All javascript manipulation for the page goes in here */

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

	// If the user changes the code, initialize the stack the next time they step or run.
	editor.on("change", function() {
		scriptDebugger.needToInitialize = true;

		var script = editor.getSession().getValue();
		// Split the script based on space characters
		scriptDebugger.commands = script.trim().split(/\s+/);
		scriptDebugger.index = 0; // The current index in the commands array to execute    
		// Display the next opcode to execute
		$( "#next-opcode-container" ).text(scriptDebugger.commands[scriptDebugger.index]);
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

	$("#editor-section").on("mouseover", function() {
		// console.log("READ");
		$("#editor-section-title-tip").stop(true);
		$("#editor-section-title-tip").fadeOut(200);
	}).on("mouseout", function() {
		// console.log("READ");
		$("#editor-section-title-tip").stop(true);
		$("#editor-section-title-tip").fadeIn(200);
	});

	$("#stack-visualizer-section").on("mouseover", function() {
		// console.log("READ");
		$("#stack-section-title-tip").stop(true);
		$("#stack-section-title-tip").fadeOut(200);
	}).on("mouseout", function() {
		// console.log("READ");
		$("#stack-section-title-tip").stop(true);
		$("#stack-section-title-tip").fadeIn(200);
	});

	$("#executor-section").on("mouseover", function() {
		// console.log("READ");
		$("#debugger-section-title-tip").stop(true);
		$("#debugger-section-title-tip").fadeOut(200);
	}).on("mouseout", function() {
		// console.log("READ");
		$("#debugger-section-title-tip").stop(true);
		$("#debugger-section-title-tip").fadeIn(200);
	});

	//Hide the slider after a delay
	setTimeout(function() {
		$("#stack-visualizer-holder").trigger("mouseout");
	}, 400);

	//When window is resized, recalculate size of section panes
	$( window ).resize(resizeSections);

	//Resize section panes
	resizeSections();
});


var resizeSections = function() {
	// console.log("READY!");
	var totalHeight = $("body").height();
	var navbarHeight = $("nav.navbar").outerHeight(true);
	var topPanelHeight = $("#top-panel").outerHeight(true);
	var middlePanelHeight = $("#middle-panel").outerHeight(true);
	// console.log(navbarHeight);
	// console.log(topPanelHeight);
	// console.log(middlePanelHeight);

	var areaUnderNav = totalHeight - navbarHeight;
	$("#top-panel").css("height", areaUnderNav*0.70);
	$("#middle-panel").css("height", areaUnderNav*0.30);
};
