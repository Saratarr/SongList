$(window).load(function () {
	var tabIndexNumber = 0;

	function getTabIndex() {
    	tabIndexNumber++;
    	return tabIndexNumber;
	}

	
	$(".reveal-ques").prepend('<span class="expand-toggle"  tabindex="0">Expand All</span>');
	$(".reveal-ques-item-title").append('<span class="reveal-btn" tabindex="0">&#x25BA; Reveal Question</span>');
	$(".reveal-ques-item-question").hide();	
	
	$("body").on("click", ".reveal-ques .reveal-btn", function () {
		console.log($(this).parent().siblings(".reveal-ques-item-question"));
		$(this).parent().siblings(".reveal-ques-item-question").toggle();
		
		if($(this).parent().parent().find('.reveal-ques-item-question').eq(0).css('display')=='block'){
			$(this).html("&#x25BC; Hide Question");
		} else {
			$(this).html("&#x25BA; Reveal Question");
		}
		
		/*
		$(this).html(
			$(this).html() == "&#x25BA; Reveal Question" ? "&#x25BC;  Hide Question" : "&#x25BA; Reveal Question"
		);
		*/
		return false;
	});
	var expandBool = false;
	$("body").on("click", ".reveal-ques .expand-toggle", function () {
		$(this).html(
			$(this).html() == "Expand All" ? "Collapse All" : "Expand All"
		);
		if (expandBool === false) {
			expandBool = true;
			$(".reveal-btn").html("&#x25BC; Hide Question");
			$(".reveal-ques-item-question").show();
		} else if (expandBool === true) {
			expandBool = false;
			$(".reveal-ques-item-question").hide();
			$(".reveal-btn").html("&#x25BA; Reveal Question");
		}
	});
	
	$(".reveal-ques .reveal-btn").bind('keypress', function(e){
		var code = (e.keyCode ? e.keyCode: e.which);
		if (code === 13 && $(this).is(":focus")){
			$(this).trigger("click");
		}
	});
	$(".reveal-ques .expand-toggle").bind('keypress', function(e){
		var code = (e.keyCode ? e.keyCode: e.which);
		if (code === 13 && $(this).is(":focus")){
			$(this).trigger("click");
		}
	});

	$(".reveal-ques").css({
		"background-color": "#EEE",
		"border-radius": "8px",
		padding: "12px",
		"padding-top": "50px",
		position: "relative",
		"box-sizing": "border-box"
	});
	
	$(".reveal-ques *").css({
		"box-sizing": "border-box"
	});

	$(".reveal-ques-item").css({
		"border-bottom": "2px dotted #00599C",
		padding: "2px 24px",
		"background-color": "#FFF",
		"padding-bottom": "4px",
		"border-right": "2px solid #CCC",
		"border-left": "2px solid #CCC"
	});

	$(".reveal-ques-item:first-of-type").css({
		"border-top": "2px solid #CCC"
	});

	$(".reveal-ques-item:last-of-type").css({
		"border-bottom": "2px solid #CCC"
	});

	$(".reveal-ques-item-question").css({
		padding: "8px",
		border: "2px solid #CCC",
		"border-radius": "4px",
		"margin-bottom": "12px",
	});
	
	$(".reveal-ques-item-question").attr('tabindex', 0);
	
	$(".reveal-ques-item-question p").css({
		margin: "0",
	});

	$(".reveal-ques-item-title").css({
		"padding-bottom": "12px",
	});
	
	$(".reveal-ques-item-title").find('h4').attr('tabindex', 0);

	$(".reveal-ques-item .reveal-btn").css({
		display: "block",
		color: "#00599C",
		cursor: "pointer"
	});


	$(".reveal-btn:hover").css({
		"text-decoration": "underline",
	});

	$(".reveal-ques-item-title h4").css({
		margin: "12px 0 8px 0",
		padding: "0"
	});

	$(".expand-toggle").css({
		position: "absolute",
		top: "8px",
		right: "24px",
		color: "#00599C",
		cursor: "pointer",
		padding: "4px 8px",
		border: "2px solid #00599C",
		"border-radius": "4px",
		"background-color": "#FFF"
	});

	$(".expand-toggle:hover").css({
		"text-decoration": "underline"
	});
	$(".reveal-answ").prepend('<span class="expand-toggle"  tabindex="0">Expand All</span>');
	$(".reveal-answ-item-title").append(
		'<span class="reveal-btn">&#x25BA; Reveal Answer</span>'
	);
	$(".reveal-answ-item-answer").hide();
	$("body").on("click", ".reveal-answ .reveal-btn", function () {
		console.log(
			$(this)
			.parent()
			.siblings(".reveal-answ-item-answer")
		);
		$(this)
			.parent()
			.siblings(".reveal-answ-item-answer")
			.toggle();
		$(this).html(
			$(this).html() == "&#x25BA; Reveal Answer" ? "&#x25BC;  Hide Answer" : "&#x25BA; Reveal Answer"
		);
		return false;
	});
	var expandBool = false;
	$("body").on("click", ".reveal-answ .expand-toggle", function () {
		$(this).html(
			$(this).html() == "Expand All" ? "Collapse All" : "Expand All"
		);
		if (expandBool === false) {
			expandBool = true;
			$(".reveal-btn").html("&#x25BC; Hide Answer");
			$(".reveal-answ-item-answer").show();
		} else if (expandBool === true) {
			expandBool = false;
			$(".reveal-answ-item-answer").hide();
			$(".reveal-btn").html("&#x25BA; Reveal Answer");
		}
	});
	$(".reveal-answ").css({
		"background-color": "#EEE",
		"border-radius": "8px",
		padding: "12px",
		"padding-top": "50px",
		position: "relative",
		"box-sizing": "border-box"
	});

	$(".reveal-answ *").css({
		"box-sizing": "border-box"
	});

	$(".reveal-answ-item").css({
		"border-bottom": "2px dotted #00599C",
		padding: "2px 24px",
		"background-color": "#FFF",
		"padding-bottom": "4px",
		"border-right": "2px solid #CCC",
		"border-left": "2px solid #CCC"
	});

	$(".reveal-answ-item:first-of-type").css({
		"border-top": "2px solid #CCC"
	});

	$(".reveal-answ-item:last-of-type").css({
		"border-bottom": "2px solid #CCC"
	});

	$(".reveal-answ-item-answer").css({
		padding: "8px",
		border: "2px solid #CCC",
		"border-radius": "4px",
		"margin-bottom": "12px",
	});
	$(".reveal-answ-item-answer p").css({
		margin: "0",
	});

	$(".reveal-answ-item-title").css({
		"padding-bottom": "12px",
	});

	$(".reveal-answ-item .reveal-btn").css({
		display: "block",
		color: "#00599C",
		cursor: "pointer"
	});

	$(".reveal-answ-item-title h4").css({
		margin: "12px 0 8px 0",
		padding: "0"
	});
});
