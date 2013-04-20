#!/usr/bin/env ruby
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

require "nokogiri"
require "open-uri"
require "json"

BAD_REGEX = %r{^japanese|emoticons?|miscellaneous|or$}i
SEP_REGEX = %r{\W+}

def simplify_name name
    name
        .split(SEP_REGEX)
        .reject{|word| word =~ BAD_REGEX }
        .+(["Miscellaneous"])
        .first
end

def next_table root
    root = root.next_element while root and root.name != "table"
    root
end

def pairs doc
    {}.tap {|h|
        doc.css("h3").each do |h3|
            h3t    = h3.text
            txt    = simplify_name h3t
            table  = next_table h3
            h[txt] = mojis table if table
        end
    }.sort
end

def mojis table
    table
        .css("td")
        .map    {|td| td.text.strip }
        .reject {|td| td == "" }
end

def main
    url = "http://www.japaneseemoticons.net/all-japanese-emoticons/"
    doc = Nokogiri::HTML.parse(open(url))

    puts pairs(doc).to_json
rescue Interrupt
    puts [].to_json
end

main
