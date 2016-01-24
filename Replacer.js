// A Replacer is an object for modifying the DOM, by replacing one or more instances
// of strings with new values.  The replaced strings can be styled according to some
// predefined rules.
var Replacer = function(replacements, replacedStyle, replacementLimit) {
    this.replacements = replacements;
    this.replacedStyle = replacedStyle;
    this.replacementLimit = replacementLimit;

    if (this.replacedStyle == SettingsValue.REPLACED_STYLE_UNDERLINE) {
        this.decorator = new UnderlineElementDecorator();
    } else if (this.replacedStyle == SettingsValue.REPLACED_STYLE_HIGHLIGHT) {
        var color = SettingsValue.REPLACED_HIGHLIGHT_COLOR;
        this.decorator = new HighlightElementDecorator(color);
    } else {
        this.decorator = new NullElementDecorator();
    }

    this.replacementCount = 0;
}

// Check if the textNode contains replacable text.  If it does, then
//
// 1. Split the text into three new nodes, with the matched text in the middle.
// 2. Replace the text in the middle node according to the Replacement rule.
// 3. Style the middle node according to the settings,
// 4. Return the new middle node.
//
// If the textNode does not contain replacable text, then null is returned.
Replacer.prototype.maybeSplitAndStyleTextNode = function (node, replacement) {
    var result = replacement.pattern.exec(node.textContent);
    if (!result) {
        return null;
    }

    // Zero length matches should not be replaced since if TextNode.split supported it
    // then the Replacer would run forever.
    var match = result[0];
    if (!match) {
        return null;
    }

    // Don't process the same node more than once, to avoid infinite loops if one
    // replacements 'to' text matches another (or the same) replacements 'from'
    // pattern.
    if (this.isTextNodeCreatedByReplacer(node)) {
        return null;
    }

    console.log('info: replacing "' + match + '" with "' + replacement.to + '"');
    var newNodes = TextNode.split(node, result.index, replacement.from.length, 'SPAN');
    if (!newNodes) {
        console.log("error: couldn't split text node \"" + node.textContent + '"');
        return null;
    }

    var to = replacement.to;

    // If the text we matched starts with an uppercase, then make the replaced text
    // start with an uppercase too.
    if (match[0][0] == match[0][0].toUpperCase()) {
        to = to[0].toUpperCase() + to.slice(1);
    }

    var styledNode = newNodes[1];
    if (this.decorator) {
        this.decorator.decorate(styledNode);
    }
    styledNode.textContent = to;

    // Mark the styled node so we can know not to try to reprocess it again later.
    this.markNodeCreatedByReplacer(styledNode);

    return styledNode;
}

// Replace all text matches of the given replacement in an element node.  Return the
// number of replacements that were made.
Replacer.prototype.replaceAllInTextNode = function (textNode, replacement) {
    if (this.replacementLimit && this.replacementCount >= this.replacementLimit) {
        return 0;
    }

    var startingReplacementCount = this.replacementCount;
    var newNode = this.maybeSplitAndStyleTextNode(textNode, replacement);

    // Performing a replacment splits a single node into three new ones.  We need to
    // recursively process the right siblings since a single text node could have
    // contain more than one instance of replacable text.
    if (newNode) {
        this.replacementCount++;
        this.replaceAllInTextNode(newNode.nextSibling, replacement);
    }

    return (this.replacementCount - startingReplacementCount);
}

// Recursively replace all text matches of the given replacement in the element tree.
// Returns the number of replacements that were made.
Replacer.prototype.replaceAllInNodeTree = function (node, replacement) {
    var replacementCount = 0;

    if (!node) {
        return replacementCount;
    }

    var child;
    var next;
    switch (node.nodeType) {
        case 1:  // Element
        case 9:  // Document
        case 11: // Document fragment
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                replacementCount += this.replaceAllInNodeTree(child, replacement);
                child = next;
            }
            break;

        case 3: // Text node
            replacementCount += this.replaceAllInTextNode(node, replacement);
            break;
    }

    return replacementCount;

}

// Run the replacement logic against all nodes in the tree.  Returns the number
// of replacments that were made.
Replacer.prototype.run = function (node) {
    // Perform the text replacement on then entire document.
    // It is important that the replacement list is in the outer loop, i.e. we
    // want
    //
    // for each replacement item
    //    for each document node
    //
    // NOT
    //
    // for each document node
    //    for each replacement item
    //
    // If we attempted to process the entire replacement list under each node,
    // then the logic gets much more complicated.  We would have to support
    // backtracking to cover the case where we split a node, but its left side
    // contains a replacement we haven't yet reached in the list.
    for (var i = 0; i < this.replacements.length; i++) {
        this.replaceAllInNodeTree(node, this.replacements[i]);
    }

    return this.replacementCount;
}

// Mark's a node has having been created as the result of a replacement, by adding
// a private CSS class name to it's list.  This should be called on the parent of
// the created TextNode (e.g. the SPAN), and not the TextNode itself.
Replacer.prototype.markNodeCreatedByReplacer = function(node) {
    node.classList.add(Replacer.PROCESSED_NODE_CLASS_NAME);
}

// Returns true if the text node was created by the replacer as the result of a
// replacement.
Replacer.prototype.isTextNodeCreatedByReplacer = function(node) {
    // We have to look at the parentNode since TextNodes do not have CSS styles.
    var classList = node.parentNode.classList;
    for (var i = 0; i < classList.length; i++) {
        var className = classList[i];
        if (className == Replacer.PROCESSED_NODE_CLASS_NAME) {
            return true;
        }
    }

    return false;
}

// The CSS class name added to all node's whose text is replaced.  This is not used
// for actual styling, but as a way to mark processed nodes so they can be identified
// later.
Replacer.PROCESSED_NODE_CLASS_NAME = 'XKCD_Substitutions_2_replaced';
