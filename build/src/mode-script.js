define("ace/mode/script_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ScriptHighlightRules = function() {

	var keywords = (
        "OP_NOP|OP_IF|OP_NOTIF|OP_ELSE|OP_ENDIF|OP_VERIFY|OP_RETURN|OP_TOALTSTACK|OP_FROMALTSTACK|OP_IFDUP|OP_DEPTH|OP_DROP|OP_DUP|OP_NIP|OP_OVER|OP_PICK|OP_ROLL|OP_ROT|OP_SWAP|OP_TUCK|OP_2DROP|OP_2DUP|OP_3DUP|OP_2OVER|OP_2ROT|OP_2SWAP"
    );

    var builtinConstants = (
        "OP_0|OP_FALSE|N/A|OP_PUSHDATA1|OP_PUSHDATA2|OP_PUSHDATA4|OP_1NEGATE|OP_1|OP_TRUE|OP_2|OP_3|OP_4|OP_5|OP_6|OP_7|OP_8|OP_9|OP_10|OP_11|OP_12|OP_13|OP_14|OP_15|OP_16"
    );

    var builtinFunctions = (
        "OP_CAT|OP_SUBSTR|OP_LEFT|OP_RIGHT|OP_SIZE|OP_INVERT|OP_AND|OP_OR|OP_XOR|OP_EQUAL|OP_EQUALVERIFY|OP_1ADD|OP_1SUB|OP_2MUL|OP_2DIV|OP_NEGATE|OP_ABS|OP_NOT|OP_0NOTEQUAL|OP_ADD|OP_SUB|OP_MUL|OP_DIV|OP_MOD|OP_LSHIFT|OP_RSHIFT|OP_BOOLAND|OP_BOOLOR|OP_NUMEQUAL|OP_NUMEQUALVERIFY|OP_NUMNOTEQUAL|OP_LESSTHAN|OP_GREATERTHAN|OP_LESSTHANOREQUAL|OP_GREATERTHANOREQUAL|OP_MIN|OP_MAX|OP_WITHIN"
    );
    var storageType = (
        "OP_RIPEMD160|OP_SHA1|OP_SHA256|OP_HASH160|OP_HASH256|OP_CODESEPARATOR|OP_CHECKSIG|OP_CHECKSIGVERIFY|OP_CHECKMULTISIG|OP_CHECKMULTISIGVERIFY|OP_PUBKEYHASH|OP_PUBKEY|OP_INVALIDOPCODE|OP_RESERVED|OP_VER|OP_VERIF|OP_VERNOTIF|OP_RESERVED1|OP_RESERVED2|OP_NOP1|OP_NOP2|OP_NOP3|OP_NOP4|OP_NOP5|OP_NOP6|OP_NOP7|OP_NOP8|OP_NOP9|OP_NOP10"
    );
    var keywordMapper = this.createKeywordMapper({
        "storage.type": storageType,
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants
    }, "identifier", true);

    this.$rules = {
        start: [{ 
            token : "string",
            regex : "'",
            stateName : "qstring",
            next  : [{
                token : "constant.language.escape",
                regex : "''"
            }, {
                token : "string",
                regex : "'|$",
                next  : "start"
            }, {
                defaultToken: "string"
            }]
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            regex: "",
            next: "noQstring"
        }],        
        noQstring : [{
            regex: "^\\s*%{\\s*$",
            token: "comment.start",
            push: "blockComment"
        }, {
            token : "comment",
            regex : "%[^\r\n]*"
        }, {
            token : "string",
            regex : '"',
            stateName : "qqstring",
            next  : [{
                token : "constant.language.escape",
                regex : /\\./
            }, {
                token : "string",
                regex : "\\\\$",
                next  : "qqstring"
            }, {
                token : "string",
                regex : '"|$',
                next  : "start"
            }, {
                defaultToken: "string"
            }]
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\/|\\/\\/|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=",
            next: "start"
        }, {
            token : "punctuation.operator",
            regex : "\\?|\\:|\\,|\\;|\\.",
            next: "start"
        }, {
            token : "paren.lparen",
            regex : "[({\\[]",
            next: "start"
        }, {
            token : "paren.rparen",
            regex : "[\\]})]"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : "$",
            next  : "start"
        }],
        blockComment: [{
            regex: "^\\s*%{\\s*$",
            token: "comment.start",
            push: "blockComment"
        }, {
            regex: "^\\s*%}\\s*$",
            token: "comment.end",
            next: "pop"
        }, {
            defaultToken: "comment"
        }],
    };
    
    this.normalizeRules();
};

oop.inherits(ScriptHighlightRules, TextHighlightRules);

exports.ScriptHighlightRules = ScriptHighlightRules;
});

define("ace/mode/script",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/script_highlight_rules","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var ScriptHighlightRules = require("./script_highlight_rules").ScriptHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = ScriptHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.$id = "ace/mode/script";
}).call(Mode.prototype);

exports.Mode = Mode;

});
