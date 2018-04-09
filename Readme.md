Bitcoin Script IDE
============================

A Bitcoin Script IDE to facilitate the learning, testing, and teaching of Bitcoin Script.

Features
--------

* Syntax highlighting
* Auto-complete
* Translation to and from assembly
* Stack visualizer
* Step-by-step debugger

Try it out!
--------------------
1. Open up IDE in https://siminchen.github.io/bitcoinIDE/
2. In the **Script pane**, type in some script code:
  * ex. 1  2  OP_ADD
  * ex. 123  OP_HASH256
  * ex. 1  OP_IF  2  OP_ELSE  3  OP_ENDIF
3. View the equivalent assembly code by clicking the **Assembly tab**
4. To execute the script, return to the Script tab and hit the **Run** button on the bottom to run the code
5. Note the stack operations in the **Stack pane** on the right.
6. To process the script one command at a time, hit the **Step** button on the bottom
7. Note the stack operations
8. Note the text box on the bottom that shows the next command
9. To process the remainder of the commands, hit the **Continue** button on the bottom
10. If the script was a valid script, then the text box on the bottom will be green and the stack elements will be orange.
11. If the script was invalid, then the text box and the stack elements will be red



