// ExpertSays by John Leahy
//File by Gio
$(document).ready(function() {
    if ((getURLParameter("edit") !== "true")) {
		$('.space').css('color','#2D3B45');
		$('.space').width('98%');
		$('.space').css('clear','both');
		$(".your.space").attr('contenteditable','true');
        $(".expertslide").hide();
        $(".expertsays").not(".hs_inner").append('<a class="toggle" href="javascript:void(0);">Compare Answers</a>');

        $(".expertsays .toggle").click(function() {
            $(this).parent().children(".expertslide").animate({height: 'toggle'}, 1000);
        });
    }
	
	$(".space").keydown(function(event){
		var space = $(this);
		var sel = window.getSelection();
		
		if(event.which == 78 && event.shiftKey == false){
			event.preventDefault();
			keypress = 'n';
			charfixES(keypress,sel,space);
		} else if (event.which == 188 && event.shiftKey == false){
			event.preventDefault();
			keypress = ',';
			charfixES(keypress,sel,space);
		} else if (event.which == 191 && event.shiftKey == false){
			event.preventDefault();
			keypress = '/';
			charfixES(keypress,sel,space);
		} else if (event.which == 191 && event.shiftKey == true) {
			event.preventDefault();
			keypress = '?';
			charfixES(keypress,sel,space);
		};
	});
	
	
	function charfixES (keypress,sel,space){
		var range = document.createRange();
		var anchorpos = sel.anchorOffset;
		var curstring = sel.anchorNode.nodeValue;
		if(sel.anchorNode.nodeName=='#text'){
			if(sel.isCollapsed==true){
				sel.anchorNode.nodeValue = curstring.substr(0,anchorpos) + keypress + curstring.substr(anchorpos);
			} else {
				var focuspos = sel.focusOffset;
				if (focuspos<anchorpos){
					var newpos = curstring.substr(0,focuspos);
					sel.anchorNode.nodeValue = curstring.substr(0,focuspos) + keypress + curstring.substr(anchorpos);
				} else {
					var newpos = curstring.substr(0,anchorpos);
					sel.anchorNode.nodeValue = curstring.substr(0,anchorpos) + keypress + curstring.substr(focuspos);
				}
				anchorpos = newpos.length;
			}
		} else {
			space.html(keypress);
		}
		range.setStart(sel.anchorNode, anchorpos+1);
		sel.removeAllRanges();
		sel.addRange(range);

	}
    function getURLParameter(name) {

        var urlcom = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        return urlcom;
    }

});