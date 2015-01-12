function interpreter () {
	this.code_separator_index = 0;
}

// Make sure that control flow in the script is logical (i.e. every IF
// has an ENDIF, every ELSE has a matching IF, etc.). Implement using
// a recursive algorithm that, for a given IF, searches for the matching
// ENDIF. Along the way, it marks all ELSEs, IFs, and ENDIFs in another
// array, and uses this logic to decide if a Script is invalid.
interpreter.prototype.validateScript = function (script) {
	var tracker = new Array(script.length);

	for (var i = 0; i < script.length; i++) {
		if (script[i] === "OP_IF") {
			// if you've already seen this IF due to recursion, ignore.
			if (tracker[i] == null || tracker[i] !== "OP_IF")
			{
				tracker[i] = "OP_IF";

				// if the search fails somehow, fail the script
				if (this.search(script, tracker, i + 1) === false) return false;
			}
			
			else continue;
		}

		// Since all valid ELSEs have to come after IFs, all valid
		// ELSEs should be found and marked in the tracker array
		// through the search() method. Thus if you come across an ELSE 
		// that hasn't been marked, it must be invalid.
		else if (script[i] === "OP_ELSE") {
			if (tracker[i] == null || tracker[i] !== "OP_ELSE") return false;
		}

		// Since all valid ENDIFs have to come after IFs, then all valid
		// ENDIFs should be found and marked in the tracker array
		// through the search() method. Thus if you come across an ENDIFs 
		// that hasn't been marked, it must be invalid.
		else if (script[i] === "OP_ENDIF") {
			if (tracker[i] == null || tracker[i] !== "OP_ENDIF") return false;
		}

		// These opcodes are not allowed
		else if (script[i] == "OP_VERIF" || script[i] == "OP_VERNOTIF") return false;
	}

	return true;
}

// Search for the ENDIF corresponding to the IF at script[if_index].
// Along the way, mark all ELSEs. Recurse if another IF is found.
// Mark the ENDIF once it is found.
interpreter.prototype.search = function (script, tracker, if_index) {
	var seenElse = false;
	for (var i = if_index; i < script.length; i++) {
		if (script[i] === "OP_ELSE") {
			// if you've already seen an ELSE in this function, and you
			// come across another unmarked ELSE, then the script must
			// be lacking an ENDIF (e.g. IF ELSE ELSE)
			if (seenElse === true && tracker[i] == null) return false;

			// if you come across an ELSE and you haven't seen one yet
			// then set the flag, and mark it in the tracker array
			if (tracker[i] == null) {
				tracker[i] = "OP_ELSE";
				seenElse = true;
			}
		}

		else if (script[i] === "OP_ENDIF") {

			// if you've already seen this ENDIF through some other recursion
			// then ignore. Otherwise, return true and mark it in the tracker.
			if (tracker[i] != null && tracker[i] === "OP_ENDIF") continue;
			tracker[i] = "OP_ENDIF";
			return true;
		}

		else if (script[i] === "OP_IF") {

			// if you've already seen this IF through recursion, ignore.
			// otherwise, recurse.
			if (tracker[i] != null && tracker[i] === "OP_IF") continue;
			tracker[i] = "OP_IF";
			if (this.search(script, tracker, i) === false) return false;;
		}
	}

	return false;
}

// Given the main stack, the alternate stack, the script array, and the index
// of the current command within the script array, execute the current command
// and return the index of the next command. Return -1 if the script is invalid.
interpreter.prototype.nextStep = function (mainstack, altstack, script, index) {
    var current_command = script[index].toUpperCase();
	switch (current_command) {
		case "OP_0":
		case "OP_FALSE":
			mainstack.push("");
			break;
		case "OP_1NEGATE":
			mainstack.push(-1);
			break;
		case "OP_1":
		case "OP_TRUE":
			mainstack.push(1);
			break;
		case "OP_2":
			mainstack.push(2);
			break;
		case "OP_3":
			mainstack.push(3);
			break;
		case "OP_4":
			mainstack.push(4);
			break;
		case "OP_5":
			mainstack.push(5);
			break;
		case "OP_6":
			mainstack.push(6);
			break;
		case "OP_7":
			mainstack.push(7);
			break;
		case "OP_8":
			mainstack.push(8);
			break;
		case "OP_9":
			mainstack.push(9);
			break;
		case "OP_10":
			mainstack.push(10);
			break;
		case "OP_11":
			mainstack.push(11);
			break;
		case "OP_12":
			mainstack.push(12);
			break;
		case "OP_13":
			mainstack.push(13);
			break;
		case "OP_14":
			mainstack.push(14);
			break;
		case "OP_15":
			mainstack.push(15);
			break;
		case "OP_16":
			mainstack.push(16);
			break;

		/* Flow control */
		case "OP_NOP":
		case "OP_NOP1":
		case "OP_NOP2":
      	case "OP_NOP3":
		case "OP_NOP4":
		case "OP_NOP5":
		case "OP_NOP6":
		case "OP_NOP7":
		case "OP_NOP8":
		case "OP_NOP9":
		case "OP_NOP10":
			break;
		case "OP_IF":
			var top = mainstack.pop();
			if (top == null) return -1;
			// if the top value is 0, don't execute this branch
			if (top == 0)
			{
				// find the appropriate ELSE/ENDIF to jump to
				for (var j = index; j < script.length; j++) {
					// if the OP_IF condition is false and there is an OP_ELSE
					// execute the opcodes right after the OP_ELSE
					if (script[j + 1] === "OP_ELSE")
						return j + 2;

					// otherwise jump to the ENDIF
					else if (script[j + 1] === "OP_ENDIF")
						return j + 1;
				}	
			}

			break;
		// the only way you reach an OP_ELSE is if the OP_IF conditional 
		// was true and all the opcodes following it were executed, so 
		// everything within the OP_ELSE and OP_ENDIF can be ignored 
		case "OP_ELSE":
			for (var j = index; j < script.length; j++) {
				// if the if condition is false and there is an else
				// execute the opcodes right after the OP_ELSE
				if (script[j + 1] === "OP_ENDIF")
					return j + 1;
			}	
		case "OP_NOTIF":
			var top = mainstack.pop();
			if (top == null) return -1;
			// if the top value isn't 0, don't execute this branch
			if (top != 0)
			{
				for (var j = index; j < script.length; j++) {
					// if the OP_IF condition is false and there is an OP_ELSE
					// execute the opcodes right after the OP_ELSE
					if (script[j + 1] === "OP_ELSE")
						return j + 2;

					else if (script[j + 1] === "OP_ENDIF")
						return j + 1;
				}	
			}

			break;
		case "OP_ENDIF":
			break;
		case "OP_VERIFY":
			var top = mainstack.pop();
			if (top == null) return -1;
			if (top == 0)
				return -1;
			break;
		case "OP_RETURN":
			return -1;
			break;

		/* Stack ops */
		case "OP_TOALTSTACK":
			var top = mainstack.pop();
			if (top == null) return -1;
			altstack.push(top);
			break;
		case "OP_FROMALTSTACK":
			var top = altstack.pop();
			if (top == null) return -1;
			mainstack.push(top);
			break;
		case "OP_IFDUP":
			var top = mainstack.pop();
			if (top == null) return -1;
			if (top != 0) 
				mainstack.push(top);
			maintack.push(top);
			break;
		case "OP_DEPTH":
			mainstack.push(mainstack.size());
			break;
		case "OP_DROP":
			if (mainstack.pop() == null) return -1;
			break;
		case "OP_DUP":
			var toPeek = mainstack.peek(1);
			if (toPeek == null) return -1;
			mainstack.push(toPeek);
			break;
		case "OP_NIP":
			if (mainstack.remove(2) == null) return -1;
			break;
		case "OP_OVER":
			var top = mainstack.peek(2);
			if (top == null) return -1;
			mainstack.push(top);
			break;
		case "OP_PICK":
			var n = mainstack.pop();
			if (n == null) return -1;
			var top = mainstack.peek(n);
			if (top == null) return -1;
			mainstack.push(top);
			break;
		case "OP_ROLL":
			var n = mainstack.pop();
			if (n == null) return -1;
			var top = mainstack.remove(n);
			if (top == null) return -1;
			mainstack.push(top);
			break;
		case "OP_ROT":
			var top = mainstack.remove(3);
			if (top == null) return -1;
			mainstack.push(top);
			break;
		case "OP_SWAP":
			var top = mainstack.remove(2);
			if (top == null) return -1;
			mainstack.push(top);
			break;
		case "OP_TUCK":
			var top = mainstack.peek(1);
			if (top == null) return -1;
			mainstack.insert(top, 3);
			break;
		case "OP_2DROP":
			if (mainstack.pop() == null) return -1;
			if (mainstack.pop() == null) return -1;
			break;
		case "OP_2DUP":
			var second = mainstack.peek(2);
			if (second == null) return -1;
			var top = mainstack.peek(1);
			if (top == null) return -1;
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_3DUP":
			var third = mainstack.peek(3);
			if (third == null) return -1;
			var second = mainstack.peek(2);
			if (second == null) return -1;
			var top = mainstack.peek(1);
			if (top == null) return -1;
			mainstack.push(third);
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_2OVER":
			var second = mainstack.peek(4);
			if (second == null) return -1;
			var top = mainstack.peek(3);
			if (top == null) return -1;
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_2ROT":
			var second = mainstack.remove(6);
			if (second == null) return -1;
			var top = mainstack.remove(5);
			if (top == null) return -1;
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_2SWAP":
		    var second = mainstack.remove(4);
		    if (second == null) return -1;
			var top = mainstack.remove(3);
			if (top == null) return -1;
			mainstack.push(second);
			mainstack.push(top);
			break;

		/* Splice */
		case "OP_SIZE":
			var size = mainstack.peek(1)
			if (size == null) return -1;
			size = size.length();
			mainstack.push(size);
			break;

		/* Bitwise logic*/
		case "OP_EQUAL":
			var first = mainstack.peek(1);
			if (first == null) return -1;
			var second = mainstack.peek(2);
			if (second == null) return -1;
			if (first === second)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;

		case "OP_EQUALVERIFY":
			var first = mainstack.peek(1);
			if (first == null) return -1;
			var second = mainstack.peek(2);
			if (second == null) return -1;
			if (first === second)
				mainstack.push(1);
			else
				mainstack.push(0);

			if (mainstack.pop() === 0)
				return -1;
			break;

		/* Arithmetic ops */
		case "OP_1ADD":
			var top = mainstack.pop();
			if (top == null) return -1;
			mainstack.push(top + 1);
			break;
		case "OP_1SUB":
			var top = mainstack.pop()
			if (top == null) return -1;
			mainstack.push(top - 1);
			break;
		case "OP_2MUL":
			var top = mainstack.pop()
			if (top == null) return -1;
			mainstack.push(top * 2);
			break;
		case "OP_2DIV":
			var top = mainstack.pop()
			if (top == null) return -1;
			mainstack.push(top / 2);
			break;
		case "OP_NEGATE":
			var top = mainstack.pop()
			if (top == null) return -1;
			mainstack.push(top * -1);
			break;
		case "OP_ABS":
			var top = mainstack.pop();
			if (top == null) return -1;
			if (top >= 0)
				mainstack.push(top);
			else
				mainstack.pop(top * -1);
			break;
		case "OP_NOT":
			var top = mainstack.pop();
			if (top == null) return -1;
			if (top === 0)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_0NOTEQUAL":
			var top = mainstack.pop();
			if (top == null) return -1;
			if (top === 0)
				mainstack.push(0);
			else
				mainstack.push(1);
			break;
		case "OP_ADD":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(top + second);
			break;
		case "OP_SUB":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(second - top);
			break;
		case "OP_MUL":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(top * second);
			break;
		case "OP_DIV":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(second / top);
			break;
		case "OP_MOD":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(second % top);
			break;
		case "OP_LSHIFT":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(second << top);
			break;
		case "OP_RSHIFT":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(second >> top);
			break;
		case "OP_BOOLAND":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (top !== 0 && second !== 0)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_BOOLOR":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (top !== 0 || second !== 0)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_NUMEQUAL":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (top === second) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_NUMEQUALVERIFY":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (top === second) 
				mainstack.push(1);
			else
				mainstack.push(0);

			if (mainstack.pop() === 0)
				return -1;
			break;
		case "OP_NUMNOTEQUAL":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (top === second) 
				mainstack.push(0);
			else
				mainstack.push(1);
			break;
		case "OP_LESSTHAN":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (second < top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_GREATERTHAN":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (second > top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_LESSTHANOREQUAL":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (second <= top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_GREATERTHANOREQUAL":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			if (second >= top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_MIN":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(Math.min(top, second));
			break;
		case "OP_MAX":
			var top = mainstack.pop();
			if (top == null) return -1;
			var second = mainstack.pop();
			if (second == null) return -1;
			mainstack.push(Math.max(top, second));
			break;
		case "OP_WITHIN":
			var top = mainstack.pop();
			if (top == null) return -1;
			var max = mainstack.pop();
			if (max == null) return -1;
			var min = mainstack.pop();
			if (min == null) return -1;

			if (top < max && top >= min)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;

		/* Crypto ops */
		case "OP_RIPEMD160":
			var top = mainstack.pop();
			if (top == null) return -1;
			mainstack.push(ripemd160(top));
			break;
		case "OP_SHA1":
			var top = mainstack.pop();
			if (top == null) return -1;
			mainstack.push(Sha1.hash(top));
			break;
		case "OP_SHA256":
			var top = mainstack.pop();
			if (top == null) return -1;
			mainstack.push(Sha256.hash(top));
			break;
		case "OP_HASH160":
			var top = mainstack.pop();
			if (top == null) return -1;
			mainstack.push(Sha256.hash(top));
			mainstack.push(ripemd160(top));
			break;
		case "OP_HASH256":
			var top = mainstack.pop();
			if (top == null) return -1;
			mainstack.push(Sha256.hash(top));
			mainstack.push(Sha256.hash(top));
			break;
		case "OP_CODESEPARATOR":
			code_separator_index = index;
			break;
		case "OP_CHECKSIG":
			//var pubKey = mainstack.pop();
			//var sig = mainstack.pop();

			//var sub_script = new Array();
			//for (var i = code_separator_index; i < script.length; i++) {
			//	if (script[i] !== sig) sub_script.push(script[i]);
			//}
			mainstack.push(1);
			break;
		// see https://en.bitcoin.it/wiki/OP_CHECKSIG
		// use secp256k1 elliptic curve for signature verification
		case "OP_CHECKSIGVERIFY":
			mainstack.push(1);
			mainstack.pop();
			break;
		case "OP_CHECKMULTISIG":
			mainstack.push(1);
			break;
		case "OP_CHECKMULTISIGVERIFY":
			mainstack.push(1);
			mainstack.pop();
			break;

		/* Pseudowords -- invalid if used in actual script */
		case "OP_PUBKEYHASH":
		case "OP_PUBKEY":
		case "OP_INVALIDOPCODE":
			return -1;
			break;

		/* Reserved words */
		case "OP_RESERVED":
		case "OP_VER":
		case "OP_RESERVED1":
		case "OP_RESERVED2":
			// fail if these are ever seen
				return -1;
		/* TODO: Preprocess script for these opcodes. If they are seen, fail automatically.
		case "OP_VERIF":
		case "OP_VERNOTIF":
			return -1;
			break; */

		// Assume anything that is not an opcode is a hex literal to be pushed onto the stack
		default:
			// check for valid hex
			var val = current_command.search(/[A-Fa-f0-9]+/);
			if (val == -1) break;
			val = current_command.match(/[A-Fa-f0-9]+/);
			val = parseInt(val, 16);
			mainstack.push(val);
			break;
	}

	// signal success by returning -2
	if (index + 1 == script.length) {
	    return -2;
	}

	// in the general case, the index of the next command to be executed is the next command
	// in the script.
	return index + 1;
}
