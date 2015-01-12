function interpreter () {
	var top;
	var n;
	var code_separator_index;
}

interpreter.prototype.validateScript = function (script) {
	var tracker = new Array(script.length);

	for (var i = 0; i < script.length; i++) {
		if (script[i] === "OP_IF") {
			if (tracker[i] == null || tracker[i] !== "OP_IF")
			{
				tracker[i] = "OP_IF";
				if (search(script, tracker, i + 1) === false) return false;
			}
			
			else continue;
		}

		else if (command[i] === "OP_ELSE") {
			if (tracker[i] == null || tracker[i] !== "OP_ELSE") return false;
		}

		else if (command[i] === "OP_ENDIF") {
			if (tracker[i] == null || tracker[i] !== "OP_ENDIF") return false;
		}
	}

	return true;
}

interpreter.prototype.search = function (script, tracker, if_index) {
	var seenElse = false;
	for (var i = if_index; i < script.length; i++) {
		if (script[i] === "OP_ELSE") {
			if (seenElse === true && tracker[i] == null) return false;
			if (tracker[i] == null) {
				array_tracker[i] = "OP_ELSE";
				seenElse = true;
			}
		}

		else if (script[i] === "OP_ENDIF") {
			if (tracker[i] != null && tracker[i] === "OP_ENDIF") continue;
			tracker[i] = "OP_ENDIF";
			return true;
		}

		else if (script[i] === "OP_IF") {
			if (tracker[i] != null && tracker[i] === "OP_IF") continue;
			tracker[i] = "OP_IF";
			if (search(script, tracker, i) === false) return false;;
		}
	}

	return false;
}

interpreter.prototype.nextStep = function (mainstack, altstack, script, index) {
	var current_command = script[index].toUpperCase();
	console.log('script ' + script);
	console.log(' index ' + index);
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

		/* flow control */
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
			top = mainstack.pop();
			if (top == 0)
			{
				for (var j = index; j < script.length; j++) {
					// if the if condition is false and there is an else
					// execute the opcodes right after the OP_ELSE
					if (script[j + 1] === "OP_ELSE")
						return j + 2;

					else if (script[j + 1] === "OP_ENDIF")
						return j + 1;
				}	
			}

			break;
		// the only way you reach an OP_ELSE is if the if conditional was true and all the
		// opcodes following it were executed, so everything within the OP_ELSE and OP_ENDIF can be
		// ignored 
		case "OP_ELSE":
			for (var j = index; j < script.length; j++) {
				// if the if condition is false and there is an else
				// execute the opcodes right after the OP_ELSE
				if (script[j + 1] === "OP_ENDIF")
					return j + 1;
			}	
		case "OP_NOTIF":
			top = mainstack.pop();
			if (top != 0)
			{
				for (var j = index; j < script.length; j++) {
					// if the if condition is false and there is an else
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
			top = mainstack.pop();
			if (top == 0)
				return -1;
			break;
		case "OP_RETURN":
			return -1;
			break;

		/* stack */
		case "OP_TOALTSTACK":
			top = mainstack.pop();
			altstack.push(top);
			break;
		case "OP_FROMALTSTACK":
			top = altstack.pop();
			mainstack.push(top);
			break;
		case "OP_IFDUP":
			top = mainstack.pop();
			if (top != 0) 
				mainstack.push(top);
			maintack.push(top);
			break;
		case "OP_DEPTH":
			mainstack.push(mainstack.size());
			break;
		case "OP_DROP":
			mainstack.pop();
			break;
		case "OP_DUP":
			mainstack.push(mainstack.peek(1));
			break;
		case "OP_NIP":
			mainstack.remove(2);
			break;
		case "OP_OVER":
			top = mainstack.peek(2);
			mainstack.push(top);
			break;
		case "OP_PICK":
			n = mainstack.pop();
			top = mainstack.peek(n);
			mainstack.push(top);
			break;
		case "OP_ROLL":
			n = mainstack.pop();
			top = mainstack.remove(n);
			mainstack.push(top);
			break;
		case "OP_ROT":
			top = mainstack.remove(3);
			mainstack.push(top);
			break;
		case "OP_SWAP":
			top = mainstack.remove(2);
			mainstack.push(top);
			break;
		case "OP_TUCK":
			top = mainstack.peek(1);
			mainstack.insert(top, 3);
			break;
		case "OP_2DROP":
			mainstack.pop();
			mainstack.pop();
			break;
		case "OP_2DUP":
			var second = mainstack.peek(2);
			top = mainstack.peek(1);
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_3DUP":
			var third = mainstack.peek(3);
			var second = mainstack.peek(2);
			top = mainstack.peek(1);
			mainstack.push(third);
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_2OVER":
			var second = mainstack.peek(4);
			top = mainstack.peek(3);
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_2ROT":
			var second = mainstack.remove(6);
			top = mainstack.remove(5);
			mainstack.push(second);
			mainstack.push(top);
			break;
		case "OP_2SWAP":
		    var second = mainstack.remove(4);
			top = mainstack.remove(3);
			mainstack.push(second);
			mainstack.push(top);
			break;

		/* Splice */
		case "OP_SIZE":
			var size = mainstack.peek(1).length();
			mainstack.push(size);

		/* bitwise logic*/
		case "OP_EQUAL":
			var first = mainstack.peek(1);
			var second = mainstack.peek(2);
			if (first === second)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;

		case "OP_EQUALVERIFY":
			var first = mainstack.peek(1);
			var second = mainstack.peek(2);
			if (first === second)
				mainstack.push(1);
			else
				mainstack.push(0);

			if (mainstack.pop() === 0)
				return -1;
			break;

		/* Arithmetic */
		case "OP_1ADD":
			mainstack.push(mainstack.pop() + 1);
			break;
		case "OP_1SUB":
			mainstack.push(mainstack.pop() - 1);
			break;
		case "OP_2MUL":
			mainstack.push(mainstack.pop() * 2);
			break;
		case "OP_2DIV":
			mainstack.push(mainstack.pop() / 2);
			break;
		case "OP_NEGATE":
			mainstack.push(mainstack.pop() * -1);
		case "OP_ABS":
			top = mainstack.pop();
			if (top >= 0)
				mainstack.push(top);
			else
				mainstack.pop(top * -1);
			break;
		case "OP_NOT":
			top = mainstack.pop();
			if (top === 0)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_0NOTEQUAL":
			top = mainstack.pop();
			if (top === 0)
				mainstack.push(0);
			else
				mainstack.push(1);
			break;
		case "OP_ADD":
			mainstack.push(mainstack.pop() + mainstack.pop());
			break;
		case "OP_SUB":
			top = mainstack.pop();
			var second = mainstack.pop();
			mainstack.push(second - top);
			break;
		case "OP_MUL":
			mainstack.push(mainstack.pop() * mainstack.pop());
			break;
		case "OP_SUB":
			top = mainstack.pop();
			var second = mainstack.pop();
			mainstack.push(second / top);
			break;
		case "OP_MOD":
			top = mainstack.pop();
			var second = mainstack.pop();
			mainstack.push(second % top);
			break;
		case "OP_LSHIFT":
			top = mainstack.pop();
			var second = mainstack.pop();
			mainstack.push(second << top);
			break;
		case "OP_RSHIFT":
			top = mainstack.pop();
			var second = mainstack.pop();
			mainstack.push(second >> top);
			break;
		case "OP_BOOLAND":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (a !== 0 && b !== 0)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_BOOLOR":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (a !== 0 || b !== 0)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_NUMEQUAL":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (top === second) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_NUMEQUALVERIFY":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (top === second) 
				mainstack.push(1);
			else
				mainstack.push(0);

			if (mainstack.pop() === 0)
				return -1;
			break;
		case "OP_NUMNOTEQUAL":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (top === second) 
				mainstack.push(0);
			else
				mainstack.push(1);
			break;
		case "OP_LESSTHAN":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (second < top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_GREATERTHAN":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (second > top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_LESSTHANOREQUAL":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (second <= top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_GREATERTHANOREQUAL":
			top = mainstack.pop();
			var second = mainstack.pop();
			if (second >= top) 
				mainstack.push(1);
			else
				mainstack.push(0);
			break;
		case "OP_MIN":
			top = mainstack.pop();
			var second = mainstack.pop();
			mainstack.push(Math.min(top, second));
			break;
		case "OP_MAX":
			top = mainstack.pop();
			var second = mainstack.pop();
			mainstack.push(Math.max(top, second));
			break;
		case "OP_WITHIN":
			top = mainstack.pop();
			var max = mainstack.pop();
			var min = mainstack.pop();

			if (top < max && top >= min)
				mainstack.push(1);
			else
				mainstack.push(0);
			break;

		/* crypto */
		case "OP_RIPEMD160":
			mainstack.push(ripemd160(mainstack.pop()));
			break;
		case "OP_SHA1":
			mainstack.push(Sha1.hash(mainstack.pop()));
			break;
		case "OP_SHA256":
			mainstack.push(Sha256.hash(mainstack.pop()));
			break;
		case "OP_HASH160":
			mainstack.push(Sha256.hash(mainstack.pop()));
			mainstack.push(ripemd160(mainstack.pop()));
			break;
		case "OP_HASH256":
			mainstack.push(Sha256.hash(mainstack.pop()));
			mainstack.push(Sha256.hash(mainstack.pop()));
			break;
		case "OP_CODESEPARATOR":
			code_separator_index = index;
			break;
		case "OP_CHECKSIG":
			var pubKey = mainstack.pop();
			var sig = mainstack.pop();

			var sub_script = new Array();
			for (var i = code_separator_index; i < script.length; i++) {
				if (script[i] !== sig) sub_script.push(script[i]);
			}

			break;
		// uh... looks complicated. see https://en.bitcoin.it/wiki/OP_CHECKSIG
		// use secp256k1 elliptic curve for signature verification
		case "OP_CHECKSIGVERIFY":
			break;
		// same as above, but with OP_VERIFY after
		case "OP_CHECKMULTISIG":
			break;
		// derp
		case "OP_CHECKMULTISIGVERIFY":
			break;
		// derp + verify

		/* pseudowords */
		case "OP_PUBKEYHASH":
		case "OP_PUBKEY":
		case "OP_INVALIDOPCODE":
			return -1;
			break;

		/* reserved words */
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

		default:
			// this search might not be necessary if we decide to do some preprocessing
			// e.g. if there is an unrecognized term in the script, and it's not surrounded
			// by arrow brackets, that's a syntax failure.
			var val = current_command.search(/0x[A-Za-z0-9]+/);
			console.log('val ' + current_command.match(/0x[A-Za-z0-9]+/));
			if (val == -1) break;
			val = current_command.match(/0x[A-Za-z0-9]+/);
			val = parseInt(val);
			mainstack.push(val);
			break;
	}

	console.log('returns i + 1: ' + (index + 1) );

	if (index + 1 == script.length) {
	    return -2;
	}
	return index + 1;
}
