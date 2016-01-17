var TextNode = TextNode || {};

// Split a single text node into three new nodes.
//
// The new left node will have a text type, and contain everything up until, but
// not including, the start index.
//
// The new middle node will be created with the given elementType, and will
// contain all of the text from the startIndex, to the startIndex + length.
//
// The new right node will contain everything after that.
//
// The return value is a three element array of the new nodes from left to
// right, or null if the node could not be split for any reason.
TextNode.split = function(textNode, startIndex, length, elementType) {
    if (!textNode ||
        !textNode.parentNode ||
        textNode.nodeType != NodeType.TEXT ||
        length <= 0 ||
        startIndex >= textNode.textContent.length) {
        return null;
    }

    var leftText = textNode.textContent.substring(0, startIndex);
    var leftNode = document.createTextNode(leftText);

    var middleText = textNode.textContent.substring(startIndex, startIndex + length);
    var middleNode = document.createElement(elementType);
    middleNode.textContent = middleText;

    var rightText = textNode.textContent.substring(startIndex + length);
    var rightNode = document.createTextNode(rightText);

    textNode.parentNode.insertBefore(leftNode, textNode);
    textNode.parentNode.insertBefore(rightNode, textNode.nextSibling);

    textNode.parentNode.appendChild(middleNode);
    textNode.parentNode.replaceChild(middleNode, textNode);

    return [leftNode, middleNode, rightNode];
}
