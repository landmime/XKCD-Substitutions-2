// A Replacement contains a pair of strings "from" and "to".  The "from" string is a
// search target that is intended to be replaced by the "to" string.  For convenience,
// the "from" string gets compiled into a regular expression for easier matching.
var Replacement = function(from, to) {
    this.from = from;
    this.to = to;
    this.pattern = new RegExp('\\b' + from + '(s)?\\b', 'i');
}
