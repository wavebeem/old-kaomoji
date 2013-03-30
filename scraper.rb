#!/usr/bin/env ruby
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
