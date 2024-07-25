/* global kWidget */
        window.partner_id = 1432812;
$(document).ready(function () {
    try {
        initiateStreamingPlayers();
    } catch (e) {
        if (console) {
            console.log(e);
        }
    }
});

function onElementRendered(selector, cb, _attempts) {
    var el = $(selector);
    _attempts = ++_attempts || 1;
    if (el.length)
        return cb(el);
    if (_attempts == 60)
        return;
    setTimeout(function () {
        onElementRendered(selector, cb, _attempts);
    }, 250);
}

function getPlayer(nickname) {


    var players = {
        playlist: {
            devry: 27266422,
        },
        single: {
            devry: 38935871,
            devrynodl: 39574202,
			devrynoceil: 42711681
        }
    };
    var type = nickname.split(":")[0];

    var id = nickname.split(":")[1];

    if (players[type] && players[type][id]) {
        return players[type][id];
    } else {
        if (!id.match(/\D/)) {
            return id;
        } else {
            return 38935871;
        }
    }
}


function initiateStreamingPlayers() {
    destroyStreamingPlayers();

    onElementRendered(".kaltura-holder-playlist", function (e) {
        $(e).not(".kal-test").each(function (i, v) {
            var $this = $(this);
            $(this).empty();
            $(this).append('<div class="kaltura-height-resize"></div>');
            var date = new Date();
            var id = "kaltura_player" + date.getTime() + i;
            var playlistID = $(this).attr("data-kal-playlist");
            $(this).append('<div id="' + id + '"  class="katura-player" style="" itemprop="video" itemscope itemtype="http://schema.org/VideoObject">');
            var player = getPlayer("playlist:" + $(this).attr("data-kal-player"));
            console.log(player);
            verifyUILoaded(player, function (UI) {
                kWidget.embed({
                    "targetId": id,
                    "wid": "_" + partner_id,
                    "uiconf_id": UI,
                    "flashvars": {
                        'playlistAPI': {
                            'includeInLayout': true,
                            'autoPlay': false,
                            'loop': false,
                            'onPage': false,
                            'kpl0Url': "http://www.kaltura.com/index.php/partnerservices2/executeplaylist?playlist_id=" + playlistID + "&partner_id=" + partner_id + "&subp_id=24334200&format=8&ks={ks}",
                            'kpl0Name': "Playlist"
                        },						
                        "IframeCustomPluginCss1": "https://lms.devry.edu/lms/styles/devryplayer.css",
                        "playlistCustom": {
                            "playlist_id": playlistID
                        },
                        'nextPrevBtn': {
                            'plugin': true
                        }
                    }
                });
            });
        });
    });




    onElementRendered(".kaltura-holder-playlist.kal-test", function (e) {
        $(e).each(function (i, v) {
            var $this = $(this);
            $(this).empty();
            $(this).append('<div class="kaltura-height-resize"></div>');
            var date = new Date();
            var id = "kaltura_player" + date.getTime() + i;
            $(this).append('<div id="' + id + '"  class="katura-player" style="" itemprop="video" itemscope itemtype="http://schema.org/VideoObject">');
            var playlistID = $(this).attr("data-kal-playlist");

            verifyUILoaded(getPlayer("playlist:" + $(this).attr("data-kal-player")), function (UI) {
                kWidget.embed({
                    "targetId": id,
                    "wid": "_" + partner_id,
                    "uiconf_id": 31996581,
                    //  'readyCallback': onReadyCallback,
                    "flashvars": {
                        'playlistAPI': {
                            'includeInLayout': false,
                            'autoPlay': false,
                            'loop': false,
                            'onPage': false,
                            'kpl0Url': "http://www.kaltura.com/index.php/partnerservices2/executeplaylist?playlist_id=" + playlistID + "&partner_id=" + partner_id + "&subp_id=24334200&format=8&ks={ks}",
                            'kpl0Name': "simple two clip pl"
                        },
                        "IframeCustomPluginCss1": "https://devry.equella.ecollege.com/file/c5df3a47-aec9-4993-b36f-0f4b402d349d/1/devryplayer.css",
                        "playlistCustom": {
                            "playlist_id": playlistID
                        },
                        'nextPrevBtn': {
                            'plugin': true
                        }
                    }
                });
            });
        });

    })
    var UI = 32001581
    onElementRendered(".kaltura-holder-single[data-kal-video]", function (e) {
		var urlbreaker = location.href.split('/');
        $(e).each(function (i, v) {
            $(this).empty();
            $(this).append('<div class="kaltura-height-resize"></div>');
            var date = new Date();
            var time = date.getTime();
			
            var id = "kaltura_player" + time + i + 1;
            var playerholder = $('<div id="' + id + '"  class="katura-player" style="" itemprop="video" itemscope itemtype="http://schema.org/VideoObject">')
            $(this).append(playerholder);
            
			var entry = $(this).attr("data-kal-video");
            /* verifyUILoaded(getPlayer("single:" + $(this).attr("data-kal-player")), function (UI) {
             var settings = {
             "targetId": id,
             "wid": "_" + partner_id,
             "uiconf_id": UI,
             "flashvars": {
             },
             "cache_st": time + i + 1,
             "entry_id": entry,
             isHTML5: true
             };
             console.log(settings);
             kWidget.embed(settings);
             });*/
            var UI = getPlayer("single:" + $(this).attr("data-kal-player"));
			
            if($(this).attr("data-kal-player") === 'devrynoceil'){
                $(this).addClass("transcript-closed");
            }
			
			var player = UI;

			var iframe = "<iframe src='https://cdnapisec.kaltura.com/p/" + partner_id + "/sp/" + partner_id + "00/embedIframeJs/uiconf_id/" + UI + "/partner_id/" + partner_id + "?iframeembed=true&playerId=kaltura_player_1515528455&entry_id=" + entry + "&flashvars[streamerType]=auto' allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder='0' style='border: 0px none; max-width: 100%; max-height: 100%; width: 100%; height: 100%;' itemprop='video' itemscope itemtype='http://schema.org/VideoObject'>\n\<span itemprop='thumbnail' content='http://cfvod.kaltura.com/p/" + partner_id + "/sp/" + partner_id + "/thumbnail/entry_id/" + entry + "/version/100002'></span>\n\</iframe>";
			
			/*
			if (urlbreaker[2]=='devryu.instructure.com' && $(this).attr("data-kal-player")!='devrynoceil'){
				var iframe = '<iframe style="width: 608px; height: 402px;" title="My Demo Test (00:30)" src="/courses/' + urlbreaker[4] + '/external_tools/retrieve?display=borderless&amp;url=https%3A%2F%2Fdvulms.kaf.kaltura.com%2Fbrowseandembed%2Findex%2Fmedia%2Fentryid%2F' + entry + '%2FshowDescription%2Ffalse%2FshowTitle%2Ffalse%2FshowTags%2Ffalse%2FshowDuration%2Ffalse%2FshowOwner%2Ffalse%2FshowUploadDate%2Ffalse%2FplayerSize%2F608x402%2FplayerSkin%2F' + player + '%2F" width="765" height="585" allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen" allow="autoplay *"></iframe>';
			} else {
				var iframe = "<iframe src='https://cdnapisec.kaltura.com/p/" + partner_id + "/sp/" + partner_id + "00/embedIframeJs/uiconf_id/" + UI + "/partner_id/" + partner_id + "?iframeembed=true&playerId=kaltura_player_1515528455&entry_id=" + entry + "&flashvars[streamerType]=auto' allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder='0' style='border: 0px none; max-width: 100%; max-height: 100%; width: 100%; height: 100%;' itemprop='video' itemscope itemtype='http://schema.org/VideoObject'>\n\<span itemprop='thumbnail' content='http://cfvod.kaltura.com/p/" + partner_id + "/sp/" + partner_id + "/thumbnail/entry_id/" + entry + "/version/100002'></span>\n\</iframe>";
			}
			*/
			
			

			/*
            var iframe = "<iframe src='https://cdnapisec.kaltura.com/p/" + partner_id + "/sp/" + partner_id + "00/embedIframeJs/uiconf_id/" + UI + "/partner_id/" + partner_id + "?iframeembed=true&playerId=kaltura_player_1515528455&entry_id=" + entry + "&flashvars[streamerType]=auto' allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder='0' style='border: 0px none; max-width: 100%; max-height: 100%; width: 100%; height: 100%;' itemprop='video' itemscope itemtype='http://schema.org/VideoObject'>\n\
<span itemprop='thumbnail' content='http://cfvod.kaltura.com/p/" + partner_id + "/sp/" + partner_id + "/thumbnail/entry_id/" + entry + "/version/100002'></span>\n\
</iframe>";
*/
            $(playerholder).append(iframe);

        });
    });

    onElementRendered(".kaltura-holder-single[data-youtube-url]", function (e) {
        $(e).each(function (i, v) {
            $(this).empty();
            $(this).append('<div class="kaltura-height-resize"></div>');
            var url = $(this).attr("data-youtube-url");
            if (url.match(/\?list/)) {
                url = url.split("?")[1];

                url = "https://www.youtube.com/embed/videoseries?" + url;

            } else {
                url = url.split("/");
                url = url[url.length - 1];
                url = "https://www.youtube.com/embed/" + url + "?showinfo=0";
            }
            $(this).append('<div class="katura-player"><iframe src="' + url + '" style="width:100%;height:100%" allowfullscreen="true"></iframe></div>');
        });
    });

    onElementRendered(".kaltura-holder-single[data-other-url]", function (e) {
        $(e).each(function (i, v) {
            $(this).empty();
            $(this).append('<div class="kaltura-height-resize"></div>');
            var url = $(this).attr("data-other-url");
            $(this).append('<div class="katura-player"><iframe src="' + url + '" style="width:100%;height:100%" allowfullscreen="true"></iframe></div>');
        });
    });
    $(window).resize(function () {
        $(".kaltura-holder-playlist").each(function () {
            if ($(this).width() < 500) {
                $(this).find(".kaltura-height-resize").css("marginTop", "80%");
            } else {
                $(this).find(".kaltura-height-resize").removeAttr("style");
            }
        });

        $(".kaltura-holder-playlist").each(function () {
            if ($(this).width() < 500) {
                $(this).find(".kaltura-height-resize").css("marginTop", "80%");
            } else {
                $(this).find(".kaltura-height-resize").removeAttr("style");
            }
        });
    });

}
;

function destroyStreamingPlayers() {
    $(".kaltura-holder-playlist").empty();
    $(".kaltura-holder-single").empty();
}

function onReadyCallback(playerID) {
    console.log(playerID);
    var playlist;
    var $this = $("#" + playerID).parents(".kaltura-holder-playlist");
    var player = $("#" + playerID)[0];
    player.addJsListener("playlistReady", function () {
        playlist = player.evaluate("{playlistAPI.dataProvider}");
        console.log(playlist);
        if ($this.find(".kaltura-page-playlist ol").length < 1) {
            var list = $("<div class='kaltura-page-playlist'><ol data-playlist-title='" + playlist.content[0].name + "'></ol><a href='#' class='kaltura-page-playlist-toggle'>=</a></div>");
            list.appendTo($this);
            list.find(".kaltura-page-playlist-toggle").click(function (e) {
                $(this).parents(".kaltura-page-playlist").toggleClass("kaltura-playlist-show");
                e.preventDefault();
            });
            $.each(playlist.content[0].items, function (i, v) {
                var video = $("<li><a href='#' data-video-index='" + i + "'><img src='" + v.thumbnailUrl + "' alt='" + v.name + " thumbnail'></img>" + v.name + "</a></li>");
                list.find("ol").append(video);
                video.find("a").click(function (e) {
                    $(this).parents(".kaltura-page-playlist").removeClass("kaltura-playlist-show");
                    player.setKDPAttribute("playlistAPI.dataProvider", "selectedIndex", parseInt($(this).attr("data-video-index")));
                    e.preventDefault();
                });
            });
        }
    });

}
//https://cdnapisec.kaltura.com/p/2290221/sp/229022100/embedIframeJs/uiconf_id/40011691/partner_id/2290221?autoembed=true&entry_id=1_lyqz00j0&playerId=kaltura_player_1501689656&cache_st=1501689656&width=528&height=297&flashvars%5bstreamerType%5d=auto

function verifyUILoaded(UI, callback) {
    if (kWidget.uiConfScriptLoadList[UI] === 1) {
        console.log("Found", UI);
        //kWidget.isChromeCast = function(){return false;};
        callback(UI);
    } else {
        console.log("loading", UI);
        $.getScript('https://cdnapisec.kaltura.com/p/' + partner_id + '/sp/' + partner_id + '00/embedIframeJs/uiconf_id/' + UI + '/partner_id/' + partner_id + '', function () {
            console.log("loaded", UI);
            var count = 0;
            setTimeout(waitForLoad, 500);
            function waitForLoad() {
                if (kWidget.uiConfScriptLoadList[UI] === 1) {
                    //kWidget.isChromeCast = function(){return false;};
                    console.log("Found loaded", UI);
                    callback(UI);
                } else {
                    console.log("not Found loaded", UI);
                    count++;
                    if (count < 5) {
                        setTimeout(waitForLoad, 500);
                    } else {
                        console.log("not found timeout", UI);
                        var ret;
                        $.each(kWidget.uiConfScriptLoadList, function (i, v) {
                            if (v === 1) {
                                ret = i;
                                return false;
                            }
                        });
                        //kWidget.isChromeCast = function(){return false;};
                        callback(ret);
                    }
                }
            }
        }).fail(function () {
            console.log("failed", UI);
            var ret;
            $.each(kWidget.uiConfScriptLoadList, function (i, v) {
                if (v === 1) {
                    ret = i;
                    return false;
                }
            });
            console.log("returning", ret);
            //kWidget.isChromeCast = function(){return false;};
            callback(ret);
        });
    }
}


onElementRendered(".cw-transcript", function (element) {
    $(element).find(".cw-transcript-content").hide();
    $(element).find("a").click(function (e) {
        $(this).next().toggle(300);
        e.preventDefault();
    });
});


setInterval(function () {
    $('div[id^="cielo24"]').each(function () {
        var styles = $(this).attr("style")
        if (styles && (styles.match(/:\s*30px/) || styles.match(/:\s*none/))) {
            $(this).parent().addClass("transcript-closed")
        } else {
            $(this).parent().removeClass("transcript-closed")
        }
    })
}, 2000);// JavaScript Document