var command = prevprogramget().toLowerCase();
var i = 0;
var mainstack;
var altstack;
var top;
var n = input;
var codeSeparatorIndex;
var if_counter = 0;
var endif_flag = 0;
var else_counter = 0;

while (i != command.length) {
	switch (currentcommand) {
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
			endif_flag = 1;
			if_counter++;
			top = pop();
			if (top == 0)
			{
				while (i != command.length)
				{
					i++;
					if (command[i] === "OP_ELSE")
						return i;

					if (command[i] === "OP_ENDIF")
						return i;
				}
					
			}
			break;

		case "OP_NOTIF":
			endif_flag = 1;
			if_counter++;
			top = pop();
			if (top != 0)
			{
				while (i != command.length)
				{
					i++;

					if (command[i] === "OP_ELSE")
					{
						if_counter--;
						return i;
					}
						

					if (command[i] === "OP_ENDIF")
						return i;
				}
					
			}
			break;

		case "OP_ELSE":
			if (endif_flag != 1)
				return -1;
			endif_flag = 2;
			else_counter++;
			break;

		case "OP_ENDIF":
			if (endif_flag == 0)
				return -1;
			if (endif_flag == 1)
			{
				if_counter--;
				if (if_counter == 0 && else_counter > 0)
					return -1;
				else if (if_counter == 0)
					endif_flag = 0;

			}
			else if (endif_flag == 2)
			{

			}

		case "OP_VERIFY":
			top = mainstack.pop();
			if (top == 0)
				return -1;
			break;
		case "OP_RETURN":
			return -1;
			break;

		/* stack*/
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

		/* Splice*/
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
			codeSeparatorIndex = i;
			break;
		case "OP_CHECKSIG":
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
			if (endif_flag == 0)
				return -1;
		case "OP_VERIF":
		case "OP_VERNOTIF":
			return -1;
			break;

		default:
			break;
}