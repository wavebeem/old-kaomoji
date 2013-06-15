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

var UA = window.navigator.userAgent;
var isOsx = /Macintosh/.exec(UA);
var groupIndex = 1;
var slice = [].slice;
var max = Math.max;
var min = Math.min;
var newEmote;
var picker;
var store;
var favorites;
var allEmotes;
var closeButt;
var overlay;
var jumpTo;
var help;
var about;
var infoMsg;
var infoWin;
var hideHelp;
var headers;

var K = {
    ESC     : 27,
    ENTER   : 13,
};

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

function clamp(x, a, b) {
    return max(min(x, b), a);
}

function chr(code) {
    return String.fromCharCode(code);
}

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
    newEmote = $create("input", {
        type        : "text",
        id          : "new-kaomoji-input",
        placeholder : "add custom kaomoji...",
    }, {});

    listen(newEmote, "blur", function(e) {
        if (newEmote.value.length > 0) {
            sendMessageAll("addFavorite", { text: newEmote.value });
        }
    });

    listen(newEmote, "keydown", function(e) {
        if (e.which === K.ENTER && newEmote.value.length > 0) {
            sendMessageAll("addFavorite", { text: newEmote.value });
        }
    });

    favorites.appendChild(newEmote);

    highlightFavorites();

    store.forEach(makeEmote);
}

function addFavorite(text) {
    if (text && text.length > 0) {
        addEmoteFavorite(text);
        highlightFavorites(text);
        newEmote.value = "";
    }
}

function saveFaves() {
    try {
        localStorage.favorites = JSON.stringify(store);
    }
    catch (e) {
    }
}

function addEmoteFavorite(text) {
    var elemId = "favorite-" + stringToHex(text);

    // Don't add duplicate favorites
    if (id(elemId)) {
        return;
    }

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
    var emo;
    var elemId = "favorite-" + stringToHex(text);

    if (EMBED) {
        emo = $create("button", {
            id          : elemId,
            className   : "kaomoji",
            type        : "button",
        }, {});
        emo.setAttribute("data-text", text);
        emo.appendChild(document.createTextNode(text));
    }
    else {
        emo = $create("input", {
            id          : elemId,
            className   : "kaomoji",
            type        : "text",
            value       : text,
            size        : "1",
            readonly    : "readonly",
        }, {});
    }

    favorites.insertBefore(emo, id("new-kaomoji-input"));
}

function kaomojiText(elem) {
    return EMBED
        ? elem.getAttribute("data-text")
        : elem.value;
}

function highlightFavorites(toHighlight) {
    toHighlight = (typeof toHighlight === "undefined")
        ? store
        : [toHighlight];

    toHighlight.forEach(function(t) {
        var i = "kaomoji-" + stringToHex(t);
        var e = id(i);
        if (e) {
            addClass(e, "favorited");
        }
    });
}

function removeElement(elem) {
    if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
    }
}

function toggleFavorite(elemId) {
    var hex  = elemId.split('-')[1];
    var fave = id("favorite-" + hex);
    var emot = id("kaomoji-"  + hex);
    var text = kaomojiText(emot || fave);

    if (fave) {
        removeEmoteFavorite(text);
        favorites.removeChild(fave);
        if (emot) {
            removeClass(emot, "favorited");
        }
    }
    else {
        addEmoteFavorite(text);
        if (emot) {
            addClass(emot, "favorited");
        }
    }
}

function stringToHex(t) {
    var i = 0;
    var n = t.length;
    var T = "";

    while (i < n) {
        T += t.charCodeAt(i).toString(16);
        i++;
    }

    return T;
}

listen(window, "storage", function(e) {
    var msg;
    var arg;
    if (e.key.charAt(0) === '*' && e.newValue !== null) {
        delete localStorage[e.key];
        msg = e.key.substring(1);
        arg = e.newValue;
        arg = JSON.parse(arg || "{}");
        callHandler(msg, arg);
    }
});

function callHandler(name, obj) {
    messageHandlers[name].call(obj, obj);
}

var messageHandlers = {
    toggleFavorite  : function() { toggleFavorite(this.id) },
    addFavorite     : function() { addFavorite(this.text) },
};

function sendMessage(name, obj) {
    localStorage["*" + name] = JSON.stringify(obj);
}

function sendMessageAll(name, obj) {
    sendMessage(name, obj);
    callHandler(name, obj);
}

try {
    store = JSON.parse(localStorage.favorites);
}
catch (e) {
    store = [];
}

function totalOffsetY(elem) {
    return elem
        ? (elem.offsetTop || 0) + totalOffsetY(elem.offsetParent || elem.parentNode)
        : 0;
}

function viewportOffsetY() {
    return document.body.scrollTop || document.body.parentNode.scrollTop;
}

function capitalize(s) {
    var x  = s.charAt(0);
    var xs = s.substring(1);

    return x.toUpperCase() + xs;
}

function updateJumpToIndex() {
    if (! headers) return;

    var o;
    var e = headers[0];
    var h = viewportOffsetY();
    var n = headers.length;
    var i = 1;
    for (; i < n; i++) {
        e = headers[i];
        o = totalOffsetY(e);
        if (o > h) {
            break;
        }
    }
    e = headers[i - 1] || e;
    jumpTo.innerHTML = capitalize(e.id);
}

listen(window, "scroll", updateJumpToIndex);

listen(window, "DOMContentLoaded", function(event) {
    headers   = query(".group h2");
    allEmotes = query(".kaomoji");
    jumpTo    = id("jump-to");
    picker    = id("picker");
    favorites = id("favorites-group");
    closeButt = id("close-button");
    overlay   = id("modal-overlay");
    help      = id("help");
    about     = id("about");
    infoMsg   = id("info-message");
    infoWin   = id("info-window");
    hideHelp  = id("hide-info-message-forever");

    picker.selectedIndex = 0;

    if (localStorage.display_tips !== "false") {
        infoWin.style.display = "none";
        infoMsg.style.display = "inline-block";
        overlay.style.display = "block";
    }

    // Replace "Ctrl" with the OS X "Command" key
    if (isOsx) query("kbd.modifier").forEach(function(mod) {
        mod.innerHTML = "";
        mod.appendChild(document.createTextNode("\u2318"));
    });

    listen(hideHelp, "click", function(e) {
        infoWin.style.display = "none";
        infoMsg.style.display = "none";
        overlay.style.display = "none";
        localStorage.display_tips = "false";
        e.preventDefault();
    });

    listen(closeButt, "click", function(e) {
        infoWin.style.display = "none";
        infoMsg.style.display = "none";
        overlay.style.display = "none";
        e.preventDefault();
    });

    listen(help, "click", function(e) {
        infoWin.style.display = "none";
        infoMsg.style.display = "inline-block";
        overlay.style.display = "block";
        localStorage.display_tips = "true";
        e.preventDefault();
    });

    listen(about, "click", function(e) {
        infoWin.style.display = "inline-block";
        infoMsg.style.display = "none";
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
            sendMessageAll("toggleFavorite", { id: elem.id });
        }
        clearSelection();
    });

    populateFavorites();
});
