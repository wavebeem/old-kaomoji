// ==UserScript==
// @name          Kaomoji: Japanese Emoticons
// @version       1.0
// @description   Add menu for adding kaomoji emoticons
// @author        Kyle Paulsen & Brian Mock
// @copyright     Kyle Paulsen & Brian Mock
// @license       http://www.wtfpl.net/
// @include       *
// @grant         none
// ==/UserScript==

// Don't Run in frames
try {
  if (self != window.top) return;
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
      if (hasValidActiveElement()) {
        var emoteText = text + ' ';
        var lastChar = activeElement.value.slice(-1);
        if (lastChar !== ' ' && lastChar !== '') {
          emoteText = ' ' + emoteText;
        }
        activeElement.value += emoteText;
        activeElement.focus();
        activeElement.setSelectionRange(99999, 99999);
      }
    },
    close: function() {
      iframe.style.display = 'none';
    },
    moveUp: function() {
      iframe.style.top = "0";
      iframe.style.bottom = "";
    },
    moveDown: function() {
      iframe.style.top = "";
      iframe.style.bottom = "0";
    },
    moveLeft: function() {
      iframe.style.left = "0";
      iframe.style.right = "";
    },
    moveRight: function() {
      iframe.style.right = "0";
      iframe.style.left = "";
    }
  };

  var KEYS = {
    'esc': 27
  };

  var iframe = $create('iframe', {
    src: 'https://dl.dropboxusercontent.com/u/2145242/kaomoji.html',
    width: '45%',
    height: '45%'
  },{
    position: 'fixed',
    bottom: '0',
    left: '0',
    margin: '10px 10px 32px 10px',
    border: '1px solid rgba(0, 0, 0, 0.35)',
    boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.25)',
    borderRadius: '2px',
    zIndex: '9999',
    display: 'none'
  });

  var buttonElement = $create('div',
    {id: 'kaomoji_picker_button'},
    {
      cursor: 'pointer',
      borderTopRightRadius: '4px',
      borderLeftWidth: '0px',
      borderBottomWidth: '0px',
      border: '1px solid rgba(0, 0, 0, 0.25)',
      position: 'fixed',
      bottom: '0px',
      left: '0px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: '9998',
      color: 'rgb(0, 0, 0)',
      padding: '4px',
      fontSize: '12px',
      webkitUserSelect: 'none',
      MozUserSelect: 'none'
    }
  );

  var activeElement;

  listen(window, 'message', processMessage);

  text(buttonElement, "( ･ω･)ﾉ");

  listen(document, 'keydown', function(e){
    if (e.which === KEYS.esc) {
      messageFunctions.close();
    }
  });

  listen(iframe, 'mousedown', function(){
    getNewActiveElement();
  });

  listen(buttonElement, 'mousedown', function(){
    activeElement = document.activeElement;
  });

  listen(document, 'click', function(e){
    if (!getNewActiveElement() && e.target !== buttonElement) {
      messageFunctions.close();
    }
  });

  listen(buttonElement, 'click', function(){
    if (iframe.style.display !== '') {
      iframe.style.display = '';
    } else {
      iframe.style.display = 'none';
    }
    if (hasValidActiveElement()) {
      activeElement.focus();
    }
  });

  document.body.appendChild(buttonElement);
  document.body.appendChild(iframe);

})();