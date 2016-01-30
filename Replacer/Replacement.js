/**
 * A Replacement contains a pair of Strings, one of which is intended to be
 * replaced by the other.
 *
 * @class Replacement
 * @param from {String} The String that should be replaced with the to String
 * @param to {String} The String to replace the from String
 * @constructor
 */
var Replacement = function(from, to) {
    this.from = from;
    this.to = to;
    this.pattern = new RegExp('\\b' + from + '(s)?\\b', 'i');
}

/**
 * @property from
 * @type String
 */

/**
 * @property to
 * @type String
 */

/**
 * A compiled regular expression matching the from String on a word boundry.
 *
 * @property pattern
 * @type RegExp
 */
