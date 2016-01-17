// Returns the replacedStyle selection box element.
function getReplacedStyleElement() {
    return document.getElementById('replacedStyle');
}

// Returns the replacements table.
function getReplacementsTable() {
    return document.getElementById('replacements');
}

// Returns the blacklisted domains table.
function getBlacklistedDomainsTable() {
    return document.getElementById('blacklistedDomains');
}

// Returns the replacement limit input box element.
function getReplacementLimitElement() {
    return document.getElementById('replacementLimit');
}

// Returns the status div element.
function getStatusElement() {
    return document.getElementById('status');
}

// Returns the save button for the settings form.
function getSaveButton() {
    return document.getElementById('save');
}

// Returns the add button for the replacement table.
function getAddReplacementButton() {
    return document.getElementById('addReplacement');
}

// Returns the add button for the blacklisted domains table.
function getAddBlacklistedDomainButton() {
    return document.getElementById('addBlacklistedDomain');
}

// Extract the settings data from options.html and save them to chrome storage.
function saveSettings() {
    var settings = new Settings();

    settings.replacedStyle = getReplacedStyleElement().value;

    settings.replacements = [];

    // Skip the last row since it just contains the "Add" button.
    var replacementsTable = getReplacementsTable();
    for (var i = 1; i < replacementsTable.rows.length - 1; ++i) {
        var row = replacementsTable.rows[i];
        var fromValue = row.cells[0].firstChild.value;
        var toValue = row.cells[1].firstChild.value;
        var replacement = new Replacement(fromValue, toValue);
        settings.replacements.push(replacement);
    }

    settings.blacklistedDomains = []

    // Skip the last row since it just contains the "Add" button.
    var blacklistedDomainsTable = getBlacklistedDomainsTable();
    for (var i = 1; i < blacklistedDomains.rows.length - 1; ++i) {
        var row = blacklistedDomains.rows[i];
        var blacklistedDomain = row.cells[0].firstChild.value;
        settings.blacklistedDomains.push(blacklistedDomain);
    }

    settings.replacementLimit = getReplacementLimitElement().value;

    settings.saveToStorage(function() {
        // Update status to let user know settings were saved.
        var status = getStatusElement();
        status.textContent = 'Settings saved.';
        setTimeout(function() {
          status.textContent = '';
        }, SaveStatus.MESSAGE_TIMEOUT_MS);
    });
}

// Load the settings from chrome and render them in options.html
function loadSettings() {
    Settings.loadFromStorage(function(settings) {
        // Set the replacedStyle value based on the current settings.
        var replacedStyle = settings.replacedStyle;
        getReplacedStyleElement().value = replacedStyle;

        // Add each current replacement as a row in the replacements table.
        for (var i = 0; i < settings.replacements.length; ++i) {
            var replacement = settings.replacements[i];
            addReplacementRow(replacement.from, replacement.to);
        }

        for (var i = 0; i < settings.blacklistedDomains.length; ++i) {
            var blacklistedDomain = settings.blacklistedDomains[i];
            addBlacklistedDomainRow(blacklistedDomain);
        }

        getReplacementLimitElement().value = settings.replacementLimit;
    });
}

// Add a blank row the replacements table.
function addBlankReplacementRow() {
    addReplacementRow('', '');
}

// Add a row the the replacements table with the given from and to values.
function addReplacementRow(fromValue, toValue) {
    var table = getReplacementsTable();
    var rowNumber = table.rows.length - 1;
    var row = table.insertRow(rowNumber);

    var fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.value = fromValue;

    var fromCell = row.insertCell(0);
    fromCell.appendChild(fromInput);

    var toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.value = toValue;

    var toCell = row.insertCell(1);
    toCell.appendChild(toInput);

    var removeButton = document.createElement('input');
    removeButton.type = 'button';
    removeButton.value = 'Remove';
    removeButton.onclick = function(clickEvent) {
        var button = clickEvent.srcElement;
        var cell = button.parentNode;
        var row = cell.parentNode;
        var table = row.parentNode;
        table.deleteRow(row.rowIndex);
    }

    var removeCell = row.insertCell(2);
    removeCell.appendChild(removeButton);
}

// Add a new row witht the given domain value to the table of blacklisted domains.
function addBlacklistedDomainRow(domain) {
    var table = getBlacklistedDomainsTable();
    var rowNumber = table.rows.length - 1;
    var row = table.insertRow(rowNumber);

    var input = document.createElement('input');
    input.type = 'text';
    input.value = domain;

    var cell = row.insertCell(0);
    cell.appendChild(input);

    var removeButton = document.createElement('input');
    removeButton.type = 'button';
    removeButton.value = 'Remove';
    removeButton.onclick = function(clickEvent) {
        var button = clickEvent.srcElement;
        var cell = button.parentNode;
        var row = cell.parentNode;
        var table = row.parentNode;
        table.deleteRow(row.rowIndex);
    }

    var removeCell = row.insertCell(1);
    removeCell.appendChild(removeButton);
}


// Add a blank row to the table of blacklisted domains.
function addBlankBlacklistedDomainRow() {
    addBlacklistedDomainRow('');
}

document.addEventListener('DOMContentLoaded', loadSettings);

getSaveButton().addEventListener('click', saveSettings);
getAddReplacementButton().addEventListener('click', addBlankReplacementRow);
getAddBlacklistedDomainButton().addEventListener('click',
                                                 addBlankBlacklistedDomainRow);
