var len;
var c;
var col;
var line;
var valstring;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
}

function validate(input) {
    input = input.trim();
    alert('[' + input + ']');
    len = input.length;
    ret = valid(input);
    alert(ret);
    return ret;
}

function valid(input) {
    if (input.length == 0) return true;

    valstring = input;
    ret = true;
    c = input.charAt(0);
    col = 1;
    line = 1;
    if (!value()) {
        //ret = error("value", 1);
        ret = false
    } else {
        skipWhiteSpace();
        if (col - 1 != len) {
            //ret = error("end", col);
            ret = false
        }
    }

    return ret;
}

function value() {
    return literal("true") || literal("false") || literal("null") || string() || number() || object() || array();
}

function literal(text) {
    var t = text.charAt(0);
    if (c != t) return false;

    var start = col;
    ret = true;
    for (i = 1; i < text.length; i++) {
        if (text.charAt(i) != nextCharacter()) {
            ret = false;
            break;
        }
    }
    nextCharacter();
    //if (!ret) error("literal " + text, start);
    return ret;
}

function array() {
    return aggregate('[', ']', false);
}

function object() {
    return aggregate('{', '}', true);
}

function aggregate(entryCharacter, exitCharacter, prefix) {
    if (c != entryCharacter) return false;

    nextCharacter();
    skipWhiteSpace();
    if (c == exitCharacter) {
        nextCharacter();
        return true;
    }

    for (;;) {
        if (prefix) {
            start = col;
            //if (!string()) return error("string", start);
            if (!string()) return false;
            skipWhiteSpace();
            //if (c != ':') return error("colon", col);
            if (c != ':') return false;
            nextCharacter();
            skipWhiteSpace();
        }
        if (value()) {
            skipWhiteSpace();
            if (c == ',') {
                nextCharacter();
            } else if (c == exitCharacter) {
                break;
            } else {
                //return error("comma or " + exitCharacter, col);
                return false;
            }
        } else {
            //return error("value", col);
            return false;
        }
        skipWhiteSpace();
    }

    nextCharacter();
    return true;
}

function number() {
    if (!isDigit(c) && c != '-') return false;
    start = col;
    if (c == '-') nextCharacter();
    if (c == '0') {
        nextCharacter();
    } else if (isDigit(c)) {
        while (isDigit(c)) nextCharacter();
    } else {
        return false;
        //return error("number", start);
    }
    if (c == '.') {
        nextCharacter();
        if (isDigit(c)) {
            while (isDigit(c)) nextCharacter();
        } else {
            return false;
            //return error("number", start);
        }
    }
    if (c == 'e' || c == 'E') {
        nextCharacter();
        if (c == '+' || c == '-') {
            nextCharacter();
        }
        if (isDigit(c)) {
            while (isDigit(c)) nextCharacter();
        } else {
            return false;
            //return error("number", start);
        }
    }
    return true;
}

function string() {
    var idf;

    if (c == '"') {
        idf = '"';
    } else if (c == "'") {
        idf = '"';
    } else {
        return false;
    }

    start = col;
    escaped = false;
    //for (nextCharacter(); c != CharacterIterator.DONE; nextCharacter()) {
    for (nextCharacter(); col - 1 != len; nextCharacter()) {
        //alert('[' + c + ']')
        if (!escaped && c == '\\') {
            escaped = true;
        } else if (escaped) {
            if (!escape()) {
                return false;
            }
            escaped = false;
        } else if (c == idf) {
            nextCharacter();
            return true;
        }
    }
    return false;
    //return error("quoted string", start);
}

function escape() {
    start = col - 1;
    if (" \\\"/bfnrtu".indexOf(c) < 0) {
        return false;
        //return error("escape sequence  \\\",\\\\,\\/,\\b,\\f,\\n,\\r,\\t  or  \\uxxxx ", start);
    }
    if (c == 'u') {
        if (!ishex(nextCharacter()) || !ishex(nextCharacter()) || !ishex(nextCharacter()) || !ishex(nextCharacter())) {
            return false;
            //return error("unicode escape sequence  \\uxxxx ", start);
        }
    }
    return true;
}

function ishex(c) {
    return "0123456789abcdefABCDEF".indexOf(c) >= 0;
}

function nextCharacter() {
    alert(c);
    c = valstring.charAt(col++);
    return c;
}

function skipWhiteSpace() {
    while (isWhitespace(c)) {
        nextCharacter();
    }
}

function isWhitespace(charToCheck) {
    var whitespaceChars = " \t\n\r\f";
    return (whitespaceChars.indexOf(charToCheck) != -1);
}

function isDigit(aChar) {
    myCharCode = aChar.charCodeAt(0);

    if ((myCharCode > 47) && (myCharCode < 58)) {
        return true;
    }

    return false;
}

/*
function error(type, int col) {
    //System.out.printf("type: %s, col: %s%s", type, col, System.getProperty("line.separator"));
    return false;
}
*/