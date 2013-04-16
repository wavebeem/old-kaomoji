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
