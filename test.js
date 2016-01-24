// Trying to split a null textNode should return null.
QUnit.test('TextNode.split null textNode', function(assert) {
    assert.notOk(TextNode.split(null, 1, 1, 'SPAN'));
});

// Trying to split a non text node should return null.
QUnit.test('TextNode.split non text node', function(assert) {
    var nodeParent = document.createElement('div');
    var nonTextNode = document.createElement('a');
    nonTextNode.textContent = 'abc'
    nodeParent.appendChild(nonTextNode);
    assert.notOk(TextNode.split(nonTextNode, 1, 1, 'SPAN'));
});

// Trying to split an orphaned node should return null, since splitting it
// requires changing the parent's childNodes.
QUnit.test('TextNode.split node without parent', function(assert) {
    var textNode = document.createTextNode('abc');
    assert.notOk(TextNode.split(textNode, 1, 1, 'SPAN'));
});

// Trying to split a non-positive amount of text doesn't make sense, and should
// return null.
QUnit.test('TextNode.split length <= 0', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('abc');
    textNodeParent.appendChild(textNode);
    assert.notOk(TextNode.split(textNode, 0, 0, 'SPAN'));
    assert.notOk(TextNode.split(textNode, 0, -1, 'SPAN'));
});

// Trying to split at a location past then end of the text doesn't make sense,
// and should return null.
QUnit.test('TextNode.split startIndex >= text size', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('abc');
    textNodeParent.appendChild(textNode);

    assert.notOk(TextNode.split(textNode, 3, 1, 'SPAN'));
    assert.notOk(TextNode.split(textNode, 4, 1, 'SPAN'));
});

// The common case is splitting a text node somewhere in the middle, resulting
// in the text to the left of it in the first node, the target text in the
// middle, and the remainder in the right node.
QUnit.test('TextNode.split split in the middle', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('abc');
    textNodeParent.appendChild(textNode);

    var result = TextNode.split(textNode, 1, 1, 'SPAN');
    assert.ok(3 == result.length);

    assert.equal(result[0].nodeType, NodeType.TEXT);
    assert.equal(result[0].textContent, 'a');

    assert.equal(result[1].nodeType, NodeType.ELEMENT);
    assert.equal(result[1].nodeName, 'SPAN');
    assert.equal(result[1].textContent, 'b');

    assert.equal(result[2].nodeType, NodeType.TEXT);
    assert.equal(result[2].textContent, 'c');
});

// For consistency with the common case, splitting a node at the very beginning
// will still result in three nodes, the first of which will be empty.
QUnit.test('TextNode.split split at the beginning', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('abc');
    textNodeParent.appendChild(textNode);

    var result = TextNode.split(textNode, 0, 1, 'SPAN');
    assert.ok(3 == result.length);

    assert.equal(result[0].nodeType, NodeType.TEXT);
    assert.equal(result[0].textContent, '');

    assert.equal(result[1].nodeType, NodeType.ELEMENT);
    assert.equal(result[1].nodeName, 'SPAN');
    assert.equal(result[1].textContent, 'a');

    assert.equal(result[2].nodeType, NodeType.TEXT);
    assert.equal(result[2].textContent, 'bc');
});

// For consistency with the common case, splitting a node at the very beginning
// will still result in three nodes, the last of which will be empty.
QUnit.test('TextNode.split split at the end', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('abc');
    textNodeParent.appendChild(textNode);

    var result = TextNode.split(textNode, 2, 1, 'SPAN');
    assert.ok(3 == result.length);

    assert.equal(result[0].nodeType, NodeType.TEXT);
    assert.equal(result[0].textContent, 'ab');

    assert.equal(result[1].nodeType, NodeType.ELEMENT);
    assert.equal(result[1].nodeName, 'SPAN');
    assert.equal(result[1].textContent, 'c');

    assert.equal(result[2].nodeType, NodeType.TEXT);
    assert.equal(result[2].textContent, '');
});

// For consistency with the common case, splitting a text node will still result
// in three nodes, the first and last being empty.
QUnit.test('TextNode.split split the entire text', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('abc');
    textNodeParent.appendChild(textNode);

    var result = TextNode.split(textNode, 0, 3, 'SPAN');
    assert.ok(3 == result.length);

    assert.equal(result[0].nodeType, NodeType.TEXT);
    assert.equal(result[0].textContent, '');

    assert.equal(result[1].nodeType, NodeType.ELEMENT);
    assert.equal(result[1].nodeName, 'SPAN');
    assert.equal(result[1].textContent, 'abc');

    assert.equal(result[2].nodeType, NodeType.TEXT);
    assert.equal(result[2].textContent, '');
});

// The common case is replacing a single occurance once, somewhere in the middle
// of a text node.
QUnit.test('Replacer.run common case', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('a b c');
    textNodeParent.appendChild(textNode);

    var replacements = [new Replacement('b', 'xxx')];
    var replacer = new Replacer(replacements, SettingsValue.REPLACED_STYLE_NONE, 0);

    assert.equal(1, replacer.run(textNodeParent));

    assert.equal(textNodeParent.childNodes[0].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[0].textContent, 'a ');

    assert.equal(textNodeParent.childNodes[1].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[1].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[1].textContent, 'xxx');

    assert.equal(textNodeParent.childNodes[2].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[2].textContent, ' c');
});

// Replacing multiple occurances of the same text in the same node should work
// by splitting the text node into (n * 2) + 1 new nodes, where n is the number
// of replacements.
QUnit.test('Replacer.run multiple instances of the same replacement',
    function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('a b b c');
    textNodeParent.appendChild(textNode);

    var replacements = [new Replacement('b', 'xxx')];
    var replacer = new Replacer(replacements, SettingsValue.REPLACED_STYLE_NONE, 0);

    assert.equal(2, replacer.run(textNodeParent));

    assert.equal(textNodeParent.childNodes[0].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[0].textContent, 'a ');

    assert.equal(textNodeParent.childNodes[1].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[1].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[1].textContent, 'xxx');

    assert.equal(textNodeParent.childNodes[2].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[2].textContent, ' ');

    assert.equal(textNodeParent.childNodes[3].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[3].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[3].textContent, 'xxx');

    assert.equal(textNodeParent.childNodes[4].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[4].textContent, ' c');
});

// Replacing multiple different replacements in the node should work by
// splitting the text node into (n * 2) + 1 new nodes, where n is the number
// of replacements.
QUnit.test('Replacer.run multiple different replacements', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('a b c d');
    textNodeParent.appendChild(textNode);

    var replacements = [new Replacement('b', 'xxx'), new Replacement('c', 'yyy')];
    var replacer = new Replacer(replacements, SettingsValue.REPLACED_STYLE_NONE, 0);

    assert.equal(2, replacer.run(textNodeParent));

    assert.equal(textNodeParent.childNodes[0].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[0].textContent, 'a ');

    assert.equal(textNodeParent.childNodes[1].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[1].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[1].textContent, 'xxx');

    assert.equal(textNodeParent.childNodes[2].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[2].textContent, ' ');

    assert.equal(textNodeParent.childNodes[3].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[3].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[3].textContent, 'yyy');

    assert.equal(textNodeParent.childNodes[4].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[4].textContent, ' d');
});

// Replacing with a zero length pattern should do nothing (and definitely not go
// into an infinite loop).
QUnit.test('Replacer.run zero length match', function(assert) {
    var textNodeParent = document.createElement('div');
    var text = 'a b c d';
    var textNode = document.createTextNode(text);
    textNodeParent.appendChild(textNode);

    var replacements = [new Replacement('', 'xxx')];
    var replacer = new Replacer(replacements, SettingsValue.REPLACED_STYLE_NONE, 0);

    assert.equal(0, replacer.run(textNodeParent));

    assert.equal(textNode.nodeType, NodeType.TEXT);
    assert.equal(textNode.textContent, text);
});

// Replacing with a pattern with an empty value should work as expected, by
// creating an empty node in place of the matched text.
QUnit.test('Replacer.run zero length value', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('a b c');
    textNodeParent.appendChild(textNode);

    var replacements = [new Replacement('b', '')];
    var replacer = new Replacer(replacements, SettingsValue.REPLACED_STYLE_NONE, 0);

    assert.equal(1, replacer.run(textNodeParent));

    assert.equal(textNodeParent.childNodes[0].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[0].textContent, 'a ');

    assert.equal(textNodeParent.childNodes[1].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[1].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[1].textContent, '');

    assert.equal(textNodeParent.childNodes[2].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[2].textContent, ' c');
});

// The Replacer has a limit on the number of replacements its object will make, mostly
// to avoid hanging a page if a bug is encountered.
QUnit.test('Replacer.run replacement limit', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('a b b b');
    textNodeParent.appendChild(textNode);

    var replacements = [new Replacement('b', 'x')];
    var replacer = new Replacer(replacements, SettingsValue.REPLACED_STYLE_NONE, 2);

    assert.equal(2, replacer.run(textNodeParent));

    assert.equal(textNodeParent.childNodes[0].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[0].textContent, 'a ');

    assert.equal(textNodeParent.childNodes[1].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[1].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[1].textContent, 'x');

    assert.equal(textNodeParent.childNodes[2].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[2].textContent, ' ');

    assert.equal(textNodeParent.childNodes[3].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[3].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[3].textContent, 'x');

    assert.equal(textNodeParent.childNodes[4].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[4].textContent, ' b');
});

// A Replacer should only replace text in a node once.  So if a replacement's 'to'
// text matches another (or its own) 'from' pattern, then only the first replacement
// will be evaluated.
QUnit.test('Replacer.run only process nodes once', function(assert) {
    var textNodeParent = document.createElement('div');
    var textNode = document.createTextNode('a');
    textNodeParent.appendChild(textNode);

    var replacements = [new Replacement('a', 'b'),
                        new Replacement('b', 'a')];
    var replacer = new Replacer(replacements, SettingsValue.REPLACED_STYLE_NONE, 100);

    assert.equal(1, replacer.run(textNodeParent));

    assert.equal(textNodeParent.childNodes[0].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[0].textContent, '');

    assert.equal(textNodeParent.childNodes[1].nodeType, NodeType.ELEMENT);
    assert.equal(textNodeParent.childNodes[1].nodeName, 'SPAN');
    assert.equal(textNodeParent.childNodes[1].textContent, 'b');

    assert.equal(textNodeParent.childNodes[2].nodeType, NodeType.TEXT);
    assert.equal(textNodeParent.childNodes[2].textContent, '');

    assert.equal(1, replacer.run(textNodeParent.childNodes[1]));
});
