ace.define("ace/snippets/script",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet NOP\n\
	OP_NOP\n\
snippet IF\n\
	OP_IF\n\
snippet NOTIF\n\
	OP_NOTIF\n\
snippet ELSE\n\
	OP_ELSE\n\
snippet ENDIF\n\
	OP_ENDIF\n\
snippet VERIFY\n\
	OP_VERIFY\n\
snippet RETURN\n\
	OP_RETURN\n\
snippet TOALTSTACK\n\
	OP_TOALTSTACK\n\
snippet FROMALTSTACK\n\
	OP_FROMALTSTACK\n\
snippet IFDUP\n\
	OP_IFDUP\n\
snippet DEPTH\n\
	OP_DEPTH\n\
snippet DROP\n\
	OP_DROP\n\
snippet DUP\n\
	OP_DUP\n\
snippet NIP\n\
	OP_NIP\n\
snippet OVER\n\
	OP_OVER\n\
snippet PICK\n\
	OP_PICK\n\
snippet ROLL\n\
	OP_ROLL\n\
snippet ROT\n\
	OP_ROT\n\
snippet SWAP\n\
	OP_SWAP\n\
snippet TUCK\n\
	OP_TUCK\n\
snippet 2DROP\n\
	OP_2DROP\n\
snippet 2DUP\n\
	OP_2DUP\n\
snippet 3DUP\n\
	OP_3DUP\n\
snippet 2OVER\n\
	OP_2OVER\n\
snippet 2ROT\n\
	OP_2ROT\n\
snippet 2SWAP\n\
	OP_2SWAP\n\
snippet 0\n\
	OP_0\n\
snippet FALSE\n\
	OP_FALSE\n\
snippet PUSHDATA1\n\
	OP_PUSHDATA1\n\
snippet PUSHDATA2\n\
	OP_PUSHDATA2\n\
snippet PUSHDATA4\n\
	OP_PUSHDATA4\n\
snippet 1NEGATE\n\
	OP_1NEGATE\n\
snippet 1\n\
	OP_1\n\
snippet TRUE\n\
	OP_TRUE\n\
snippet 2\n\
	OP_2\n\
snippet 3\n\
	OP_3\n\
snippet 4\n\
	OP_4\n\
snippet 5\n\
	OP_5\n\
snippet 6\n\
	OP_6\n\
snippet 7\n\
	OP_7\n\
snippet 8\n\
	OP_8\n\
snippet 9\n\
	OP_9\n\
snippet 10\n\
	OP_10\n\
snippet 11\n\
	OP_11\n\
snippet 12\n\
	OP_12\n\
snippet 13\n\
	OP_13\n\
snippet 14\n\
	OP_14\n\
snippet 15\n\
	OP_15\n\
snippet 16\n\
	OP_16\n\
snippet CAT\n\
	OP_CAT\n\
snippet SUBSTR\n\
	OP_SUBSTR\n\
snippet LEFT\n\
	OP_LEFT\n\
snippet RIGHT\n\
	OP_RIGHT\n\
snippet SIZE\n\
	OP_SIZE\n\
snippet INVERT\n\
	OP_INVERT\n\
snippet AND\n\
	OP_AND\n\
snippet OR\n\
	OP_OR\n\
snippet XOR\n\
	OP_XOR\n\
snippet EQUAL\n\
	OP_EQUAL\n\
snippet EQUALVERIFY\n\
	OP_EQUALVERIFY\n\
snippet 1ADD\n\
	OP_1ADD\n\
snippet 1SUB\n\
	OP_1SUB\n\
snippet 2MUL\n\
	OP_2MUL\n\
snippet 2DIV\n\
	OP_2DIV\n\
snippet NEGATE\n\
	OP_NEGATE\n\
snippet ABS\n\
	OP_ABS\n\
snippet NOT\n\
	OP_NOT\n\
snippet 0NOTEQUAL\n\
	OP_0NOTEQUAL\n\
snippet ADD\n\
	OP_ADD\n\
snippet SUB\n\
	OP_SUB\n\
snippet MUL\n\
	OP_MUL\n\
snippet DIV\n\
	OP_DIV\n\
snippet MOD\n\
	OP_MOD\n\
snippet LSHIFT\n\
	OP_LSHIFT\n\
snippet RSHIFT\n\
	OP_RSHIFT\n\
snippet BOOLAND\n\
	OP_BOOLAND\n\
snippet BOOLOR\n\
	OP_BOOLOR\n\
snippet NUMEQUAL\n\
	OP_NUMEQUAL\n\
snippet NUMEQUALVERIFY\n\
	OP_NUMEQUALVERIFY\n\
snippet NUMNOTEQUAL\n\
	OP_NUMNOTEQUAL\n\
snippet LESSTHAN\n\
	OP_LESSTHAN\n\
snippet GREATERTHAN\n\
	OP_GREATERTHAN\n\
snippet LESSTHANOREQUAL\n\
	OP_LESSTHANOREQUAL\n\
snippet GREATERTHANOREQUAL\n\
	OP_GREATERTHANOREQUAL\n\
snippet MIN\n\
	OP_MIN\n\
snippet MAX\n\
	OP_MAX\n\
snippet WITHIN\n\
	OP_WITHIN\n\
snippet RIPEMD160\n\
	OP_RIPEMD160\n\
snippet SHA1\n\
	OP_SHA1\n\
snippet SHA256\n\
	OP_SHA256\n\
snippet HASH160\n\
	OP_HASH160\n\
snippet HASH256\n\
	OP_HASH256\n\
snippet CODESEPARATOR\n\
	OP_CODESEPARATOR\n\
snippet CHECKSIG\n\
	OP_CHECKSIG\n\
snippet CHECKSIGVERIFY\n\
	OP_CHECKSIGVERIFY\n\
snippet CHECKMULTISIG\n\
	OP_CHECKMULTISIG\n\
snippet CHECKMULTISIGVERIFY\n\
	OP_CHECKMULTISIGVERIFY\n\
snippet PUBKEYHASH\n\
	OP_PUBKEYHASH\n\
snippet PUBKEY\n\
	OP_PUBKEY\n\
snippet INVALIDOPCODE\n\
	OP_INVALIDOPCODE\n\
snippet RESERVED\n\
	OP_RESERVED\n\
snippet VER\n\
	OP_VER\n\
snippet VERIF\n\
	OP_VERIF\n\
snippet VERNOTIF\n\
	OP_VERNOTIF\n\
snippet RESERVED1\n\
	OP_RESERVED1\n\
snippet RESERVED2\n\
	OP_RESERVED2\n\
snippet NOP1\n\
	OP_NOP1\n\
snippet NOP2\n\
	OP_NOP2\n\
snippet NOP3\n\
	OP_NOP3\n\
snippet NOP4\n\
	OP_NOP4\n\
snippet NOP5\n\
	OP_NOP5\n\
snippet NOP6\n\
	OP_NOP6\n\
snippet NOP7\n\
	OP_NOP7\n\
snippet NOP8\n\
	OP_NOP8\n\
snippet NOP9\n\
	OP_NOP9\n\
snippet NOP10\n\
	OP_NOP10\n\
\n\
snippet nop\n\
	OP_NOP\n\
snippet if\n\
	OP_IF\n\
snippet notif\n\
	OP_NOTIF\n\
snippet else\n\
	OP_ELSE\n\
snippet endif\n\
	OP_ENDIF\n\
snippet verify\n\
	OP_VERIFY\n\
snippet return\n\
	OP_RETURN\n\
snippet toaltstack\n\
	OP_TOALTSTACK\n\
snippet fromaltstack\n\
	OP_FROMALTSTACK\n\
snippet ifdup\n\
	OP_IFDUP\n\
snippet depth\n\
	OP_DEPTH\n\
snippet drop\n\
	OP_DROP\n\
snippet dup\n\
	OP_DUP\n\
snippet nip\n\
	OP_NIP\n\
snippet over\n\
	OP_OVER\n\
snippet pick\n\
	OP_PICK\n\
snippet roll\n\
	OP_ROLL\n\
snippet rot\n\
	OP_ROT\n\
snippet swap\n\
	OP_SWAP\n\
snippet tuck\n\
	OP_TUCK\n\
snippet 2drop\n\
	OP_2DROP\n\
snippet 2dup\n\
	OP_2DUP\n\
snippet 3dup\n\
	OP_3DUP\n\
snippet 2over\n\
	OP_2OVER\n\
snippet 2rot\n\
	OP_2ROT\n\
snippet 2swap\n\
	OP_2SWAP\n\
snippet 0\n\
	OP_0\n\
snippet false\n\
	OP_FALSE\n\
snippet pushdata1\n\
	OP_PUSHDATA1\n\
snippet pushdata2\n\
	OP_PUSHDATA2\n\
snippet pushdata4\n\
	OP_PUSHDATA4\n\
snippet 1negate\n\
	OP_1NEGATE\n\
snippet 1\n\
	OP_1\n\
snippet true\n\
	OP_TRUE\n\
snippet 2\n\
	OP_2\n\
snippet 3\n\
	OP_3\n\
snippet 4\n\
	OP_4\n\
snippet 5\n\
	OP_5\n\
snippet 6\n\
	OP_6\n\
snippet 7\n\
	OP_7\n\
snippet 8\n\
	OP_8\n\
snippet 9\n\
	OP_9\n\
snippet 10\n\
	OP_10\n\
snippet 11\n\
	OP_11\n\
snippet 12\n\
	OP_12\n\
snippet 13\n\
	OP_13\n\
snippet 14\n\
	OP_14\n\
snippet 15\n\
	OP_15\n\
snippet 16\n\
	OP_16\n\
snippet cat\n\
	OP_CAT\n\
snippet substr\n\
	OP_SUBSTR\n\
snippet left\n\
	OP_LEFT\n\
snippet right\n\
	OP_RIGHT\n\
snippet size\n\
	OP_SIZE\n\
snippet invert\n\
	OP_INVERT\n\
snippet and\n\
	OP_AND\n\
snippet or\n\
	OP_OR\n\
snippet xor\n\
	OP_XOR\n\
snippet equal\n\
	OP_EQUAL\n\
snippet equalverify\n\
	OP_EQUALVERIFY\n\
snippet 1add\n\
	OP_1ADD\n\
snippet 1sub\n\
	OP_1SUB\n\
snippet 2mul\n\
	OP_2MUL\n\
snippet 2div\n\
	OP_2DIV\n\
snippet negate\n\
	OP_NEGATE\n\
snippet abs\n\
	OP_ABS\n\
snippet not\n\
	OP_NOT\n\
snippet 0notequal\n\
	OP_0NOTEQUAL\n\
snippet add\n\
	OP_ADD\n\
snippet sub\n\
	OP_SUB\n\
snippet mul\n\
	OP_MUL\n\
snippet div\n\
	OP_DIV\n\
snippet mod\n\
	OP_MOD\n\
snippet lshift\n\
	OP_LSHIFT\n\
snippet rshift\n\
	OP_RSHIFT\n\
snippet booland\n\
	OP_BOOLAND\n\
snippet boolor\n\
	OP_BOOLOR\n\
snippet numequal\n\
	OP_NUMEQUAL\n\
snippet numequalverify\n\
	OP_NUMEQUALVERIFY\n\
snippet numnotequal\n\
	OP_NUMNOTEQUAL\n\
snippet lessthan\n\
	OP_LESSTHAN\n\
snippet greaterthan\n\
	OP_GREATERTHAN\n\
snippet lessthanorequal\n\
	OP_LESSTHANOREQUAL\n\
snippet greaterthanorequal\n\
	OP_GREATERTHANOREQUAL\n\
snippet min\n\
	OP_MIN\n\
snippet max\n\
	OP_MAX\n\
snippet within\n\
	OP_WITHIN\n\
snippet ripemd160\n\
	OP_RIPEMD160\n\
snippet sha1\n\
	OP_SHA1\n\
snippet sha256\n\
	OP_SHA256\n\
snippet hash160\n\
	OP_HASH160\n\
snippet hash256\n\
	OP_HASH256\n\
snippet codeseparator\n\
	OP_CODESEPARATOR\n\
snippet checksig\n\
	OP_CHECKSIG\n\
snippet checksigverify\n\
	OP_CHECKSIGVERIFY\n\
snippet checkmultisig\n\
	OP_CHECKMULTISIG\n\
snippet checkmultisigverify\n\
	OP_CHECKMULTISIGVERIFY\n\
snippet pubkeyhash\n\
	OP_PUBKEYHASH\n\
snippet pubkey\n\
	OP_PUBKEY\n\
snippet invalidopcode\n\
	OP_INVALIDOPCODE\n\
snippet reserved\n\
	OP_RESERVED\n\
snippet ver\n\
	OP_VER\n\
snippet verif\n\
	OP_VERIF\n\
snippet vernotif\n\
	OP_VERNOTIF\n\
snippet reserved1\n\
	OP_RESERVED1\n\
snippet reserved2\n\
	OP_RESERVED2\n\
snippet nop1\n\
	OP_NOP1\n\
snippet nop2\n\
	OP_NOP2\n\
snippet nop3\n\
	OP_NOP3\n\
snippet nop4\n\
	OP_NOP4\n\
snippet nop5\n\
	OP_NOP5\n\
snippet nop6\n\
	OP_NOP6\n\
snippet nop7\n\
	OP_NOP7\n\
snippet nop8\n\
	OP_NOP8\n\
snippet nop9\n\
	OP_NOP9\n\
snippet nop10\n\
	OP_NOP10\n\
\n\
snippet ret\n\
	OP_RETURN\n\
snippet in\n\
	OP_WITHIN\n\
snippet rip\n\
	OP_RIPEMD160\n\
snippet cod\n\
	OP_CODESEPARATOR\n\
snippet inv\n\
	OP_INVALIDOPCODE\n\
snippet res\n\
	OP_RESERVED\n\
snippet res1\n\
	OP_RESERVED1\n\
snippet res2\n\
	OP_RESERVED2\n\
\n\
\n\
snippet +1\n\
	OP_1ADD\n\
snippet -1\n\
	OP_1SUB\n\
snippet *2\n\
	OP_2MUL\n\
snippet /2\n\
	OP_2DIV\n\
snippet NEG\n\
	OP_NEGATE\n\
snippet !0\n\
	OP_0NOTEQUAL\n\
snippet <<\n\
	OP_LSHIFT\n\
snippet >>\n\
	OP_RSHIFT\n\
snippet &&\n\
	OP_BOOLAND\n\
snippet ||\n\
	OP_BOOLOR\n\
snippet ==\n\
	OP_NUMEQUAL\n\
snippet NUM\n\
	OP_NUMEQUALVERIFY\n\
snippet !=\n\
	OP_NUMNOTEQUAL\n\
snippet <\n\
	OP_LESSTHAN\n\
snippet >\n\
	OP_GREATERTHAN\n\
snippet <=\n\
	OP_LESSTHANOREQUAL\n\
snippet >=\n\
	OP_GREATERTHANOREQUAL\n\
snippet IN\n\
	OP_WITHIN\n\
snippet RIP\n\
	OP_RIPEMD160\n\
snippet COD\n\
	OP_CODESEPARATOR\n\
snippet INV\n\
	OP_INVALIDOPCODE\n\
snippet RES\n\
	OP_RESERVED\n\
snippet RES1\n\
	OP_RESERVED1\n\
snippet RES2\n\
	OP_RESERVED2\n\
snippet !\n\
	OP_NOT\n\
\n\
\n\
";
exports.scope = "script";

});
