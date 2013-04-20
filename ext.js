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

listen(window, "DOMContentLoaded", function(event) {
    function sendKaomoji(text) {
        window.parent.postMessage({
            namespace   : "binary_elk",
            command     : "paste",
            text        : text,
        }, "*");
    }

    var click = function(event) {
        sendKaomoji(this.getAttribute("data-text"));
    };

    query("button.kaomoji").forEach(function(button) {
        listen(button, "click", click);
    });
});
