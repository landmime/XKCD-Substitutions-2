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

// Returns the status div element.
function getStatusElement() {
    return document.getElementById('status');
}

// Returns the save button for the settings form.
function getSaveButton() {
    return document.getElementById('save');
}

// Returns the "Load Default Settings" button for the settings form.
function getLoadDefaultSettingsButton() {
    return document.getElementById('loadDefaultSettings');
}

// Returns the add button for the replacement table.
function getAddReplacementButton() {
    return document.getElementById('addReplacement');
}

// Returns the add button for the blacklisted domains table.
function getAddBlacklistedDomainButton() {
    return document.getElementById('addBlacklistedDomain');
}

// Clears all the data rows from a settings table.
function clearTable(table) {
    // The first row is the header, and the last row is the "Add" button.  We
    // want to remove everything in between.
    while (table.rows.length > 2) {
        table.deleteRow(1);
    }
}

// Display a status message for a short time.
function flashStatusMessage(message) {
    var status = getStatusElement();
    status.textContent = message;
    setTimeout(function() {
      status.textContent = '';
    }, SaveStatus.MESSAGE_TIMEOUT_MS);
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

    settings.saveToStorage(function() {
        // Update status to let user know settings were saved.
        flashStatusMessage('Current settings saved.');
    });
}

// Load the default settings into the page.
function loadDefaultSettings() {
    var settings = new Settings();
    loadSettings(settings);
    flashStatusMessage('Default settings loaded.');
}

// Load the values from a settings object into the page.
function loadSettings(settings) {
    // Set the replacedStyle value based on the current settings.
    var replacedStyle = settings.replacedStyle;
    getReplacedStyleElement().value = replacedStyle;

    // Add each current replacement as a row in the replacements table.
    clearTable(getReplacementsTable());
    for (var i = 0; i < settings.replacements.length; ++i) {
        var replacement = settings.replacements[i];
        addReplacementRow(replacement.from, replacement.to);
    }

    // Add each blacklisted domain as a row in the blacklisted domains table.
    clearTable(getBlacklistedDomainsTable());
    for (var i = 0; i < settings.blacklistedDomains.length; ++i) {
        var blacklistedDomain = settings.blacklistedDomains[i];
        addBlacklistedDomainRow(blacklistedDomain);
    }
}

// Load the settings from chrome and render them into the page.
function loadSettingsFromStorage() {
    Settings.loadFromStorage(function(settings) {
        loadSettings(settings);
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

// Add a new row with the given domain value to the table of blacklisted domains.
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

document.addEventListener('DOMContentLoaded', loadSettingsFromStorage);

getLoadDefaultSettingsButton().addEventListener('click', loadDefaultSettings);
getSaveButton().addEventListener('click', saveSettings);
getAddReplacementButton().addEventListener('click', addBlankReplacementRow);
getAddBlacklistedDomainButton().addEventListener('click', addBlankBlacklistedDomainRow);
