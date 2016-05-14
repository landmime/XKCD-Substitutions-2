/**
 * Creates a Settings object with the default values.
 *
 * @class Settings
 * @constructor
 */
var Settings = function() {
    this.blacklistedDomains = [
        'mail.google.com',
        'gmail.com'
    ];

    this.replacements = [
        // XKCD 1004
        new Replacement('batman', 'a man dressed like a bat'),

        // XKCD 1031
        new Replacement('keyboard', 'leopard'),

        // XKCD 1288
        new Replacement('witnesses', 'these dudes I know'),
        new Replacement('new study', 'tumblr post'),
        new Replacement('rebuild', 'avenge'),
        new Replacement('space', 'spaaace'),
        new Replacement('google glass', 'virtual boy'),
        new Replacement('smartphone', 'pokedex'),
        new Replacement('electric', 'atomic'),
        new Replacement('senator', 'elf-lord'),
        new Replacement('car', 'cat'),
        new Replacement('election', 'eating contest'),
        new Replacement('congressional leader', 'river spirit'),
        new Replacement('homeland security', 'homestar runner'),
        new Replacement('could not be reached for comment', 'is guilty and everyone knows it'),

        // XKCD 1418
        new Replacement('force', 'horse'),

        // XKCD 1625
        new Replacement('debate', 'dance-off'),
        new Replacement('self driving', 'uncontrollably swerving'),
        new Replacement('poll', 'psychic reading'),
        new Replacement('candidate', 'airbender'),
        new Replacement('drone', 'dog'),
        new Replacement('vows to', "probably won't"),
        new Replacement('at large', 'very large'),
        new Replacement('successfully', 'suddenly'),
        new Replacement('expands', 'physically expands'),
        new Replacement('first degree', "friggin' awful"),
        new Replacement('second degree', "friggin' awful"),
        new Replacement('third degree', "friggin' awful"),
        new Replacement('an unknown number', 'like hundreds'),
        new Replacement('front runner', 'blade runner'),
        new Replacement('global', 'spherical'),
        new Replacement('years', 'minutes'),
        new Replacement('no indication', 'lots of signs'),
        new Replacement('urged restraint by', 'drunkenly egged on'),
        new Replacement('horsepower', 'tons of horsemeat'),

        // ???
        new Replacement('allegedly', 'kinda probably'),

        // XKCD 1679
        new Replacement('gaffe', 'magic spell'),
        new Replacement('ancient', 'haunted'),
        new Replacement('star-studded', 'blook-soaked'),
        new Replacement('remains to be seen', 'will never be known'),
        new Replacement('silver bullet', 'way to kill werewolves'),
        new Replacement('subway system', 'tunnels I found'),
        new Replacement('surprising', 'surprising (but not to me)'),
        new Replacement('war of words', 'interplanetary war'),
        new Replacement('tension', 'sexual tension'),
        new Replacement('cautiously optimistic', 'delusional'),
        new Replacement('doctor who', 'the big bang theory'),
        new Replacement('win votes', 'find pokemon'),
        new Replacement('behind the headline', 'beyond the grave'),
        new Replacement('email', 'poem'),
        new Replacement('facebook post', 'poem'),
        new Replacement('tweet', 'poem'),
        new Replacement('facebook ceo', 'this guy'),
        new Replacement('latest', 'final'),
        new Replacement('disrupt', 'destroy'),
        new Replacement('meeting', 'menage a trois'),
        new Replacement('scientists', 'Channing Tatum and his friends'),
        new Replacement("you won't believe", "I'm really sad about")
    ];

    this.replacedStyle = SettingsValue.REPLACED_STYLE_NONE;

    this.replacementLimit = 1000;
}

/**
 * Load Settings data from Chrome local storage, convert it into a Settings
 * object, then run a callback with the loaded object.
 *
 * @method loadFromStorage
 * @static
 * @param onLoaded {function}
 */
Settings.loadFromStorage = function(onLoaded) {
    var settings = new Settings();
    chrome.storage.local.get(null, function(items) {
        if (items.replacedStyle) {
            settings.replacedStyle = items.replacedStyle;
        }

        // Convert replacement dictionaries to Replacement objects.
        if (items.replacements) {
            settings.replacements = items.replacements.map(
                function(replacementSetting, index, array) {
                    return new Replacement(replacementSetting.from,
                                           replacementSetting.to);
                }
            );
        }

        if (items.blacklistedDomains) {
            settings.blacklistedDomains = items.blacklistedDomains;
        }

        if (items.replacementLimit) {
            settings.replacementLimit = items.replacementLimit;
        }

        onLoaded(settings);
    });
}

/**
 * Convert the Settings object to a format accepted by Chrome, save it local
 * storage, then run a callback once the save is complete.
 *
 * @method saveToStorage
 * @param onSaved {function}
 */
Settings.prototype.saveToStorage = function(onSaved) {
    var replacements = this.replacements.map(
        function(replacement, index, array) {
            return {from: replacement.from, to: replacement.to};
        }
    );

    chrome.storage.local.set({
        replacedStyle: this.replacedStyle,
        replacements: this.replacements,
        blacklistedDomains: this.blacklistedDomains,
        replacementLimit: parseInt(this.replacementLimit)
    }, onSaved);
}
