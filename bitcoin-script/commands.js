// commands.js
// Library for all Bitcoin Script commands
//
// Usage: to assemble a bitcoin script (string) into hex (string),
// call assembleToHex. To disassemble a hex string into a bitcoin
// script (string), call disassembleFromHex.

var BASE_16 = 16;

var commandToOpcode = {
    "OP_0": 0,
    "OP_FALSE": 0,
    "OP_PUSHDATA1": 76,
    "OP_PUSHDATA2": 77,
    "OP_PUSHDATA4": 78,
    "OP_1NEGATE": 79,
    "OP_1": 81,
    "OP_TRUE": 81,
    "OP_2": 82,
    "OP_3": 83,
    "OP_4": 84,
    "OP_5": 85,
    "OP_6": 86,
    "OP_7": 87,
    "OP_8": 88,
    "OP_9": 89,
    "OP_10": 90,
    "OP_11": 91,
    "OP_12": 92,
    "OP_13": 93,
    "OP_14": 94,
    "OP_15": 95,
    "OP_16": 96,
    "OP_NOP": 97,
    "OP_IF": 99,
    "OP_NOTIF": 100,
    "OP_ELSE": 103,
    "OP_ENDIF": 104,
    "OP_VERIFY": 105,
    "OP_RETURN": 106,
    "OP_TOALTSTACK": 107,
    "OP_FROMALTSTACK": 108,
    "OP_IFDUP": 115,
    "OP_DEPTH": 116,
    "OP_DROP": 117,
    "OP_DUP": 118,
    "OP_NIP": 119,
    "OP_OVER": 120,
    "OP_PICK": 121,
    "OP_ROLL": 122,
    "OP_ROT": 123,
    "OP_SWAP": 124,
    "OP_TUCK": 125,
    "OP_2DROP": 109,
    "OP_2DUP": 110,
    "OP_3DUP": 111,
    "OP_2OVER": 112,
    "OP_2ROT": 113,
    "OP_2SWAP": 114,
    "OP_CAT": 126,
    "OP_SUBSTR": 127,
    "OP_LEFT": 128,
    "OP_RIGHT": 129,
    "OP_SIZE": 130,
    "OP_INVERT": 131,
    "OP_AND": 132,
    "OP_OR": 133,
    "OP_XOR": 134,
    "OP_EQUAL": 135,
    "OP_EQUALVERIFY": 136,
    "OP_1ADD": 139,
    "OP_1SUB": 140,
    "OP_2MUL": 141,
    "OP_2DIV": 142,
    "OP_NEGATE": 143,
    "OP_ABS": 144,
    "OP_NOT": 145,
    "OP_0NOTEQUAL": 146,
    "OP_ADD": 147,
    "OP_SUB": 148,
    "OP_MUL": 149,
    "OP_DIV": 150,
    "OP_MOD": 151,
    "OP_LSHIFT": 152,
    "OP_RSHIFT": 153,
    "OP_BOOLAND": 154,
    "OP_BOOLOR": 155,
    "OP_NUMEQUAL": 156,
    "OP_NUMEQUALVERIFY": 157,
    "OP_NUMNOTEQUAL": 158,
    "OP_LESSTHAN": 159,
    "OP_GREATERTHAN": 160,
    "OP_LESSTHANOREQUAL": 161,
    "OP_GREATERTHANOREQUAL": 162,
    "OP_MIN": 163,
    "OP_MAX": 164,
    "OP_WITHIN": 165,
    "OP_RIPEMD160": 166,
    "OP_SHA1": 167,
    "OP_SHA256": 168,
    "OP_HASH160": 169,
    "OP_HASH256": 170,
    "OP_CODESEPARATOR": 171,
    "OP_CHECKSIG": 172,
    "OP_CHECKSIGVERIFY": 173,
    "OP_CHECKMULTISIG": 174,
    "OP_CHECKMULTISIGVERIFY": 175,
    "OP_PUBKEYHASH": 253,
    "OP_PUBKEY": 254,
    "OP_INVALIDOPCODE": 255,
    "OP_RESERVED": 80,
    "OP_VER": 98,
    "OP_VERIF": 101,
    "OP_VERNOTIF": 102,
    "OP_RESERVED1": 137,
    "OP_RESERVED2": 138,
    "OP_NOP1": 176,
    "OP_NOP2": 177,
    "OP_NOP3": 178,
    "OP_NOP4": 179,
    "OP_NOP5": 180,
    "OP_NOP6": 181,
    "OP_NOP7": 182,
    "OP_NOP8": 183,
    "OP_NOP9": 184,
    "OP_NOP10": 185,
};


var opcodeToCommand = {
    0: "OP_FALSE",
    76: "OP_PUSHDATA1",
    77: "OP_PUSHDATA2",
    78: "OP_PUSHDATA4",
    79: "OP_1NEGATE",
    81: "OP_1",
    82: "OP_2",
    83: "OP_3",
    84: "OP_4",
    85: "OP_5",
    86: "OP_6",
    87: "OP_7",
    88: "OP_8",
    89: "OP_9",
    90: "OP_10",
    91: "OP_11",
    92: "OP_12",
    93: "OP_13",
    94: "OP_14",
    95: "OP_15",
    96: "OP_16",
    97: "OP_NOP",
    99: "OP_IF",
    100: "OP_NOTIF",
    103: "OP_ELSE",
    104: "OP_ENDIF",
    105: "OP_VERIFY",
    106: "OP_RETURN",
    107: "OP_TOALTSTACK",
    108: "OP_FROMALTSTACK",
    115: "OP_IFDUP",
    116: "OP_DEPTH",
    117: "OP_DROP",
    118: "OP_DUP",
    119: "OP_NIP",
    120: "OP_OVER",
    121: "OP_PICK",
    122: "OP_ROLL",
    123: "OP_ROT",
    124: "OP_SWAP",
    125: "OP_TUCK",
    109: "OP_2DROP",
    110: "OP_2DUP",
    111: "OP_3DUP",
    112: "OP_2OVER",
    113: "OP_2ROT",
    114: "OP_2SWAP",
    126: "OP_CAT",
    127: "OP_SUBSTR",
    128: "OP_LEFT",
    129: "OP_RIGHT",
    130: "OP_SIZE",
    131: "OP_INVERT",
    132: "OP_AND",
    133: "OP_OR",
    134: "OP_XOR",
    135: "OP_EQUAL",
    136: "OP_EQUALVERIFY",
    139: "OP_1ADD",
    140: "OP_1SUB",
    141: "OP_2MUL",
    142: "OP_2DIV",
    143: "OP_NEGATE",
    144: "OP_ABS",
    145: "OP_NOT",
    146: "OP_0NOTEQUAL",
    147: "OP_ADD",
    148: "OP_SUB",
    149: "OP_MUL",
    150: "OP_DIV",
    151: "OP_MOD",
    152: "OP_LSHIFT",
    153: "OP_RSHIFT",
    154: "OP_BOOLAND",
    155: "OP_BOOLOR",
    156: "OP_NUMEQUAL",
    157: "OP_NUMEQUALVERIFY",
    158: "OP_NUMNOTEQUAL",
    159: "OP_LESSTHAN",
    160: "OP_GREATERTHAN",
    161: "OP_LESSTHANOREQUAL",
    162: "OP_GREATERTHANOREQUAL",
    163: "OP_MIN",
    164: "OP_MAX",
    165: "OP_WITHIN",
    166: "OP_RIPEMD160",
    167: "OP_SHA1",
    168: "OP_SHA256",
    169: "OP_HASH160",
    170: "OP_HASH256",
    171: "OP_CODESEPARATOR",
    172: "OP_CHECKSIG",
    173: "OP_CHECKSIGVERIFY",
    174: "OP_CHECKMULTISIG",
    175: "OP_CHECKMULTISIGVERIFY",
    253: "OP_PUBKEYHASH",
    254: "OP_PUBKEY",
    255: "OP_INVALIDOPCODE",
    80: "OP_RESERVED",
    98: "OP_VER",
    101: "OP_VERIF",
    102: "OP_VERNOTIF",
    137: "OP_RESERVED1",
    138: "OP_RESERVED2",
    176: "OP_NOP1",
    177: "OP_NOP2",
    178: "OP_NOP3",
    179: "OP_NOP4",
    180: "OP_NOP5",
    181: "OP_NOP6",
    182: "OP_NOP7",
    183: "OP_NOP8",
    184: "OP_NOP9",
    185: "OP_NOP10",
};


// Convert an opcode to its hex code
// Arguments: opcode: integer
// Return: string with two characters
var opcodeToHex = function(opcode) {
    var hexcode = opcode.toString(BASE_16);

    // Convert the hex code two 2 characters
    if (hexcode.length == 1) {
	hexcode = "0" + hexcode;
    }

    return hexcode;
};


// Convert a constant in the Bitcoin script to its hexcode in Bitcoin
// Return a string on success, and null on failure
// Arguments: hexstring: string
// Return: string or null
var constantToHexcode = function(hexstring) {
    // Extract the constant inside the < ... >
    var num = parseInt(hexstring.substring(1, hexstring.length - 1));
    if (isNaN(num)) {
	return null;
    }

    num = num.toString(BASE_16);

    // Determine the number of bytes of the constant
    var numBytes = num.length;
    numBytes = opcodeToHex(numBytes);

    return numBytes + num;
};

// Convert a Bitcoin script to its hex code
// Argument: script: string
// Return: string for the hex code
var assembleToHex = function(script) {
    var hexcode = "";
    var commands = script.split(" ");
    
    for (var i = 0; i < commands.length; i++) {
	var opcode = commandToOpcode[commands[i]];

	// This is a valid command
	if (opcode != null) {
	    hexcode += opcodeToHex(opcode);
	} else { // must be a constant
	    var constant = constantToHexcode(commands[i]);
	    if (constant != null) {
		hexcode += constant;
	    }
	}
    }
    return hexcode;
};

// Convert a hex string to the original Bitcoin script
// Argument: hex: string
// Return: string for the script
var disassembleFromHex = function(hexstring) {
    var script = "";
    var index = 0;

    while (index < hexstring.length) {
	var opcode = hexstring.substring(index, index + 2);
	var opcodeValue = parseInt("0x" + opcode);
	index += 2;

	// If opcode does not represent any constant data
	if (opcodeValue < 1 || opcodeValue > 75) {
	    script += opcodeToCommand[opcodeValue];
	} else { // Opcode represents constants
	    script += "<";
	    script += "0x";
	    while (opcodeValue > 0) {
		script += hexstring[index];
		index += 1;
		opcodeValue -= 1;
	    }
	    script += ">";
	}

	script += " ";
    }

    // Remove the last space and return
    return script.substring(0, script.length - 1);
};