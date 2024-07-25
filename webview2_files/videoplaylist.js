
$.widget("dat.videoPlaylist", {
    options: {
        videos: [],
        playerTitle: undefined,
        height: 432,
        width: 768,
        tableWidth: 250,
        autoPlay: true,
        captionsOn: false
    },
    _create: function () {
        //height:(parseInt(this.options.height) + 40) +"px",
        if (!$("#elem").is(":data( 'dat-videoPlaylist' )")) {
            var $this = this;
            var elem = $this.element
            if (window.innerWidth > 800) {
                var width = "100%";
                var tableWidth = "30%";
            } else {
                var width = "100%";
                var tableWidth = "100%";
            }
            elem.addClass("ui-video-player-list").css({width: width});
            console.log($this.options.playerTitle)
            if ($this.options.playerTitle !== undefined) {
                elem.append("<h4>" + $this.options.playerTitle + "</h4>");
            }
            elem.append("<div class='ui-table-content' style='max-height:" + (parseInt(this.options.height) + 40) + "px;'><div tabindex='0' class='ui-cont-play' title='continuous play'></div><h2>Table of Contents</h2><ul class='ui-video-list'></ul></div><div class='ui-player-holder'><video controls " +
                    (this.options.videos[0].poster ? ("poster='" + this.options.videos[0].poster + "'") : "") +
                    "><source src='" + this.options.videos[0].url + "' type='video/mp4' /></video></div><div class='ui-transcript-holder'></div>");
            elem.find(".ui-cont-play").click(function () {
                $(this).toggleClass("ui-active");
            })
            if (this.options.videos[0].subtitles !== undefined) {
                elem.find("video").append('<track src="' + this.options.videos[0].subtitles + '" label="English subtitles" kind="subtitles" srclang="en" default></track>')
            }
            if (this.options.videos[0].transcript !== undefined) {
                var containerTest = this.options.videos[0].transcript.split(" ");
                elem.find(".ui-transcript-holder").append("<button class='ui-show-transcript'>Transcript</button><div class='ui-transcript ui-transcript-hide'></div>");
                var transcript = $("<div></div>");

                transcript.load(this.options.videos[0].transcript, function () {
                    transcript.find(".dvu_container").removeClass("dvu_container");
                    transcript.find("*").each(function () {
                        if ($(this).attr("id") === "header")
                            $(this).attr("id", "tran-header");
                    });
                    elem.find(".ui-transcript").html(transcript.html());
                });
                elem.find(".ui-show-transcript").button().click(function () {
                    $(this).siblings(".ui-transcript").toggleClass("ui-transcript-hide")
                })
            }
            elem.find("video").acornMediaPlayer();
            $.each(this.options.videos, function (i, v) {
                elem.find("ul").append("<li tabindex='0' class='ui-video-item' title='" + v.title + "' data-video-index='" + i + "'>" + v.title + "</li>");
            });
            elem.find(".ui-video-item").first().addClass("ui-video-active");
            elem.find("video").bind("ended", function () {
                if (elem.find(".ui-cont-play").hasClass("ui-active")) {
                    elem.find(".ui-video-item.ui-video-active").next(".ui-video-item").click();
                }
            });
            if (window.innerWidth < 1050) {
                elem.find(".ui-table-content").css("max-height", elem.find(".ui-player-holder").height() + "px")
                elem.find("video").bind("loadedmetadata", function () {
                    if (window.innerWidth < 1050)
                        elem.find(".ui-table-content").css("max-height", elem.find(".ui-player-holder").height() + "px")
                }
                )
            }

            elem.find(".ui-video-item").click(function () {
                if (!$(this).hasClass("ui-video-active")) {
                    var aoptions = {captionsOn: elem.find(".acorn-caption").css("display") === "block"};
                    var index = parseInt($(this).attr("data-video-index"));
                    $(".ui-video-active").removeClass("ui-video-active");
                    $(this).addClass("ui-video-active");
                    elem.find(".acorn-player").remove();
                    var poster = ""
                    if ($this.options.videos[index].poster !== undefined)
                        poster = $this.options.videos[index].poster
                    else if ($this.options.videos[0].poster != undefined)
                        poster = $this.options.videos[0].poster
                    elem.find(".ui-player-holder").html("<video height='" +
                            $this.options.height + "' width='" + $this.options.width + "' controls poster='" + poster + "'><source src='" + $this.options.videos[index].url + "' type='video/mp4' /></video>");
                    if ($this.options.videos[index].subtitles !== undefined) {
                        elem.find("video").append('<track src="' + $this.options.videos[index].subtitles + '" label="English subtitles" kind="subtitles" srclang="en" default></track>')
                    }
                    var transcriptVis = elem.find(".ui-transcript").hasClass("ui-transcript-hide") || elem.find(".ui-transcript").length < 1;
                    elem.find(".ui-transcript-holder").empty()
                    if ($this.options.videos[index].transcript !== undefined) {
                        elem.find(".ui-transcript-holder").append("<button class='ui-show-transcript'>Transcript</button><div class='ui-transcript'></div>");
                        if (transcriptVis)
                            elem.find(".ui-transcript").addClass("ui-transcript-hide");

                        var transcript = $("<div></div>");
                        transcript.load($this.options.videos[index].transcript, function () {
                            transcript.find(".dvu_container").removeClass("dvu_container");
                            transcript.find("*").each(function () {
                                if ($(this).attr("id") === "header")
                                    $(this).attr("id", "tran-header");
                            });
                            elem.find(".ui-transcript").html(transcript.html());
                        });
                        elem.find(".ui-show-transcript").button().click(function () {
                            $(this).siblings(".ui-transcript").toggleClass("ui-transcript-hide")
                        });
                    }
                    elem.find("video").acornMediaPlayer(aoptions);
                    elem.find("video").bind("ended", function () {
                        if (elem.find(".ui-cont-play").hasClass("ui-active")) {
                            elem.find(".ui-video-item.ui-video-active").next(".ui-video-item").click();
                        }
                    });
                    $this._update();
                }
            }
            );
            elem.find(".ui-video-item, .ui-cont-play").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).click();
                }
            });
            $(window).resize(function () {
                $(".ui-debug-width").text(window.innerWidth);
                if (window.innerWidth > 1050) {
                    var width = parseInt($this.options.width) + $this.options.tableWidth;
                    if (width > elem.parent().innerWidth()) {                        
                        width = elem.parent().innerWidth();
                    }
                    elem.css({width: width + "px"});

                } else if (window.innerWidth <= 1050 && window.innerWidth > 800) {
                    elem.css({width: "100%"});
                    elem.find(".ui-table-content").css({width: "30%", maxHeight: elem.find(".ui-player-holder").height() + "px"})
                } else {
                    elem.css({width: "100%"});
                    elem.find(".ui-table-content").css({width: "100%"})
                }
            })
        }
    },
    _setOption: function (key, value) {
        this.options[ key ] = value;
        this._update();
    },
    _update: function () {
        var elem = this.element
        elem.find("video")[0].load();
        if (this.options.autoPlay)
            elem.find("video")[0].play();
    }
});
