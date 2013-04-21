// ==UserScript==
// @name          Kaomoji: Japanese Emoticons
// @version       1.0
// @description   Add menu for adding kaomoji emoticons
// @author        Kyle Paulsen & Brian Mock
// @copyright     Kyle Paulsen & Brian Mock
// @license       http://www.wtfpl.net/
// @icon          http://i.imgur.com/pPW9ZRe.png
// @include       *
// @grant         none
// ==/UserScript==

// Don't run in frames
try {
  if (window.self !== window.top) return;
} catch(e) { return; }

(function() {
  function $create(ele, attrs, styles) {
    var ele = document.createElement(ele);
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        ele.setAttribute(attr, attrs[attr]);
      }
    }

    for (var style in styles) {
      if (styles.hasOwnProperty(style)) {
        ele.style[style] = styles[style];
      }
    }

    return ele;
  }

  function text(element, text) {
    element.innerHTML = '';
    element.appendChild(document.createTextNode(text));
  }

  function listen(element, type, listener) {
    element.addEventListener(type, listener, false);
  }

  function hasValidActiveElement() {
    var activeNode = activeElement.nodeName;
    if (activeNode !== 'INPUT' && activeNode !== 'TEXTAREA') {
      return getNewActiveElement();
    }
    return true;
  }

  function getNewActiveElement() {
    var activeNode = document.activeElement.nodeName;
    if (activeNode === 'INPUT' || activeNode === 'TEXTAREA') {
      activeElement = document.activeElement;
      return true;
    }
    return false;
  }

  function processMessage(e) {
    if (e.origin !== 'https://dl.dropboxusercontent.com') {
      return;
    }

    var obj = e.data;
    messageFunctions[obj.action](obj.data);
  }

  var messageFunctions = {
    putEmote: function(text) {
      var newLen;
      if (hasValidActiveElement()) {
        var emoteText = text + ' ';
        var lastChar = activeElement.value.slice(-1);
        if (lastChar !== ' ' && lastChar !== '') {
          emoteText = ' ' + emoteText;
        }
        activeElement.value += emoteText;
        newLen = activeElement.value.length;
        activeElement.focus();
        activeElement.setSelectionRange(newLen, newLen);
      }
    },
    close: function() {
      balloon.style.display = 'none';
    },
    moveUp: function() {
      console.log("Moving up");
      balloon.style.top = "0";
      balloon.style.bottom = "";
    },
    moveDown: function() {
      console.log("Moving down");
      balloon.style.top = "";
      balloon.style.bottom = "0";
    },
    moveLeft: function() {
      console.log("Moving left");
      balloon.style.left = "0";
      balloon.style.right = "";
      balloon.style.marginBottom = "32px";
    },
    moveRight: function() {
      console.log("Moving right");
      balloon.style.right = "0";
      balloon.style.left = "";
      balloon.style.marginBottom = "10px";
    }
  };

  var K = {
    ESC: 27
  };

  var LS = window.localStorage;
  var remoteHost = LS.BinaryElk_Kaomoji_DebugMode === "true"
    ? LS.BinaryElk_Kaomoji_RemoteHost || "http://kaomoji.binaryelk.com/kaomoji/embed.html"
    : 'https://dl.dropboxusercontent.com/u/2145242/kaomoji.html';

  var iframe = $create('iframe',
    {
      id  : 'binary_elk_kaomoji_picker_iframe',
      src : remoteHost,
    },
    {
      border : '1px solid #ddd',
      width  : '400px',
      height : '400px',
    }
  );

  var balloon = $create('div',
    {
      id  : 'binary_elk_kaomoji_picker_balloon',
    },
    {
      lineHeight    : '0',
      background    : 'white',
      position      : 'fixed',
      border        : '4px solid white',
      borderRadius  : '6px',
      boxShadow     : '0px 0px 2px rgba(0, 0, 0, 0.60), 0px 0px 12px rgba(0, 0, 0, 0.30)',
      display       : 'none',
      padding       : '0px',
      margin        : '10px 10px 32px 10px',
      bottom        : '0',
      left          : '0',
      zIndex        : '9999',
      display       : 'none',
    }
  );

  var button = $create('div',
    {
      id: 'binary_elk_kaomoji_picker_button'
    },
    {
      cursor                : 'pointer',
      borderTopRightRadius  : '4px',
      boxShadow             : '0px 0px 1px rgba(0, 0, 0, 0.80)',
      border                : 'none',
      position              : 'fixed',
      bottom                : '0px',
      left                  : '0px',
      backgroundColor       : 'rgba(240, 240, 240, 0.75)',
      zIndex                : '9998',
      color                 : 'rgb(0, 0, 0)',
      padding               : '4px',
      fontSize              : '12px',
      webkitUserSelect      : 'none',
      MozUserSelect         : 'none',
    }
  );

  var activeElement;

  listen(window, 'message', processMessage);

  // ( ･ω･)ﾉ = ( \uff65\u03c9\uff65)\uff89
  text(button, "( \uff65\u03c9\uff65)\uff89");

  listen(document, 'keydown', function(e){
    if (e.which === K.ESC) {
      messageFunctions.close();
    }
  });

  listen(iframe, 'mousedown', function(){
    getNewActiveElement();
  });

  listen(button, 'mousedown', function(){
    activeElement = document.activeElement;
  });

  listen(document, 'click', function(e){
    if (!getNewActiveElement() && e.target !== button) {
      messageFunctions.close();
    }
  });

  listen(button, 'click', function(){
    var bs = balloon.style;
    bs.display = bs.display === 'table-cell' ? 'none' : 'table-cell';

    if (hasValidActiveElement()) {
      activeElement.focus();
    }
  });

  balloon.appendChild(iframe);
  document.body.appendChild(button);
  document.body.appendChild(balloon);
})();

// vim: set sw=2 sts=2:
