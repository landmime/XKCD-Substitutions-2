// Sentinel value used to indicate that the extension is disabled on the current
// page.
var BADGE_DISABLED_ON_PAGE = -1;

// Update the badge with the number of replacements that have been made, or
// indicate that the extension is not running on the current page.
function setBadge(replacementCount) {
    var badge;
    if (replacementCount == BADGE_DISABLED_ON_PAGE) {
        badge = 'X';
    } else if (replacementCount == 0) {
        badge = '';
    } else {
        badge = replacementCount.toString();
    }

    message = {
        name: MessageName.SET_BADGE_TEXT,
        text: badge
    }

    chrome.extension.sendMessage(message);
}

// Run the extension on the current page as long as it isn't in the blacklist.
function run() {
    Settings.loadFromStorage(function(settings) {
        // Don't run the Replacer on blacklisted pages.
        if (settings.blacklistedDomains.indexOf(document.domain) >= 0) {
            setBadge(BADGE_DISABLED_ON_PAGE);
            return;
        }

        var replacer = new Replacer(settings.replacements,
                                    settings.replacedStyle,
                                    settings.replacementLimit);
        replacer.run(document.body);
        setBadge(replacer.replacementCount);

        // Watch for changes to the page, e.g to catch Facebooks or Reddit Enhancemnt
        // Suite's never-ending scrolling pages.  When new content is loaded we want
        // to apply replacements to it, just as if the user had navigated to a new
        // page.
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    replacer.run(mutation.addedNodes[i]);
                }
            });

            setBadge(replacer.replacementCount);
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

run();
