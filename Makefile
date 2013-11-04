### Copyright © 2013 Brian Mock <mock.brian+kaomoji@gmail.com>
### This work is free. You can redistribute it and/or modify it under the
### terms of the Do What The Fuck You Want To Public License, Version 2,
### as published by Sam Hocevar. See the COPYING file for more details.
###
### This program is free software. It comes without any warranty, to
### the extent permitted by applicable law. You can redistribute it
### and/or modify it under the terms of the Do What The Fuck You Want
### To Public License, Version 2, as published by Sam Hocevar. See
### http://www.wtfpl.net/ for more details.

all: standalone embed

standalone:
	EMBED=0 ./writer.rb </dev/null >index.html
embed:
	EMBED=1 ./writer.rb </dev/null >embed.html
github:
	./deploy-github.sh
data:
	./scraper.rb >data.json

dist: standalone
	cp -v bg.png style.css selector.css stalone.css index.html main.js dist/
	./deploy.sh
