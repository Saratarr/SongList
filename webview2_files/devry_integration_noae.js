/*
 * To stop scripts from loading:
 * ?global_includes=0 
 * 
 */


var CanvasDetails = {};
var CanvasSIS = {};
var faccheck;
var urlparams = new URLSearchParams(location.search);

    var urlbreaker = location.href.split('/');
 
(function () {

    CanvasDetails.location = getLocationDetails();
    
    $.get("/api/v1/users/self/profile", function (data) {
        CanvasDetails.userInfo = data;
        console.log(data);
        CanvasSIS.userInfo = data;
        if (CanvasDetails.courseInfo){
			infoCont();
		}

    });
	if (CanvasDetails.location.courses) {
		$.get("/api/v1/courses/" + CanvasDetails.location.courses, function(data) {
			CanvasDetails.courseInfo = data;
		});
	}
    if (CanvasDetails.location && CanvasDetails.location.search && CanvasDetails.location.search.noframe == "true") {
        onElementRendered("body", function () {
            var tag = "<style type='text/css'> #not_right_side {\
            background: #eee none repeat scroll 0 0;\
            bottom: 0;\
            left: 0;\
            overflow: auto;\
            position: fixed;\
            right: 0;\
            top: 0;\
            z-index: 10000;\
        }\
        header.ic-app-header {\
            display: none;\
        }</style>"
            $(tag).appendTo("head");
        });
    }
    // var hideFac = "<style>#global_nav_faculty_link {    display: none;}</style>"
    //   $(hideFac).appendTo("head");
    
    if (CanvasDetails.location.courses) {
        $.get("/api/v1/courses/" + CanvasDetails.location.courses, function (data) {
            CanvasDetails.courseInfo = data;
            CanvasSIS.courseInfo = data;
            console.log(data);

            if (CanvasDetails.userInfo)
                infoCont();
            // $("body").append("<div class='insructor-tools'></div>");
        });
    } else {
        faccheck = false;
    }

    function infoCont() {
        console.log("info check")
        if (CanvasDetails.courseInfo.enrollments) {
            $.each(CanvasDetails.courseInfo.enrollments, function (i, v) {
                console.log(v.user_id, CanvasDetails.userInfo.id)
                if (v.user_id === CanvasDetails.userInfo.id) {
                    faccheck = true;
                }
            })
        }
    }
    onVarAvailable(["CanvasDetails", 'courseInfo'], function () {
        if (CanvasDetails.courseInfo.course_format === "online") {
            $("body").addClass("online");
        } else {
            $("body").addClass("campus")
        }
    });
    
    onElementRendered(".user_content", function(el){
        $(el).find('#ae_app').remove();
    });
    
    onElementRendered("#ae-userStateStore", function(el){
        $(el).find('#ae_app').remove();
    });
    
    onElementRendered(".kaccordion", function (el){
        $(el).find('a').prepend('<i class="fas fa-angle-right" style="margin-right: 5px;"></i>');
        $(el).find('h3').click(function(){
            if ($(this).parent().find('.kalturahide').css('position')=='absolute') {
                //If accordion is closed
                $(this).find('i').remove();
                $(this).find('a').prepend('<i class="fas fa-angle-down" style="margin-right: 5px;"></i>');
//              $(this).find('i').removeClass('fa-angle-right');
//              $(this).find('i').addClass('fa-angle-down');
                $(this).css('background-color', '#037ABA');
                $(this).find('a').css('color', 'white');
                $(this).parent().find('.kalturahide').css('position', 'relative');
                $(this).parent().find('.kalturahide').css('top', '0');
                $(this).parent().find('.kalturahide').css('left', '0');
                $(this).parent().find('.kalturahide').css('opacity', '1');
            } else {
                //If accordion is open
                $(this).find('i').remove();
                $(this).find('a').prepend('<i class="fas fa-angle-right" style="margin-right: 5px;"></i>');
//              $(this).find('i').removeClass('fa-angle-down');
//              $(this).find('i').addClass('fa-angle-right');
                $(this).css('background-color', '#eee');
                $(this).find('a').css('color', '#242224');
                $(this).parent().find('.kalturahide').css('position', 'absolute');
                $(this).parent().find('.kalturahide').css('top', '-9999px');
                $(this).parent().find('.kalturahide').css('left', '-9999px');
                $(this).parent().find('.kalturahide').css('opacity', '0');
            }
        });
    });

    onElementRendered(".intro-card", function (el) {
        $(el).each(function (idx, el) {
            el = $(el);
            // Set the href value of the link, replacing various pieces first
            if (el.attr('data-target-url')) {
                el.attr('data-target-url', el.attr('data-target-url').replace('$CANVAS_COURSE_REFERENCE$', "courses/" + CanvasDetails.location.courses));
            } else {
                console.log("no data target");
            }
        });
    });

    onElementRendered($("h2:contains(Add Account Admins)"), function () {
        $('<div><form><label>Search for User To Add</label><div class="ic-Input-group"><input type="text" class="ic-Input" id="dvu-search-query"><input type="submit" class="Button Button---primary" id="dvu-search-for-users" value="search"></div></form><ul class="admins_list user_list list admins" id="dos-user-results" style="max-height:200px;overflow:auto;"></ul></div>').insertAfter("#admin_role_id");
        $("#dvu-search-for-users").click(function (e) {
            e.preventDefault();
            $("#dos-user-results").empty();
            $.get("/api/v1/accounts/1/users?search_term=" + $("#dvu-search-query").val()).then(function (data) {
                $.each(data, function (i, v) {
                    $('<li id="dos-user-toadd">\
  <span class="user_name name">' + v.name + '</span>\
    <a title="Add to list" class="dos-add-user-to-list no-hover" data-user-login="' + v.login_id + '" style="float:right;" href="/accounts/6/account_users/19"><i class="icon-add standalone-icon"></i></a>\
  <span class="email">' + v.login_id + '</span>\
</li>').appendTo($("#dos-user-results"));
                });
            });
        })
        $("#dos-user-results").on("click", ".dos-add-user-to-list", function (e) {
            e.preventDefault();
            if ($("#user_list").val().indexOf($(this).attr("data-user-login")) < 0)
                $("#user_list").val($("#user_list").val() + " " + $(this).attr("data-user-login"));
        });
    });
    
//////////////////////////////////////////
////Begin HSI SSO Link Code////
////////////////////////////////////////
    onElementRendered('a[href*="survey-server2.com"]', function(el){
        $(el).each(function(idx,el){
            el = $(el);
            
            onVarAvailable(["CanvasDetails", 'userInfo'],function(){
                el.attr('href', el.attr('href').replace('Parameter1', CanvasDetails.userInfo.login_id));
                console.log('Replaced Parameter1 in HSI SSO');
            });
            onVarAvailable(["CanvasDetails", 'courseInfo'],function(){
                el.attr('href', el.attr('href').replace('Parameter2', encodeURIComponent(CanvasDetails.courseInfo.name)));
                console.log('Replaced Paramter2 in HSI SSO');
            });
            
        });
    
    });
    
//////////////////////////////////////////
////End HSI SSO Link Code////
////////////////////////////////////////
    
    onElementRendered('#flash_message_holder', function(el){
        if (ENV.COURSE_ID==19214 || ENV.COURSE_ID==41462 || ENV.context_asset_string=='course_19214' || ENV.context_asset_string=='course_41462'){
            $("#flash_message_holder").css('display','none');
        }
    });


    var toLoad = {
        scripts: [
        {src: "https://devry.evaluationkit.com/canvas/js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/modernizr.custom.32922.js", onLoad: function () {
                }},
			/*
            {src: "https://lms.devry.edu/lms/scripts/lib/jqueryui/jquery-ui.min.js", onLoad: function () {
                }},
				*/
            {src: "https://use.fontawesome.com/90a4b89be9.js", onLoad: function () {
                }},
            {src: "https://cdn-na.readspeaker.com/script/10038/webReaderForEducation/canvas/current/ReadSpeaker.Canvas.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/devryu_script.js?v=12314", onLoad: function () {
                    loader({src: "https://lms.devry.edu/lms/scripts/sidebar_usergrab.js", onLoad: function () {

                        }});
                }},
            {src: "https://lms.devry.edu/lms/scripts/dqfix_edited_notoken.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/dynamic/script.js?load=dvu", onLoad: function () {
                }},
        {src: "https://lms.devry.edu/lms/scripts/main-min.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/jquery.acornmediaplayer.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/audio_player.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/videoplaylist.js", onLoad: function () {
                }},
            {src: "https://cdnapisec.kaltura.com/p/1432812/sp/143281200/embedIframeJs/uiconf_id/27266491/partner_id/1432812", onLoad: function () {
                }},
            {src: "https://cdnapisec.kaltura.com/p/1432812/sp/143281200/embedIframeJs/uiconf_id/27266422/partner_id/1432812", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/kalturavideo.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/study-tools.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/codeblockprotect.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/pagespecific.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/HShow.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/hideshow2.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/Uber_Rollover.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/imagedesc.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/expertsays.js", onLoad: function () {
                }},
            //Elements of Link Token Replacement script inserted into this script.
            {src: "https://lms.devry.edu/lms/scripts/link_token_replacement.js", onLoad: function () {
                }},
            {src: "https://lms.devry.edu/lms/scripts/reveal_question.js", onLoad: function() {
                }},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js", onLoad: function () {
                    onElementRendered('.slick-carousel-item', function (item) {
                        item.each(function () {
                            var settings = {dots: true};
                            var insettings = $(this).attr("data-slick-settings");
                            if (insettings !== undefined) {
                                insettings = insettings.split(/;/);
                                $.each(insettings,
                                        function (i, item) {
                                            if (item.length > 1) {
                                                item = item.split(/:/);
                                                try {
                                                    settings[item[0]] = eval(item[1]);
                                                } catch (e) {
                                                    console.warn("could not load setting " + item[0], e);
                                                }
                                            }
                                        });
                            }
                            $(this).slick(settings);
                        });
                    });
                }
            }
            /*
            {src: "https://www.canvabadges.org/canvas_profile_badges.js", onLoad: function () {
                }}
            */
        ],
        css: [
            "https://lms.devry.edu/lms/styles/circle.css",
            "https://lms.devry.edu/lms/styles/DVNEW.css",
            "https://lms.devry.edu/lms/styles/main.min.css",
            "https://lms.devry.edu/lms/styles/acornmediaplayer.base.css",
            "https://lms.devry.edu/lms/scripts/lib/jqueryui/jquery-ui.min.css",
            "https://lms.devry.edu/lms/styles/acorn.access.css",
            "https://lms.devry.edu/lms/styles/videoplaylist.css",
            "https://lms.devry.edu/lms/styles/kalturaplayerstyles.css",
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.css",
            "https://lms.devry.edu/lms/styles/slickfix.css",
            "https://lms.devry.edu/lms/styles/Uber_RollOver.css",
            "https://lms.devry.edu/lms/styles/mediadevelopment.css",
            "https://lms.devry.edu/lms/styles/study-tools-main.css",
            "https://lms.devry.edu/lms/styles/animate-custom.css",
            "https://use.fontawesome.com/releases/v5.7.1/css/all.css",
        ]

    }

    if (CanvasDetails.location.pages) {
        onElementRendered("#wiki_page_show .page-title", function (element) {
            if ($("#wiki_page_show .section").length <= 0) {
                $("#wiki_page_show").addClass("enable-editing");
            }
        });
    }
    
    //Enables editing for pages for admins/teachers
    if (ENV && ENV.current_user_roles && ENV.current_user_roles.indexOf("admin") >= 0 || ENV && ENV.current_user_roles && ENV.current_user_roles.indexOf("teacher") >= 0) {
        onElementRendered("#wiki_page_show", function (element) {
            $("#wiki_page_show").addClass("enable-editing");
        });
        if (ENV.current_user_roles.indexOf("admin") >= 0){
            onElementRendered("body", function (element) {
                $("body").addClass("is-admin");
            });
        }
    } else {
        onElementRendered("#tab-details", function (element) {
            $("#tab-details").find("input").attr("disabled", "true");
            $("#tab-details").find("select").not("#course_course_code").not("#course_home_page_announcement_limit").attr("disabled", "true");
            $("#course_home_page_announcement_limit, #course_hide_distribution_graphs, #course_lock_all_announcements").removeAttr("disabled");
            $("#tab-details").find(".ui-datepicker-trigger").attr("disabled", "true");
        });
    }



    onElementRendered(".prettyprint", function (element) {
        if (typeof PR !== "undefined" && PR.prettyprint) {
            PR.prettyPrint();
        } else {
            appendCSS("https://lms.devry.edu/lms/scripts/lib/pretty/prettify.css");
            loader({src: "https://lms.devry.edu/lms/scripts/lib/pretty/prettify.js", onLoad: function () {
                    loader({src: "https://lms.devry.edu/lms/scripts/lib/pretty/lang-vb.js", onLoad: function () {
                            console.log("loaded");
                            PR.prettyPrint();
                        }});
                }});
        }


    });
//<span data-mig-tag='script' data-mig-src='urlofjs'></span>
//<span data-mig-tag='style' data-mig-src='urlofcss'></span>


    loadCss(toLoad.css);
    var len = toLoad.scripts.length;
    loadScripts(toLoad.scripts, function () {
        console.log("loaded ", len)
        onElementRendered("[data-mig-tag]", function (el) {
            $(el).each(function (i, element) {
                if ($(element).attr("data-mig-tag") === "script") {
                    if ($(element).attr("data-mig-src") !== undefined)
                        loader({src: $(element).attr("data-mig-src")});
                    else
                        loader({text: $(element).html()});
                } else if ($(element).attr("data-mig-tag") === "style") {
                    appendCSS($(element).attr("data-mig-src"));
                }
            })
        });
        onElementRendered("[data-script-url]", function (el) {
            $(el).each(function (i, element) {
                if ($(element).attr("data-script-url") !== undefined)
                    loader({src: $(element).attr("data-mig-src")});
            })
        });
    });


    function loader(scr, handler) {
        var script = document.createElement("script");
        if (scr.src) {
            script.src = scr.src;
            script.onload = script.onreadystatechange = function () {
                script.onreadystatechange = script.onload = null;
                if (scr.onLoad)
                    scr.onLoad();
                if (typeof handler === "function")
                    handler();
            }
            var head = document.getElementsByTagName("head")[0];
            (head || document.body).appendChild(script);
        } else if (scr.text) {
            addScriptBlock(scr.text, scr.onLoad);
        }
    }
    ;
    function loadScripts(array, callback) {

        (function run() {
            if (array.length != 0) {
                loader(array.shift(), run);
            } else {
                callback && callback();
            }
        })();
    }
    function addScriptBlock(text, callback) {
        var script = document.createElement("script");
        script.innerHTML = text
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild(script);
        if (typeof callback === "function")
            callback();
    }

    function loadCss(array) {
        $.each(array, function (i, v) {
            appendCSS(v)
        });
    }

    function appendCSS(v) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', v);
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    function getLocationDetails() {
        try {
            var details = {url: location.href, search: {}};
            var path = location.pathname;
            path = path.split("/");
            for (var i = 1; i < path.length; i += 2) {
                details[path[i]] = path[i + 1];
            }
            if (location.search.length > 0) {
                var search = location.search.replace(/^\?/, "")
                search = search.split(/\&/);
                for (var i = 0; i < search.length; i++) {
                    var d = search[i].split("=");
                    details.search[d[0]] = d[1];
                }

            }
        } catch (e) {
            console.log(e)
        }
        return details;
    }
})();


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

function onVarAvailable(variable, cb, _attempts) {

    _attempts = ++_attempts || 1;
    if (typeof eval("window." + variable.join(".")) !== "undefined")
        return cb(eval("window." + variable.join(".")));
    if (_attempts == 60)
        return;
    setTimeout(function () {
        onVarAvailable(variable, cb, _attempts);
    }, 250);
}
var lookForAdamLinks = function(){
  onElementRendered('a[href*="interactiveanatomy.com"][rel=noreferrer]',  
    function(els){
      console.log('found '+els.length+' A.D.A.M. links');
      $(els).each(function(idx, el){
        // A.D.A.M links need special treatment. Remove the noreferrer rel.
        $(el).removeAttr('rel');

      });
      window.setTimeout(lookForAdamLinks, 250);
    }
  );
};

$(document).ready(function(){
  lookForAdamLinks()
});

// JavaScript Document

//////////////////////////////////////////
////Begin Google Analytics - RA Built////
////////////////////////////////////////

//In Google Analytics you'll need to set up custom dimensions as follows
// Custom Dimension 1 = Canvas User ID --- Scope = User
// Custom Dimension 2 = Archived --- Scope = User
// Custom Dimension 3 = Canvas User Role --- Scope = User
// Custom Dimension 4 = Canvas Course ID --- Scope = Hit
// Custom Dimension 5 = Canvas Course Name --- Scope = Hit
// Custom Dimension 6 = Canvas Sub-Account ID --- Scope = Hit

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'custom_ga');

$(document).ready(function () {

    // START - More Google Analytics Tracking Code
    var sUserId
    var sUserRole
    var sTemp // Course ID from URL
    var _course
    var sCourseName = null
    var parent_account //Give you the subaccount_id that the course is in

////////////////// CHANGE UA # HERE /////////////////////
    custom_ga('create', 'UA-125899619-1', 'auto');

    //Get User Information
    sUserId = ENV["current_user_id"]
    custom_ga('set', 'dimension1', sUserId);
    custom_ga('set','userId', sUserId);


    //Get User Role
    if ($.inArray('admin', ENV['current_user_roles']) == -1 && $.inArray('teacher', ENV['current_user_roles']) == -1 && $.inArray('student', ENV['current_user_roles']) > -1) {
        sUserRole = "student"
    } else if ($.inArray('admin', ENV['current_user_roles']) == -1 && $.inArray('teacher', ENV['current_user_roles']) > -1) {
        sUserRole = "teacher"
    } else if ($.inArray('admin', ENV['current_user_roles']) > -1) {
        sUserRole = "admin"
    } else {
        sUserRole = "other"
    }

    custom_ga('set', 'dimension3', sUserRole);

    //If the user is in a course
    try {
        sTemp = window.location.pathname.match(/\/courses\/(\d+)/);
        if (sTemp[1]) {

            //Get Course information - Course Name and parent sub-account id
            var d1 = $.get('/api/v1/courses/' + sTemp[1], function (_course) {
                parent_account = _course.account_id
                parent_account = parent_account.toString();
                sCourseName = _course.name
            });


            $.when(d1).done(function (_account) {
                // ...do stuff...
                custom_ga('set', 'dimension4', sTemp[1]);
                custom_ga('set', 'dimension5', sCourseName);
                custom_ga('set', 'dimension6', parent_account);
                custom_ga('send', 'pageview');
            });
        } else {
            custom_ga('send', 'pageview');
        }
    } catch (err) {}
    
    $("#global_nav_dashboard_link").click(function(){
        custom_ga('send', 'event', 'dashboard','click',sUserRole,1);
    });

    // END - Google Analytics Tracking Code

});

//////////////////////////////////////////
////End Google Analytics - RA Built////
////////////////////////////////////////
////////////////////////////////////////////////////
// DESIGN TOOLS CONFIG                            //
////////////////////////////////////////////////////
// Copyright (C) 2017  Utah State University
var DT_variables = {
        iframeID: '',
        // Path to the hosted USU Design Tools
        path: 'https://designtools.ciditools.com/',
        templateCourse: '53417',
        // OPTIONAL: Button will be hidden from view until launched using shortcut keys
        hideButton: true,
         // OPTIONAL: Limit by course format
         limitByFormat: false, // Change to true to limit by format
         // adjust the formats as needed. Format must be set for the course and in this array for tools to load
         formatArray: [
            'online',
            'on-campus',
            'blended'
        ],
        // OPTIONAL: Limit tools loading by users role
        limitByRole: true, // set to true to limit to roles in the roleArray
        // adjust roles as needed
        roleArray: [
            'admin'
        ],
        // OPTIONAL: Limit tools to an array of Canvas user IDs
        limitByUser: false, // Change to true to limit by user
        // add users to array (Canvas user ID not SIS user ID)
        userArray: [
            '8',//Matthew Crowley
            '98',//Dianna Heckman
            '206',//Kimberley Martin
            '197',//Danielle Crenshaw
            '135270000000000001'//Dean Holik
        
        ]
};

// Run the necessary code when a page loads
$(document).ready(function () {
    'use strict';
    // This runs code that looks at each page and determines what controls to create
    $.getScript(DT_variables.path + 'js/master_controls.js', function () {
        console.log('master_controls.js loaded');
    });
});

////////////////////////////////////////////////////
// END DESIGN TOOLS CONFIG                        //
////////////////////////////////////////////////////

//////////////////////////////////////////
////  Start Devry Assistance Widget  ////
////////////////////////////////////////

(function (w, d, s, o, f, js, fjs) {
    w['Simple-Widget'] = o; w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
}(window, document, 'script', 'w1', 'https://dce-ctl.devry.edu/widget-component/dist/widget.js'));

if (window.location == window.parent.location) {

    onVarAvailable(["CanvasDetails", 'userInfo'],function(){
        if (CanvasDetails.location.hasOwnProperty !== false && typeof CanvasDetails.userInfo !== 'undefined' && CanvasDetails.userInfo.hasOwnProperty('id')){
            var el = document.createElement("div");
            el.id="root-widget--";
            var parentNode = document.getElementById("main");
            parentNode.appendChild(el);

            w1('init', { targetElementId: 'root-widget--' });
            document.getElementById("wrapper").style.paddingBottom = "85px"
            if (ENV.current_user_roles !== 'undefined' && ENV.current_user_roles.includes("fake_student")){
                document.getElementById("root-widget--").firstElementChild.style.marginBottom = "55px"
            }

            var newLink = document.createElement("link");
            newLink.rel = "stylesheet";
            newLink.href = "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap";

            document.getElementsByTagName("head")[0].appendChild(newLink);
        }
    });



}

//////////////////////////////////////////
////   End Devry Assistance Widget   ////
////////////////////////////////////////


///////////////////////////////////////////
////  Start Impact integration script ////
/////////////////////////////////////////

if (document.location.hostname === "devryu.instructure.com") {
    window.eesyLaunchConfig = {
        host: 'devry.eesysoft.com',
        key: 'c7TjCG2a',
        supportTab: false
    };
    
} else {
    window.eesyLaunchConfig = {
        host: 'devrytest.eesysoft.com',
        key: 'FS7yknZz',
        supportTab: true
    };
};
(function() {
    var e = document.createElement('script');
    e.src = '//' + window.eesyLaunchConfig.host + "/resources/js/canvas/launch.js?stmp=" + new Date().getTime();
    e.src = '//' + window.eesyLaunchConfig.host + "/resources/js/canvas/launch.js";
    e.async = true;
    e.type = 'text/javascript';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
} ());




///////////////////////////////////////////
////   End Impact integration script  ////
/////////////////////////////////////////