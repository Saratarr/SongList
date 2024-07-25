// Discussion Fix (Edited)
	if(new RegExp("discussion_topics/").test(window.location.href)==true && new RegExp("is_announcement=true").test(window.location.href)==false && new RegExp("new").test(window.location.href)==false && new RegExp("edit").test(window.location.href)==false && new RegExp("Announcements").test($("#breadcrumbs").find('.ellipsible').eq(2).text())==false){

		var urlbreaker = location.href.split('/');

		//Check if posts are hidden
		var hidden_post = false;
		var instructor = '';
		var isInstructor = false;
		var instonLoad = true;
		if ($(".course-instructor").length>0){
			if (urlbreaker[2]=='devryworks.instructure.com'){
				instructor = $(".course-instructor").eq(0).find(".avatar").attr("href").replace(/https\:\/\/devryworks\.instructure\.com\/courses\/\d*\/users\//, '');
			} else if (urlbreaker[2]=='devrydevelopment.instructure.com'){
				instructor = $(".course-instructor").eq(0).find(".avatar").attr('href').replace(/https\:\/\/devrydevelopment\.instructure\.com\/courses\/\d*\/users\//, '');
				
			} else {
				instructor = $(".course-instructor").eq(0).find(".avatar").attr('href').replace(/https\:\/\/devryu\.instructure\.com\/courses\/\d*\/users\//, '');
			}
		} else {
			console.log('found no instructor posts');
			instonLoad = false;
		}
		
		if ($(".showMore").length>0){
			console.log('there are hidden posts');
			hidden_post = true;
			
			$(document).data('posted_discussions', {'complete': false, 'userposts': [], 'instposts': [], 'querychecker': []});
			
			$.ajax({
				url: 'https://' + urlbreaker[2] + '/api/v1/courses/' + urlbreaker[4] + '/discussion_topics/' + urlbreaker[6].split('?')[0] + '/entries?per_page=100',
				type: 'GET',
				success: function(dq_topics){
					for (var i=0; i<dq_topics.length; i++){
						$(document).data('posted_discussions').querychecker.push({
						'id': dq_topics[i].id,
						'user_id': dq_topics[i].user_id,
							'created_at': dq_topics[i].created_at,
							'read_state': dq_topics[i].read_state,
							'user_name': dq_topics[i].user_name,
							'message': dq_topics[i].message,
							'avatar_image_url': dq_topics[i].user.avatar_image_url,
						'post_name': 'entry_' + i,
						'finished': false,
						'replies': 0
					});
						if (dq_topics[i].user_id == ENV.current_user_id){
						    $(document).data('posted_discussions').userposts.push(dq_topics[i]);
						}
						if (dq_topics[i].user_id == instructor){
							$(document).data('posted_discussions').instposts.push(dq_topics[i]);
						}
						$.ajax({
							url: 'https://' + urlbreaker[2] + '/api/v1/courses/' + urlbreaker[4] + '/discussion_topics/' + urlbreaker[6].split('?')[0] + '/entries/' + dq_topics[i].id + '/replies?per_page=100',
							type: 'GET',
							ajax_i: i,
							success: function(replies){
								i = this.ajax_i;
								if (replies.length > 0){
									$(document).data('posted_discussions').querychecker[i].replies = replies.length;
									for (var r=0; r<replies.length; r++){
										if(replies[r].user_id == ENV.current_user_id){
											$(document).data('posted_discussions').userposts.push(replies[r]);
										}
										if (replies[r].user_id == instructor){
											$(document).data('posted_discussions').instposts.push(replies[r]);
										}
										if (r==replies.length-1){
											$(document).data('posted_discussions').querychecker[i].finished = true;
										}
									}
								} else {
									$(document).data('posted_discussions').querychecker[i].finished = true;
								}
							}
							
						});
					}
					
				}
			});			
			
			var qcheck_counter = 0;				
			var qcheck_timer = setInterval(function(){
				//Wait until post is generated
				qcheck_counter++;
				for (var q=0; q<$(document).data('posted_discussions').querychecker.length; q++){
					if ($(document).data('posted_discussions').querychecker[q].finished==false){
						console.log('false instances found, breaking loop');
						break;
					}
					if (q==$(document).data('posted_discussions').querychecker.length-1){
						console.log('reached the end of the query');
						$(document).data('posted_discussions').complete = true;
					}
				}
				
				if($(document).data('posted_discussions').complete==true){
					clearInterval(qcheck_timer);
				}
									
				if(qcheck_counter>=10){
					$("#filterResults").html('<p>ERROR: Posts have not finished loading. Please wait a few seconds and try again.</p>');
						clearInterval(qcheck_timer);
					}		
				
			}, 500);

			
		}
		
		/*
		var windloc = window.location.href;
		windloc = windloc.split('/');
		var canvasDomain = windloc[0];
		var courseID = windloc[2];
		*/
	
	//Hide in live script - used to hardcode user ID
	//var userID = '80842';
	
	//User settings functions & other variable declarations
		var weekLimit = 1;
			
		var curWeek = $("#discussion_topic").find('h1.discussion-title').text();	
		curWeek = curWeek.replace(/[^\d*]/g,'');
		console.log(curWeek);
		var curUser = CanvasDetails.userInfo.id;
		console.log(curUser);
		var video = '<div class="devry_note discussion_note"><div class="discussion_note_content"><h3><a target="_blank" href="https://lms.devry.edu/lms/video/player.html?video=0_hdsriydy">Navigating Your Discussions</a></h3><p>Follow the link above to learn more about how to navigate discussions within your course. If you are not seeing the new features, clear your browser cache.</p></div></div> ';
		if (curUser == instructor){
			isInstructor = true;
			console.log('isInstructor is true');
		
		//Add sidebar functionality for faculty
			$(".discussion-reply-action").click(function(){
				$("#right-side-wrapper").css('display','block');
			});
			$(".cancel_button").click(function(){
				$("#right-side-wrapper").css('display','none');
			});
			$(".btn-primary").click(function(){
				$("#right-side-wrapper").css('display','none');
			});
		
		}
	
	//Flags for custom dq buttons
		var ip_flag = false;
		var mp_flag = false;
			
	//Add in video to Week 1 Instructions
		if(curWeek<=weekLimit && curWeek!=''){
			$("#discussion_topic").find('.entry-content').eq(0).prepend(video);
		}
	
	//Discussion resizing fixes
		$("#right-side-wrapper").css('display','none');
	
	// Indented replies & miscellaneous styling
		$(".replies").css('background', '#EEEEEE');
		$(".replies").css('padding-left', '30px');
		$(".discussion-entries").find(".entry").css("border","none");
		$(".discussion-entries").find("article").css("border", "1px solid #C7CDD1");
		$(".discussion-read-state-btn").css("margin", "0 -40px");
		$(".pad-box-mini").css("padding","3px");
		$(".discussion-entries").css('overflow','visible');
		$(".entry-content").css('paddingLeft','12px');

	//Expand collapsed view summary text
		$(".discussion-header-content").find(".span4").css('width','600px');

	//Add "View My Posts" button
		$(".headerBar__controls").prepend('<button id="my_posts" class="btn custombtn disableWhileFiltering" title="View My Posts" aria-label="View My Posts"><i aria-hidden="true" class="icon-user"></i><span class="screenreader-only">View My Posts</span></button>');

	//Add "View Instructor" button
		if(isInstructor==false){
			$(".headerBar__controls").prepend('<button id="instructor_posts" class="btn custombtn disableWhileFiltering" title="View Instructor posts" aria-label="View Instructor Posts"><i aria-hidden="true" class="icon-educators"></i><span class="screenreader-only">View Instructor posts</span></button>&nbsp;');
		};
	
	
	//"Read More" functionality
	
	$("#discussion_subentries").find(".user_content").each(function(){
		var postheight = parseInt($(this).css('height'));
		if (postheight > 400){
			$(this).css('max-height','400px');
			$(this).css('overflow', 'hidden');
			$(this).parent().parent().find('.entry-controls').eq(0).find('.notification').css('margin-top','10px');
			$(this).parent().parent().find('.entry-controls').prepend('<a href="javascript:void(0)" class="dq_readmore" style="padding-top: 10px;">Read More</a>');
			//Fade Out Code
			//$(this).parent().append('<div class="css_fade"></div>');
		}
		//Fade Out Code (CSS)
		/*
		if ($(this).parent().parent().parent().hasClass('course-instructor')==true){
			$(this).parent().find(".css_fade").eq(0).css('bottom','26%');
			$(this).parent().find(".css_fade").eq(0).css('width', '95%');
		} else {
			$(this).parent().find(".css_fade").eq(0).css('bottom','24%');
			$(this).parent().find(".css_fade").eq(0).css('width', '97%');			
		}
		$(".css_fade").css('position', 'absolute');
		$(".css_fade").css('height','100px');
		$(".css_fade").css('pointer-events','none');
		$(".css_fade").css('background', '-webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)');
		*/
	});
	
	
	//Read More click functionality
	$(".dq_readmore").click(function(e){
		e.preventDefault();
		if ($(this).text()=='Read More'){
			$(this).parent().parent().find('.user_content').css('max-height','100%');
			$(this).parent().parent().find('.css_fade').css('display','none');
			$(this).text('Read Less');
		} else {
			$(this).parent().parent().find('.user_content').css('max-height','400px');
			$(this).parent().parent().find('.css_fade').css('display','block');
			$(this).text('Read More');
		}
	});
		
	//Custom button styling
		$(".custombtn").css('border','2px solid #00599C');

	//Click functionality for instructor posts button
		$("#instructor_posts").click(function(){			
			if ($("#discussion_subentries").hasClass('hidden') && ip_flag==true){
				//Filtered results are displaying instructor posts
				$("#discussion_subentries").removeClass('hidden');
				$("#filterResults").addClass('hidden');
				ip_flag = false;
			} else {
				ip_flag = true;
				mp_flag = false;
				$("#discussion_subentries").addClass('hidden');
				//Filtered results are hidden
				if(hidden_post==true){
					if ($(document).data('posted_discussions').complete==true){
						console.log('posted_discussions search is complete, instPost on load = ' + instonLoad);
						if (instonLoad==false && $(".course-instructor").length>0){
							if (urlbreaker[2]=='devryworks.instructure.com'){
								instructor = $(".course-instructor").eq(0).find(".avatar").attr("href").replace(/https\:\/\/devryworks\.instructure\.com\/courses\/\d*\/users\//, '');
							} else if (urlbreaker[2]=='devrydevelopment.instructure.com'){
								instructor = $(".course-instructor").eq(0).find(".avatar").attr('href').replace(/https\:\/\/devrydevelopment\.instructure\.com\/courses\/\d*\/users\//, '');
							} else {
								instructor = $(".course-instructor").eq(0).find(".avatar").attr('href').replace(/https\:\/\/devryu\.instructure\.com\/courses\/\d*\/users\//, '');
							}

							console.log ('Missed ' + $(".course-instructor").length + ' instructor posts, loading them now.');
							
							$("#filterResults").html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>Loading posts...');
							
							for (var d=0; d<$(document).data('posted_discussions').querychecker.length; d++){
								console.log($(document).data('posted_discussions').querychecker[d].user_id + ', ' + instructor);
								if ($(document).data('posted_discussions').querychecker[d].user_id==instructor){
									$(document).data('posted_discussions').instposts.push($(document).data('posted_discussions').querychecker[d]);
								} 
							}		
							
						}
						
						var filtered_results = $(document).data('posted_discussions').instposts.length;
						var filtered_output = '<ul class="discussion-entries">';
						if (filtered_results>0){
							for (var ip=0; ip<filtered_results; ip++) {
								var instp = $(document).data('posted_discussions').instposts[ip];
								var pdate = new Date(instp.created_at);
								var pmonthdate = pdate.toLocaleString('en-US', {month: 'long', day: 'numeric'});
								var ptime = pdate.toLocaleString('en-US', {hour:'numeric', minute: 'numeric', hour12: true});
								var readStatus = instp.read_state;
								var article = '<article class="discussion_entry ' + readStatus + '">';
								var alink = '<div><a href="#" class="discussion-read-state-btn" role="button" title="Mark as Unread" data-event="toggleRead" style="margin: 0px -40px;"><div class="discussion-read-state tooltip data-tooltip"></div></a></div>';
								var dq_head = '<header class="entry-header discussion-section"><a href="#" class="collapsable collapse-discussion pad-box-mini" role="button" tabindex="0" data-event="toggleCollapsed" style="padding: 3px;"><span aria-live="assertive" class="screenreader-only">Collapse Subdiscussion</span></a><a href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + instp.user_id + '" class="avatar" style="background-image: url(' + instp.avatar_image_url + ')"><span class="screenreader-only">' + instp.user_name + '</span></a><div class="discussion-header-content right-of-avatar"><div class="pull-left span4" style="width: 600px;"><h2 class="discussion-title" role="heading" aria-level="2"><a class="author" href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + instp.user_id + '" data-bypass="" title="Author\'s name">' + instp.user_name + '</a></h2><div class="discussion-pubdate hide-if-collapsed"><time data-html-tooltip-title="' + pmonthdate + ' at ' + ptime + '" datetime="' + pdate + '" pubdate=""><span aria-hidden="true">' + pdate.toLocaleString('en-US', {weekday: 'long'}) + '</span><span class="screenreader-only">' + pmonthdate + ' at ' + ptime + '</span></time></div><div class="show-if-collapsed discussion-subtitle summary ellipsis">' + instp.message + '</div></div><div class="admin-links hide-if-collapsed"><a role="button" class="al-trigger dim-till-hover" href="#"><i class="icon-more standalone-icon" aria-hidden="true"></i><span class="screenreader-only">Manage Discussion Entry</span></a><ul class="al-options"><li><a href="#topic" data-pushstate=""><i class="icon-discussion"></i> Go To Topic</a></li><li><a data-event="edit" href="#"><i class="icon-edit"></i> Edit</a></li><li><a data-event="remove" href="#"><i class="icon-trash"></i> Delete</a></li><li><a href="/courses/' + urlbreaker[4] + '/gradebook/speed_grader?assignment_id=' + urlbreaker[6].split('?')[0] + '&amp;student_id=' + instp.user_id + '"><i class="icon-speed-grader"></i> Open in SpeedGrader</a></li></ul></div><div class="discussion-header-right"><div class="headerBadges show-if-collapsed"></div></div></header>';
						
							/*
							ADD AFTER <div class="headerBadges show-if-collapsed">
							'<div class="new-and-total-badge"><span class="new-items">14</span><span class="total-items">39</span></div></div></div>'
							*/
								var dq_section = '<div class="discussion-section message-wrapper" style="clear: both;">' + instp.message + '</div>';

								var dq_entrycontrols = '<div class="entry-controls" data-entry="' + instp.id + '"><a class="viewdq_ip" href="javascript:void(0)">View in Discussion</a>';
						
								filtered_output = filtered_output + '<li class="entry">' + article + alink + '<div class="entry-content">' + dq_head + dq_section + dq_entrycontrols + '</div></article></li>';
							}
							filtered_output += '</ul>';
							$("#filterResults").html(filtered_output);
							$(".viewdq_ip").click(function(e){
								console.log('Clicked before default prevented');
								e.preventDefault();
								console.log('Clicked after default prevented');
								var windloc = window.location.href;
								var entry_id = '#entry-' + instp.id;
								windloc = windloc.replace(/\#\w*\-\d*/ig, '');
								$(".entry").removeClass('collapsed');
								$("#discussion_subentries").removeClass('hidden');
								$("#filterResults").addClass('hidden');
								window.location.href = windloc + entry_id;
							});
					} else {
							//Double Checking for Instructor Posts in case of a loading time issue
						
						
							$("#filterResults").html('<p>There are no instructor posts in this discussion at this time.</p>');
						}					
					} else {
						console.log('posted_discussion search is incomplete');
					}
					
				} else {
					var filtered_results = 0;
					var filtered_output = '<ul class="discussion-entries">';
					$("#discussion_subentries").find('article').each(function(){
						if($(this).hasClass('course-instructor') && !$(this).hasClass('deleted-discussion-entry')){
							filtered_results = filtered_results + 1;
							var ent_id = $(this).parent().attr('id');
							var readStatus = '';
							if ($(this).find('article').eq(0).hasClass('read')){
								readStatus = ' read';
							}
							var article = '<article class="discussion_entry' + readStatus + '">';
							var alink = $(this).find('a').eq(0).clone();
							var dq_head = '<header class="entry-header discussion-section">' + $(this).find('header').eq(0).html() + '</header>';
							var dq_section = '<div class="discussion-section message-wrapper" style="clear: both;">' + $(this).find('.message_wrapper').eq(0).find('.user_content').eq(0).html() + '</div>';
							var dq_entrycontrols = '<div class="entry-controls" data-entry="' + ent_id + '"><a class="viewdq_ip" href="javascript:void(0)">View in Discussion</a>';
							$(alink).wrap('<div>');
							alink = $(alink).parent().html();
					
							filtered_output = filtered_output + '<li class="entry">' + article + alink + '<div class="entry-content">' + dq_head + dq_section + dq_entrycontrols + '</div></article></li>';
						}
					});
					filtered_output += '<ul>';
					if (filtered_results>0){
						$("#filterResults").html(filtered_output);
						$(".viewdq_ip").click(function(e){
						console.log('Clicked before default prevented');
						e.preventDefault();
						console.log('Clicked after default prevented');
						var windloc = window.location.href;
						var entry_id = '#' + $(this).parent().data('entry');
						windloc = windloc.replace(/\#\w*\-\d*/ig, '');
						$(".entry").removeClass('collapsed');
						$("#discussion_subentries").removeClass('hidden');
						$("#filterResults").addClass('hidden');
						window.location.href = windloc + entry_id;
					});
					} else {
						$("#filterResults").html('<p>There are no instructor posts in this discussion at this time.</p>');
					}
				}
				$("#filterResults").removeClass('hidden');
		}
	});
	
	//Click functionality for my posts button
		$("#my_posts").click(function(){
			if ($("#discussion_subentries").hasClass('hidden') && mp_flag==true){
				//Filtered results are displaying user posts
				$("#discussion_subentries").removeClass('hidden');
				$("#filterResults").addClass('hidden');
				mp_flag = false;
			} else {
				//Filtered results are hidden
				mp_flag = true;
				ip_flag = false;
				$("#discussion_subentries").addClass('hidden');
				if(hidden_post==true){
					if($(document).data('posted_discussions').complete==true){
						var filtered_results = $(document).data('posted_discussions').userposts.length;
						var filtered_output = '<ul class="discussion-entries">';
						if (filtered_results>0){
							for (var u=0; u<filtered_results; u++) {
								var userp = $(document).data('posted_discussions').userposts[u];
								var pdate = new Date(userp.created_at);
								var pmonthdate = pdate.toLocaleString('en-US', {month: 'long', day: 'numeric'});
								var ptime = pdate.toLocaleString('en-US', {hour:'numeric', minute: 'numeric', hour12: true});
								var readStatus = userp.read_state;
								var article = '<article class="discussion_entry ' + readStatus + '">';
								var alink = '<div><a href="#" class="discussion-read-state-btn" role="button" title="Mark as Unread" data-event="toggleRead" style="margin: 0px -40px;"><div class="discussion-read-state tooltip data-tooltip"></div></a></div>';
						
								var dq_head = '<header class="entry-header discussion-section"><a href="#" class="collapsable collapse-discussion pad-box-mini" role="button" tabindex="0" data-event="toggleCollapsed" style="padding: 3px;"><span aria-live="assertive" class="screenreader-only">Collapse Subdiscussion</span></a><a href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + userp.user_id + '" class="avatar" style="background-image: url(' + userp.user.avatar_image_url + ')"><span class="screenreader-only">' + userp.user_name + '</span></a><div class="discussion-header-content right-of-avatar"><div class="pull-left span4" style="width: 600px;"><h2 class="discussion-title" role="heading" aria-level="2"><a class="author" href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + userp.user_id + '" data-bypass="" title="Author\'s name">' + userp.user_name + '</a></h2><div class="discussion-pubdate hide-if-collapsed"><time data-html-tooltip-title="' + pmonthdate + ' at ' + ptime + '" datetime="' + pdate + '" pubdate=""><span aria-hidden="true">' + pdate.toLocaleString('en-US', {weekday: 'long'}) + '</span><span class="screenreader-only">' + pmonthdate + ' at ' + ptime + '</span></time></div><div class="show-if-collapsed discussion-subtitle summary ellipsis">' + userp.message + '</div></div><div class="admin-links hide-if-collapsed"><a role="button" class="al-trigger dim-till-hover" href="#"><i class="icon-more standalone-icon" aria-hidden="true"></i><span class="screenreader-only">Manage Discussion Entry</span></a><ul class="al-options"><li><a href="#topic" data-pushstate=""><i class="icon-discussion"></i> Go To Topic</a></li><li><a data-event="edit" href="#"><i class="icon-edit"></i> Edit</a></li><li><a data-event="remove" href="#"><i class="icon-trash"></i> Delete</a></li><li><a href="/courses/' + urlbreaker[4] + '/gradebook/speed_grader?assignment_id=' + urlbreaker[6].split('?')[0] + '&amp;student_id=' + userp.user_id + '"><i class="icon-speed-grader"></i> Open in SpeedGrader</a></li></ul></div><div class="discussion-header-right"><div class="headerBadges show-if-collapsed"></div></div></header>';
						
								/*
								ADD AFTER <div class="headerBadges show-if-collapsed">
								'<div class="new-and-total-badge"><span class="new-items">14</span><span class="total-items">39</span></div>	</div></div>'
								*/
								var dq_section = '<div class="discussion-section message-wrapper" style="clear: both;">' + userp.message + '</div>';

								var dq_entrycontrols = '<div class="entry-controls" data-entry="' + userp.id + '"><a class="viewdq_ip" href="javascript:void(0)">View in Discussion</a>';
						
								filtered_output = filtered_output + '<li class="entry">' + article + alink + '<div class="entry-content">' + dq_head + dq_section + dq_entrycontrols + '</div></article></li>';
						}
							filtered_output += '</ul>';
							$("#filterResults").html(filtered_output);
							$(".viewdq_ip").click(function(e){
								console.log('Clicked before default prevented');
								e.preventDefault();
								console.log('Clicked after default prevented');
								var windloc = window.location.href;
								var entry_id = '#entry-' + userp.id;
								windloc = windloc.replace(/\#\w*\-\d*/ig, '');
								$(".entry").removeClass('collapsed');
								$("#discussion_subentries").removeClass('hidden');
								$("#filterResults").addClass('hidden');
								window.location.href = windloc + entry_id;
							});
						} else {
							$("#filterResults").html("<p>You haven't made any posts to this discussion yet!</p>");
						}					
					} else {
						for (var q=0; q<$(document).data('posted_discussions').querychecker.length; q++){
							if ($(document).data('posted_discussions').querychecker[q].finished==false){
								console.log('false instances found, breaking loop');
								var filtered_results = $(document).data('posted_discussions').userposts.length;
								if (filtered_results < 0){
									$("#filterResults").html("<p>ERROR: Posts could not be loaded.</p>")
								} else {
									var filtered_output = "<p>ERROR: Could not load all posts, please try again later. Posts that can be loaded are displayed below:</p><ul class='discussion-entries'>";
									for (var u=0; u<filtered_results; u++){
										var userp = $(document).data('posted_discussions').userposts[u];
										var pdate = new Date(userp.created_at);
										var pmonthdate = pdate.toLocaleString('en-US', {month: 'long', day: 'numeric'});
										var ptime = pdate.toLocaleString('en-US', {hour:'numeric', minute: 'numeric', hour12: true});
										var readStatus = userp.read_state;
										var article = '<article class="discussion_entry ' + readStatus + '">';
										var alink = '<div><a href="#" class="discussion-read-state-btn" role="button" title="Mark as Unread" data-event="toggleRead" style="margin: 0px -40px;"><div class="discussion-read-state tooltip data-tooltip"></div></a></div>';
						
										var dq_head = '<header class="entry-header discussion-section"><a href="#" class="collapsable collapse-discussion pad-box-mini" role="button" tabindex="0" data-event="toggleCollapsed" style="padding: 3px;"><span aria-live="assertive" class="screenreader-only">Collapse Subdiscussion</span></a><a href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + userp.user_id + '" class="avatar" style="background-image: url(' + userp.user.avatar_image_url + ')"><span class="screenreader-only">' + userp.user_name + '</span></a><div class="discussion-header-content right-of-avatar"><div class="pull-left span4" style="width: 600px;"><h2 class="discussion-title" role="heading" aria-level="2"><a class="author" href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + userp.user_id + '" data-bypass="" title="Author\'s name">' + userp.user_name + '</a></h2><div class="discussion-pubdate hide-if-collapsed"><time data-html-tooltip-title="' + pmonthdate + ' at ' + ptime + '" datetime="' + pdate + '" pubdate=""><span aria-hidden="true">' + pdate.toLocaleString('en-US', {weekday: 'long'}) + '</span><span class="screenreader-only">' + pmonthdate + ' at ' + ptime + '</span></time></div><div class="show-if-collapsed discussion-subtitle summary ellipsis">' + userp.message + '</div></div><div class="admin-links hide-if-collapsed"><a role="button" class="al-trigger dim-till-hover" href="#"><i class="icon-more standalone-icon" aria-hidden="true"></i><span class="screenreader-only">Manage Discussion Entry</span></a><ul class="al-options"><li><a href="#topic" data-pushstate=""><i class="icon-discussion"></i> Go To Topic</a></li><li><a data-event="edit" href="#"><i class="icon-edit"></i> Edit</a></li><li><a data-event="remove" href="#"><i class="icon-trash"></i> Delete</a></li><li><a href="/courses/' + urlbreaker[4] + '/gradebook/speed_grader?assignment_id=' + urlbreaker[6].split('?')[0] + '&amp;student_id=' + userp.user_id + '"><i class="icon-speed-grader"></i> Open in SpeedGrader</a></li></ul></div><div class="discussion-header-right"><div class="headerBadges show-if-collapsed"></div></div></header>';
						
										/*
										ADD AFTER <div class="headerBadges show-if-collapsed">
										'<div class="new-and-total-badge"><span class="new-items">14</span><span class="total-items">39</span></div>	</div></div>'
										*/
										var dq_section = '<div class="discussion-section message-wrapper" style="clear: both;">' + userp.message + '</div>';

										var dq_entrycontrols = '<div class="entry-controls" data-entry="' + userp.id + '"><a class="viewdq_ip" href="javascript:void(0)">View in Discussion</a>';
						
										filtered_output = filtered_output + '<li class="entry">' + article + alink + '<div class="entry-content">' + dq_head + dq_section + dq_entrycontrols + '</div></article></li>';

									}
									filtered_output += '</ul>';
									$("#filteredResults").html(filtered_output);
									$(".viewdq_ip").click(function(e){
										console.log('Clicked before default prevented');
										e.preventDefault();
										console.log('Clicked after default prevented');
										var windloc = window.location.href;
										var entry_id = '#entry-' + userp.id;
										windloc = windloc.replace(/\#\w*\-\d*/ig, '');
										$(".entry").removeClass('collapsed');
										$("#discussion_subentries").removeClass('hidden');
										$("#filterResults").addClass('hidden');
										window.location.href = windloc + entry_id;
									});
								}
								break;
							}
							if (q==$(document).data('posted_discussions').querychecker.length-1){
								console.log('reached the end of the query');
								$(document).data('posted_discussions').complete = true;
								var filtered_results = $(document).data('posted_discussions').userposts.length;
								var filtered_output = "<ul class='discussion-entries'>";
								for (var u=0; u<filtered_results; u++){
									var userp = $(document).data('posted_discussions').userposts[u];
									var pdate = new Date(userp.created_at);
									var pmonthdate = pdate.toLocaleString('en-US', {month: 'long', day: 'numeric'});
									var ptime = pdate.toLocaleString('en-US', {hour:'numeric', minute: 'numeric', hour12: true});
									var readStatus = userp.read_state;
									var article = '<article class="discussion_entry ' + readStatus + '">';
									var alink = '<div><a href="#" class="discussion-read-state-btn" role="button" title="Mark as Unread" data-event="toggleRead" style="margin: 0px -40px;"><div class="discussion-read-state tooltip data-tooltip"></div></a></div>';
						
									var dq_head = '<header class="entry-header discussion-section"><a href="#" class="collapsable collapse-discussion pad-box-mini" role="button" tabindex="0" data-event="toggleCollapsed" style="padding: 3px;"><span aria-live="assertive" class="screenreader-only">Collapse Subdiscussion</span></a><a href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + userp.user_id + '" class="avatar" style="background-image: url(' + userp.user.avatar_image_url + ')"><span class="screenreader-only">' + userp.user_name + '</span></a><div class="discussion-header-content right-of-avatar"><div class="pull-left span4" style="width: 600px;"><h2 class="discussion-title" role="heading" aria-level="2"><a class="author" href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/users/' + userp.user_id + '" data-bypass="" title="Author\'s name">' + userp.user_name + '</a></h2><div class="discussion-pubdate hide-if-collapsed"><time data-html-tooltip-title="' + pmonthdate + ' at ' + ptime + '" datetime="' + pdate + '" pubdate=""><span aria-hidden="true">' + pdate.toLocaleString('en-US', {weekday: 'long'}) + '</span><span class="screenreader-only">' + pmonthdate + ' at ' + ptime + '</span></time></div><div class="show-if-collapsed discussion-subtitle summary ellipsis">' + userp.message + '</div></div><div class="admin-links hide-if-collapsed"><a role="button" class="al-trigger dim-till-hover" href="#"><i class="icon-more standalone-icon" aria-hidden="true"></i><span class="screenreader-only">Manage Discussion Entry</span></a><ul class="al-options"><li><a href="#topic" data-pushstate=""><i class="icon-discussion"></i> Go To Topic</a></li><li><a data-event="edit" href="#"><i class="icon-edit"></i> Edit</a></li><li><a data-event="remove" href="#"><i class="icon-trash"></i> Delete</a></li><li><a href="/courses/' + urlbreaker[4] + '/gradebook/speed_grader?assignment_id=' + urlbreaker[6].split('?')[0] + '&amp;student_id=' + userp.user_id + '"><i class="icon-speed-grader"></i> Open in SpeedGrader</a></li></ul></div><div class="discussion-header-right"><div class="headerBadges show-if-collapsed"></div></div></header>';
						
									/*
									ADD AFTER <div class="headerBadges show-if-collapsed">
									'<div class="new-and-total-badge"><span class="new-items">14</span><span class="total-items">39</span></div></div></div>'
									*/
									var dq_section = '<div class="discussion-section message-wrapper" style="clear: both;">' + userp.message + '</div>';

									var dq_entrycontrols = '<div class="entry-controls" data-entry="' + userp.id + '"><a class="viewdq_ip" href="javascript:void(0)">View in Discussion</a>';
						
									filtered_output = filtered_output + '<li class="entry">' + article + alink + '<div class="entry-content">' + dq_head + dq_section + dq_entrycontrols + '</div></article></li>';
	
								}
								filtered_output += '</ul>';
								$("#filteredResults").html(filtered_output);
								$(".viewdq_ip").click(function(e){
									console.log('Clicked before default prevented');
									e.preventDefault();
									console.log('Clicked after default prevented');
									var windloc = window.location.href;
									var entry_id = '#entry-' + userp.id;
									windloc = windloc.replace(/\#\w*\-\d*/ig, '');
									$(".entry").removeClass('collapsed');
									$("#discussion_subentries").removeClass('hidden');
									$("#filterResults").addClass('hidden');
									window.location.href = windloc + entry_id;
								});
							}
						}
						
					}
				} else {
					var mypost_count = 0;
					var filtered_output = '<ul class="discussion-entries">';
					$("#discussion_subentries").find('article').each(function(){
						if(!$(this).hasClass('deleted-discussion-entry')){
						console.log($(this));
						var postid = $(this).find(".avatar").eq(0).attr('href');
						postid = postid.split('/');
						if (postid[postid.length-1]==curUser){
							mypost_count = mypost_count + 1;
							var ent_id = $(this).parent().attr('id');
							var readStatus = '';
							if($(this).hasClass('read')){
								readStatus = ' read';
							}	
							var article = '<article class="discussion_entry' + readStatus + '">';
							var alink = $(this).find('a').eq(0).clone();
							var dq_head = '<header class="entry-header discussion-section">' + $(this).find('header').eq(0).html() + '</header>';
							var dq_section = '<div class="discussion-section message-wrapper" style="clear: both;">' + $(this).find('.message_wrapper').eq(0).find('.user_content').eq(0).html() + '</div>';
							var dq_entrycontrols = '<div class="entry-controls" data-entry="' + ent_id + '"><a class="viewdq_ip" href="javascript:void(0)">View in Discussion</a>';
							$(alink).wrap('<div>');
							alink = $(alink).parent().html();
					
							filtered_output = filtered_output + '<li class="entry">' + article + alink + '<div class="entry-content">' + dq_head + dq_section + dq_entrycontrols + '</div></article></li>';
						}
					}
					});
					filtered_output += '<ul>';
					if (mypost_count>0){
						$("#filterResults").html(filtered_output);
						$(".viewdq_ip").click(function(e){
							e.preventDefault();
							console.log('Clicked mypost after prevented default');
							var windloc = window.location.href;
							var entry_id = '#' + $(this).parent().data('entry');
							windloc = windloc.replace(/\#\w*\-\d*/ig, '');
							$(".entry").removeClass('collapsed');
							$("#discussion_subentries").removeClass('hidden');
							$("#filterResults").addClass('hidden');
							window.location = windloc + entry_id;
						});
					} else {
						$("#filterResults").html("<p>You haven't made any posts to this discussion yet!</p>");
					}
				}
				$("#filterResults").removeClass('hidden');
			}
	});
		
}