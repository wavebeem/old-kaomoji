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

var slice = [].slice;
function query(s) {
    return slice.call(document.querySelectorAll(s));
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
