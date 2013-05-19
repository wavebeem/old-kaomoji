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
        inline_js File.read(src)
    end
end

def inline_js txt
    $cgi.script(:type => "text/javascript") { txt }
end

def viewport
    $cgi.meta(
        :name    => "viewport",
        :content => "width=device-width, initial-scale=1",
    )
end

def env_vars
    inline_js <<JS
var DEBUG = #{DEBUG};
var EMBED = #{EMBED};
JS
end

def head
    $cgi.meta(:"http-equiv" => "Content-Type", :content => "text/html; charset=utf-8") +
    viewport +

    css("style.css") +
    css("selector.css") +
    # css("scrollbars.css") +
    (EMBED ? css("embed.css") : "" ) +
    css("icon-font.css") +

    env_vars +

    js("main.js") +
    (EMBED ? js("ext.js") : "") +

    $cgi.title { "Kaomoji Selector :: Binary Elk" }
end

def body
    $cgi.div(:id => "groups", :class => "toolbar") {
        kaomoji_groups
    } +
    (EMBED ? embed_toolbar : "") +
    $cgi.div(:id => "container") {
        (EMBED ? "" : $cgi.h1 { "Kaomoji Picker" }) +
        kaomoji_items +
        footer
    } +
    $cgi.div(:id => "modal-overlay") {
        $cgi.div(:id => "info-window") {
            info_window_contents
        }
    } +
    info_message
end

def info_tips
    return <<TIPS.chomp.split(/\n{2,}/)
Right click a kaomoji to favorite it, or a favorite to remove it.

Type into the box and hit Enter to add a custom kaomoji.
TIPS
end

def info_message
    $cgi.div(:class => "message", :id => "info-message") {
        $cgi.h2 { "Tips and Tricks" } +
        info_tips.map{|tip| $cgi.p { tip }}.join +
        $cgi.div(:id => "hide-info-message-forever-container") {
            $cgi.a(:href => "#", :id => "hide-info-message-forever") {
                "Hide this message"
            }
        }
    }
end

def embed_toolbar
    $cgi.div(:id => "embed-toolbar", :class => "toolbar") {
        # %w[left right].map{|d| dir_button d }.join
        dir_button("left") +
        " Dock " +
        dir_button("right")
    }
end

def dir_button dir
    $cgi.div(:class => "arrow icon-arrow-#{dir}", :id => "arrow-#{dir}")
end

def info_window_contents
    $cgi.p {
        "Full source code at " +
        $cgi.a(:href => "https://github.com/saikobee/kaomoji") {
            "GitHub"
        }
    } +
    $cgi.p {
        "Kaomoji from " +
        $cgi.a(:href => "http://www.japaneseemoticons.net/all-japanese-emoticons/") {
            "Japanese Emoticons"
        }
    } +
    copyright +
    close_button
end

def close_button
    $cgi.button(:id => "close-button", :type => "button") {
        $cgi.div(:class => "icon-close")
    }
end

def copyright
    $cgi.span(:id => "copyright") {
        "&copy; 2013 " +
        $cgi.a(:href => "http://saikobee.github.com") {
            "Brian Mock"
        } +
        " &amp; " +
        $cgi.a(:href => "http://www.kylepaulsen.com/") {
            "Kyle Paulsen"
        }
    }
end

def footer
    $cgi.div(:id => "footer") {
        $cgi.a(:id => "help-me", :href => "#") {
            "Help / About"
        }
    }
end

def kaomoji_items
    $cgi.div(:id => "favorites-group", :class => "group") {
        $cgi.h2(:id => "favorites") {
            $cgi.a(:href => "#favorites") {
                "Favorites"
            }
        }
    } +
    $moji.map {|group, mojis|
        g = group.downcase
        $cgi.div(:class => "group") {
            $cgi.h2(:id => g) {
                $cgi.a(:href => "##{g}") {
                    group
                }
            } +
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
        $cgi.option(:value => "favorites") { "Favorites" } +
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
