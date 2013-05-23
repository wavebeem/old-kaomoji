#!/bin/bash
DEBUG=0 ./writer.rb </dev/null> ~/gh-pages/kaomoji/index.html
cp bg.png ~/gh-pages/kaomoji
cd ~/gh-pages/kaomoji
git commit -am "$(date)"
git push
