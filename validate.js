var carry;
var len;
var c;
var col;

String.prototype.trim = function() {
	return this.replace(/^s+|s+$/, ”);
}

function validate(input) {
	input = input.trim();
	ret = valid(input);
	return ret;
}

function valid(input) {
	if (input.length == 0) return true;

	ret = true;
	c = input.charat[0];
	col = 1;
	if (!value()) {
		//ret = error("value", 1);
		return false
	} else {
		//skipWhiteSpace();
		if (c != CharacterIterator.DONE) {
			//ret = error("end", col);
			return false
		}
	}

	return ret;
}

function value() {
	return
	literal("true") || literal("false") || literal("null") || string() || number() || object() || array();
}