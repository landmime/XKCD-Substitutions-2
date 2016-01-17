// Return the domain part of a URL, by creating a link element and using its built in
// hostname method.
function domainFromURL(url) {
    var link = document.createElement ('a');
    link.href = url
    return link.hostname;
}

// Returns the enabledForDomain checkbox element.
function getEnabledForDomainCheckbox() {
    return document.getElementById('enabledForDomain');
}

// Returns the status div element.
function getStatusDiv() {
    return document.getElementById('status');
}

// Update the checkbox value with the given domain, by loading the settings and
// determining if the domain is blacklisted or not.
function updatePageWithDomain(domain) {
    Settings.loadFromStorage(function(settings) {
        var isCurrentDomainBlacklisted = false;
        for (var i = 0; i < settings.blacklistedDomains.length; ++i) {
            var blacklistedDomain = settings.blacklistedDomains[i];
            if (blacklistedDomain == domain) {
                isCurrentDomainBlacklisted = true;
                break;
            }
        }

        getEnabledForDomainCheckbox().checked = !isCurrentDomainBlacklisted;
    });
}

// Update the checkbox value based on the active tab's domain.
function updatePageFromCurrentDomain() {
    console.log('loadCurrentDomainSettings');
    chrome.tabs.query({ //This method output active URL 
        'active': true,
        'currentWindow': true
    }, function (tabs) {
        var tab = tabs[0];
        var domain = domainFromURL(tab.url);
        updatePageWithDomain(domain);
    });
}

// Toggle the domain's blacklist status, by either adding or removing the domain from
// the blacklist.
function toggleEnabledForDomain(domain) {
    Settings.loadFromStorage(function(settings) {
        var isCurrentDomainBlacklisted = getEnabledForDomainCheckbox().checked;

        if (isCurrentDomainBlacklisted) {
            var index = settings.blacklistedDomains.indexOf(domain);
            settings.blacklistedDomains.splice(index, 1);
        } else {
            settings.blacklistedDomains.push(domain);
        }

        settings.saveToStorage(function() {
            var status = getStatusDiv();
            status.textContent = 'Settings saved.';
            setTimeout(function() {
              status.textContent = '';
            }, SaveStatus.MESSAGE_TIMEOUT_MS);
        });
    });
}

// Toggle the blacklisted status of the active tab's domain.
function toggleEnabledForCurrentDomain() {
    var isCurrentDomainBlacklisted = !getEnabledForDomainCheckbox().checked;

    chrome.tabs.query({
        'active': true,
        'currentWindow': true
    }, function (tabs) {
        var tab = tabs[0];
        var domain = domainFromURL(tab.url);
        toggleEnabledForDomain(domain);
    });
}

document.addEventListener('DOMContentLoaded', updatePageFromCurrentDomain);
getEnabledForDomainCheckbox().addEventListener('click', toggleEnabledForCurrentDomain);
