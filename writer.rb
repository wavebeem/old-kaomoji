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

require "cgi"
require "json"

$cgi    = CGI.new("html4")
$moji   = JSON.parse(File.read("kaomoji.json"))
$header = File.read("header-logo.txt") + "\n" + File.read("header-text.txt")

def env_bool? name, fallback=false
    if ENV[name]
    then !!(ENV[name] =~ %r{^true|t|1$})
    else fallback
    end
end

DEBUG = env_bool? "DEBUG", true
EMBED = env_bool? "EMBED", false

def css href
    if DEBUG
        $cgi.link(
            :href   => href,
            :type   => "text/css",
            :rel    => "stylesheet",
        )
    else
        $cgi.style(:type => "text/css") { File.read(href) }
    end
end

def js src
    if DEBUG
        $cgi.script(
            :type   => "text/javascript",
            :src    => src,
        )
    else
        $cgi.script(:type => "text/javascript") { File.read(src) }
    end
end

def viewport
    $cgi.meta(
        :name    => "viewport",
        :content => "width=device-width, initial-scale=1",
    )
end

def head
    $cgi.meta(:"http-equiv" => "Content-Type", :content => "text/html; charset=utf-8") +
    viewport +

    css("style.css") +
    css("selector.css") +
    css("scrollbars.css") +
    (EMBED ? css("embed.css") + css("icon-font.css") : "" ) +

    (!EMBED ? js("main.js") : "") +
    (EMBED ? js("ext.js") : "") +

    $cgi.title { "Kaomoji Selector" }
end

def body
    $cgi.div(:id => "groups", :class => "toolbar") {
        kaomoji_groups
    } +
    (EMBED ? embed_toolbar : "") +
    $cgi.div(:id => "container") {
        # header +
        kaomoji_items +
        (EMBED ? "" : footer)
    }
end

DIRECTIONS = %w[
    up
    down
    left
    right
]

def embed_toolbar
    $cgi.div(:id => "embed-toolbar", :class => "toolbar") {
        DIRECTIONS.map{|d| dir_button d }.join
    }
end

def dir_button dir
    $cgi.div(:class => "arrow arrow-#{dir}", :id => "arrow-#{dir}")
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
                kaomoji moji.chomp.strip
            }.join
        }
    }.join
end

def kaomoji txt
    if EMBED
        $cgi.button(
            :type   => "button",
            :class  => "kaomoji",
            :"data-text" => txt,
        ) { txt }
    else
        $cgi.input(
            :value    => txt,
            :size     => "1",
            :type     => "text",
            :class    => "kaomoji",
            :readonly => "readonly",
        )
    end
end

def kaomoji_groups
    $cgi.div(:id => "jump-to") { "Jump to..." } +
    $cgi.select(:id => "picker") {
        $cgi.option(:value => "_", :disabled => "disabled") { "Jump to..." } +
        $moji.map {|group, mojis|
            $cgi.option(:value => group.downcase) {
                group.capitalize
            }
        }.join
    }
end

def comment_header
<<HEADER

<!--
#$header
-->
HEADER
end

def html
    $cgi.html {
        comment_header +
        $cgi.head { head } +
        $cgi.body { body }
    }
end

def main
    # puts CGI::pretty(html)
    puts html
end

main
