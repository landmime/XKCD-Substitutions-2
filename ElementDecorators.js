// Do nothing to an element.
var NullElementDecorator = function() {

}

NullElementDecorator.prototype.decorate = function(element) {

}

// Add a dotted underline to an element.
var UnderlineElementDecorator = function() {

}

UnderlineElementDecorator.prototype.decorate = function(element) {
    element.style.borderBottom = '1px dotted black';
    element.style.display = 'inline';
}

// Change an element's background color to the given color.
var HighlightElementDecorator = function(backgroundColor) {
    this.backgroundColor = backgroundColor;
}

HighlightElementDecorator.prototype.decorate = function(element) {
    element.style.backgroundColor = this.backgroundColor;
}
