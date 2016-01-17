// Message dispatcher.
chrome.extension.onMessage.addListener(function(message, sender) {
    var messageHandlers = {};
    messageHandlers[MessageName.SET_BADGE_TEXT] = setBadgeText;

    if (message.name in messageHandlers) {
        messageHandlers[message.name](message, sender);;
    }
});

// Handle setBadgeText messages by setting the toolbar badge text.
function setBadgeText(message, sender) {
    chrome.browserAction.setBadgeBackgroundColor({
        color: '#808080'
    });

    chrome.browserAction.setBadgeText({
        text: message.text,
        tabId: sender.tab.id
    });
}
