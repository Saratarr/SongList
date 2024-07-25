(function () {
    var pageLink, href;	
	//Top level definitions for urlbreaker for easier ajax requests in if statements.
	var urlbreaker = location.href.split('/');
	
	//Hides the Tutoring section in expired courses
	if (urlbreaker[3]=='courses'){
		var enddate = '';
		$.ajax({
			type: 'GET',
			url: 'https://' + urlbreaker[2] + '/courses/' + urlbreaker[4],
			success: function(data){
				enddate = data.course.conclude_at;
				var curdate = new Date();
				console.log(enddate);
				curdate = curdate.getUTCFullYear() + '-' + zeroadd(curdate.getUTCMonth() + 1) + '-' + zeroadd(curdate.getUTCDate()) + 'T' + zeroadd(curdate.getUTCHours()) + ':' + zeroadd(curdate.getUTCMinutes()) + ':' + '00Z';
				if (new Date(curdate) > new Date(enddate)){
                	var timediff = new Date(curdate) - new Date(enddate);
                	if (timediff > 60000){
						$(document).find('.context_external_tool_5336').remove();
                    	//$(document).find('.context_external_tool_49').remove();
                	}
            	}
        	}
    	});
		
		if (urlbreaker[2]=='dvutraining.instructure.com') {
			//Hides hidden items from DVU Manager role
			$.ajax({
				type: 'GET',
				url: 'https://' + urlbreaker[2] + '/api/v1/courses/' + urlbreaker[4] + '/enrollments?per_page=100&role[]=DVUManager',
				success: function(data){
					var dvumindex = data.findIndex(i => i.user_id === parseInt(ENV.current_user_id));
					if (dvumindex>=0){
                        //If DVUManager role is true
						//Hide settings button
						$("#section-tabs").find('.settings').parent().css('display','none');
						//Hide Badges button
						$("#section_tabs").find('.context_external_tool_68').parent().css('display','none');
						//Hide right-hand sidebar
						$("#course_show_secondary").css('display','none');
						//Hide hidden buttons
						$("#section-tabs").find(".section-hidden").each(function(){
							var secname = $(this).find('a').eq(0).text();
							if (secname!='People' && secname!='Grades'){
								$(this).css('display','none');
							}
						});
						
						//Blank out "Badges" external tool
						if (urlbreaker[5]=='external_tools' && urlbreaker[6]==68) {
							$("#tool_content").after('<div>You do not have permission to view this page.</div>');
							$("#tool_content").remove();
						}
				    }
				}
			});

		}
	} else {
		//Adding in sidebar for Library
		$("#menu").append('<li id="custom_nav" class="menu-item ic-app-header__menu-list-item"><a id="global_nav_resources_link" class="ic-app-header__menu-list-link" href="https://library.devry.edu" target="_blank"><div class="menu-item-icon-container" aria-hidden="true"><i class="fas fa-university fa-2x" aria-hidden="true"></i><div class="menu-item__text">Library</div></div></a></li>');
	}
	
	if (urlbreaker[5]=='discussion_topics'){
		$(".hidden-readable").remove();
		$(".MJX_Assistive_MathML").remove();
		
		//Custom Announcements Script Starts Here
		if ($('.announcements').hasClass('active')) {
			$('#module_sequence_footer').addClass('module-sequence-footer');
			$('.module-sequence-footer').append('<div class="module-sequence-footer-content"></div>');
			
			getAnnouncements([],1,function(announcements){
				console.log(announcements);
				var total_announcements = announcements.length;
				for (i=0; i<total_announcements; i++){ 
					if(announcements[i].id == urlbreaker[6]){
						var prev_announce = i-1;
						var next_announce = i+1;
						if(prev_announce>=0){
							$('.module-sequence-footer-content').append('<a href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/discussion_topics/' + announcements[prev_announce].id + '" role="button" class="Button module-sequence-footer-button--previous" data-html-tooltip-title="" aria-describedby="masf0-previous-desc"><i class="icon-mini-arrow-left"></i>Previous<span id="msf0-previous-desc" class="hidden" hidden="">Previous Announcement: ' + announcements[prev_announce].title + '<span></a>');
							$('.module-sequence-footer-button--previous').attr('data-html-tooltip-title',"<strong style='float: left'>Previous Announcement</strong> <br> " + announcements[prev_announce].title);
						}
						
						if (next_announce<total_announcements){
							$('.module-sequence-footer-content').append('<span class="module-sequence-footer-button--next" data-html-tooltip-title=""><a href="https://' + urlbreaker[2] + '/courses/' + urlbreaker[4] + '/discussion_topics/' + announcements[next_announce].id + '" role="button" class="Button" aria-described-by="msf0-next-desc">Next<i class="icon-mini-arrow-right"></i><span id="msf0-next-desc" class="hidden" hidden="">Next Announcement: ' + announcements[next_announce].title + '</span></a></span>');
							$('.module-sequence-footer-button--next').attr('data-html-tooltip-title',"<i class='icon-document'></i> " + announcements[next_announce].title);
						}
						break;
					}
				}
			});
		}
		//Custom Announcements Script Ends Here
	}
	
	if (urlbreaker.length <= 4 && location.href=='https://devryu.instructure.com/') {
		var curdate = new Date();
		var displaynso = false;
		var careermonth = false;
		var careerfair = false;
		
		if (curdate.getMonth()==0 && curdate.getDate()<=16 || curdate.getMonth()==1 && curdate.getDate()>=28 || curdate.getMonth()==2 && curdate.getDate()<=13 || curdate.getMonth()==3 && curdate.getDate()>=25 || curdate.getMonth()==4 && curdate.getDate()<=15 || curdate.getMonth()==5 && curdate.getDate()>=27){
			displaynso = true;
		}
		
		if (curdate.getMonth()==2){
			careermonth = true;
		}
		
		if (curdate.getMonth()==8 && curdate.getDate()>=21 || curdate.getMonth()==9 && curdate.getDate()<=4){
			careerfair = true;
		}
			
		//if (curdate.getMonth()==1 && curdate.getDate()==28 || curdate.getMonth()==2)

    	if (displaynso==true){
        	$('#dashboard-activity').append("<div id='kl_wrapper_3' class='kl_flat_sections kl_wrapper'>\n<div id='kl_banner' style='background-color: #414244; color: #ffffff;'> \n <h2 style='color: #ffffff;'><span id='kl_banner_left'><span class='kl_mod_text'>New to Canvas?</span></span></h2>\n <p class='center lead' style='color:#FFF;'>Click the 'Getting Started' button below to help you get started in your course.</p><br>\n<p class='center'><a href='https://devryu.instructure.com/courses/899/pages/start-here' target='_blank' class='button btn'>Getting Started</a></p>\n</div>\n</div>");
    	}
		if (careermonth==true){
			$('#dashboard-activity').append("<img src='https://lms.devry.edu/lms/fileoversize/CAREER%20MONTH%202023%20BANNER.jpg' />");
		}
		
		if (careerfair==true){
			$('#dashboard-activity').append('<div id="vcf-container" style="border: 4px solid #FEC221"><h1 style="margin: 0; padding: .4rem 16px; background-color : #FEC221;">Fall 2023 Virtual Career Fair</h1><p style="margin: 1rem 0; padding: 0 16px;">DeVry Career Services invites you to attend our Fall 2023 Virtual Career Fair - All Colleges of Study - on October 5, 2023 from 12 pm to 2 pm CT. Meet with recruiters hiring for a variety of roles including full-time, internships, and remote opportunities.</p><p style="margin: 1rem 0; padding: 0 16px; font-size: 1.2rem;">Sign up by following the link below.</p><p style="margin: 1rem 0; padding: 0 16px;"><a href="https://devryfall2023.vfairs.com/" target="_blank" title="DeVry University Virtual Career Fair"><button style="border-radius: 0; border: 2px solid rgb(0, 0, 0) !important; background-color: rgb(33, 93, 254); color: rgb(239, 244, 255); padding: 6px 12px; padding-left: 15px; padding-right: 15px; font-size: 16px;">https://devryfall2023.vfairs.com/</button></a></p></div>');
		}

	}
	

	function zeroadd(num){
		if (num<10){
    		return "0" + num;
		} else {
    		return num;
		}
	}
	
	//Replace the content specific breadcrums with Module when the current page was accessed from the Module page
    if (CanvasDetails.location.search.hasOwnProperty("module_item_id")) {
        if ($("#breadcrumbs").find("a:contains('Pages')").length > 0) {
            pageLink = $("#breadcrumbs").find("a:contains('Pages')");
            href = pageLink.attr("href");
            href = href.replace(/pages/i, "modules");
            pageLink.text("Modules").attr("href", href);
        } else if ($("#breadcrumbs").find("a:contains('Assignments')").length > 0) {
            pageLink = $("#breadcrumbs").find("a:contains('Assignments')");
            href = pageLink.attr("href");
            href = href.replace(/assignments/i, "modules");
            pageLink.text("Modules").attr("href", href);
        } else if ($("#breadcrumbs").find("a:contains('Discussions')").length > 0) {
            pageLink = $("#breadcrumbs").find("a:contains('Discussions')");
            href = pageLink.attr("href");
            href = href.replace(/discussion_topics/i, "modules");
            pageLink.text("Modules").attr("href", href);
        }
    }

    if (CanvasDetails.location.hasOwnProperty("groups")) {
		$("body").addClass("group-nav");
    }
    
    if(CanvasDetails.location.hasOwnProperty("settings")){
        $.getScript("https://lms.devry.edu/lms/scripts/validateURLs.js");

		//Hides calendar access in settings for non-admin users
		if (ENV.current_user_roles.indexOf("admin") == -1){
			$('#course_form').find('.coursesettings').find('label[for="course_start_at"]').parent().parent().css('display','none');
			$('#course_form').find('.coursesettings').find('label[for="course_conclude_at"]').parent().parent().css('display','none');
			
			$("#course_start_at").parent().remove();
			$("#course_conclude_at").parent().remove();
   			
			$(".reset_course_content_button").remove();

			if (ENV.current_user_roles.indexOf("observer_v")==-1){
				$("#course_allow_student_forum_attachments").remove();
				$('label[for="course_allow_student_forum_attachments"]').remove();	
			}

		}
		
		//GRADE SYNC BLOCKER EDIT STARTS
		$("#publish_grades_link").attr('disabled','disabled');
		$("#publish_grades_messages").after('<span class="gsync_block_message">To enable Grade Sync, you must first complete the course Grade Audit.</span>');
		gradeSyncBlocker('get');
		//GRADE SYNC BLOCKER EDIT ENDS
    }
	
	//GRADE SYNC BLOCKER EDIT STARTS
	
	if (window.location.href.match("#tab-grade-publishing")!=null){
		$("#publish_grades_link").attr('disabled','disabled');
		$("#publish_grades_messages").after('<span class="gsync_block_message">To enable Grade Sync, you must first complete the course Grade Audit.</span>');
		gradeSyncBlocker('get');
	}

	if(CanvasDetails.location.hasOwnProperty("external_tools") && CanvasDetails.location.external_tools=="20709"){
		console.log('In Grade Audit page');
		gradeSyncBlocker('post');
	}
	//GRADE SYNC BLOCKER EDIT ENDS
	
	if(CanvasDetails.location.hasOwnProperty("modules")){
		$(".due_date_display").prepend('Due: ');
		
		//Change CTE Link
		$("#context_modules_sortable_container").find(".external_url_link").each(function(i){
    		if ($(this).attr('title')=="Center for Teaching Excellence"){
        		$(this).attr('href', 'https://devryu.sharepoint.com/sites/Center_for_Teaching_Excellence_at_DeVry_University?xsdata=MDN8MDF8fDUzYzVkYWE3MjhmNjQwOTFhMTliNmY4YTQ1NzBkMGQ0fGY5NzljOTljNTFhYjRmZjY4NmUwMzVmZDI4NzQ3ODhmfDB8MHw2Mzc4NDA4MTAwNzcxOTYyNTR8R29vZHxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT0%3D&sdata=TmdEK1daMXo1bTZia2sreE02eWs0MGZoREkvRUhoTHdjOVNoMTBuYW5oTT0%3D&ovuser=f979c99c-51ab-4ff6-86e0-35fd2874788f%2CD40572787%40devry.edu');
        		$(this).attr('data-item-href', 'https://devryu.sharepoint.com/sites/Center_for_Teaching_Excellence_at_DeVry_University?xsdata=MDN8MDF8fDUzYzVkYWE3MjhmNjQwOTFhMTliNmY4YTQ1NzBkMGQ0fGY5NzljOTljNTFhYjRmZjY4NmUwMzVmZDI4NzQ3ODhmfDB8MHw2Mzc4NDA4MTAwNzcxOTYyNTR8R29vZHxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT0%3D&sdata=TmdEK1daMXo1bTZia2sreE02eWs0MGZoREkvRUhoTHdjOVNoMTBuYW5oTT0%3D&ovuser=f979c99c-51ab-4ff6-86e0-35fd2874788f%2CD40572787%40devry.edu');
    		}
		});
	}
	
	if(CanvasDetails.location.hasOwnProperty("discussion_topics")){
		$("#discussion_topic").find(".fs-exclude").remove();
		$(".discussion-subtitle").empty();
		$(".discussion-header-right").remove();
		
		//DISCUSSION SAVE FEATURES BEGIN HERE
		//Variable for tracking whether or not a post is in progress
		var open_post = false;
		var dqid, post_content = '';
		var save_title = 'Save your work to post later.';		
		if (urlbreaker.length >=7){
			$.ajax({
				type: 'GET',
				url: 'https://' + urlbreaker[2] + '/api/v1/users/' + ENV.current_user_id + '/custom_data/saved_discussions/' + urlbreaker[4] + '/' + urlbreaker[6].replace(/\?[\w\_\=\d]*/,'') + '?ns=com.' + urlbreaker[2].split('.')[0] + '.canvas-app',
				success: function (results){
					
					if (results.data==null || results.data=='null'){
						$(document).data('saved_discussions', {});
					} else {
						$(document).data('saved_discussions', results.data);
					}
				},
				error: function(){
					$(document).data('saved_discussions', {});
				}
			});	
		}
		
		$(".discussion-reply-buttons").each(function(){
			$(this).find('a').eq(0).after('&nbsp;<button class="btn btn-success btn-small savepostbtn" title="' + save_title + '">Save Post</button>');
		});
		
		//FUNCTIONS FOR BTN CLICKS START HERE
		function savePost(btn, urlbreaker){
			//Add e.preventDefault(); before calling this function
			//Spin when clicked
			$(btn).prepend('<i class="fa fa-spinner fa-spin fa-fw"></i>');
			dqid = $(btn).parent().parent().parent().parent().parent().parent().attr('id');
			if (dqid=='discussion_container'){
				dqid = 'main';
			}
			$(document).data('saved_discussions')[dqid] = $('#' + dqid).find('iframe').eq(0).contents().find('#tinymce').html();
	
			$.ajax({
				type: 'PUT',
				url: 'https://' + urlbreaker[2] + '/api/v1/users/' + ENV.current_user_id + '/custom_data/saved_discussions/' + urlbreaker[4] + '/' + urlbreaker[6].replace(/\?[\w\_\=\d]*/, '') + '?ns=com.' + urlbreaker[2].split('.')[0] + '.canvas-app',
				data: {
					data: $(document).data('saved_discussions')
				},
				ajax_selector: $(btn),
				success: function(){
					$(this.ajax_selector).find('i').remove();
					$.ajax({
						type: 'POST',
						url: 'https://lms.devry.edu/lms/scripts/php/basic_router.php',
						data: {
							action: 'saveposts',
							domain: urlbreaker[2],
							user_id: ENV.current_user_id,
							course_id: urlbreaker[4],
							discussion_id: urlbreaker[6].split('?')[0],
							post_id: dqid,
							term: CanvasDetails.courseInfo.enrollment_term_id,
							date: dateGenerator()
						},
						success: function(d){
							console.log('Saved post ticket logged in database.');
							console.log(d);
						},
						error: function(){
							console.log('Saved post ticket failed to log in database.');
						}
					});
				}
			});
	
		}

		function submitClick(btn, urlbreaker){
			var dqid = $(btn).parent().parent().parent().parent().parent().parent().attr('id');
			if (dqid=='discussion_container'){
				dqid = 'main';
			}
    		open_post = false;
		
			if (!$(document).data('saved_discussions')[dqid]==false){
				//Data for this record exists
				$.ajax({
					type: 'DELETE',
					url: 'https://' + urlbreaker[2] + '/api/v1/users/' + ENV.current_user_id + '/custom_data/saved_discussions/' + urlbreaker[4] + '/' + urlbreaker[6].replace(/\?[\w\_\=\d]*/,'') + '/' + dqid + '?ns=com.' + urlbreaker[2].split('.')[0] + '.canvas-app'
				});
				
				delete $(document).data('saved_discussions')[dqid];
				
			}
				
			var newpost = $(btn).parent().parent().parent().parent().parent().parent();
			
			if($(newpost).attr('id')=='discussion_container'){
				//In the first post
				var newpost_counter = 0;
				var currposts = $("#discussion_subentries").find('.discussion-entries').eq(0).children().not('.deleted').length;
				
				var newpostgen_timer = setInterval(function(){
					//Wait until post is generated
					newpost_counter++;
					var postleng = $("#discussion_subentries").find('.discussion-entries').eq(0).children().not('.deleted').length;
					
					if(postleng>currposts){
						postleng = postleng - 1;

						newpost = $("#discussion_subentries").find('.discussion-entries').eq(0).children().not('.deleted').eq(postleng);
				
						//Attach save post button
						$(newpost).find('article').eq(0).find('.discussion-reply-buttons').eq(0).find('a').eq(0).after('&nbsp;<button class="btn btn-success btn-small savepostbtn" title="' + save_title + '">Save Post</button>');
					
						//Add click handler to new save post button
						$(newpost).find('article').eq(0).find('.discussion-reply-buttons').eq(0).find('.savepostbtn').click(function(e){
							e.preventDefault();
							savePost($(this), urlbreaker);
						});
					
						//Add click handler to new cancel button
						$(newpost).find('article').eq(0).find('.discussion-reply-buttons').eq(0).find('.cancel_button').click(function(e){
							open_post = false;
						});
					
						//Add click handler to new submit button
						$(newpost).find('article').eq(0).find('.discussion-reply-buttons').eq(0).find('.btn-primary').click(function(){
							submitClick($(this), urlbreaker);
						});
					
						//Clear Interval
						clearInterval(newpostgen_timer);
						
					}
					if(newpost_counter>=10){
						clearInterval(newpostgen_timer);
					}
					
					
				}, 500);
			} else {
				// Replying to a reply				
				//Set timer so this adds the button after the post is generated
				var savebtn_counter = 0;
				var save_btn_gen_timer = setInterval(function(){
					//Run function if the post exists
					savebtn_counter++;
					newpost = $(newpost).find('.replies').eq(0).find('ul').eq(0);
					var newpostid = $(newpost).find('.entry').length;
					console.log(newpostid);
					if(newpostid>0){
						//Add the save post button
						$(newpost).find('.entry').eq(newpostid-1).find('.discussion-reply-buttons').eq(0).find('a').eq(0).after('&nbsp;<button class="btn btn-success btn-small savepostbtn" title="' + save_title + '">Save Post</button>');
						
						//Add click handler to new save post button
						$(newpost).find('.entry').eq(newpostid-1).find('.discussion-reply-buttons').eq(0).find('.savepostbtn').click(function(e){
							e.preventDefault();
							savePost($(this), urlbreaker);
						});
						
						//Add click handler to new cancel button
						$(newpost).find('.entry').eq(newpostid-1).find('.discussion-reply-buttons').eq(0).find('.cancel_button').click(function(){
							open_post = false;
						});
					
						//Add click handler to new post button
						$(newpost).find('.entry').eq(newpostid-1).find('.discussion-reply-buttons').eq(0).find('.btn-primary').click(function(){
							submitClick($(this), urlbreaker);
						});
						
						//Clear interval
						clearInterval(save_btn_gen_timer);



					}
					if(savebtn_counter>=10){
						console.log('ERROR: Post has still not generated after 10 attempts');
						clearInterval(save_btn_gen_timer);
					}
				}, 500);
			}

		}
		
		//FUNCTIONS FOR BTN CLICKS END HERE
		
		$(".savepostbtn").click(function(e){
			e.preventDefault();
			/*
			$(this).prepend('<i class="fa fa-spinner fa-spin fa-fw"></i>');
			dqid = $(this).parent().parent().parent().parent().parent().parent().attr('id');
						
			if (dqid=='discussion_container'){


				dqid = 'main';
			}
			
			$(document).data('saved_discussions')[dqid] = $('#' + dqid).find('iframe').eq(0).contents().find('#tinymce').html();
			
			//See function for 'PUT' ajax call
			*/ 
			console.log(open_post);
			savePost($(this), urlbreaker)
			
		});
				
		var modal = '<div id="DQ_message_modal" class="modal" style="display: none;"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h3 class="modal-title">Warning!</h3><hr /></div><div class="modal-body"><p>You have an unsaved post. This will be lost if you leave the page. Do you really want to leave the page?</p></div><div class="modal-footer"><button type="button" class="btn btn-primary">Yes</button><button type="button" class="btn btn-secondary" data-dismiss="modal">No</button></div></div></div></div>';
		var modalscreen = '<div id="modalscreen"></div>';
		
		$("body").append(modalscreen);
		
		$("#modalscreen").css({
			'width': '100%',
			'height': '100%',
			'position': 'fixed',
			'top': '0',
			'z-index': '9999',
			'background-color': '#000',
			'opacity': '0.75',
			'display': 'none'
		});
		
		$("body").append(modal);
		
		$("#DQ_message_modal").css({
			'box-sizing': 'border-box',
			'position': 'fixed',
			'top': '10%',
			'right': '25%',
			'left': '25%',
			'width': 'auto',
			'height': 'auto',
			'overflow': 'hidden',
			'background-color': '#EEE',
			'-mox-border-radius': '8px',
			'border-radius': '8px',
			'z-index': '9999'
		});
		
		$(".modal-dialog").css('padding', '10px 20px');
		$(".modal-title").css({
			'color': 'crimson',
			'font-variant': 'small-caps'
		});
		
		//Check to see if a post is in progress
		$(".discussion-reply-action").click(function(){
			if (!$(this).hasClass('discussion-reply-add-attachment')) {
				open_post = true;
				
				if ($(this).parent().hasClass('discussion-entry-reply-area')){
					//Responding to main discussion
					dqid = 'main';
					post_content = $(this).parent().parent().find('.discussion-entry-reply-area').eq(1);
				} else {
					//Normal behavior
					dqid = $(this).parent().parent().parent().parent().attr('id');
					post_content = $(this).parent().parent().parent().find('.discussion-entry-reply-area').eq(0);
				}
				console.log(post_content);
				if (!$(document).data('saved_discussions')[dqid]==false){
					//Saved post exists
					
					var intnum = 0;
					var html_insertion_timer = setInterval(function(){
						if (post_content.find('iframe').eq(0).contents().find('#tinymce').length>0){
							post_content.find('iframe').eq(0).contents().find('#tinymce').html($(document).data('saved_discussions')[dqid]);
							var post_tester = setInterval(function(){
								
								if(post_content.find('iframe').eq(0).contents().find('#tinymce').html()==$(document).data('saved_discussions')[dqid]){
									clearInterval(post_tester);
								} else {
									post_content.find('iframe').eq(0).contents().find('#tinymce').html($(document).data('saved_discussions')[dqid]);
									if (intnum>10){
										clearInterval(post_tester);
									}
								}
								intnum++;
							}, 1000);
							/*
							var postdelay = setTimeout(function(){
								post_content.find('iframe').eq(0).contents().find('#tinymce').html($(document).data('saved_discussions')[dqid]);
							}, 1000);
							*/
							clearInterval(html_insertion_timer);
						}
					}, 500);
				}
				
			}

		});

		//Cancels post progress by clicking cancel button
		$(".cancel_button").click(function(){
    		open_post = false;
			console.log(open_post);
		});

		//Cancels post progress by clicking submit button
		$(".btn-primary").click(function(){
			console.log(open_post);
			submitClick($(this), urlbreaker);
			console.log(open_post);
			/*
			var dqid = $(this).parent().parent().parent().parent().parent().parent().attr('id');
			if (dqid=='discussion_container'){
				dqid = 'main';
			}
    		open_post = false;
			
			if (!$(document).data('saved_discussions')[dqid]==false){
				//Data for this record exists
				//AJAX CALL HERE - see SUBMIT FUNCTION
				delete $(document).data('saved_discussions')[dqid];
				
			}
			
			var newpost = $(this).parent().parent().parent().parent().parent().parent();
			
			if($(newpost).attr('id')=='discussion_container'){
				//In the first post
				var newpostgen_timer = setInterval(function(){
					//Wait until post is generated
				}, 500);
			} else {
				// Replying to a reply
				newpost = $(newpost).find('.replies').eq(0).find('ul').eq(0);
				var newpostid = $(newpost).find('.entry').length;
				
				//Set timer so this adds the button after the post is generated
				var save_btn_gen_timer = setInterval(function(){
					//Run function if the post exists
					if($(newpost).find('.entry').eq(newpostid).length>0){
						//Add the save post button
						$(newpost).find('.entry').eq(newpostid).find('.discussion-reply-buttons').eq(0).find('a').eq(0).after('&nbsp;<button class="btn btn-success btn-small savepostbtn">Save Post</button>');
						
						//Add click handler to new save post button
						$(newpost).find('entry').eq(newpostid).find('.discussion-reply-buttons').eq(0).find('.savepostbtn').click(function(e){
							e.preventDefault();
							$(this).prepend('<i class="fa fa-spinner fa-spin fa-fw"></i>');
							dqid = $(this).parent().parent().parent().parent().parent().parent().attr('id');
							
							if (dqid=='discussion_container'){
								dqid = 'main';
							}
							
							$(document).data('saved_discussions')[dqid] = $("#" + dqid).find('iframe').eq(0).contents().find('#tinymce').html();
							
							//AJAX call here - see SUBMIT FUNCITON*
							
						});
						
						//Add click handler to new cancel button
						
						//Add click handler to new post button
						
						//Clear interval
						clearInterval(save_btn_gen_timer);
					}
				}, 500);
			}
			*/
						
		});
		
		$("#DQ_message_modal").find(".btn-secondary").click(function(){
			$("#modalscreen").css('display', 'none');
			$("#DQ_message_modal").css('display', 'none');
		});

		
		$('a:not(.discussion-reply-action, .cancel_button, .tinymce-keyboard-shortcuts-toggle, .btn-topic-subscribe-button, #global_nav_profile_link, #global_nav_accounts_link, #global_nav_courses_link, #global_nav_help_link, #global_nav_resources_link, .rsbtn_toggle, .rsbtn_move, .rsbtn_help, .rsbtn_play, .rsbtn_toggle_close, [href=#])').click(function(e){
			if (open_post==true && post_content.find('iframe').eq(0).contents().find('#tinymce').text()!=''){
				e.preventDefault();
				var link = $(this);
				var unsaved_post = post_content.find('iframe').eq(0).contents().find('#tinymce').html();
				//Alert message about leaving the page
				if ($(document).data('saved_discussions')[dqid]!=unsaved_post){
					$("#modalscreen").css('display', 'block');
					$("#DQ_message_modal").css('display', 'block');
					console.log(link);
					console.log(post_content.find('iframe').eq(0).contents().find('#tinymce').html());
					$("#DQ_message_modal").find(".btn-primary").off('click').on('click', function(){					
						$(location).attr('href', $(link).attr('href'));
					});
				} else {
					$(location).attr('href', $(link).attr('href'));
				}

			}
			
				//if(post_content.find('iframe').eq(0).contents().find('#tinymce').text()=='' || post_content.find('iframe').eq(0).contents().find('#tinymce').text()==null){

		});

	
	}
	
	//DISCUSSION SAVE FEATURES END HERE

    if (CanvasDetails.location.accounts == 1 && CanvasDetails.location.hasOwnProperty("admin_tools")) {
        var acclist = $("<div class='restoreContentPane' style='margin-top: 20px; background-color: #fff; padding: 15px;'><button id='getAdminList' class='btn btn-info pull-right'>Get List</button><button id='exportTable' disabled='true' class='btn btn-info pull-right'>Export</button><h2>Account Admins</h2><table class='ic-Table' id='admin-list-table'></table></div>");

        $(acclist).insertAfter("#admin-tools-app")

        $("#getAdminList").click(function () {
            $('<i id="admin-loading-icon" class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>').insertBefore($(this));
            $(acclist).find("table").empty();
            $("#exportTable").attr("disabled", false);
			
			var m_count = 0;
			getAccounts('main', [], 1, function (data){
				console.log('running admin search');
				var tb = $("<tbody><tr><th colspan='3' data-style='Bold'>Root</th></tr></tbody>");
				$(acclist).find("table").append(tb);
				$.each(data, function (x, admin) {
					m_count++;
					var r = $("<tr><td>" + admin.user.name + "</td><td>" + admin.user.login_id + "</td><td>" + admin.role + "</td></tr>");
					tb.append(r);
				});
				
				var count = 0;
				getAccounts('sub', [], 1, function (data){
					console.log(data);
					$.each(data, function (i, account){
						count++;
						var tb = $("<tbody><tr><th colspan='3' data-style='Bold'>" + account.name + "</th></tr></tbody>");
						$(acclist).find("table").append(tb);
						
						getUsers(account.id, [], 1, function (adm){
							count--
							$.each(adm, function (x, admin) {
								var r = $("<tr><td>" + admin.user.name + "</td><td>" + admin.user.login_id + "</td><td>" + admin.role + "</td></tr>");
								tb.append(r);
							});
							if (count === 0){
								$("#admin-loading-icon").remove();
							}
						})
					});
				});
			
			});
			
        });

        function getAccounts(type, accounts, page, callback) {
			if (type == 'main'){
				$.get("/api/v1/accounts/1/admins?&per_page=50&page=" + page).success(function (data){
					accounts = accounts.concat(data);
					if (data.length === 50) {
						getAccounts('main', accounts, page + 1, callback);
					} else {
						callback(accounts);
					}
				});
			} else {
				$.get("/api/v1/accounts/1/sub_accounts?recursive=true&per_page=50&page=" + page).success(function (data) {
					console.log(accounts);
					accounts = accounts.concat(data);
                	if (data.length === 50) {
						getAccounts('sub', accounts, page + 1, callback)
                	} else {
						callback(accounts);
                	}
            	})
				
			}
        }

        function getUsers(account, users, page, callback) {
            $.get("/api/v1/accounts/" + account + "/admins?per_page=50&page=" + page).success(function (data) {
                users = users.concat(data);
                if (data.length === 50) {
                    getUsers(account, users, page + 1, callback)
                } else {
                    callback(users);
                }
            })
        }

        $("#exportTable").click(function () {
            tablesToExcel($("#admin-list-table"), "Account Admins", 'Excel')
        });
    }

    onElementRendered("div[data-master-course]", function (element) {

        var course = element.attr("data-master-course");

        if (CanvasDetails.location.pages === "course-resources") {
            $("*[data-load-content]").append("<div class='dvu_rd_container'></div>");

            /*
             * <style>.fancy-page-nav {\
             background-color: #fff;\
             height: 40px;\
             left: 0;\
             position: absolute;\
             top: 80px;\
             width: 100%;\
             z-index:100;\
             }\
             .fancy-page-nav a {\
             padding-top: 10px;\
             text-decoration: none;\
             }\
             #wrapper .user_content > h1 {\
             margin-bottom: 50px;\
             }\
             </style>
             */

            $.get("https://lms.devry.edu/lms/OneDatabase/courseresources.php?id=" + course).success(function (data) {
                $.each(data, function (i, v) {
                    var section = $("<div class='section'></div>");
                    section.append("<div class='btt'><h2>" + v.title + "</h2></div>");
                    section.append("<div class='section-content'>" + v.content + "</div>");
                    if (v.action) {
                        actions[v.action](function (data) {
                            console.log(v.location, data);
                            section.find(v.location).append(data);
                        });
                    }
                    $(".user_content").append(section);
                });
                onVarAvailable(['renderTOC'],function(){
                   renderTOC($("#wiki_page_show .section")); 
                })
                
                //$("<div class='fancy-page-nav'></div>").insertAfter(".page-title");

                /* $(".user_content .section").each(function (i) {
                 var id = "nav-section-" + i;
                 $(this).attr("id", id);
                 var navBut = $("<a href='#" + id + "' class='btn'>" + $(this).find("h2").first().text() + "</a>");
                 $(".fancy-page-nav").append(navBut);
                 })*/


            });
            /*  $("body").on("click", ".fancy-page-nav a", function (e) {
             e.preventDefault();
             $("html, body").scrollTop($($(this).attr("href")).offset().top - 50);
             })*/
            /*  $(window).scroll(function () {
             var left = $(".user_content").offset().left + "px";
             if ($(".page-title").offset().top + $(".page-title").height() - $(window).scrollTop() < 0) {
             $(".fancy-page-nav").css({position: "fixed", top: 0, left: left})
             } else {
             $(".fancy-page-nav").removeAttr("style");
             }
             
             });*/
        }
        if (CanvasDetails.location.pages && CanvasDetails.location.pages.match(/(week|unit|module)-\d*-(introduction|overview-and-objectives)/ig)) {
        	console.log("loading objectives");
			var unit = CanvasDetails.location.pages.match(/\d+/);
            console.log(unit);
            if (unit) {
                unit = unit[0];
                var sec = $("<div class='section'></div>").html("<div class='btt'><h2>Course Objectives</h2></div>");
                $.get("https://" + location.hostname + "/api/v1/courses/" + CanvasDetails.location.courses + "/outcome_groups?per_page=30", function (data) {
                    var order = [];
                    $.each(data, function (i, v) {
                        if (v.description && !v.title.match(/outcomes/i)) {
                            order.push(data[i]);
                            data[i].title = data[i].title.split(/-/);
                            data[i].title = data[i].title[data[i].title.length - 1];
                            if (!data[i].title.match(/\D/)) {                                
                                data[i].title = parseInt(data[i].title);
                            }
                        }
                    });

                    order.sort(function (a, b) {
                        if (a.title > b.title) {
                            return 1;
                        }
                        if (a.title < b.title) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                    console.log(order)
                    var objlist = $("<div class='section-content'></div>");
                    $.each(order, function (i, v) {
                        if (typeof v.title==='number' || (v.description && !v.title.match(/outcomes/i))) {
                            var units = []
                            var desc = $("<div/>").html(v.description);
                            var link = desc.find(".obj-unit-link").text();
                            if (link && link.length > 0) {
                                units = link.split(/,/g);
                            }
                            if (units.indexOf(unit) >= 0) {
                                var obj = $("<div data-obj-index='0' class='loaded-objective'>").html("<div class='objective'><div class='obj-number'><p>" + v.title + "</p></div><div class='obj-description'>" + v.description + "</div></div>");
                                $.get("https://" + location.hostname + "/api/v1/courses/" + CanvasDetails.location.courses + "/outcome_groups/" + v.id + "/outcomes?per_page=50&outcome_style=full", function (outcomes) {
                                    var enab = $("<div/>")
                                    enab.append("<h3 class='sub-heading'>Knowledge, Skills, and Abilities</h3>");
                                    var list = $("<ul></ul>");
                                    $.each(outcomes, function (index, enabler) {
                                        
                                        var elink = $("<div>").html(enabler.outcome.description).find(".obj-unit-link").text();
                                        
                                        if (elink && elink.length > 0 && !$(enabler.outcome.description).text().match(/^\./)) {
                                            var eunits = elink.split(/,/g);
                                            if (eunits.indexOf(unit) >= 0) {
                                                list.append("<li>" + enabler.outcome.description + "</li>");
                                            }
                                        }
                                    });
                                    var enb = $("<div class='section-content-uneditable'></div>").append(list);
                                    if (enb.find("li").length > 0) {
                                        obj.append(enab).append(enb);
                                        obj.find(".obj-unit-link").remove();
                                    }
                                });

                                objlist.append(obj);
                            }
                        }
                    });
                    if (objlist.find(".loaded-objective").length > 0) {
                        sec.append(objlist);
                        objlist.find(".obj-unit-link").remove();
                        sec.insertAfter($(".user_content .section").last());
                    }
                });
            }
        }
		

        if (CanvasDetails.location.assignments === "syllabus") {
            console.log("Loading Syllabus")
            $.get("https://" + location.hostname + "/api/v1/courses/" + CanvasDetails.location.courses + "/discussion_topics?per_page=50").success(function (data) {
                $.each(data, function (i, v) {
                    var assign = v.assignment_id;
                    if (assign) {
                        $(".related-assignment_" + assign).find(".icon-assignment").removeClass("icon-assignment").addClass("icon-discussion");
                    }
                });
            });
			
            $("#course_syllabus").append("<div class='dvu_rd_container'></div>");

            var actions = {
                getCourseOutcomes: function (callback) {
                    $.get("https://" + location.hostname + "/api/v1/courses/" + CanvasDetails.location.courses + "/outcome_groups?per_page=30", function (data) {
                        console.log(data);
                        var outc = []
                        $.each(data, function (i, v) {
                            if (v.description && !v.title.match(/outcomes/i)) {
                                data[i].title = data[i].title.split(/-/);
                                data[i].title = data[i].title[data[i].title.length - 1];
                                if (!data[i].title.match(/\D/)) {
                                    data[i].title = parseInt(data[i].title);
                                }
                                outc.push(data[i]);
                            }
                        });
                        outc.sort(function (a, b) {
                            console.log(b)
                            if (a.title > b.title) {

                                console.log("*A*")
                                return 1;
                            }
                            if (a.title < b.title) {

                                console.log("*B*")
                                return -1;
                            }
                            // a must be equal to b
                            return 0;
                        });
                        var objlist = $('<div></div>');
                        $.each(outc, function (i, v) {
                            if (typeof v.title==='number' || (v.description && !v.title.match(/outcomes/i))) {
                                // var obj = $("<div class='row-fluid course-outcome'><div class='span1'><strong>" + v.title + "</strong></div><div class='span8'>" + v.description + "</div></div>");
                                var obj = $("<div data-obj-index='0' class='loaded-objective'>").html("<div class='objective'><div class='obj-number'><p>" + v.title + "</p></div><div class='obj-description'>" + v.description + "</div></div>");
                                objlist.append(obj);
                            }
                        });
                        callback(objlist);
                    });
                },
                getAssignmentList: function (callback) {
                    $("h2:contains('Course Summary')").hide();
                    callback($("#syllabusContainer"));
                },
                getInstructorInfo: function (callback) {
                    var instInfo = $('<div></div>');
                    $.get("https://" + location.hostname + "/api/v1/courses/" + CanvasDetails.location.courses + "/users?enrollment_type=teacher&include[]=avatar_url&include[]=bio&include[]=custom_links&include[]=email").success(function (data) {
                        $.each(data, function (i, v) {
                            if (v.bio)
                                v.bio = v.bio.replace(/\n/g, "<br>");
                            else
                                v.bio = "";
							if (location.hostname=='devryu.instructure.com'){
								instInfo.append('<div style="clear:left;"><p><img class="kl_image_align_left kl_image_round_white_border" alt="' + v.name + '" src="' + v.avatar_url + '" style="max-width: 50.4px;"></p><p class="kl_user_detail" style="margin-top: 0px;"><i class="fas fa-user" aria-hidden="true" style="margin-right: 10px;"></i>' + v.name + '</p><p class="kl_user_detail"><i class="fas fa-envelope" aria-hidden="true" style="margin-right: 10px;"></i><a href="mailto:' + v.email + '">' + v.email + '</a></p><p class="kl_user_detail"><i class="fas fa-dna" aria-hidden="true" style="margin-right: 10px;"></i>' + v.bio + '</p></div>');
							} else {
								instInfo.append('<div class="image-block"><div class="image-block-image profile-avatar-wrapper"><img style="max-width:100%" src="' + v.avatar_url + '"/></div><div class="profileContent__Block"><h2>' + v.name + '</h2><div><h3 class="profileHeader">Contact</h3><p><a href="mailto:' + v.email + '" title="Email link">' + v.email + '</a></p></div><div><h3 id="profile_bio_label" class="profileHeader">Biography</h3><p class="hide-if-editing">' + v.bio + '</p></div></div></div>');
							}
                        });
                        callback(instInfo);
                    });
                }


            };
			
			var sylget = "https://lms.devry.edu/lms/OneDatabase/syllabus.php?id=";
			if(location.hostname=="dvutraining.instructure.com"){
				sylget = "https://lms.devry.edu/lms/OneDatabase/dvt/syllabus.php?id=";
			} else if (location.hostname=="devryworks.instructure.com"){
				sylget = "https://lms.devry.edu/lms/OneDatabase/dvw/syllabus.php?id=";
			}

            $.get(sylget + course).success(function (data) {
				indexplus = data.length;
                $.each(data, function (i, v) {
					if (v.title=='Course Schedule'){
						v.content = v.content.replace(/\<table\s([\w\=\"\%\d\-\_\s]*)(class\=[\"\']*[\w\_\-\s\d]*[\"\']*)/ig, function(a, b, c){
							return '<table ' + b + 'class="table-striped table table-bordered"';
						});
					}
					if (v.title=='Assignment Values and Letter Grades'){
						v.content = v.content.replace(/(\d+)\?(\d+)/ig, function(a,b,c){
							return b + '-' + c;
						});	
						var i = 0;
						v.content = v.content.replace(/\<table\s([\w\=\"\%\d\-\_\s]*)(class\=[\"\']*[\w\_\-\s\d]*[\"\']*)/ig, function(a, b, c){
							return '<table ' + b + 'class="table-striped table table-bordered"';
						});
						v.content = v.content.replace(/\<table\s([\w\=\"\%\d\-\_\s]*)(style\=[\"\']*[\w\_\-\s\d\%\;\:]*[\"\']*)/ig, function(a, b, c){
							if (i=0){
								i=1;
								return '<table ' + b + 'style="width: 60%; margin: 10px auto;"';	
							} else {
								return '<table ' + b + 'style="width: 90%; margin: 10px auto;"';
							}
						});
					}
					if (v.title=='Textbooks and Supplemental Materials'){
						console.log('found textbooks');
						v.content = v.content.replace(/\<div\s[\w\d\-\_\=\'\"]*class\=[\'\"]*book\_details[\'\"]*[\w\d\s\'\"\=\%]*\>/ig, '<div class="book_details" style="margin-left: 40px;">');
					}
					
					if(location.hostname=='devryu.instructure.com'){
						var icon = "fas fa-times";
						switch(v.title){
							case "Professor Information":
								icon = "fas fa-chalkboard-teacher";
								break;
							case "Course Information":
								icon = "icon-star";
								break;
							case "Course Specific Requirements":
								icon = "fas fa-toolbox";
								break;
							case "Textbooks and Supplemental Materials":
								icon = "fas fa-book-open";
								break;
							case "Course Schedule":
								icon = "fas fa-calendar";
								break;
							case "Assignment Values and Letter Grades":
								icon = "fas fa-check";
								break;
							case "Assignment & Exam Due Date Policy":
							case "University Policies and Procedures":
								icon = "fas fa-shield-alt";
								break;
							case "Course Objectives":
								icon = "fas fa-bullseye";
								break;
							default:
								icon = "fas fa-circle";
								break;
						}
						var section = $("<div id='kl_custom_block_" + i + "' class='kl_custom_block'></div>");
                    	section.append("<h3 id='kl_syllabus_nav_link_" + i + "'><i class='" + icon + "' aria-hidden='true'></i>" + v.title + "</h3>");
						section.append("<div class='section-content'>" + v.content + "</div>");
					} else {
                    	var section = $("<div class='section'></div>");
                    	section.append("<div class='btt'><h2>" + v.title + "</h2></div>");
						section.append("<div class='section-content'>" + v.content + "</div>");
					}
					
                    if (v.action) {
                        actions[v.action](function (data) {
                            console.log(v.location, data);
                            section.find(v.location).append(data);
                        });
                    }
                    $(".dvu_rd_container").append(section);
                });
				
				if (location.hostname=='devryu.instructure.com'){
					//Late Work Guidelines
					var lwg = $("<div id='kl_custom_block_" + indexplus + "' class='kl_custom_block'></div>");
					lwg.append("<h3 id='kl_syllabus_nav_link_" + indexplus + "'><i class='fas fa-circle' aria-hidden='true'></i>Late Work Guidelines</h3>");
					lwg.append("<div class='section-content'><p>Late work may be submitted only with approval from the instructor based on communication from the student in advance or as close as possible to the assignment due date.</p><p>Instructors may deviate from these guidelines based on the student's individual circumstances, with the ideal goal being to foster a high-quality educational experience coupled with exceptional student care.</p><p>To further promote academic growth and related leadership skills, students are encouraged to communicate as early as possible when events arise that may cause a student to miss an assignment due date.</p><div class='table-holder'><table class='table-striped table table-bordered' cellspacing='0'><tbody><tr><td><p><strong>Type of Assignment</strong></p></td><td><p><strong>Late Submission Guidelines</strong></p></td></tr><tr><td><p>Discussion Post</p></td><td><p>Due to the nature and mechanics of these weekly assignments, discussion posts are not eligible for late submission; however, depending upon the student's set of circumstances, an alternative, equivalent assignment may be provided by the instructor  with a 10% grade deduction.</p></td></tr><tr><td><p>Individual assignment (paper, project, etc.)</p></td><td><p>May be submitted up to two weeks late with prior approval. Professor has the discretion to deduct 10% depending upon the circumstances. Late work may not be submitted for credit after the scheduled end of the session without an approved incomplete or specific approval by the instructor.</p></td></tr><tr><td><p>Team-based assignment</p></td><td><p>Subject to arrangements with other team members. Because other members may need to do the work for the missed assignment, penalties may include assignment of additional work on future deliverables, point deductions on peer reviews, etc.</p></td></tr><tr><td><p>&quot;Live&quot; presentations</p></td><td><p>Individual presentations may be rescheduled with prior approval from instructor based on the student's circumstances and the assignment requirements. Rescheduled presentations are subject to conditions and penalties specified for individual assignments.</p><p>Individual contributions to a team presentation may not be rescheduled or submitted late. At instructor's discretion, student materials for that portion of the presentation may be submitted with a 10% grade deduction.</p></td> </tr><tr> <td><p> Auto-graded work done in third-party systems (Cengage, ALEKS, etc).</p></td> <td><p>For assignments assigned through third-party technologies, prior approval from instructor is required for late submissions to be accepted and will be subject to conditions specified for individual assignments.</p></td></tr></tbody></table></div></div>");
					$(".dvu_rd_container").append(lwg);
					
					$(".dvu_rd_container").addClass("kl_flat_sections kl_wrapper");
					$(".dvu_rd_container").eq(0).attr('id','kl_wrapper_3');
					$(".dvu_rd_container").eq(0).prepend('<div id="kl_banner" style="background-color: #414244; color: #ffffff"><h2 style="color: #ffffff;"><span id="kl_banner_left"><span class="kl_mod_text">' + CanvasDetails.courseInfo.course_code + '</span></span><span id="kl_banner_right">Syllabus</span></h2></div>');
					onVarAvailable(['renderTOC'], function(){
						renderTOC($("#course_syllabus .kl_custom_block"));
					});
				} else {
					onVarAvailable(['renderTOC'],function(){
                   		renderTOC($("#course_syllabus .section"));
					});
				}
                
            });
			
			var btest = /Book\:/i;

			$.ajax({
    			type: 'GET',
    			url: 'https://' + urlbreaker[2] + '/api/v1/courses/' + urlbreaker[4] + '/modules?per_page=100',
    			success: function(modules){
					for (var i=0; i<modules.length; i++){
						if (modules[i].name=="Introduction & Resources" || modules[i].name=="Introduction and Resources"){
							$.ajax({
								type: 'GET',
                    			url: 'https://' + urlbreaker[2] + '/api/v1/courses/' + urlbreaker[4] + '/modules/' + modules[i].id + '/items?per_page=100',
								success: function(moditems){
                        			for (var x=0; x<moditems.length; x++){
                            			if (btest.test(moditems[x].title)==true && moditems[x].type=="ExternalTool"){
                                			var vbid = moditems[x].external_url.replace('https://bc.vitalsource.com/books/','');
											console.log(vbid);
                                			$('.is-ebook[data-vbid="' + vbid + '"]').find('a').eq(0).attr('href', moditems[x].html_url);
										}
									}
								}
							});
						}
					}
				}
			});

        }
    });
	
	//Inserts Page Injection
	onElementRendered("div[data-page-import]", function (element) {
		var pageid = parseInt(element.attr("data-page-import"));
		var courseid = parseInt(element.attr("data-page-master"));
		if (courseid=="18877"){
			courseid="89485";
			pageid="2529960";
		}
		var el_icon = '<span class="external_link_icon" style="margin-inline-start: 5px;" role="presentation"><svg viewBox="0 0 1920 1920" version="1.1" xmlns="http://www.w3.org/2000/svg" style="width:1em; height:1em; vertical-align: middle; fill: currentColor"><path d="M1226.66667,267 C1314.88,267 1386.66667,338.786667 1386.66667,427 L1386.66667,427 L1386.66667,853.666667 L1280,853.666667 L1280,693.666667 L106.666667,693.666667 L106.666667,1493.66667 C106.666667,1523 130.56,1547 160,1547 L160,1547 L1226.66667,1547 C1256.10667,1547 1280,1523 1280,1493.66667 L1280,1493.66667 L1280,1280.33333 L1386.66667,1280.33333 L1386.66667,1493.66667 C1386.66667,1581.88 1314.88,1653.66667 1226.66667,1653.66667 L1226.66667,1653.66667 L160,1653.66667 C71.7866667,1653.66667 0,1581.88 0,1493.66667 L0,1493.66667 L0,427 C0,338.786667 71.7866667,267 160,267 L160,267 Z M1584.37333,709.293333 L1904.37333,1029.29333 C1925.17333,1050.09333 1925.17333,1083.90667 1904.37333,1104.70667 L1904.37333,1104.70667 L1584.37333,1424.70667 L1508.96,1349.29333 L1737.86667,1120.38667 L906.613333,1120.38667 L906.613333,1013.72 L1737.86667,1013.72 L1508.96,784.706667 L1584.37333,709.293333 Z M1226.66667,373.666667 L160,373.666667 C130.56,373.666667 106.666667,397.666667 106.666667,427 L106.666667,427 L106.666667,587 L1280,587 L1280,427 C1280,397.666667 1256.10667,373.666667 1226.66667,373.666667 L1226.66667,373.666667 Z" stroke="none" stroke-width="1" fill-rule="evenodd"></path></svg><span class="screenreader-only">Links to an external site.</span></span>';
		console.log('found page injection placeholder');
		
		if (courseid=="89485" && pageid=="2529960") {
			console.log('page injection: p' + pageid + ' c' + courseid);
			$(element).html('<p><strong><span style="font-size: 18pt;">Video Tutorial:</span></strong></p><p><a href="https://lms.devry.edu/lms/video/player.html?video=1_qr3bcl5p">How to join Engageli via Canvas</a>' + el_icon + '</p><p class="MsoNormal" style="line-height: normal; background: white; margin: 4.5pt 0in 4.5pt 0in;"><strong><span style="font-size: 18.0pt; font-family: Poppins; color: #050505;">Engageli Overview:</span></strong></p><p>Engageli recreates group and classroom engagement with the tools of online technology for both live and recorded lessons. It is optimized for Chrome or Edge browsers without any application to install on your Windows or Mac PC. If you prefer not to use Chrome or Edge, the Brave browser is also full compatible with Engageli. Engageli has been integrated with Canvas, so you should plan to join all classes directly through the single link provided in the course <strong>Modules</strong> area.</p><p class="MsoNormal" style="line-height: normal; background: white; margin: 6.0pt 0in 6.0pt 0in;"><span style="color: black;"><img style="max-width: 100%; height: auto; vertical-align: middle; border: 0px; padding: 0px;" src="https://lms.devry.edu/lms/fileoversize/engageli/Engageli%203%20Tables-1.jpg" alt="Engageli 3 Tables-1.jpg" width="625" height="358" data-api-endpoint="https://devryu.instructure.com/api/v1/courses/18877/files/13454965" data-api-returntype="File" /><br /></span></p><p>Some of the classroom features include the following.</p><ul><li>Sit at a virtual table where you can converse in a group with your tablemates using table mode or converse to everyone using room mode. You can even move to other tables (faculty permitting).</li><li><span style="text-decoration: line-through;"> </span>Take private, time-stamped notes with the ability to capture and annotate screenshots that persist for the entire course and are downloadable during the live class and recording.</li><li>Ask or answer questions through the Q &amp; A feature, which is downloadable during the live class and recording.</li><li>Communicate with faculty and other students using chat with the ability to attach files, which are downloadable during the live class.</li><li>Respond to polling questions during the live class and while viewing the recording.</li></ul><p>To learn more about Engageli and set up your device, please review the following resources.</p><ul><li><a href="https://support.engageli.com/hc/en-us/articles/6603875710235-Check-Your-Technical-Requirements-Learner">Technical requirements</a>' + el_icon + '</li><li><u><a href="https://support.engageli.com/hc/en-us/articles/4411910147483-Learner-Quick-Start-Video-">Quick start video</a>' + el_icon + '</u></li><li><a href="https://view.genial.ly/64c44fa5cb8da8001321c624">Interactive guide</a>' + el_icon + '</li></ul><p class="MsoNormal" style="line-height: normal; background: white; margin: 6.0pt 0in 12.0pt 0in;"><strong><span style="font-size: 18.0pt; font-family: Poppins; color: #050505;">Watching Recordings:</span></strong></p><p>If you miss class, recordings will be available by selecting the same classroom link. While watching the recording, you can answer polls, ask and answer questions in the Q&amp;A, and take and download notes just as if you attended the live class.</p><p class="MsoNormal" style="margin-bottom: .0001pt; line-height: normal; background: white;"><span style="font-size: 12.0pt; font-family: "Arial",sans-serif; color: #050505;">&nbsp;</span></p><ul><li><a href="https://support.engageli.com/hc/en-us/articles/10478505198619-How-to-Use-Playback-Rooms-Learner-3-0-">Playback Room features</a>' + el_icon + '</li></ul><p class="MsoNormal" style="margin-bottom: .0001pt; line-height: normal; background: white;"><span style="font-size: 12.0pt; font-family: "Arial",sans-serif; color: #050505;">&nbsp;<img style="max-width: 100%; height: auto; vertical-align: middle; border: 0px; padding: 0px;" src="https://lms.devry.edu/lms/fileoversize/engageli/Engageli%203%20Main%20Login_Playback_083123.png" alt="Engageli 3 Main Login_Playback_083123.png" width="625" height="344" data-api-endpoint="https://devryu.instructure.com/api/v1/courses/18877/files/13454966" data-api-returntype="File" /></span></p><p class="MsoNormal" style="line-height: normal; background: white; margin: 4.5pt 0in 4.5pt 0in;"><strong><span style="font-size: 18.0pt; font-family: Poppins; color: #050505;">Have questions?</span></strong></p><p>Contact the DeVry Helpdesk, available 24/7/365 at (877) 306-4283. A live chat and helpdesk form is also available. You can submit a ticket at&nbsp;<a href="https://devry.service-now.com/sp?id=help">https://devry.service-now.com/sp?id=help</a>' + el_icon + '.</p><p>&nbsp;</p>');
		}
		
	});
	
	//Inserts Pulse Survey
	onElementRendered("div[data-feedback-id]", function (element) {		

		//Sets feedback ID
        var fid = parseInt(element.attr("data-feedback-id"));
		var iid = element.attr("data-feedback-inst");
		if (iid==null){
			iid=1;
		} else {
			iid = parseInt(iid);
		}
		var box = $(element);
		
		//Set domain & term variables
		var domain = window.location.href.split('/');
		//var term = CanvasDetails.courseInfo.sis_course_id;
		var term = CanvasDetails.courseInfo.enrollment_term_id;
		
		if (term==null){
			term = '';
		}
		
		//Sets user info
		var udat = $.Deferred();
		function getUserData(){
			
			$.ajax({
				type: 'GET',
				url: 'https://' + urlbreaker[2] + '/api/v1/users/self/profile',
				success: function(data){
					udat.resolve({uname: data.name, uemail: data.email, dnumber: user_data.login_id});
				}
			});
			return udat.promise();
		}
		/*
		function getUserData(){
			var uname = ENV.current_user.display_name;
			var uemail = CanvasDetails.userInfo.primary_email;
			var dnumber = CanvasDetails.userInfo.login_id;
	
   			if (uname!=null && uname!='' && uemail!=null && uemail!='' && dnumber!=null && dnumber!=''){
	   			udat.resolve({uname: uname, uemail: uemail, dnumber: dnumber});
    		} else {
				$.ajax({
					type: 'GET',
					url: 'https://' + urlbreaker[2] + '/api/v1/users/self',
					success: function(data){
						udat.resolve({uname: data.name, uemail: data.email, dnumber: data.login_id});
					}
				});
			}
			
			return def.promise();
		}
		*/
		
		var userdata = getUserData();
				
		//Modal stuff starts
		var modal = '<div id="DQ_message_modal" class="modal" style="display: none;"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="btn btn-secondary" data-dismiss="modal">X</button><h3 class="modal-title">Error:</h3><hr /></div><div class="modal-body custmoddefault"><p>You must select a rating before submitting your response.</p></div><div class="modal-body" id="coll148modaltext"><p>Please select no more than two options.</p></div></div></div></div>';
		var modalscreen = '<div id="modalscreen"></div>';
		
		$("body").append(modalscreen);
		
		$("#modalscreen").css({
			'width': '100%',
			'height': '100%',
			'position': 'fixed',
			'top': '0',
			'z-index': '9999',
			'background-color': '#000',
			'opacity': '0.75',
			'display': 'none'
		});
		
		$("body").append(modal);
		
		$("#DQ_message_modal").css({
			'box-sizing': 'border-box',
			'position': 'fixed',
			'top': '10%',
			'right': '25%',
			'left': '25%',
			'width': 'auto',
			'height': 'auto',
			'overflow': 'hidden',
			'background-color': '#EEE',
			'-mox-border-radius': '8px',
			'border-radius': '8px',
			'z-index': '9999'
		});
		
		$(".modal-dialog").css('padding', '10px 20px');
		$(".modal-header .btn-secondary").css({'float': 'right', 'clear': 'both'})
		$(".modal-title").css({
			'color': 'crimson',
			'font-variant': 'small-caps'
		});
		$("#coll148modaltext").css('display', 'none');
		
		$("#DQ_message_modal").find(".btn-secondary").click(function(){
			$("#modalscreen").css('display', 'none');
			$("#DQ_message_modal").css('display', 'none');
		});		
		//Modal stuff ends
		
		//Grabs feedback survey content from server
		$.ajax({
			type: 'POST',
			url: 'https://lms.devry.edu/lms/scripts/php/feedback.php',
			data: {
				action: 'check_survey',
				uid: ENV.current_user_id,
				cid: domain[4],
				sid: fid,
				iid: iid,
				domain: domain[2],
				term: term,
				dnum: user_data.login_id
			},
			success: function(data){
				//Places feedback survey content into the page
				$(box).append(data);
				//Adds submit button at the end of the survey content
				
				if ($("#survey-submit").length>0){
					$("#survey-submit").html('<input id="feedback-sub-btn" class="btn" type="button" value="Submit" />');

					//button binding for submit button
					$("#feedback-sub-btn").click(function(){
						$(this).prop('disabled', true);
						var qtype;
						var rcount = 0;
						var udcount = 0;
						var answers = [];
						userdata.done(function(udata){
							console.log(udata);
							for (var f=0; f<$(".fb-question").length; f++){
								if ($(".fb-question").eq(f).children().length>0){
									qtype = $(".fb-question").eq(f).find(".fb-option").eq(0).children()[0].nodeName;
								} else {
									qtype = $(".fb-question").eq(f)[0].nodeName;
								}					
								console.log(qtype);
								if (qtype=='INPUT'){
									if ($(".fb-question").eq(f).find(".fb-option").eq(0).children()[0].getAttribute('type')=='checkbox'){
										console.log(f + ' is checkbox');
										if ($(".fb-question").eq(f).find(".fb-option").eq(0).children()[0].getAttribute('name')=='contact' && $(".fb-question").eq(f).find("input:checked").val()=='contact'){
											answers.push({type: 'checkbox', qid: $(".fb-question").eq(f).attr('data-qid'), answer: 'Name: ' + udata.uname + ', Email: ' + udata.uemail + ', DNumber: ' + user_data.login_id});
										} else if ($(".fb-question").eq(f).find(".fb-option").eq(0).children()[0].getAttribute('name')=='coll148_q4'){
											rcount = rcount + 1;
											if ($(".fb-question").eq(f).find("input:checked").length==2){
												//Two options selected
												answers.push({type: 'checkbox', qid: $(".fb-question").eq(f).attr('data-qid'), answer: $(".fb-question").eq(f).find("input:checked").eq(0).val() + ', ' + $(".fb-question").eq(f).find("input:checked").eq(1).val()});
											} else if ($(".fb-question").eq(f).find("input:checked").length==1) {
												//Only one option checked
												answers.push({type: 'checkbox', qid: $(".fb-question").eq(f).attr('data-qid'), answer: $(".fb-question").eq(f).find("input:checked").val()});
											} else if ($(".fb-question").eq(f).find("input:checked").length>2){
												//too many options selected
												$(".custmoddefault").css('display','none');
												$("#modalscreen").css('display', 'block');
												$("#DQ_message_modal").css('display', 'block');
												$("#coll148modaltext").css('display', 'block');
											} else {
												//no options selected
												udcount = udcount + 1;
											}
											answers.push({type: 'checkbox', qid: $(".fb-question").eq(f).attr('data-qid'), answer: ''})
										}
									} else {
										//type is radio
										console.log(f + ' is radio');
										answers.push({type: 'radio', qid: $(".fb-question").eq(f).attr('data-qid'), answer: $(".fb-question").eq(f).find('input:checked').val()});
										rcount = rcount + 1;
										if ($(".fb-question").eq(f).find('input:checked').val()==undefined) {
											udcount = udcount + 1;
										}
									}								
								} else if (qtype='TEXTAREA'){
									console.log(f + ' is textarea');
									answers.push({type:'text', qid: $(".fb-question").eq(f).attr('data-qid'), answer: $(".fb-question").eq(f).val()});
								}
							}
					
							if (udcount>0 && rcount>=1){
								console.log(udcount);
								console.log(rcount);
								//message forcing students to choose a rating.
								$("#coll148modaltext").css('display', 'none');
								$(".custmoddefault").css('display','block');
								$("#modalscreen").css('display', 'block');
								$("#DQ_message_modal").css('display', 'block');
								$("#feedback-sub-btn").prop('disabeled', false);
							} else {
								//Submits data to server
								console.log(udcount);
								console.log(rcount);
								$.ajax({
									type: 'POST',
									url: 'https://lms.devry.edu/lms/scripts/php/feedback.php',
									data: {
										uid: ENV.current_user_id,
										cid: domain[4],
										sid: fid,
										iid: iid,
										domain: domain[2],
										dnumber: user_data.login_id,
										term: term,
										ccode: CanvasDetails.courseInfo.course_code,
										answers: answers,
										action: 'submit_survey'
									},
									success: function(fdata){
										$(box).html(fdata);
									}
								});
							}
							
						});
						
					});
					
					$(".fb-option").find('i').click(function(){
						$(this).parent().find('input').eq(0).prop('checked', true);
					});

				}
				
			}
		});

    });


	//Inserts feedback results
	onElementRendered("div[data-feedback-results]", function(element) {
		//Sets feedback ID, course code
		var fid = element.attr("data-feedback-results");
		var ccode = CanvasDetails.courseInfo.course_code;
		var box = $(element);
		var term = CanvasDetails.courseInfo.enrollment_term_id;
		if (term==null){
			term = '';
		}
		
		//Grabs feedback survey content from server*
		$.ajax({
			type: 'GET',
			url: 'https://lms.devry.edu/lms/scripts/php/feedback.php',
			data: {
				action: 'faculty_display',
				id: fid,
				ccode: ccode,
				cid: CanvasDetails.courseInfo.id,
				term: term
			},
			success: function(data){
				//Places feedback survey content into the page
				$(box).html(data);
				var surveys = [];
				$("#survey_responses").find(".resp_item").each(function(){
					var resp = {
						uid: $(this).data('uid'),
						sid: $(this).data('sid'),
						iid: $(this).data('iid'),
						qid: $(this).data('qid'),
						cid: $(this).data('cid'),
						ccode: $(this).data('ccode'),
						term: $(this).data('term'),
						stars: $(this).find('.star_rating').eq(0).data('stars'),
						title: $(this).find('.survey_instance').eq(0).text(),
						response_t: $(this).find('.resp_content').eq(0).text()
					};
					surveys.push(resp);
				});
				$(document).data('surveys', surveys);
				$("#survey-submit").remove();
								
				//Binds buttons
				$(".survey-order-rating").click(function(){
					var otherbtn = $(".survey-order-inst").find('i').eq(0);
					otherbtn.addClass('fa-angle-right');
					otherbtn.removeClass('fa-angle-down');
					otherbtn.removeClass('fa-angle-up');
					var btnstate = $(this).find('i').eq(0);	
					var surveys = [];
					$("#survey_responses").find(".resp_item").each(function(){
						var resp = {
							uid: $(this).data('uid'),
							sid: $(this).data('sid'),
							iid: $(this).data('iid'),
							qid: $(this).data('qid'),
							cid: $(this).data('cid'),
							ccode: $(this).data('ccode'),
							term: $(this).data('term'),
							stars: $(this).find('.star_rating').eq(0).data('stars'),
							title: $(this).find('.survey_instance').eq(0).text(),
							response_t: $(this).find('.resp_content').eq(0).text()
						};
						surveys.push(resp);
					});
					$(document).data('surveys', surveys);
					
					$("#survey_responses").empty();

					if (btnstate.hasClass('fa-angle-down')){
						//Sort from highest to lowest
						btnstate.addClass('fa-angle-up');
						btnstate.removeClass('fa-angle-down');
						$(document).data('surveys').sort(function(a,b){return b.stars - a.stars});
					} else {
						//Sort from lowest to highest
						console.log('fa-angle-right');
						btnstate.addClass('fa-angle-down');
						btnstate.removeClass('fa-angle-up');
						$(document).data('surveys').sort(function(a,b){return a.stars - b.stars});
					}
					
					btnstate.removeClass('fa-angle-right');
					
					var surveydata = $(document).data('surveys');
					var output = '';
					for (i=0; i<surveydata.length; i++){
						output += '<div class="resp_item" data-uid="' + surveydata[i].uid + '" data-sid="' + surveydata[i].sid + '" data-iid="' + surveydata[i].iid + '" data-qid="' + surveydata[i].qid + '" data-cid="' + surveydata[i].cid + '" data-ccode="' + surveydata[i].ccode + '" data-term="' + surveydata[i].term + '"><div class="resp_header"><span class="star_rating" data-stars="' + surveydata[i].stars + '">' + starGenerator(surveydata[i].stars) + '</span><span class="survey_instance">' + surveydata[i].title + '</span></div><div class="resp_content">' + surveydata[i].response_t + '</div></div>';
					}
					$("#survey_responses").html(output);
				});
									
				$(".survey-order-inst").click(function(){
					var otherbtn = $(".survey-order-rating").find('i').eq(0);
					otherbtn.addClass('fa-angle-right');
					otherbtn.removeClass('fa-angle-down');
					otherbtn.removeClass('fa-angle-up');
					var btnstate = $(this).find('i').eq(0);
					var surveys = [];
					$("#survey_responses").find(".resp_item").each(function(){
						var resp = {
							uid: $(this).data('uid'),
							sid: $(this).data('sid'),
							iid: $(this).data('iid'),
							qid: $(this).data('qid'),
							cid: $(this).data('cid'),
							ccode: $(this).data('ccode'),
							term: $(this).data('term'),
							stars: $(this).find('.star_rating').eq(0).data('stars'),
							title: $(this).find('.survey_instance').eq(0).text(),
							response_t: $(this).find('.resp_content').eq(0).text()
						};
					surveys.push(resp);
					});
					$(document).data('surveys', surveys);
					
					$("#survey_responses").empty();
					
					if (btnstate.hasClass('fa-angle-down')){
						//Sort from highest to lowest
						btnstate.addClass('fa-angle-up');
						btnstate.removeClass('fa-angle-down');
						$(document).data('surveys').sort(function(a,b){return a.iid - b.iid});
					} else {
						//Sort from lowest to highest
						btnstate.addClass('fa-angle-down');
						btnstate.removeClass('fa-angle-up');
						$(document).data('surveys').sort(function(a,b){return b.iid - a.iid});
					}
					
					btnstate.removeClass('fa-angle-right');
					
					var surveydata = $(document).data('surveys');
					var output = '';
					for (i=0; i<surveydata.length; i++){
						output += '<div class="resp_item" data-uid="' + surveydata[i].uid + '" data-sid="' + surveydata[i].sid + '" data-iid="' + surveydata[i].iid + '" data-qid="' + surveydata[i].qid + '" data-cid="' + surveydata[i].cid + '" data-ccode="' + surveydata[i].ccode + '" data-term="' + surveydata[i].term + '"><div class="resp_header"><span class="star_rating" data-stars="' + surveydata[i].stars + '">' + starGenerator(surveydata[i].stars) + '</span><span class="survey_instance">' + surveydata[i].title + '</span></div><div class="resp_content">' + surveydata[i].response_t + '</div></div>';
					}
					$("#survey_responses").html(output);			
				});
				
				$(".survey-inst-select").change(function(){
					var sel_index = $(this).val();
					if (sel_index==0){
						//View all weeks
						$("#survey_responses").find('.resp_item').css('display', 'block');
					} else {
						//View a specific week
						$("#survey_responses").find('.resp_item').each(function(){
							if($(this).data('iid')==sel_index){
								$(this).css('display', 'block');
							} else {
								$(this).css('display', 'none');
							}
						});
					}
				});
				
				function starGenerator(num){
					var half = Math.round(Math.round(num) - num);
					var blank = 4 - Math.round(num);
					var whole = 4 - (blank + half);

					var icode = '';
					for (w=0; w<whole; w++){
						icode += '<i class="fas fa-star fa-lg"></i>';
					}
					for (h=0; h<half; h++){
						icode += '<i class="fas fa-star-half-alt fa-lg"></i>';
					}
					for (b=0; b<blank; b++){
						icode += '<i class="far fa-star fa-lg"></i>';
					}
					
					return icode;
				}

									
			}
		});		
		
	});
		
    onElementRendered("body", function (body) {

        $(body).on("click", "a", function (e) {
            var href = $(this).attr("href");
            if ($(this).attr('rel') === 'lightbox' || $(this).children(".thumbnail").length > 0 || (href && href.match(/\.(jpe*g|png|bmp)/i)) && $(this).find("img").length > 0) {
                $("body").append("<div class='lightbox-modal'><img src='" + $(this).attr("href") + "'/><span class='lightbox-modal-close'>Click To Close</span></div>");
                setTimeout(function () {
                    $("body").addClass("modal-backdrop");
                }, 100);

                e.preventDefault();
            }

        });
        $(body).on("click", ".lightbox-modal", function (e) {
            var $this = $(this);
            $("body").removeClass("modal-backdrop");
            setTimeout(function () {
                $this.remove();
            }, 300);

            e.preventDefault();
        });
    });
	
	//Custom Insert Objectives by Title
	onElementRendered($("h2:contains(Course Objectives)"), function (el) {
		var section = $(el).parent().find('.section-content').eq(0);
		loadObjectives(section);
	});

/*
    onElementRendered(".accordion", function (accordion) {

        $(accordion).not(".student-groups").accordion({header: "h3"});

    });*/


    var tablesToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
                tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
                + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Name</Author><Created>{created}</Created></DocumentProperties>'
                + '<Styles>'
                + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
                + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
                + '<Style ss:ID="DateTime"><NumberFormat ss:Format="m/d/yy h:mm AM/PM"></NumberFormat></Style>'
                + '<Style ss:ID="Bold"><Font ss:Bold="1"/><Interior ss:Color="#BDD7EE" ss:Pattern="Solid"/></Style>'
                + '</Styles>'
                + '{worksheets}</Workbook>'
                , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
                , tmplCellXML = '<Cell{span}{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
                , base64 = function (s) {
                    return window.btoa(unescape(encodeURIComponent(s)))
                }
        , format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        }
        return function (tables, wbname, appname) {
            var ctx = "";
            var workbookXML = "";
            var worksheetsXML = "";
            var rowsXML = "";

            tables.each(function () {

                var v = $(this).clone();
                var wsname = $(this).attr("data-sheet-name")
                v.find("*").each(function () {
                    if ($(this).css("display") === "none") {
                        $(this).remove();
                    }
                });
                var v = v[0];
                for (var j = 0; j < v.rows.length; j++) {
                    rowsXML += '<Row>'
                    for (var k = 0; k < v.rows[j].cells.length; k++) {
                        var dataType = v.rows[j].cells[k].getAttribute("data-type");
                        var dataStyle = v.rows[j].cells[k].getAttribute("data-style");
                        var dataValue = v.rows[j].cells[k].getAttribute("data-value");
                        var dataSpan = v.rows[j].cells[k].getAttribute("colspan");
                        if (dataSpan)
                            dataSpan = parseInt(dataSpan);
                        dataValue = (dataValue) ? dataValue : v.rows[j].cells[k].innerHTML;
                        var dataFormula = v.rows[j].cells[k].getAttribute("data-formula");
                        dataFormula = (dataFormula) ? dataFormula : (appname == 'Calc' && dataType == 'DateTime') ? dataValue : null;
                        ctx = {attributeStyleID: (dataStyle == 'Currency' || dataStyle == 'Date' || dataStyle == 'DateTime' || dataStyle == 'Bold') ? ' ss:StyleID="' + dataStyle + '"' : ''
                            , nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String'
                            , data: (dataFormula) ? '' : dataValue
                            , attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : '',
                            span: dataSpan ? ' ss:MergeAcross="' + (dataSpan - 1) + '"' : ''
                        };
                        rowsXML += format(tmplCellXML, ctx);
                    }
                    rowsXML += '</Row>'
                }
                ctx = {rows: rowsXML, nameWS: wsname || 'Sheet'};
                worksheetsXML += format(tmplWorksheetXML, ctx);
                rowsXML = "";
            });

            ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
            workbookXML = format(tmplWorkbookXML, ctx);

            console.log(workbookXML);

            var link = document.createElement("A");
            link.href = uri + base64(workbookXML);
            link.download = wbname || 'Workbook.xls';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    })();
	
	//New GRADE SYNC FUNCTIONS - ADDED 12/06/18
	function gradeSyncBlocker(type){
		var user = CanvasDetails.userInfo.login_id;
		var domain = document.location.href.split('/')[2];
		var course_id = document.location.href.split('/')[4];
		var term = CanvasDetails.courseInfo.enrollment_term_id;
		var access_date = dateGenerator();
		var return_obj='';
		console.log('user=' + user + ', domain=' + domain + ', course_id='+ course_id + ', term=' + term + ', access_date=' + access_date);
		
		if(type=='get'){
			$.ajax({
				url: 'https://lms.devry.edu/lms/scripts/php/gradesync_check.php',
				type: 'GET',
				data: {
					user: user,
					domain: domain,
					course_id: course_id,
					term: term,
					access_date: access_date
				},
				success: function(x){
					return_obj = JSON.parse(x);
					if (return_obj!=null){
						$("#publish_grades_link").removeAttr('disabled');
						$('.gsync_block_message').remove();
					}
					console.log(return_obj);
				}
			});
		} else {
			//type=='post'
			$.ajax({
				url: 'https://lms.devry.edu/lms/scripts/php/gradesync_check.php',
				type: 'POST',
				data: {
					user: user,
					domain: domain,
					course_id: course_id,
					term: term,
					access_date: access_date
				},
				success: function(x){
					console.log(x);
				}
			});
		}
		return return_obj;
	}
	
	function dateGenerator(){
			var date = new Date();
			var year = date.getUTCFullYear();
			var month = addZero(date.getUTCMonth() + 1);
			var day = addZero(date.getUTCDate());
			var hours = addZero(date.getUTCHours());
			var minutes = addZero(date.getUTCMinutes());
			var seconds = addZero(date.getUTCSeconds());
			var access_date = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
			return access_date;
			
			function addZero(date){
				if(date.toString().length<2){
					date = '0' + date;
				}
				return date;
			}
	}

	
	function loadObjectives(section){
		console.log("loading objectives");
		var unit = CanvasDetails.location.pages.match(/\d+/);
    	console.log(unit);
    	if (unit) {
        	unit = unit[0];
            $.get("https://" + location.hostname + "/api/v1/courses/" + CanvasDetails.location.courses + "/outcome_groups?per_page=30", function (data) {
            	var order = [];
                $.each(data, function (i, v) {
                	if (v.description && !v.title.match(/outcomes/i)) {
                    	order.push(data[i]);
                        data[i].title = data[i].title.split(/-/);
                        data[i].title = data[i].title[data[i].title.length - 1];
                        if (!data[i].title.match(/\D/)) {                                
                        	data[i].title = parseInt(data[i].title);
                        }
                    }
                });
                order.sort(function (a, b) {
                	if (a.title > b.title) {
                    	return 1;
                    }
                    if (a.title < b.title) {
                    	return -1;
                    }
                    // a must be equal to b
                    return 0;
                });
                console.log(order)
                var objlist = $("<div class='section-content'></div>");
                $.each(order, function (i, v) {
                	if (typeof v.title==='number' || (v.description && !v.title.match(/outcomes/i))) {
                    	var units = []
                        var desc = $("<div/>").html(v.description);
                        var link = desc.find(".obj-unit-link").text();
                        if (link && link.length > 0) {
                        	units = link.split(/,/g);
                        }
                        if (units.indexOf(unit) >= 0) {
                            var obj = $("<div data-obj-index='0' class='loaded-objective'>").html("<div class='objective'><div class='obj-number'><p>" + v.title + "</p></div><div class='obj-description'>" + v.description + "</div></div>");
                            $.get("https://" + location.hostname + "/api/v1/courses/" + CanvasDetails.location.courses + "/outcome_groups/" + v.id + "/outcomes?per_page=50&outcome_style=full", function (outcomes) {
                            	var enab = $("<div/>")
                                enab.append("<h3 class='sub-heading'>Knowledge, Skills, and Abilities</h3>");
                                var list = $("<ul></ul>");
                                $.each(outcomes, function (index, enabler) {        
                                	var elink = $("<div>").html(enabler.outcome.description).find(".obj-unit-link").text();    
                                    if (elink && elink.length > 0 && !$(enabler.outcome.description).text().match(/^\./)) {
                                    	var eunits = elink.split(/,/g);
										if (eunits.indexOf(unit) >= 0) {
                                        	list.append("<li>" + enabler.outcome.description + "</li>");
                                        }
                                    }
                                });
                                var enb = $("<div class='section-content-uneditable'></div>").append(list);
                                if (enb.find("li").length > 0) {
                                	obj.append(enab).append(enb);
                                    obj.find(".obj-unit-link").remove();
                                }
                            });

                            objlist.append(obj);
                        }
                    }
                });
                if (objlist.find(".loaded-objective").length > 0) {
					if (section!=undefined && section!=null && section!='undefined'){
						section.html(objlist);
						objlist.find(".obj-unit-link").remove();
					} else {
						var sec = $("<div class='section'></div>").html("<div class='btt'<h2>Course Objectives</h2></div>");
						sec.append(objlist);
                    	objlist.find(".obj-unit-link").remove();
                    	sec.insertAfter($(".user_content .section").last());
					}
                }
            });
       }
	}
		
	//GRADE SYNC FUNCTION END
	
	//Announcement Custom Function
	function getAnnouncements(obj,page,callback){
		$.ajax({
			type: 'GET',
			url: 'https://' + urlbreaker[2] + '/api/v1/courses/' + urlbreaker[4] + '/discussion_topics?only_announcements=true&order_by=recent_activity&per_page=100&page=' + page,
			success: function(data){
				$(data).each(function(i){
					obj.push(data[i]);
				});
				if(data.length>=100){
					page++;
					getAnnouncements(obj,page,callback);
				} else {
					callback(obj);
				}
			}
		});
	}

})();

$(document).ready(function () {
    
    
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
    
		    
    if (ENV.current_user_id === null) {
       var locationDetails = getLocationDetails();
        
        $(".ic-app-header__main-navigation li").not(":first-child").not(":last-child").find("a").attr("href", "#").off("click");
        $("#global_nav_dashboard_link").attr("href", ENV.WIKI_PAGES_PATH + "/dashboard");
        $("#global_nav_courses_link").attr("href", ENV.WIKI_PAGES_PATH + "/courses");
        $("#global_nav_calendar_link").attr("href", ENV.WIKI_PAGES_PATH + "/calendar");
        $("#global_nav_conversations_link").attr("href", ENV.WIKI_PAGES_PATH + "/inbox");     
        $(".ic-app-header__logomark").attr("href","https://www.devry.edu/");
        $("#global_nav_login_link").parent().hide();
        console.log(locationDetails);
        if(locationDetails){            
            if(locationDetails.pages === "dashboard"){
                $(".ic-app-header__main-navigation").find(".ic-app-header__menu-list-item--active").removeClass("ic-app-header__menu-list-item--active");
                $("#global_nav_dashboard_link").parent().addClass("ic-app-header__menu-list-item--active");
            }
            if(locationDetails.pages === "courses"){
                $(".ic-app-header__main-navigation").find(".ic-app-header__menu-list-item--active").removeClass("ic-app-header__menu-list-item--active");
                $("#global_nav_courses_link").parent().addClass("ic-app-header__menu-list-item--active");
            }
            if(locationDetails.pages === "calendar"){
                $(".ic-app-header__main-navigation").find(".ic-app-header__menu-list-item--active").removeClass("ic-app-header__menu-list-item--active");
                $("#global_nav_calendar_link").parent().addClass("ic-app-header__menu-list-item--active");
            }
            if(locationDetails.pages === "inbox"){
                $(".ic-app-header__main-navigation").find(".ic-app-header__menu-list-item--active").removeClass("ic-app-header__menu-list-item--active");
                $("#global_nav_conversations_link").parent().addClass("ic-app-header__menu-list-item--active");
                
            }

        }
    }
    
    onElementRendered("#batch_check",function(element){
        $(element).find("input").attr("disabled",true);
    })
});