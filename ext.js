"use strict";

listen(window, "DOMContentLoaded", function(event) {
    var pendingElement = null;

    function sendKaomoji(text) {
        window.parent.postMessage({
            namespace   : "binary_elk",
            command     : "paste",
            text        : text,
        }, "*");
    }

    var mousedown = function(event) {
        pendingElement = this;
    };

    var mouseup = function(event) {
        if (this === pendingElement) {
            sendKaomoji(this.getAttribute("data-text"));
        }
        pendingElement = null;
    };

    query("button.kaomoji").forEach(function(button) {
        // The click event is broken in Chrome if the element moves under
        // certain clicking conditions. This somewhat fixes that.
        // Alternatively, we could just rewrite the CSS to not reposition the
        // element, but the squishing down effect it gives is really cool...
        listen(button, "mousedown", mousedown);
        listen(button, "mouseup"  , mouseup  );
    });
});
