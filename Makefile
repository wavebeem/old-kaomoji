### Copyright © 2013 Brian Mock & Kyle Paulsen <binary.elk@gmail.com>
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
dropbox:
	EMBED=0 DEBUG=0 ./writer.rb </dev/null >~/Dropbox/Public/kaomoji/index.html
	EMBED=1 DEBUG=0 ./writer.rb </dev/null >~/Dropbox/Public/kaomoji/embed.html
	cp bg.png ~/Dropbox/Public/kaomoji
github:
	./deploy-github.sh
data:
	./scraper.rb >kaomoji.json
