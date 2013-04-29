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

listen(window, "DOMContentLoaded", function(event) {
    var K = {
        ESC : 27
    };

    var picker      = id("picker");
    var leftArrow   = id("arrow-left");
    var rightArrow  = id("arrow-right");

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
        if (e.target.nodeName === 'BUTTON') {
            var emoteText = e.target.getAttribute("data-text");
            messageUserScript('putEmote', emoteText);
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
});
