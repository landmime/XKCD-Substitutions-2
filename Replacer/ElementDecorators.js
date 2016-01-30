/**
 * An ElementDecorator that does nothing to an element.
 *
 * @class NullElementDecorator
 * @constructor
 */
var NullElementDecorator = function() {

}

/**
 * Does nothing to the element.
 *
 * @method decorate
 * @param element {Element}
 */
NullElementDecorator.prototype.decorate = function(element) {

}

/**
 * An ElementDecorator that puts a black dotted underline beneath an element.
 *
 * @class UnderlineElementDecorator
 * @constructor
 */
var UnderlineElementDecorator = function() {

}

/**
 * Adds a 1px dotted black underline to the element's style.
 *
 * @method decorate
 * @param element {Element}
 */
UnderlineElementDecorator.prototype.decorate = function(element) {
    element.style.borderBottom = '1px dotted black';
    element.style.display = 'inline';
}

/**
 * An ElementDecorator that highlight's the element with a specific background
 * color.
 *
 * @class HighlightElementDecorator
 * @constructor
 * @param backgroundColor {String} The color to replace the elements background with.
 */
var HighlightElementDecorator = function(backgroundColor) {
    this.backgroundColor = backgroundColor;
}

/**
 * Replaces the element's background color with the decorator's backgroundColor.
 *
 * @method decorate
 * @param element {Element}
 */
HighlightElementDecorator.prototype.decorate = function(element) {
    element.style.backgroundColor = this.backgroundColor;
}
