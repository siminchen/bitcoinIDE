/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ScriptHighlightRules = function() {

	var keywords = (
        "break|case|catch|classdef|continue|else|elseif|end|for|function|global|if|otherwise|parfor|persistent|return|spmd|switch|try|while"
    );

    var builtinConstants = (
        "true|false|inf|Inf|nan|NaN|eps|pi|ans|nargin|nargout|varargin|varargout"
    );

    var builtinFunctions = (
        "abs|accumarray|acos(?:d|h)?|acot(?:d|h)?|acsc(?:d|h)?|actxcontrol(?:list|select)?|actxGetRunningServer|actxserver|addlistener|addpath|addpref|addtodate|"+
        "linprog|lsqcurvefit|lsqlin|lsqnonlin|lsqnonneg|optimget|optimset|optimtool|quadprog"
    );
    var storageType = (
        "cell|struct|char|double|single|logical|u?int(?:8|16|32|64)|sparse"
    );
    var keywordMapper = this.createKeywordMapper({
        "storage.type": storageType,
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants
    }, "identifier", true);

    this.$rules = {
        // allowQstring
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