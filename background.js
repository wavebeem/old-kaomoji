chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("embed.html", {
        id          : "main-window",
        singleton   : true,
        frame       : "none",

        bounds : {
            width  : 600,
            height : 900,
        },
    });
});
