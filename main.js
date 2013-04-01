(function() {
"use strict";

function listen(elem, name, callback) {
    elem.addEventListener(name, callback, false);
}

var slice = [].slice;
function query(s) {
    return slice.call(document.querySelectorAll(s));
}

function classes(cs) {
    return cs.join(" ");
}

function selectText(event) {
    this.select();
}

listen(window, "DOMContentLoaded", function(event) {
    document.body.className = classes([
        "use-push-effect",
        "use-animations",
    ]);

    query(".kaomoji").forEach(function(button) {
        // listen(button, "mouseover", repositionZC);
        listen(button, "click", selectText);
    });
});
})();
