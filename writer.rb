#!/usr/bin/env ruby
require "cgi"
require "json"
require "htmlentities"

$cgi   = CGI.new("html4")
$moji  = JSON.parse(File.read("kaomoji.json"))
$coder = HTMLEntities.new(:html4)

def css href
    $cgi.link(:rel => "stylesheet", :href => href, :type => "text/css")
    # $cgi.style(:type => "text/css") { File.read(href) }
end

def js src
    $cgi.script(:type => "text/javascript", :src => src)
    # $cgi.script(:type => "text/javascript") { File.read(src) }
end

def viewport
    $cgi.meta(
        :name => "viewport",
        :content => "width=device-width, initial-scale=1")
end

def head
    $cgi.meta(:charset => "utf-8") +
    viewport +
    css("style.css") +
    js("lib/ZeroClipboard.min.js") +
    js("main.js") +
    $cgi.title { "Kaomoji Selector" }
end

def body
    $cgi.div(:id => "container") {
        header +
        kaomoji_items +
        footer
    }
end

def footer_text
    $cgi.p {
        "Full source code available on " +
        $cgi.a(:href => "https://github.com/saikobee/kaomoji") {
            "GitHub"
        }
    } +
    $cgi.p {
        "Emoticons from " +
        $cgi.a(:href => "http://www.japaneseemoticons.net/all-japanese-emoticons/") {
            "Japanese Emoticons"
        }
    }
end

def copyright
    $cgi.a(:href => "http://saikobee.github.com", :id => "copyright") {
        "&copy; 2013 Brian Mock"
    }
end

def footer
    $cgi.div(:id => "footer") {
        footer_text +
        copyright
    }
end

def encode str
    $coder.encode str, :basic, :decimal
end

def header
    $cgi.h1(:id => "header") {
        $cgi.a(:href => "#") {
            "Kaomoji Picker"
        }
    }
end

def kaomoji_items
    $moji.map {|group, mojis|
        g = group.downcase
        $cgi.h2 {
            $cgi.a(:id => g, :href => "##{g}") {
                group
            }
        } +
        $cgi.div(:class => "group") {
            mojis.map {|moji|
                moji = moji.chomp.strip
                $cgi.input(
                    :value => moji,
                    :type  => "text",
                    :class => "kaomoji",
                )
            }.join
        }
    }.join
end

def html
    $cgi.html {
        $cgi.head { head } +
        $cgi.body { body }
    }
end

def main
    # puts CGI::pretty(html)
    puts html
end

main
