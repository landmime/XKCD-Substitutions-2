DOCUMENTATION_ROOT=doc

SOURCES=Replacer/Constants.js \
        Replacer/ElementDecorators.js \
        Replacer/Replacement.js \
        Replacer/Replacer.js \
        Replacer/Settings.js \
        Replacer/TextNode.js

doc: $(SOURCES)
	yuidoc -x third-party --outdir $(DOCUMENTATION_ROOT) .

clean:
	rm -rf $(DOCUMENTATION_ROOT)
