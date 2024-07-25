// JavaScript Document

$(window).load(dvuLoad);

function dvuLoad () {

	/*$.ajax({
				url: "https://devryu.instructure.com/api/v1/courses/" + window.courseCode + "/enrollments",
				type:'GET',
				success: function(x){
					for (i=0; i<x.length; i++){
						if (x[i].role=="Instructor"){
							console.log(x[i].id);
						}
					}
				}
			}); */

	$('body').on('click', '.intro-card', function () {
		window.open($(this).attr('data-target-url'), $(this).attr('data-target-location'));
		return false;
	});
	$('body').on('click', '.resource-general', function () {
		window.open($(this).attr('data-target-url'), $(this).attr('data-target-location'));
		return false;
	});
	$('body').on('click', '.resource-program', function () {
		window.open($(this).attr('data-target-url'), $(this).attr('data-target-location'));
		return false;
	});
	$('body').on('click', '.resource-card', function () {
		window.open($(this).attr('data-target-url'), $(this).attr('data-target-location'));
		return false;
	});
	$('body').on('click', '.resource-action', function () {
		window.open($(this).attr('data-target-url'), $(this).attr('data-target-location'));
		return false;
	});
	$('body').on('mouseenter', '.tile-image', function () {
		$(this).children('.tile-title').addClass('tile-hover');
	});
	$('body').on('mouseleave', '.tile-image', function () {
		$(this).children('.tile-title').removeClass('tile-hover');
	});
	$('body').on('click', '.tile-image', function () {
		window.open($(this).attr('data-target-url'), $(this).attr('data-target-location'));
		return false;
	});
	$('body').on('click', '.accordion.ui-accordion--mini h3 a', function () {
		$(this).parent().siblings().removeClass('active_item');
		$(this).parent().addClass('active_item');
		return false;
	});
	$('body').on('click', '.accordion.ui-accordion h3 a', function () {
		$(this).parent().siblings().removeClass('active_item');
		$(this).parent().addClass('active_item');
		return false;
	});

	$('.image-view-toggle').click(function () {
		if (!$(this).hasClass('image-view-toggle-active')) {
			$('.list-view-toggle').removeClass('list-view-toggle-active');
			$(this).addClass('image-view-toggle-active');
			$('.resource-container').removeClass('list-view-enabled');
			$('.resource-container .resource-program').addClass('resource-general');
			$('.resource-container .resource-general').removeClass('resource-program');
			$('.resource-container .resource-inner').addClass('resource-content');
			$('.resource-container .resource-content').removeClass('resource-inner');
			return false;
		}
	});
	$('.list-view-toggle').click(function () {
		if (!$(this).hasClass('list-view-toggle-active')) {
			$('.image-view-toggle').removeClass('image-view-toggle-active');
			$(this).addClass('list-view-toggle-active');
			$('.resource-container').addClass('list-view-enabled');
			$('.resource-container .resource-general').addClass('resource-program');
			$('.resource-container .resource-program').removeClass('resource-general');
			$('.resource-container .resource-content').addClass('resource-inner');
			$('.resource-container .resource-inner').removeClass('resource-content');
			return false;
		}
	});

	$('#wrapper .cirt_container .dd-button').click(function () {
		$(this).toggleClass('collapsed');
	});
	var btt = $('<div id="btt" title="Back to Top"><a href=#">Top</a></div>').appendTo($('.course-menu-expanded #wrapper #main'));
	$('#btt').hide();
	var dataEntryID;
	var attr;
	var playerID = 'kaltura_player_38935871';
	var playButton;
	$('.button-50 a, .button-100 a').each(function () {
		attr = $(this).attr('data-entryId');
		if ($(this).parent().hasClass('play-button')) {
			if (typeof attr == typeof undefined || attr == false || typeof attr == '') {
				$(this).parent().addClass('blank-button');
				$(this).bind('click', function (e) {
					e.preventDefault();
				});
				$('.blank-button').removeClass('play-button');
			}
		}
		if ($(this).parent().hasClass('quick-guide-button')) {
			if ($(this).attr('href') == '') {





				$(this).parent().addClass('blank-button');
				$(this).bind('click', function (e) {
					e.preventDefault();
				});
				$('.blank-button').removeClass('quick-guide-button');
			}
		}
	});
	$('body').off('click', '.play-button a').on('click', '.play-button a', function (e) {
		e.preventDefault();
		var dataEntryID = $(this).attr('data-entryId');
		var playerID = "kaltura_player_" + dataEntryID
		$('.button-50, .button-100').siblings('.faculty-learning-content').children('div.kaltura-video').remove();
		$('.button-50.description-button, .button-100.description-button').addClass('play-button');
		$('.button-50.play-button, .button-100.play-button').removeClass('description-button');
		$('.play-button span').text('Show Video');
		$('.button-50, .button-100').siblings('.faculty-learning-content').children('p.description').css('display', 'block');
		$(this).parent('.button-50, .button-100').addClass('description-button');
		$(this).parent('.button-50, .button-100').removeClass('play-button');
		$(this).parent('.button-50, .button-100').siblings('.faculty-learning-content').children('p.description').css('display', 'none');
		var player = $('<div class="allow-inline-style kaltura-video" id="' + playerID + '" style="width: 560px; height: 395px;" itemprop="video" itemscope itemtype="http://schema.org/VideoObject"></div>')
		$(this).parent('.button-50, .button-100').siblings('.faculty-learning-content').append(player);
		var container = $(this).parents('.faculty-learning-item').offset().top;
		var date = new Date();
		var time = date.getTime();
		kWidget.embed({
			"targetId": playerID,
			"wid": "_1432812",
			"uiconf_id": 27266491,
			"flashvars": {},
			"cache_st": time,
			"entry_id": dataEntryID
		});
		$(this).children('span').text('Hide Video');
		scrollBodyTo(container, 100);

		function scrollBodyTo(to, duration) {
			var tickLengt = 30;
			if (duration <= tickLengt) {
				$("html, body").scrollTop(to);
			}
			var difference = to - $.windowScrollTop();
			console.log(to + " - " + $.windowScrollTop() + " = " + difference);
			var ticks = Math.round(duration / tickLengt);
			var perTick = difference / ticks;
			console.log("per: ", perTick);
			setTimeout(execScroll, tickLengt);

			function execScroll() {
				console.log("step: ", $.windowScrollTop() + perTick);
				$("html, body").scrollTop($.windowScrollTop() + perTick);
				ticks--;
				if (ticks > 0)
					setTimeout(execScroll, tickLengt);
			}

		}

	});

	$('body').off('click', '.description-button a').on('click', '.description-button a', function (e) {		
		e.preventDefault();
		$(this).parent('.button-50, .button-100').addClass('play-button');
		$(this).parent('.button-50, .button-100').removeClass('description-button');
		$(this).parent('.button-50, .button-100').siblings('.faculty-learning-content').children('p.description').css('display', 'block');
		$(this).parent('.button-50, .button-100').siblings('.faculty-learning-content').children('div.kaltura-video').remove();
		$(this).children('span').text('Show Video');
	});
	$('body').off('click', '.expand-trigger').on('click', '.expand-trigger', function () {	
		$(this).parent().children('.expand-content').addClass('collapse');
		$(this).next('.expand-content').toggleClass('collapse');		
		var expandContainer = $(this).offset().top;
		
		scrollBodyTo(expandContainer, 100);

		function scrollBodyTo(to, duration) {
			var tickLengt = 30;
			if (duration <= tickLengt) {
				$("html, body").scrollTop(to);
			}
			var difference = to - $.windowScrollTop();
			console.log(to + " - " + $.windowScrollTop() + " = " + difference);
			var ticks = Math.round(duration / tickLengt);
			var perTick = difference / ticks;
			console.log("per: ", perTick);
			setTimeout(execScroll, tickLengt);

			function execScroll() {
				console.log("step: ", $.windowScrollTop() + perTick);
				$("html, body").scrollTop($.windowScrollTop() + perTick);
				ticks--;
				if (ticks > 0)
					setTimeout(execScroll, tickLengt);
			}

		}
	});
	$('.course__tile-container-modal').append('<div class="tile-modal"><div class="close-modal" aria-hidden="true" tabindex="-1"><a href="javascript:void(0);">X</a></div></div>');
	$('.tile-modal').hide();
	$('body').off('click', '.course__tile--modal a').on('click', '.course__tile--modal a', function (e) {
		e.preventDefault();
		$('.tile-modal').show();
		$(".close-modal").attr('tabindex','0');
		$(".close-modal").removeAttr('aria-hidden');
		var tileTitle = '<div class="tmcontent" tabindex="0"><h1>' + $(this).parent('.course__tile--modal').children('.course__tile-content').children('h1').html() + '</h1>';
var tileDescription = $(this).parent('.course__tile--modal').children('.course__tile-content').children('.course__tile-hidden-desc').html();
var tileContent = tileTitle + tileDescription + '</div>';
		$('.tile-modal').append(tileContent);
		$(".tmcontent").focus();
		$('.course__tile--modal').css('pointer-events','none');
	});
	$('body').off('click', '.close-modal a').on('click', '.close-modal a', function(e) {
		e.preventDefault();
		$('.tile-modal').html('<div class="close-modal"><a href="">X</a></div>').hide();		
		$(".close-modal").attr('tabindex','-1');
		$(".close-modal").attr('aria-hidden','true');
		$('.course__tile--modal').css('pointer-events','auto');
	});	
	$('.course__tile--custom').each(function () {
		if (typeof $(this).data('img-src') !== 'undefined') {
			var bgImgSrc = $(this).data('img-src');
			$(this).css('background-image', 'url("' + bgImgSrc + '")');
		}
	});
	$('.course__tile--modal').each(function () {
		if (typeof $(this).data('img-src') !== 'undefined') {
			var bgImgSrc = $(this).data('img-src');
			$(this).css('background-image', 'url("' + bgImgSrc + '")');
		}
	});

	flipBook();

	$('.modcontainer .mod').each(function () {
		if (typeof $(this).data('img-src') !== 'undefined') {
			var bgImgSrc = $(this).data('img-src');
			$(this).css('background-image', 'url("' + bgImgSrc + '")');
		}
	});

	if ($('#course_home_content .item-group-container #context_modules').length) {
		$.get("/api/v1/courses/" + ENV.COURSE_ID + "/modules?include[]=items&per_page=20").then(function (modules) {
			$.each(modules, function (i, mods) {
				console.log(mods);
				console.log(i);
				var modItemTotal = '';
				var modName;
				modName = mods.name;
				console.log(modName);
				$.each(mods.items, function (i, mods_items) {
					var modItemSingle = '';
					var modItemTitle;
					var modItemType;
					var modItemIndent;
					var modItemUrl;
					modItemTitle = mods_items.title;
					modItemUrl = mods_items.html_url;
					//console.log(modItemUrl);
					modItemIndent = 'indent_' + mods_items.indent;
					//console.log(mods_items);
					/*console.log(mods_items.title);
					console.log(mods_items.url);*/
					if (mods_items.type === "SubHeader") {
						modItemSingle = '<li class="context_module_item ' + modItemIndent + '"><div class="ig-row ig-published"><div class="ig-info"><div class="module-item-title"><span class="item_name"><a title="' + modItemTitle + '" class="ig-title title item_link" href="#">' + modItemTitle + '</a><span title="' + modItemTitle + '" class="title locked_title lookatmerighthere">' + modItemTitle + '</span></span></div></div></div></li>';
					} else {
						if (mods_items.type === "Assignment") {
							modItemType = '<i class="icon-assignment" aria-label="Item type: Assignment">';

						} else if (mods_items.type === "Discussion") {
							modItemType = '<i class="icon-discussion" aria-label="Item type: Discussion">';

						} else if (mods_items.type === "External Tool") {
							modItemType = '<i class="icon-link" aria-label="Item type: Link">';

						} else if (mods_items.type === "Quiz") {
							modItemType = '<i class="icon-quiz" aria-label="Item type: Quiz">';

						} else {
							modItemType = '<i class="icon-document" aria-label="Item type: Document">';
						}
						modItemSingle = '<li class="context_module_item ' + modItemIndent + '"><div class="ig-row ig-published"><a href="' + modItemUrl + '" class="for-nvda" tabindex="-1"> ' + modItemTitle + ' </a> <span class="type_icon"> <span class="ig-type-icon"> ' + modItemType + '</i> </span> </span><div class="ig-info"><div class="module-item-title"><span class="item_name"><a title="' + modItemTitle + '" class="ig-title title item_link" href="' + modItemUrl + '">' + modItemTitle + '</a><span title="' + modItemTitle + '" class="title locked_title">' + modItemTitle + '</span></span></div></div></div></li>';
					}
					modItemTotal = modItemTotal + modItemSingle;
				});
				$('.item-group-container #context_modules').append('<div class="item-group-condensed context_module context_module_hover" aria-label="' + modName + '" data-workflow-state="active"><div class="ig-header header"><span role="button" tabindex="0" href="#" class="ig-header-title collapse_module_link ellipsis" title="' + modName + '"><i class="icon-mini-arrow icon-mini-arrow-right"></i><span class="name" title="' + modName + '">' + modName + '</span></span></div><div class="content"><ul class="ig-list items context_module_items">' + modItemTotal + '</ul></div></div>');
				$('.context_module_items').hide();
				$('.loading-msg').hide();
				if ($('.ig-list').hasClass('expanded')) {
					$('.context_module_items').toggle();
					$('.icon-mini-arrow').toggleClass('icon-mini-arrow-right').toggleClass('icon-mini-arrow-down');
				}
			});
		});
		$('head').append('<link rel="stylesheet" type="text/css" href="http://lms.devry.edu/lms/styles/module_style.css">');
	}
	$('body').on('click', '.context_module .header', function () {
		$(this).parent().find('.context_module_items').toggle();
		$(this).parent().find('.icon-mini-arrow').toggleClass('icon-mini-arrow-right').toggleClass('icon-mini-arrow-down');
	});

};

if (CanvasDetails.location && CanvasDetails.location.courses) {
	$.get('/api/v1/courses/' + CanvasDetails.location.courses + '/users?enrollment_type[]=teacher').then(function (instructors) {
		onElementRendered(".author", function (el) {
			$.each(instructors, function (i, inst) {
				console.log(inst);
				console.log('.author:contains("' + inst.name + '")');
				$('.author:contains("' + inst.short_name + '")').closest('.discussion_entry').addClass('course-instructor');
			});
		});
	});
}


$(window).scroll(function () {
	if ($(document).scrollTop() > 10) {
		$("#btt").stop(true, true).fadeIn(300);
	} else {
		$("#btt").fadeOut(300);
	}
	$("#btt, #btt a").click(function () {
		$("html, body").stop(true, true).animate({
			scrollTop: "0px"
		}, 1000);
		return false;
	});
	if (!CanvasDetails.location.hasOwnProperty('edit')) {
		/*This will change the lecture subtitle to the section that is at the top of the viewport as it scrolls*/
		$(".toc .section").not(".to-delete").not("cw-hidden-section").each(function () {
			var vpH = $(window).height(), // Viewport Height
				st = $(window).scrollTop(), // Scroll Top
				y = $(this).offset().top,
				elementHeight = $(this).height();

			if ((y < (vpH + st)) && (y > (st - elementHeight + 80))) {
				$('#header h1').html('<a href="#">' + pageHeader + '</a><span> &gt; ' + $(this).find('h2').first().text() + '</span>');
				return false;
			}
		});
	}
});
if (CanvasDetails && CanvasDetails.location && CanvasDetails.location.hasOwnProperty('pages')) {
	onElementRendered('.user_content .section', function (elem) {
		renderTOC(elem);
	});
}


$('#course-roles-tab table.roles_table a.dropdown-toggle i').each(function (x, el) {
	el = $(el);
	var cellIndex = $(el).closest('td').index();
	var new_title = (el.attr('title') ? el.attr('title') : '') + ' [' + $($('#course-roles-tab table thead th em')[cellIndex - 1]).text() + ']';
	el.attr('title', new_title);
});
$('#account-roles-tab table.roles_table a.dropdown-toggle i').each(function (x, el) {
	el = $(el);
	var cellIndex = $(el).closest('td').index();
	var new_title = (el.attr('title') ? el.attr('title') : '') + ' [' + $($('#account-roles-tab table thead th em')[cellIndex - 1]).text() + ']';
	el.attr('title', new_title);
});

function renderTOC(elem) {
	$("[id=toc-nav]").remove();
	if (elem.length > 1) {
		var tocnav = $('<div id="toc-nav"></div>');
		var title = $(".page-title, .ic-Action-header__Primary")
		tocnav.insertAfter(title);
		tocnav.html('<a href="#" class="btn btn-primary">Table of Contents</a>');
		tocnav.append('<ul id="section-list"></ul>');
		tocnav.children("a").attr("tabindex", "1").click(function (e) {
			e.preventDefault();
			tocnav.toggleClass('toc-expanded');
			tocnav.attr("aria-expanded", "true").attr("aria-hidden", "false").focus();
		}).keyup(function (event) {
			if (event.keyCode == 13) {
				$(this).click();
				$(this).find("li a").first().focus();
			}
		});
		elem.each(function (i) {
			$(this).attr('id', 'nav-sec-' + i);
			if($(this).hasClass('kl_custom_block')){
				var tocItem = $(this).find('h3').first().html();
			} else {
				var tocItem = $(this).find('h2').first().html();
			}
			var jumpLink = 'nav-sec-' + i + '-link';
			if ($(this).hasClass('kl_custom_block')) {
				$(this).find('h3').attr('id', 'nav-sec-' + i + '-link');
			} else {
				$(this).find('h2').attr('id', 'nav-sec-' + i + '-link');
			}
			$('#section-list').append('<li><a href="#' + jumpLink + '">' + tocItem + '</a></li>');
		});
		tocnav.find('#section-list li a').attr('tabindex', '-1').click(function (event) {
			/*console.log('offset ')
			window.scrollTo(0, $($(this).attr("href")).offset().top - 60);
			$($(this).attr('href')).focus();
			event.preventDefault();
			event.stopPropagation();*/
			tocnav.removeClass('toc-expanded');
			if (tocnav.attr('class') !== 'expanded') {
				tocnav.attr('aria-expanded', 'false');
				tocnav.attr('aria-hidden', 'true');
				tocnav.attr('tabindex', '');
			} else {
				tocnav.attr('aria-expanded', 'true');
				tocnav.attr('aria-hidden', 'false');
				tocnav.attr('tabindex', '-1');
			}
		});
		$(window).scroll(function () {
			var left = $(".user_content").offset().left + "px";
			if (title.offset().top + title.height() - $(window).scrollTop() < 0) {
				tocnav.css({
					position: "fixed",
					top: 0,
					left: left
				});
				title.css("margin-bottom", "53px");

			} else {
				title.removeAttr("style");
				tocnav.removeAttr("style");
			}
		});
	}
}


function reactTray(trayLinks, slide_out_title, global_nav_name, footerContent) {

	//Browser Detection
	navigator.agentDetect = (function () {
		var ua = navigator.userAgent,
			tem,
			M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');

		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if (tem != null)
				return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/(\d+)/i)) != null)
			M.splice(1, 1, tem[1]);
		return M;
	})();

	//Array, 0 = browser, 1 = version
	var agent = navigator.agentDetect;
	var reactId;

	switch (agent[0]) {
		case "Firefox":
			reactId = "2";
			break;
		case "Safari":
			reactId = "2";
			break;
		default:
			reactId = "1";
			break;
	}

	var displayVals = '';

	function displayLinks(element, index, array) {
		displayVals += '<li class="ic-NavMenu-list-item">';
		displayVals += '<a class="ic-NavMenu-list-item__link ' + element.val.toLowerCase().replace(/\s/g, '-') + '" href="' + element.key + '" target="_blank" >' + element.val + '</a>'; //Remove target="_blank" if you do not want the links to open in a new tab.
		displayVals += '</li>';
	}

	trayLinks.forEach(displayLinks);

	var trayHtml = '<div style="position:absolute;background:#fff;" class="ReactTray__Content ReactTray__Content--after-open" style="position:absolute;background:#fff;" tabindex="-1" data-reactid=".' +
		reactId + '.0"><div class="ic-NavMenu__layout" data-reactid=".' +
		reactId + '.0.0"><div class="ic-NavMenu__primary-content" data-reactid=".' +
		reactId + '.0.0.0"><button style="float:right;" class="Button Button--icon-action ReactTray__closeBtn ic-NavMenu__closeButton" type="button" data-reactid=".' +
		reactId + '.0.0.0.0.1"><i class="icon-x" data-reactid=".' +
		reactId + '.0.0.0.0.1.0"></i><span class="screenreader-only" data-reactid=".' +
		reactId + '.0.0.0.0.1.1">Close</span></button><div class="ic-NavMenu__header" data-reactid=".' +
		reactId + '.0.0.0.0"><h1 style="letter-spacing: .05em; text-transform: uppercase; font-family: Khand, sans-serif;" class="ic-NavMenu__headline"" data-reactid=".' +
		reactId + '.0.0.0.0.0">' +
		slide_out_title + '</h1><hr /></div><h5>Course Issue Reporting Tool (CIRT)</h5><ul class="ic-NavMenu__link-list" data-reactid=".' +
		reactId + '.0.0.0.1">' +
		displayVals + '</ul></div><hr><div class="ic-NavMenu__secondary-content" data-reactid=".' +
		reactId + '.0.0.1"><div class="ReactTray__info-box" data-reactid=".' +
		reactId + '.0.0.1.0">' +
		footerContent + '</div></div></div></div>' +
		'<script>$(\'.Button.Button--icon-action.ReactTray__closeBtn, .Button.Button--icon-action.ReactTray__closeBtn .icon-x\').click(function () {			$(\'#custom_nav\').removeClass(\'ic-app-header__menu-list-item--active\');$(\'.ReactTrayPortal div\').removeAttr(\'style\');$(\'.ReactTrayPortal div\').removeAttr(\'class\');$(\'.ReactTrayPortal div\').html("");$(\'#menu, .menu-item.ic-app-header__menu-list-item a\').removeClass(\'ui-state-disabled\').removeAttr(\'disabled\');$(\'#customTrayOverlay\').hide();$(\'#custom_nav\').css(\'background-color\', \'\');$(\'.icon-resources\').css(\'color\', \'#fff\');});</script>';

	trayHtml = trayHtml.replace(/(?:\r\n|\r|\n|  )/g, '');
	var menu = $('#menu');
	var custom_nav = '<li id="custom_nav" class="menu-item ic-app-header__menu-list-item">';
	if (ENV.current_user_roles.indexOf('teacher') >= 0 || ENV.current_user_roles.indexOf('admin') >= 0) {
		if (!menu.length){
			return;
		}
		custom_nav = custom_nav + '<a id="global_nav_resources_link" href="javascript:void(0)" class="ic-app-header__menu-list-link">' + '<div class="menu-item-icon-container" aria-hidden="true">' + '<i class="fa fa-wrench" aria-hidden="true"></i>' + '<div class="menu-item__text">' + global_nav_name + '</div>' + '</div></a>';
	}
    custom_nav = custom_nav + '<a class="ic-app-header__menu-list-link" href="https://library.devry.edu" target="_blank"><div class="menu-item-icon-container" aria-hidden="true"><i class="fas fa-university fa-2x" aria-hidden="true"></i><div class="menu-item__text">Library</div></div></a></li>';
	menu.append(custom_nav);


	$('body').append('<div id="customTrayOverlay" style="width:' + $('#menu').width() + 'px;height: ' + $('#menu').height() + 'px;position: absolute;left: 0;top: 87px;z-index: 999;display:none;"></div>');

	$('body').append('<div class="ReactTrayPortal"><div></div></div>');

	$('#global_nav_resources_link').click(function () {
		$('.ReactTrayPortal div').addClass('ReactTray__Overlay ReactTray__Overlay--after-open');
		$('.ReactTrayPortal div').css({
			'position': 'fixed',
			'top': '0px',
			'left': '0px',
			'right': '0px',
			'bottom': '0px'
		});
		$('div.ReactTray__Content h5').css({
			'color': '#2D3B45 !important'
		});
		$('.ReactTrayPortal div').append(trayHtml);
		$('#menu, .menu-item.ic-app-header__menu-list-item a').addClass('ui-state-disabled').attr('disabled', 'disabled');
		$('#customTrayOverlay').show();
		$('.ic-app-header__menu-list-item--active').removeClass('ic-app-header__menu-list-item--active');
		$('#custom_nav').addClass('ic-app-header__menu-list-item--active');

	});

	var modalTitle;
	var modalWindow;

}

function cirtModal(modalTitle, modalWindow) {
	$('#cirt-Modal').remove();
	var modalContent = '<div id="cirt-Modal" class="modal user_content"><span class="closeBTN">&times;</span><h4>' + modalTitle + '</h4><div class="modal-content">' + modalWindow + '</div></div>';
	$('body').append(modalContent);
	$("#cirt-Modal").draggable({
		handle: 'h4'
	});
	$('#cirt-Modal').css({
		'box-sizing': 'border-box',
		'display': 'block',
		'position': 'fixed',
		'top': '10%',
		'right': '10%',
		'bottom': '10%',
		'left': '10%',

		'width': '80%',
		'height': '80%',
		'overflow': 'hidden',
		'background-color': '#EEE',
		'-moz-border-radius': '8px',
		'-webkit-border-radius': '8px',
		'border-radius': '8px',
		'z-index': '9999'

	});
	$('#cirt-Modal h4').css({
		'box-sizing': 'border-box',
		'padding': '10px 18px',
		'border': '1px dotted #CCC'
	});
	$('.closeBTN').css({
		'display': 'block',
		'position': 'absolute',
		'top': '1%',
		'right': '1%',
		'font-size': '24px',
		'cursor': 'pointer'
	});
	$('.modal-content').css({
		'box-sizing': 'border-box',
		'padding': '15px',
		'position': 'absolute',
		'top': '55px',
		'right': '0',
		'bottom': '0',
		'left': '0',
		'display': '100%',
		'margin-top': '0',
		'overflow': 'auto'
	});
	$('body').on('click', '.closeBTN', function (e) {
		$('#cirt-Modal').css('display', 'none');
		e.preventDefault();
	});

}

function flipBook() {
	var currentPage = 1;
	var totalPages = 0;

	$('.flip-book .flip-page').each(function () {
		totalPages++;
	});
	console.log(totalPages);

	$('.flip-book')
		.on('click', '.active', nextPage)
		.on('click', '.flipped', prevPage);

	$('.flip-book').click().on("swipeleft", nextPage);
	$('.flip-book').click().on("swiperight", prevPage);

	$('.flip-book').append('<span class="left-arrow"><<</span><span class="right-arrow">>></span>');
	$('.flip-book .left-arrow').hide();

	function prevPage() {
		currentPage--;
		console.log(currentPage);
		$('.flip-book .right-arrow').show();
		if (currentPage === 1) {
			$('.flip-book .left-arrow').hide();
		}
		$('.flipped')
			.last()
			.removeClass('flipped')
			.addClass('active')
			.siblings('.flip-page')
			.removeClass('active');
	}

	function nextPage() {
		currentPage++;
		console.log(currentPage);
		if (currentPage === totalPages) {
			$('.flip-book .right-arrow').hide();
		}
		$('.active')
			.removeClass('active')
			.addClass('flipped')
			.next('.flip-page')
			.addClass('active')
			.siblings();
		$('.flip-book .left-arrow').show();
	}


}
var atomicSearchWidgetScript = document.createElement("script");
atomicSearchWidgetScript.src = "https://d2u53n8918fnto.cloudfront.net/atomic_search_widget.js" + "?ts=" + new Date().getTime();
document.getElementsByTagName("head")[0].appendChild(atomicSearchWidgetScript);
