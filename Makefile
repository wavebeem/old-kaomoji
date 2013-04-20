### Copyright © 2013 Binary Elk <binary.elk@gmail.com>
### This work is free. You can redistribute it and/or modify it under the
### terms of the Do What The Fuck You Want To Public License, Version 2,
### as published by Sam Hocevar. See the COPYING file for more details.
###
### This program is free software. It comes without any warranty, to
### the extent permitted by applicable law. You can redistribute it
### and/or modify it under the terms of the Do What The Fuck You Want
### To Public License, Version 2, as published by Sam Hocevar. See
### http://www.wtfpl.net/ for more details.

all:
	echo -n | ./writer.rb > index.html
embed:
	echo -n | EMBED=1 ./writer.rb > embed.html
data:
	./scraper.rb > kaomoji.json
