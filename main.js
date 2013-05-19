/// Copyright © 2013 Brian Mock & Kyle Paulsen <binary.elk@gmail.com>
/// This work is free. You can redistribute it and/or modify it under the
/// terms of the Do What The Fuck You Want To Public License, Version 2,
/// as published by Sam Hocevar. See the COPYING file for more details.
///
/// This program is free software. It comes without any warranty, to
/// the extent permitted by applicable law. You can redistribute it
/// and/or modify it under the terms of the Do What The Fuck You Want
/// To Public License, Version 2, as published by Sam Hocevar. See
/// http://www.wtfpl.net/ for more details.

"use strict";

function $create(ele, attrs, styles) {
    var ele = document.createElement(ele);
    for (var attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            ele[attr] = attrs[attr];
        }
    }

    for (var style in styles) {
        if (styles.hasOwnProperty(style)) {
            ele.style[style] = styles[style];
        }
    }

    return ele;
}

function listen(elem, name, callback, bubble) {
    elem.addEventListener(name, callback, !!bubble);
}

var slice = [].slice;
function query(s, e) {
    e = e || document;
    return slice.call(e.querySelectorAll(s));
}

function id(id) {
    return document.getElementById(id);
}

function selectText(elem) {
    elem.select();
}

function addClass(elem, klass) {
    elem.classList.add(klass);
}

function removeClass(elem, klass) {
    elem.classList.remove(klass);
}

function hasClass(elem, klass) {
    return elem.classList.contains(klass);
}

var max = Math.max;
var min = Math.min;
function clamp(x, a, b) {
    return max(min(x, b), a);
}

function chr(code) {
    return String.fromCharCode(code);
}

var groupIndex = 1;
function jumpBy(offset) {
    var n = picker.length - 1;
    groupIndex = clamp(groupIndex + offset, 1, n);
    picker.selectedIndex = groupIndex;
    gotoValue();
}

function gotoValue() {
    window.location.hash = "-";
    window.location.hash = picker.value;
    picker.selectedIndex = 0;
}

function clearSelection() {
    var sel = document.selection;
    if (sel && sel.empty) {
        sel.empty();
    }
    else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        var active = document.activeElement;
        if (active) {
            var tagName = active.nodeName;
            if (tagName === "TEXTAREA" ||
                (tagName === "INPUT" && active.type === "text")) {
                active.selectionStart = active.selectionEnd;
            }
        }
    }
}

function populateFavorites() {
    var newEmote = $create("input", {
        type        : "text",
        id          : "new-kaomoji-input",
        placeholder : "add custom kaomoji...",
    }, {});

    listen(newEmote, "blur", function() {
        if (newEmote.value.length > 0) {
            addEmoteFavorite(newEmote.value);
            highlightFavorites(newEmote.value);
            newEmote.value = "";
        }
    });

    listen(newEmote, "keydown", function(e) {
        if (newEmote.value.length > 0 && e.which === K.ENTER) {
            addEmoteFavorite(newEmote.value);
            highlightFavorites(newEmote.value);
            newEmote.value = "";
        }
    });

    favorites.appendChild(newEmote);

    highlightFavorites();

    store.forEach(makeEmote);
}

function saveFaves() {
    try {
        localStorage.favorites = JSON.stringify(store);
    }
    catch (e) {
    }
}

function addEmoteFavorite(text) {
    store.push(text);
    makeEmote(text);
    saveFaves();
}

function removeEmoteFavorite(text) {
    var loc = store.indexOf(text);
    if (loc >= 0) {
        store.splice(loc, 1);
        saveFaves();
    }
}

function makeEmote(text) {
    var newEmote;
    if (EMBED) {
        newEmote = $create("button", {
            className   : "kaomoji",
            type        : "button",
        }, {});
        newEmote.setAttribute("data-text", text);
        newEmote.appendChild(document.createTextNode(text));
    }
    else {
        newEmote = $create("input", {
            className   : "kaomoji",
            type        : "text",
            value       : text,
            size        : "1",
            readonly    : "readonly",
        }, {});
    }

    favorites.insertBefore(newEmote, id("new-kaomoji-input"));
}

var picker;
var store = [];
var favorites;
var allEmotes;
var closeButt;
var overlay;
var helpMe;
var infoMsg;
var hideHelp;

var K = {
    ESC     : 27,
    ENTER   : 13,
};

function kaomojiText(elem) {
    return EMBED
        ? elem.getAttribute("data-text")
        : elem.value;
}

function highlightFavorites(toHighlight) {
    toHighlight = (typeof toHighlight === "undefined")
        ? store
        : [toHighlight];

    allEmotes.forEach(function(btn) {
        var text = kaomojiText(btn);
        if (toHighlight.indexOf(text) >= 0) {
            addClass(btn, "favorited");
        }
    });
}

function unhighlightFavorite(elements, text, remove) {
    var i = 0;
    var n = elements.length;
    for (; i < n; ++i) {
        var elem = elements[i];

        if (kaomojiText(elem) !== text)
            continue;

        if (remove) {
            elem.parentNode.removeChild(elem);
            break;
        }
        else if (elem.parentNode.id !== "favorites-group") {
            removeClass(elem, "favorited");
            break;
        }
    }
}

function toggleFavorite(elem) {
    var text = kaomojiText(elem);

    // Removing favorite from favorites group
    if (elem.parentNode.id === "favorites-group") {
        unhighlightFavorite(allEmotes, text, false);
        removeEmoteFavorite(text);
        favorites.removeChild(elem);
    }
    // Toggle favorite from any other group
    else if (hasClass(elem, "favorited")) {
        var favoriteEmotes = query(".kaomoji", favorites);
        unhighlightFavorite(favoriteEmotes, text, true);
        removeEmoteFavorite(text);
        removeClass(elem, "favorited");
    }
    // Add favorite
    else {
        addEmoteFavorite(text);
        addClass(elem, "favorited");
    }
}

try {
    store = JSON.parse(localStorage.favorites);
}
catch (e) {
}

listen(window, "DOMContentLoaded", function(event) {
    allEmotes = query(".kaomoji");
    picker    = id("picker");
    favorites = id("favorites-group");
    closeButt = id("close-button");
    overlay   = id("modal-overlay");
    helpMe    = id("help-me");
    infoMsg   = id("info-message");
    hideHelp  = id("hide-info-message-forever");

    picker.selectedIndex = 0;

    if (localStorage.display_tips !== "false") {
        infoMsg.style.display = "block";
    }

    listen(hideHelp, "click", function(e) {
        e.preventDefault();
        infoMsg.style.display = "none";
        localStorage.display_tips = "false";
    });

    listen(closeButt, "click", function(e) {
        overlay.style.display = "none";
    });

    listen(helpMe, "click", function(e) {
        overlay.style.display = "block";
        e.preventDefault();
    });

    // Left click to select text
    listen(document, 'click', function(e) {
        var elem = e.target;
        if (elem.nodeName === "INPUT"
        && hasClass(elem, "kaomoji")
        && e.which === 1) {
            e.preventDefault();
            selectText(elem);
        }
    });

    listen(picker, "change", gotoValue);

    // Right click to favorite
    listen(document, 'contextmenu', function(e) {
        var elem = e.target;
        if (hasClass(elem, "kaomoji")) {
            e.preventDefault();
            toggleFavorite(elem);
        }
        clearSelection();
    });

    populateFavorites();
});
