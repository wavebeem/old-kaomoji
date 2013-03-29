all:
	echo -n | ./writer.rb > index.html
data:
	./scraper.rb > kaomoji.json
