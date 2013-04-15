"use strict";

function listen(elem, name, callback) {
    elem.addEventListener(name, callback, false);
}

var slice = [].slice;
function query(s) {
    return slice.call(document.querySelectorAll(s));
}

function id(i) {
    return document.getElementById(i);
}

function classes(cs) {
    return cs.join(" ");
}

function selectText(event) {
    this.select();
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

var binds = {
    j: function() { jumpBy(+1) },
    k: function() { jumpBy(-1) },
};

var picker;

listen(window, "DOMContentLoaded", function(event) {
    document.body.className = classes([
        "use-push-effect",
        "use-animations",
    ]);

    query("input.kaomoji").forEach(function(button) {
        listen(button, "click", selectText);
    });

    picker = query("#picker")[0];
    listen(picker, "change", gotoValue);

    listen(document.body, "click", function(event) {
        picker.click();
    });

    listen(window, "keypress", function(event) {
        var k = chr(event.charCode || event.which);
        var f = binds[k];
        if (f) {
            f();
            event.preventDefault();
        }
    });
});
