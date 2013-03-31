(function() {
"use strict";

function listen(elem, name, callback) {
    elem.addEventListener(name, callback, false);
}

var slice = [].slice;
function query(s) {
    return slice.call(document.querySelectorAll(s));
}

function selectText(event) {
    this.select();
}

var toastId;
var toast;
var TOAST_TIMEOUT = 1000;
function showToast() {
    toast.className = "";

    if (toastId) {
        clearTimeout(toastId);
        toastId = null;
    }

    toastId = setTimeout(function() {
        toast.className = "hidden";
    }, TOAST_TIMEOUT);
}

var kaomoji = [];
function flashProblem() {
    console.log("Failed to set up ZeroClipboard due to problems with Flash");
    console.log("NOTE: This probably means Flash is not installed");
}

listen(window, "DOMContentLoaded", function(event) {
    document.body.className = "use-push-effect";

    kaomoji = query(".kaomoji");
    toast   = query("#toast")[0];

    ZeroClipboard.setDefaults({
        moviePath   : "lib/ZeroClipboard.swf",
        hoverClass  : "hover",
        activeClass : "active",
    });

    var clip = new ZeroClipboard();

    clip.on("load", function() {
        document.body.className = "use-animations use-push-effect";

        listen(window, "resize", function() {
            clip.reposition();
        });
    });

    var pending = [];
    var repositionZC = function(event) {
        var oldButton;
        while (oldButton = pending.pop()) {
            console.log("Resetting...");
            oldButton.className = "kaomoji";
        }

        clip.setCurrent(this);
        pending.push(this);
    };

    kaomoji.forEach(function(button) {
        listen(button, "mouseover", repositionZC);
        listen(button, "click",     selectText);
    });

    clip.on("complete", showToast);

    clip.on("noflash wrongflash", flashProblem);
});
})();
