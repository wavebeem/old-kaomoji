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

/**
*** Copyright © 2013 Brian Mock & Kyle Paulsen <binary.elk@gmail.com>
*** This work is free. You can redistribute it and/or modify it under the
*** terms of the Do What The Fuck You Want To Public License, Version 2,
*** as published by Sam Hocevar. See the COPYING file for more details.
***
*** This program is free software. It comes without any warranty, to
*** the extent permitted by applicable law. You can redistribute it
*** and/or modify it under the terms of the Do What The Fuck You Want
*** To Public License, Version 2, as published by Sam Hocevar. See
*** http://www.wtfpl.net/ for more details.
**/

(function() {
  // Don't run in frames
  try {
    if (window.self !== window.top)
      return;
  }
  catch (e) {
    return;
  }

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

  function listen(element, type, listener, bubble) {
    bubble = typeof bubble === 'undefined' ? false : bubble;
    element.addEventListener(type, listener, bubble);
  }

  function hasValidActiveElement() {
    if (!activeElement) { return false; }
    var activeNode = activeElement.nodeName;
    if (activeNode !== 'INPUT' && activeNode !== 'TEXTAREA') {
      return false;
    }
    return true;
  }

  function getNewActiveElement(elem) {
    var activeNode = elem.nodeName;
    if (activeNode === 'INPUT' || activeNode === 'TEXTAREA') {
      activeElement = elem;
      return true;
    }
    return false;
  }

  function processMessage(e) {
    if (e.origin !== 'https://dl.dropboxusercontent.com'
    &&  e.origin !== 'http://kaomoji.binaryelk.com') {
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

        // Dont ask... I dont even...
        // ok fine... Firefox wont let me type in the new Emote box after I click on a
        // emote button first. Doing this crap somehow fixes it.
        activeElement.blur();
        activeElement.focus();
        activeElement.blur();
        activeElement.focus();
      }
    },
    close: function() {
      balloon.style.display = 'none';
    },
    moveLeft: function() {
      balloon.style.left = "0";
      balloon.style.right = "";
      balloon.style.marginBottom = "32px";
    },
    moveRight: function() {
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
    : 'https://dl.dropboxusercontent.com/u/40887731/kaomoji/embed.html';

  var iframe = $create('iframe',
    {
      id  : 'binary_elk_kaomoji_picker_iframe',
      src : remoteHost,
    },
    {
      webkitBoxSizing : 'border-box',
      MozBoxSizing    : 'border-box',
      boxSizing       : 'border-box',

      border    : '1px solid #ddd',
      width     : '600px',
      height    : '100%',
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
      boxShadow     : '0px 0px 2px rgba(0, 0, 0, 0.60),'
                    + '0px 0px 12px rgba(0, 0, 0, 0.30)',
      display       : 'none',
      padding       : '0px',
      margin        : '10px 10px 32px 10px',
      top           : '0',
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

  listen(document, 'focus', function(e){
    if (e.target === document)
      return;

    if (!getNewActiveElement(e.target)
    && e.target !== button
    && e.target !== iframe) {
      messageFunctions.close();
    }
  }, true);

  listen(document, 'click', function(e){
    var nodeName = e.target.nodeName;
    if (nodeName !== 'INPUT'
    &&  nodeName !== 'TEXTAREA'
    &&  e.target !== button
    &&  e.target !== iframe) {
      messageFunctions.close();
    }
  }, true);

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
