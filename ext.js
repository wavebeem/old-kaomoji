/// Copyright © 2013 Binary Elk <binary.elk@gmail.com>
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

function listen(elem, name, callback) {
    elem.addEventListener(name, callback, false);
}

function id(id) {
    return document.getElementById(id);
}

function addClass(elem, newClass) {
    // going for speed, so not using arrays and split.
    var classes = elem.className;
    if (classes.indexOf(newClass) === -1) {
        if (classes.length > 0) {
            newClass = " " + newClass;
        }
        classes += newClass;
        elem.className = classes;
    }
}

function removeClass(elem, classToRemove) {
    // going for speed, so not using arrays and split.
    var classes = elem.className;
    var classIndex = classes.indexOf(classToRemove);
    if (classIndex > -1) {
        var classes = classes.substring(0, classIndex) +
            classes.substring(classIndex + classToRemove.length + 1);

        if (classes.charAt(classes.length - 1) === " ") {
            classes = classes.substring(0, classes.length - 1);
        }
        elem.className = classes;
    }
}

function hasClass(elem, lookForClass) {
    return elem.className.indexOf(lookForClass) > -1;
}

listen(window, "DOMContentLoaded", function(event) {
    var K = {
        ESC : 27,
        ENTER : 13
    };

    var picker      = id("picker");
    var leftArrow   = id("arrow-left");
    var rightArrow  = id("arrow-right");
    var favoritesContainer = id("favorites-group");
    var allEmotes = document.getElementsByClassName("kaomoji");
    var store;

    try {
        if (localStorage.favorites === undefined) { localStorage.favorites = "[]"; }
        store = JSON.parse(localStorage.favorites);
    } catch(e) {
        console.log("Could not read favorites! :(");
        store = [];
    }

    function messageUserScript(action, data) {
        try {
            window.parent.postMessage({
                action  : action,
                data    : data,
            }, '*');
        } catch (e) {
            console.log('Could not post message :(');
        }
    }

    listen(picker, "change", function() {
        window.location.hash = "-";
        window.location.hash = picker.value;
        picker.selectedIndex = 0;
    });

    listen(document, 'click', function(e) {
        if (e.target.nodeName === 'BUTTON' && e.which === 1) {
            // primary click
            var emoteText = e.target.getAttribute("data-text");
            messageUserScript('putEmote', emoteText);
        }
    });

    listen(document, 'contextmenu', function(e) {
        if (e.target.nodeName === 'BUTTON') {
            e.preventDefault();
            toggleFavorite(e.target);
        }
    });

    listen(document, 'keydown', function(e) {
        if (e.which === K.ESC) {
            messageUserScript('close');
        }
    });

    listen(rightArrow, 'click', function() {
        messageUserScript('moveRight');
    });

    listen(leftArrow, 'click', function() {
        messageUserScript('moveLeft');
    });

    function populateFavorites() {
        var newEmote = document.createElement("input");
        newEmote.type = "text";
        newEmote.id = "makeEmoteTextBox";
        newEmote.className = "new-kaomoji";
        newEmote.setAttribute("placeholder", "Type New Emote");

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

        favoritesContainer.appendChild(newEmote);

        highlightFavorites();

        for (var t=0, len = store.length; t < len; ++t) {
            makeEmoteButton(store[t]);
        }
    }

    function addEmoteFavorite(text) {
        store.push(text);
        try {
            localStorage.favorites = JSON.stringify(store);
            makeEmoteButton(text);
        } catch(e) {
            console.log("Could not save favorites! :(");
        }
    }

    function removeEmoteFavorite(text) {
        var loc = store.indexOf(text);
        if (loc > -1) {
            store.splice(loc, 1);
            try {
                localStorage.favorites = JSON.stringify(store);
            } catch (e) {
                console.log("Could not save favorites! :(");
            }
        }
    }

    function makeEmoteButton(text) {
        var newButton = document.createElement('button');
        newButton.dataset.text = text;
        newButton.className = "kaomoji";
        newButton.type = "button";
        newButton.appendChild(document.createTextNode(text));

        favoritesContainer.insertBefore(newButton, id("makeEmoteTextBox"));
    }

    function highlightFavorites(toHighlight) {
        toHighlight = typeof toHighlight === "undefined" ? store : [toHighlight];

        for (var t=0, len = allEmotes.length; t < len; ++t) {
            var btn = allEmotes[t];
            var text = btn.dataset.text;
            if (toHighlight.indexOf(text) > -1) {
                addClass(btn, "favorited");
            }
        }
    }

    function unhighlightFavorite(elements, text, remove) {
        for (var t = 0, len = elements.length; t < len; ++t) {
            var elem = elements[t];
            if (elem.dataset.text === text) {
                if (remove) {
                    elem.parentNode.removeChild(elem);
                    break;
                } else {
                    if (elem.parentNode.id !== "favorites-group") {
                        removeClass(elem, "favorited");
                        break;
                    }
                }
            }
        }
    }

    function toggleFavorite(elem) {
        var text = elem.dataset.text;
        if (elem.parentNode.id === "favorites-group") {
            // removing favorite from favorites group
            unhighlightFavorite(allEmotes, text, false);
            removeEmoteFavorite(text);
            favoritesContainer.removeChild(elem);
        } else {
            // toggle favorite from any other group
            if (hasClass(elem, "favorited")) {
                // remove favorite
                var favorites = favoritesContainer.getElementsByClassName("kaomoji");
                unhighlightFavorite(favorites, text, true);
                removeEmoteFavorite(text);
                removeClass(elem, "favorited");
            } else {
                // add favorite
                addEmoteFavorite(text);
                addClass(elem, "favorited");
            }
        }
    }

    populateFavorites();
});
