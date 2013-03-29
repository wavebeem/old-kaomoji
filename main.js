(function() {
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

listen(window, "DOMContentLoaded", function(event) {
    document.body.className = "use-animations";

    query(".kaomoji").forEach(function(button) {
        listen(button, "click", selectText);
    });

    // ZeroClipboard.setDefaults({
    //     moviePath: "lib/ZeroClipboard.swf"
    // });

    // var clip = new ZeroClipboard();

    // TODO:
    // - Use clip.setCurrent(elem) to change the element it's attached to
    // - Use clip.reposition() in a resize handler to keep it on the element
});
})();
