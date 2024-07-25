

//var urlPath = window.location.href;
/*
 var refUrlPath = document.referrer;
 //console.log('referred from ' + refUrlPath);
 if (refUrlPath==null || refUrlPath==''){
 var urlPath = window.location.href;
 } else {
 var urlPath = refUrlPath;
 }
 */

/*
$('body').on('click', ".view-submitted-issues", function (e) {
    //console.log('View Submitted Issues Clicked!');
    //ADD SUBBITED ISSUES SCRIPT
    modalTitle = 'View Submitted Issues';
    modalWindow = '<div class="course-item-container"><div class="section"><div class="section-content"></div><div class="cirt_container cirt-curpage-view"><div class="center"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span><span>Loading...</span></div></div></div></div></div></div>';
    viewSubmitted(function (data) {
        $('.cirt_container').html(data);
    });
    cirtModal(modalTitle, modalWindow);
    e.preventDefault();
});
*/

/*
$('body').on('click', ".report-an-issue", function (e) {
    //console.log('Report and Issue Clicked!');
    //ADD REPORT AN ISSUE SCRIPT//
    modalTitle = 'Report an Issue';
    modalWindow = '<div class="course-item-container"><div class="section"><div class="section-content"><div></div><div class="cirt_container cirt-curpage-submit"><div class="center"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span><span>Loading...</span></div></div><div class="cirt_sub_btns"><a class="button btn btn-primary cirt_submission_btn">Submit</a></div></div></div></div>';
    reportIssue(function (data) {
        $('.cirt_container').html(data);
    });
    cirtModal(modalTitle, modalWindow);
    e.preventDefault();
});
*/

/*
$('body').on('click', ".help", function (e) {
    //console.log('Report and Issue Clicked!');
    ADD HELP SCRIPT
    modalTitle = 'Help';
    modalWindow = '<p>CIRT, the Course Issue Reporting Tool, replaces Sidebar as the place to report issues with course content. If you find an issue on any page in your course, just open Faculty Tools and select Report an Issue</p><p>CIRT will automatically detect your identity and the course you are in.</p><p>It will also capture the week and page you currently have open. (If you wish to change the week and page for your issue report, you may use the dropdown to select a different page. You will see a list of all weeks and all pages within each week. Just click on the correct one to select it.)</p><p>Provide a Title for the Issue, a description of the issue, and an Importance flag (if you wish). You may also add an attachment if you wish to provide additional documentation.</p><p><img src="https://lms.devry.edu/lms/CourseExport/manual/images/CIRT/image/CIRT_Help1.jpg" alt="Fields indicated in the step above for CIRT." /></p><p>Click Submit.</p><p>You will receive a confirmation.</p><p><img src="https://lms.devry.edu/lms/CourseExport/manual/images/CIRT/image/CIRT_Help2.jpg" alt="Confirmation message based on the step above for CIRT." /></p><p>You may close the CIRT window.</p><p>To review reported issues, open Faculty Tools and select View Submitted Issues from the CIRT section.</p><p><img src="https://lms.devry.edu/lms/CourseExport/manual/images/CIRT/image/CIRT_Help3.jpg" alt="Visual depicting clicking on View Submitted Issues." /></p><p>You will see all of the items that have been reported for this course.</p><img src="https://lms.devry.edu/lms/CourseExport/manual/images/CIRT/image/CIRT_Help4.jpg" alt="List of items that have been reported for the course" /></p>';
    cirtModal(modalTitle, modalWindow);
    e.preventDefault();
});
*/

$('body').on('click', ".faculty-feedback-survey", function (e) {
	//console.log('Faculty Pulse Survey selected');
	modalTitle = 'Faculty Feedback Survey';
    modalWindow = '<div class="course-item-container"><div class="section"><div class="section-content"><div></div><div class="cirt_container ffs_container"><div class="center"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span><span>Loading...</span></div></div></div></div></div>';
	//modalWindow = '<div class="course-item-container"><div class="section"><div class="section-content"><div></div><div class="cirt_container ffs_container"><div class="center"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span><span>Loading...</span></div></div><div class="cirt_sub_btns"><a class="button btn btn-primary cirt_submission_btn">Submit</a></div></div></div></div>';
    loadFacPulse(function (data) {
        $('.cirt_container').html(data);
		if ($("#survey-submit").length>0){
			$('.ffs_container .fb-question').css({
				'display': 'flex'
			});
			$('.ffs_container .fb-option').css({
				'margin': '5px'
			});

			$("#survey-submit").html('<div class="ffs_sub_btns"><a id="ffs_btn" class="button btn btn-primary">Submit</a>');
					
			$(".fb-option").find('i').click(function(){
				$(this).parent().find('input').eq(0).prop('checked', true);
			});
			
			$("#ffs_btn").click(function(){
				console.log('Survey submitted');
				
				surveySubCheck(function (data){
					$('.cirt_container').html(data);
				});
			});
		}
    });
    cirtModal(modalTitle, modalWindow);
    e.preventDefault();
});

    var course_data;
    var user_data;
    var courseCode;
    var urlPath = window.location.href;
    var splitPath = urlPath.split('/');
    var cid = splitPath[4];
	var curbrowser = 'Unknown Browser';
//var canvasDomain = urlPath[2];
//console.log(cid);
onVarAvailable(["CanvasDetails",'courseInfo'], function () {
    course_data = CanvasDetails.courseInfo;
    user_data = CanvasDetails.userInfo;

        var trayLinks = [{
                key: 'https://devry.service-now.com/sp?id=sc_cat_item&sys_id=0a1ecc65db5ca1108f94049ed396190f&sysparm_category=9a39f3e50f56da04011f317ce1050ef8',
                val: 'Report an Issue'
            }, {
				key: '#',
				val: 'Faculty Feedback Survey'
			}];
        var slide_out_title = "Faculty Tools"; //Changes the title on the slide out menu
        var global_nav_name = "Faculty Tools"; //Change the title on the global navigation menu
        var footerContent = ''; //Changes the text of the bottom on the slide out tray

        reactTray(trayLinks, slide_out_title, global_nav_name, footerContent);

//var userID = user_data.id;
//var userEmail = user_data.primary_email;
        courseCode = course_data.course_code;
//var dnumber = user_data.sis_user_id;
        var cirt_frontpage = '';
        var cirt_submitpage = '';
        var cirt_viewpage = '';
        var user_shortname = user_data.name.split(" ");
        user_shortname = user_shortname[0];
//var courseSession = user_data.name.split(" - ");
//console.log(courseSession);
//courseSession = courseSession[courseSession.length-1];
        /*
         if (courseSession.search(/\w{3}\d{2}/ig) < 0) {
         courseSession == null;
         }
         */
		  /*GRABBING BROWSER TYPE*/
		  
			var userAgent = navigator.userAgent;
			var palemoon = /PaleMoon\/(\d+\.\d+)/ig;
			var firefox = /Firefox[\/\s](\d+\.\d+)/ig;
			var old_ie = /MSIE (\d+\.\d+)/ig;
			var new_ie = /Trident.*rv[ :]*(\d+\.\d+)/ig;
			var old_opera = /Opera[\/\s](\d+\.\d+)/ig;
			var new_opera = /OPR\/(\d+\.\d+)/ig; 
			var chrome = /Chrome\/(\d+\.\d+)/ig;
			var old_safari = /Safari\/(\d+\.\d+)/ig;
			var new_safari = /Version\/(\d+\.\d+)/ig;
			
		  	//Browser testing
			//Test if old Opera
			if (old_opera.test(userAgent)==true) {
				if(userAgent.indexOf('Version')!=-1){
					curbrowser = userAgent.match(new_safari)[0].replace('Version','Opera').replace('/',' ');
				} else {
					curbrowser = userAgent.match(old_opera)[0].replace('/',' ');
				}
			//Test if new Opera
			} else if (userAgent.indexOf('OPR/')!=-1){
				curbrowser = userAgent.match(new_opera)[0].replace('OPR','Opera').replace('/',' ');
			}
			//Test if PaleMoon
			else if (userAgent.indexOf('PaleMoon')!=-1){
				curbrowser = userAgent.match(palemoon)[0].replace('/',' ');
			//Test if Firefox
			} else if (firefox.test(userAgent)==true){
				curbrowser = userAgent.match(firefox)[0].replace('/',' ');
			//Test if IE
			} else if (userAgent.indexOf('MSIE')!=-1){
				curbrowser = userAgent.match(old_ie)[0].replace('MSIE','Internet Explorer');
			} else if (new_ie.test(userAgent)==true){
				curbrowser = userAgent.match(new_ie)[0].replace(/Trident.*rv[ :]*/,'Internet Explorer ');
			//Test if Chrome	
			} else if (userAgent.indexOf('Chrome')!=-1) {
				curbrowser = userAgent.match(chrome)[0].replace('/',' ');
			//Test if Safari	
			} else if (userAgent.indexOf('Safari')!=-1) {
				if(userAgent.indexOf('Version')!=-1){
					curbrowser = userAgent.match(new_safari)[0].replace('Version','Safari').replace('/',' ');
				} else {
					curbrowser = userAgent.match(old_safari)[0].replace('/',' ');
				}
			}
			//$("#cirt_submit_form").find("input[name='browser']").eq(0).val(curbrowser);
			//$("#cirt_submit_form").find("input[name='browser']").eq(0).value = curbrowser;

        $.ajax({
            url: "/api/v1/users/self/profile",
            dataType: 'json',
            success: function (data) {
                userID = data.id;
                userEmail = data.primary_email;
                dnumber = data.sis_user_id;
                username = data.name;
            }
        });

        


        $("body").off('click', '.cirt_submission_btn').on('click', '.cirt_submission_btn', function () {
            //$("body").off('click', '.cirt_submission_btn');
			$("#cirt_submit_form").find("input[name='browser']").eq(0).val(curbrowser);
			$("#cirt_submit_form").find("input[name='browser']").eq(0).value = curbrowser;
            var formdata = new FormData($("#cirt_submit_form")[0]);


            if ($("#cirt_submit_form").find("textarea[name='issue']").val() && $("#cirt_submit_form").find("textarea[name='issue']").val().trim() != '') {

                //console.log('clicked submit button');
                $(".cirt_container").html('<div class="center"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Submitting...</span>&nbsp;Submitting...</div>');
                $(".cirt_sub_btns").css("display", "none");
                $.ajax({
                    type: "POST",
                    url: "https://lms.devry.edu/lms/scripts/php/sidebar.php",
                    processData: false,
                    contentType: false,
                    // data: $("#cirt_submit_form").serialize(),
                    data: formdata,
                    /*
                     data: {
                     userid: $("#cirt_submit_form").find("input[name='userid']").val(),
                     currentcourse: $("#cirt_submit_form").find("input[name='currentcourse']").val(),
                     week: $("#cirt_submit_form").find("select[name='week']").val(),
                     location: $("#cirt_submit_form").find("input[name='location']").val(),
                     summary: $("#cirt_submit_form").find("input[name='summary']").val(),
                     dsi: $("#cirt_submit_form").find("input[name='dsi']").val(),
                     email: $("#cirt_submit_form").find("input[name='email']").val(),
                     label: $("#cirt_submit_form").find("select[name='label']").val(),
                     issue: $("#cirt_submit_form").find("textarea[name='issue']").val(),
                     fileattach: $("#cirt_submit_form").find("input[name='fileattach']").val()
                     },
                     */
                    success: function () {
                        //console.log('passed formdata ok');
                        $("#cirt_submit_form").find("textarea[name='issue']").css("border-color", "#d8e0e6");
                        $(".cirt_container").html("<h1>Thank you for your submission, " + user_shortname + "!</h1>");
                        $(".cirt_sub_btns").css("display", "none");
                        $(".cirt_front_btns").css("display", "none");
                        $(".cirt_action_btns").css("display", "block");
                        console.log('submitted successfully');
                    },
					error: function(errordata) {
						console.log(errordata);
						$(".cirt_container").html('Error: Your ticket has not submitted properly. If you are using Safari, please try submitting this ticket with Firefox instead.<br /><br />' + errordata);
					}
                });

            } else {
                $("#cirt_submit_form").find("textarea[name='issue']").css("border-color", "red");
                $("#cirt_submit_form").find("textarea[name='issue']").addClass('has-warning');
            }


        });
})

function viewSubmitted(callback) {
            onVarAvailable(["userID"], function () {
                $.ajax({
                    url: "https://lms.devry.edu/lms/scripts/php/sidebar.php?userid=" + userID + "&urlpath=" + urlPath,
                    async: true,
                    success: function (phpdata) {
                        callback(phpdata);
                        //$(".cirt_container").html(phpdata);
                    },
					error: function(errordata){
						console.log('Failed to connect: ');
						console.log(errordata);
					}
                });
            });
        }

function reportIssue(callback) {
            onVarAvailable(["userID"], function () {
                $.ajax({
                    url: "https://lms.devry.edu/lms/scripts/php/sidebar.php?action=submit&course=" + courseCode + "&useremail=" + userEmail + "&userid=" + userID + "&cid=" + cid + "&urlpath=" + urlPath + "&browser=" + curbrowser,
                    async: true,
					headers: {
						'Referrer Policy': 'no-referrer-when-downgrade'
					},
                    success: function (phpdata) {
                        callback(phpdata);
                        //$(".cirt_container").html(phpdata);
                    },
					error: function(errordata){
						console.log('Failed to connect: ');
						console.log(errordata);
					}
                });
            });
}

function loadFacPulse(callback) {
	            onVarAvailable(["userID"], function () {
				cid = cid.replace('#','');
                $.ajax({
					type: 'POST',
                    url: "https://lms.devry.edu/lms/scripts/php/feedback_modal.php",
					data: {
						action: 'check_survey',
						uid: userID,
						cid: cid,
						sid: 7,
						iid: 1,
						domain: splitPath[2],
						term: CanvasDetails.courseInfo.enrollment_term_id,
						dnum: user_data.sis_user_id
					},
                    async: true,
					headers: {
						'Referrer Policy': 'no-referrer-when-downgrade'
					},
                    success: function (phpdata) {
                        callback(phpdata);
                        //$(".cirt_container").html(phpdata);
                    },
					error: function(errordata){
						console.log('Failed to connect: ');
						console.log(errordata);
					}
                });
            });
}

function surveySubCheck(callback){
	onVarAvailable(["userID"], function () {
		var qtype;
		var rcount = 0;
		var udcount = 0;
		var answers = [];
		
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
						answers.push({type: 'checkbox', qid: $(".fb-question").eq(f).attr('data-qid'), answer: 'Name: ' + udata.uname + ', Email: ' + udata.uemail + ', DNumber: ' + user_data.sis_user_id});
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
				url: 'https://lms.devry.edu/lms/scripts/php/feedback_modal.php',
				data: {
					uid: userID,
					cid: cid,
					sid: 7,
					iid: 1,
					domain: splitPath[2],
					dnumber: user_data.sis_user_id,
					term: CanvasDetails.courseInfo.enrollment_term_id,
					ccode: courseCode,
					answers: answers,
					action: 'submit_survey'
				},
				success: function(fdata){
					callback(fdata);
				}
			});
		}
	});
}
        