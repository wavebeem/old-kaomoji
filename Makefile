all:
	echo -n | ./writer.rb > index.html
embed:
	echo -n | EMBED=1 ./writer.rb > embed.html
data:
	./scraper.rb > kaomoji.json
