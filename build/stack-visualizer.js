var stackAnimationTime = 100;
var stackElementBorderWidth = 1;
var curvedness = 8;
var percentHeightToFallFrom = 0.95;
var percentHeightToFlyUp = 0.95;
var msToWaitForAnim = 100;

var msToWaitBetweenAnimSections = 0;
var msToWaitBeforeQueueing = 0; //setTimeout timer
var msToWaitPerCall = 0; //delay between calls
var callerCount = 0;
var stackID = 'stack-diagram';
var qname = 'stackAnimQueue';

/*
//Have an element with id myQueue
var qname = 'stackAnimQueue';

//Add animation to the queue
$('#myQueue').queue(qname, function(next) {
    $('#t1').animate({
		left: 100
		}, {
		duration: stackAnimationTime, 
     	queue: false, //so other anim queues are independent
        complete: next //THIS IS IMPORTANT FOR ANIMATION
    });
});

//Add variable actions to the queue
$('#myQueue').queue(qname, function(next) {
    console.log("Remove");
    $('#t1').append(stackElement);
    $('#t1').remove();
    $('#myQueue').dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE
});

$('#myQueue').dequeue(qname); //Needed at some point to start the queue sequence

*/

function StackVisualizer (elemID, isHiddenStack) {
    this.name = "Bitcoin Stack Visualizer";
    this.stack = new Array();

    if(isHiddenStack == undefined || !isHiddenStack) {
	    this.parentID = elemID;
	    this.stackID = 'stack-diagram';
	    this.parentElement = $("#"+elemID);
	    this.createStackDiagram();
	    // this.animQueue = $({});
	    this.isHiddenStack = false;
	    // this.dfd = null;
	} else {
		this.isHiddenStack = true;
	}
}

// StackVisualizer.prototype.animToQueue = function(selector, animationprops, callback, concurrentFunc, args, s) {
//     this.animQueue.queue(function(next) {
//     	var oldSelector = selector;
//     	//Execute a function with your animation
//     	if(concurrentFunc !== undefined) {


//     		// if(s.waitForAnims(selector, oldSelector, animationprops, callback, concurrentFunc,
//     		// 		function(selector, oldSelector, animationprops, callback, concurrentFunc) {


//     		// Do the animation after the concurrent function completes
//     		$.when( newSelector = concurrentFunc(args) ).done(function() {
// 			// $.when( s.waitForAnimsOrExecute(selector, oldSelector, animationprops, callback, concurrentFunc, function() {
// 			// 		newSelector = concurrentFunc(args);
// 			// 	})    
// 			// ).done(function(newSelector) {

//     			console.log("Animating for " + selector + " => " + $(selector).text());
//     			console.log(" ");
//     			// Get the updated selector at this time
//     			// var oldSelector = selector;
//     			if(newSelector != undefined)
//     			{
//     				selector = newSelector;
//     			}

//     			if(s.waitForAnimsOrDie(selector, oldSelector, animationprops, callback, concurrentFunc,
//     				function(selector, oldSelector, animationprops, callback, concurrentFunc) {
//     					$(oldSelector).animate(animationprops, stackAnimationTime, next).promise().done(callback);
//     				})
//     			) {
//     				//waited and done
//     			} else {
//     				$(selector).animate(animationprops, stackAnimationTime, next).promise().done(callback);
//     			}

//     			//If something is currently animating, then WAIT! You're behind!
// 			});


//     	} else {
//     		console.log("Animating for " + selector + " : " + $(selector).text());
//     		console.log(" ");
// 	        $(selector).animate(animationprops, stackAnimationTime, next).promise().done(callback);
// 	    }
//     });
// };

// StackVisualizer.prototype.waitForAnimsOrDie = function(selector, oldSelector, animationprops, callback, concurrentFunc, func) {
//     //If something is currently animating, then WAIT! You're behind!
// 	var children = $('#' + this.stackID).children();
// 	if(children.not(':animated').length == children.length) {
// 		var checkExist = setInterval(function() {
// 			// if(!$(selector).is(':animated')) {
// 			var children = $('#' + this.stackID).children();
// 			if(children.not(':animated').length == children.length) {
// 				clearInterval(checkExist);
// 				//Call the waiting function
// 				func(selector, oldSelector, animationprops, callback, concurrentFunc);
// 			}
// 		}, msToWaitForAnim);
// 		return true;
		
// 	} else {
// 		//Nothing currently animating. Animate this element
//        	// func(selector, oldSelector, animationprops, callback, concurrentFunc);
//        	return false;
//    }
// };

// StackVisualizer.prototype.waitForAnimsOrExecute = function(selector, oldSelector, animationprops, callback, concurrentFunc, func) {
//     //If something is currently animating, then WAIT! You're behind!
// 	var children = $('#' + this.stackID).children();
// 	if(children.not(':animated').length == children.length) {
// 		var checkExist = setInterval(function() {
// 			// if(!$(selector).is(':animated')) {
// 			var children = $('#' + this.stackID).children();
// 			if(children.not(':animated').length == children.length) {
// 				clearInterval(checkExist);
// 				//Call the waiting function
// 				func(selector, oldSelector, animationprops, callback, concurrentFunc);
// 			}
// 		}, msToWaitForAnim);
// 		// return true;
		
// 	} else {
// 		//Nothing currently animating. Animate this element
//        	// func(selector, oldSelector, animationprops, callback, concurrentFunc);
//        	// return false;
//        	func(selector, oldSelector, animationprops, callback, concurrentFunc);
//    }
// };

StackVisualizer.prototype.getInfo = function() {
    return this.name;
};


StackVisualizer.prototype.createStackDiagram = function() {
    console.log("Creating new stack diagram...");

    // console.log(this.parentElement.children());
    this.parentElement.children().remove();

    this.parentElement.css({
    	'position' : 'relative',
    	'display' : 'table',
    	'height' : '90%',
    	'width' : '80%',
    	'margin' : '0 auto',

		'margin-top' : '2%',
    	//'overflow' : 'scroll'
    });

    var stackDiv = $('<div/>', {
	    id: this.stackID
	});

	stackDiv.css({
		'height' : '100%',
		'display' : 'table-cell', //for IE8+
		'margin' : '0 auto',
		'position' : 'relative',
		'vertical-align' :'bottom',
		'overflow-y' : 'hidden',
		'background-color' : 'white',
		
		//border
		'border-style' : 'double',
		'border-color' : 'gray',
		'border-width' : '0px 5px 5px 5px',

		'-moz-border-radius-bottomright' : curvedness + 'px',
		'border-bottom-right-radius' : curvedness + 'px',
		'-moz-border-radius-bottomleft' : curvedness + 'px',
		'border-bottom-left-radius' : curvedness + 'px'
	});

	stackDiv.appendTo(this.parentElement);
	this.stackDiagram = stackDiv;
};

StackVisualizer.prototype.createStackElement = function(value) {
    var stackElement = $('<div/>', {
	    text: value
	});

	stackElement.css({
		'height' : '10%',
		'width' : '100%',
		'position' : 'relative',
		'display' : 'table', //for IE8+
		
		'padding' : '5px',
		'color' : 'white',
		'text-align' : 'center',
		'bottom' : '0',
		'background-color' : '#E89A2C',

		'border-style' : 'groove',
		'border-color' : 'white',
		'border-width' : stackElementBorderWidth+'px',

		'-moz-border-radius' : curvedness+'px',
		'border-radius' : curvedness+'px'
	});

	return stackElement;
};


StackVisualizer.prototype.pushElementOnDiagram = function(stackElement) {
	var heightToFallFrom = this.getStackRemainingHeight()*percentHeightToFallFrom;
	var stackSelector = '#' + this.stackID;

	//Set starting state and then animation
	stackElement.css({
		'opacity' : '0.0',
		'margin' : '0',
		'bottom' : heightToFallFrom
	});

	// this.animToQueue(stackElement, {
	// 	opacity: 1.0,
	// 	'bottom' : '0px'
	// }, function(){
	// 	//animation complete
	// }, function(s) {
	// 	//concurrent
	// 	$(stackSelector).prepend(stackElement);
	// 	s.top = stackElement;
	// }, this, this);
	var thisStack = this;
	setTimeout(function() {
		//Concurrent
		$('#'+thisStack.stackID).queue(qname, function(next) {
		    $(stackSelector).prepend(stackElement);
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE
		    // console.log("Concurrent for PUSH done.");
		    //filler animation
		    $(stackElement).animate({
					'bottom' : heightToFallFrom
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    console.log("(1/2)Concurrent for PUSH done.");
		}).queue(qname, function(next) {
		    $(stackElement).animate({
					opacity: 1.0,
					'bottom' : '0px'
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		     console.log("(2/2)Animation for PUSH done.");
		});

		// $('#'+this.stackID).dequeue(qname); //start the queue sequence
		thisStack.dequeueIfNotAnimating();

	}, msToWaitBeforeQueueing+msToWaitBetweenAnimSections);

	// this.dequeueIfNotAnimating();
};

StackVisualizer.prototype.popElementFromDiagram = function() {
	poppedSelector = '#' + this.stackID + ' :first-child';

	var heightToFlyTo = this.getStackRemainingHeight()*percentHeightToFlyUp;

	var top = this.top;

	// this.animToQueue(poppedSelector, {
	// 	opacity: 0.0,
	// 	'bottom' : heightToFlyTo+'px'
	// }, function() {
	// 	//animation complete
	// 	$(this).remove();
	// }, function(s) {
	// 	//concurrent
	// 	var poppedTop = s.top;
	// 	s.top = $(s.top).next();
	// 	return poppedTop;
	// }, this, this);

	//Concurrent
	// $('#'+this.stackID).queue(qname, function(next) {
	//     $(stackSelector).prepend(stackElement);
	//     // this.top = stackElement;
	//     $('#'+stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE
	//     console.log("Prepending for PUSH done.");
	//      console.log(this);
	// });

	var thisStack = this;
	setTimeout(function() {
		//Animation
		$('#'+thisStack.stackID).queue(qname, function(next) {
		    $(poppedSelector).animate({
					opacity: 0.0,
					'bottom' : heightToFlyTo+'px'
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    console.log("(1/2)Animation for POP done.");
		    //thisStack.dequeueIfNotAnimating();
		}).queue(qname, function(next) {
		    
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE

			//filler animation
		    $(poppedSelector).animate({
					opacity: 1.0,
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    $(poppedSelector).remove();

		    console.log("(2/2)After for POP done.");
		});

		thisStack.dequeueIfNotAnimating();
	}, msToWaitBeforeQueueing+msToWaitBetweenAnimSections);

	// this.dequeueIfNotAnimating();
};

//1-indexed from top
StackVisualizer.prototype.removeElementFromDiagram = function(idx) {
	if(idx == 1) { //removing top element
		this.popElementFromDiagram();
		return;
	} 
	// popped = $('#' + this.stackID + ' :nth-child(' + idx + ')');

	var heightToFlyTo = this.getStackRemainingHeight()*percentHeightToFlyUp;

	poppedSelector = '#' + this.stackID + ' :nth-child(' + idx + ')';
	// this.animToQueue(poppedSelector, {
	// 	'opacity' : '0.0',
	// 	'bottom' : heightToFlyTo+'px'
	// }, function() {
	// 	//animation complete
	// 	$(this).animate({
	// 		"height": "toggle",
	// 		'font-size': '0',
	// 	}, stackAnimationTime, function(){
	// 		$(this).remove();
	// 	});
	// }, function(s){
	// 	//concurrent function
	// 	//get nth sibling of the current top
	// 	//return sibling
	// 	var elementsPrecedingTop = s.top.prevAll().length;
	// 	var futureIdx = idx + elementsPrecedingTop;
	// 	// var newSelector = '#' + s.stackID + ' :nth-child(' + futureIdx + ')';

	// 	var newSelector = $(s.top).nextAll().eq(idx-2);
	// 	$(newSelector).css({
	// 		padding: "0"
	// 	});
	// 	return newSelector;
	// }, this, this);

	var thisStack = this;
	setTimeout(function() {

		//Concurrent
		$('#'+thisStack.stackID).queue(qname, function(next) {
		    $(poppedSelector).css({
				padding: "0"
			});
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE

			//filler animation
		    $(poppedSelector).animate({
					opacity: 1.0,
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    console.log("(1/4)Concurrent for REMOVE done.");
		}).queue(qname, function(next) {
		    $(poppedSelector).animate({
					'opacity' : '0.0',
					'bottom' : heightToFlyTo+'px' //var heightToFlyTo = this.getStackRemainingHeight()*percentHeightToFlyUp;
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    console.log("(2/4)Animation #1 for REMOVE done.");
		}).queue(qname, function(next) {
		    $(poppedSelector).animate({
					"height": "toggle",
					'font-size': '0',
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    console.log("(3/4)Animation #2 for REMOVE done.");
		}).queue(qname, function(next) {
		    
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE

		    //filler animation
		    $(poppedSelector).animate({
					opacity: 1.0,
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    $(poppedSelector).remove();

		    console.log("(4/4)After for REMOVE done.");
		});

		thisStack.dequeueIfNotAnimating();

	}, msToWaitBeforeQueueing+ 1*msToWaitBetweenAnimSections);	
};

//1-indexed from top
StackVisualizer.prototype.insertElementInDiagram = function(stackElement, idx) {

	if(idx == 1) { //inserting new top element
		this.pushElementOnDiagram(stackElement);
		return;
	} 
	// else {
	var heightToFallFrom = this.getStackRemainingHeight()*percentHeightToFallFrom;
	// 	var padding = this.top.css("padding");

	//Set starting state and then animation
	stackElement.css({
		'opacity' : '0.0',
		'margin' : '0',
		'bottom' : heightToFallFrom,
		'padding' : '0',
		'font-size' : '0',
		'height' : '0'
	});

	// 	//Append element
	// 	// var appendSelector = '#' + this.stackID + ' :nth-child(' + (idx-1) + ')';
		
	// 	this.animToQueue(stackElement, {
	// 		"height": "10%",
	// 		'font-size' : '100%',
	// 		// 'opacity' : '1.0',
	// 		// 'bottom' : '0px',
	// 		'padding' : padding
	// 	}, function() {
	// 		//when this animation is done
	// 		$(this).animate({
	// 			'opacity' : '1.0',
	// 			'bottom' : '0px',
	// 		}, stackAnimationTime);
	// 	}, function(s) {
	// 		// Append element
	// 		var appendSelector = '#' + s.stackID + ' :nth-child(' + (idx-1) + ')';
			
	// 		// exit();
	// 		//If something is currently animating, then WAIT! You're behind!
	// 		var children = $('#' + s.stackID).children();
	// 		if(children.not(':animated').length != children.length) {
	// 			var checkExist = setInterval(function() {
	// 				console.log("Animation wait for insert!");
	// 				// if(!$(selector).is(':animated')) {
	// 				var children = $('#' + s.stackID).children();
	// 				if(children.not(':animated').length == children.length) {
	// 					clearInterval(checkExist);
	// 					//Call the waiting function
	// 					//func(selector, oldSelector, animationprops, callback, concurrentFunc);
	// 					$(appendSelector).after(stackElement);

	// 					console.log("Animation wait DONE for insert2 for " + $(stackElement).text() + "! Target: ");
	// 					console.log(appendSelector);
	// 				}
	// 			}, msToWaitForAnim);
	// 			// return true;
				
	// 		} else {
	// 			$(appendSelector).after(stackElement);
	// 			console.log("Nothing anim for insert" +  $(stackElement).text() + ". Target:");
	// 			console.log(appendSelector);
	// 		}

	// 		console.log("End of insert concurrent call for " + $(stackElement).text());

	// 		// $(appendSelector).after(stackElement);

	// 		return $(appendSelector);
	// 	}, this, this);
	// }

	var children = $('#'+this.stackID).children();
	var padding = '5px'; //default?
	if(children.length > 0) //there are children elements in the stack
		padding = $('#'+this.stackID+' :nth-child(1)').css("padding");
	var appendSelector = '#' + this.stackID + ' :nth-child(' + (idx-1) + ')';
	var thisStack = this;
	setTimeout(function() {


		//Concurrent
		$('#'+thisStack.stackID).queue(qname, function(next) {
		    $(appendSelector).after(stackElement);
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE
			$(stackElement).animate({
					'opacity' : '0.0'
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    console.log("(1/3)Concurrent for INSERT done.");
		}).queue(qname, function(next) {
		    $(stackElement).animate({
					"height": "10%",
					'font-size' : '100%',
					// 'opacity' : '1.0',
					// 'bottom' : '0px',
					'padding' : padding
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    console.log("(2/3)Animation #1 for INSERT done.");
		}).queue(qname, function(next) {
		    $(stackElement).animate({
					'opacity' : '1.0',
					'bottom' : '0px',
				}, {
					duration: stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    console.log("(3/3)Animation #2 for INSERT done.");
		});

		thisStack.dequeueIfNotAnimating();

	}, msToWaitBeforeQueueing+ 1*msToWaitBetweenAnimSections);
};

StackVisualizer.prototype.consistentSize = function() {
	//Is the visual consistent with the actual stack data?
	var sizeVisualStack = $('#' + this.stackID + ' > *').length;
	return this.size() == sizeVisualStack;
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

StackVisualizer.prototype.size = function() {
	return this.stack.length;
};

//1-indexed from the top of the stack
StackVisualizer.prototype.peek = function(idx) {

	if(idx === undefined) {
		if(this.size() <= 0) {
			console.error("WARNING: peek() called with empty stack.");
		} else {
			return this.stack[this.size()-1];
		}
	} else {
		if(this.size()-idx < 0 || this.size()-idx >= this.size()) {
			console.error("WARNING: Index out of bounds: peek(" + idx + ") called with stack size " + this.size() + ".");
		} else {
			return this.stack[this.size()-idx];
		}
	}
};

StackVisualizer.prototype.push = function(value) {
	console.log('callerCount: ' + callerCount);
	var thisStack = this;
	if(!this.isHiddenStack) {
		setTimeout(function() {
			thisStack.pushElementOnDiagram(thisStack.createStackElement(value));
		}, msToWaitPerCall*(callerCount++));
	}
	this.stack.push(value);
};

StackVisualizer.prototype.pop = function() {
	console.log('callerCount: ' + callerCount);
	if(this.numStackElements() == 0) {
		console.error("WARNING: Stack underflow! Attempted to pop empty stack.");
		return;
	}

	var thisStack = this;
	if(!this.isHiddenStack) {
		setTimeout(function() {
			thisStack.popElementFromDiagram();
		}, msToWaitPerCall*(callerCount++));
	}
    return this.stack.pop();
};

//1-indexed from the top of the stack
StackVisualizer.prototype.remove = function(idx) {
	console.log('callerCount: ' + callerCount);
	var arrayIndex = this.size() - idx;
	if(arrayIndex < 0 || arrayIndex >= this.size()) {
		console.error("WARNING: Index out of bounds: remove(" + idx + ") called with stack size " + this.size() + ".");
	} else {

		var thisStack = this;
		if(!this.isHiddenStack){
			setTimeout(function() {
				thisStack.removeElementFromDiagram(idx);
			}, msToWaitPerCall*(callerCount++));
		}

		return this.stack.splice(arrayIndex, 1)[0];
	}
};

//1-indexed from the top of the stack
StackVisualizer.prototype.insert = function(value, idx) {
	//insert(val, 1) goes on the top of the stack
	//insert(val, 2) goes under the current top element
	var arrayIndex = this.size() - idx;
	// console.log("Array index: " + arrayIndex);
	if(idx <= 0 || idx > this.size()+1) {
		console.error("WARNING: Index out of bounds: insert(" + value + "," + idx + ") called with stack size " + this.size() + ".");
	} else {
		this.stack.splice(arrayIndex+1, 0, value);

		var thisStack = this;
		if(!this.isHiddenStack) {
			setTimeout(function() {
				thisStack.insertElementInDiagram(thisStack.createStackElement(value), idx);
			}, msToWaitPerCall*(callerCount++));
		}
	}
};

StackVisualizer.prototype.visualizationMatchesStack = function() {
	if(!this.consistentSize())
		return false;

	var i = 0;
	var thisStack = this;
	$($('#' + this.stackID).children().get().reverse()).each(function() {
		if(thisStack.stack[i] != $(this).text()) {
			return false;
		}
	});

	return true;

}

StackVisualizer.prototype.clear = function() {
    this.stack = new Array();

    if(!this.isHiddenStack) {
	    // this.animQueue.clearQueue();
	    //Clear the queue
		$('#'+this.stackID).clearQueue(qname);

	    var stackElements = $('#' + this.stackID).children();
	    var heightToFlyTo = this.getStackRemainingHeight()*percentHeightToFlyUp;

	    //Pop all at once and remove
	    $(stackElements).animate({
			'opacity' : '0.0',
			'bottom' : heightToFlyTo+'px'
	    }, stackAnimationTime, function(){
	    	stackElements.remove();
	    });
	    
	}

};

StackVisualizer.prototype.dequeueIfNotAnimating = function() {
	callerCount = 0;
	if(!this.isAnimating()) {
		$('#'+this.stackID).dequeue(qname);
	}
};

StackVisualizer.prototype.isAnimating = function() {
	var numAnimatingElements =  $('#' + this.stackID).children().filter(":animated").length;
	//console.log(animatingElements);
	//console.log(animatingElements.length + " animating elements")
	if(numAnimatingElements > 0) {
		console.log("ANIMATING");
		return true;
	} else {
		console.log("NOT animating");
		return false;
	}
};