(function() {
function listen(elem, name, callback) {
    elem.addEventListener(name, callback, false);
}

function query(s) {
    return document.querySelectorAll(s);
}

listen(window, "DOMContentLoaded", function(event) {
    // ZeroClipboard.setDefaults({
    //     moviePath: "lib/ZeroClipboard.swf"
    // });

    // var clip = new ZeroClipboard();

    // TODO:
    // - Use clip.setCurrent(elem) to change the element it's attached to
    // - Use clip.reposition() in a resize handler to keep it on the element
});
})();
