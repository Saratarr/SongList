// JQuery Image Description Hide/Show
// CCristerna@devry.edu & Gio
$(document).ready(function(){	
	var n = 1;
	var i = 1;	
	$('.hsanswer').each(function(){
		$(this).attr('id','hs-answer'+n);
		$(this).attr('role','region');
		$(this).attr('aria-expanded','false');
		$(this).attr('tabindex','-1');
		n++;
	});
	$('.hslink').each(function(){		
		$(this).attr('rel','hs-answer'+i);
		$(this).attr('href','#hs-answer'+i);
		$(this).attr('role','button');
		$(this).attr('aria-controls','hs-answer'+i);
		
		i++;		
	});
	$('.hsanswer .instructions').each(function(){
		$(this).append("Press the ESC key to hide the example.");
	});
	
	var linkID;
	$('.hsanswer').css('display','none');
	$('.hslink').click(function(){				
		linkID = $(this).attr('rel');
				
		if($('div#'+linkID).is(':hidden')) {
			$('div#'+linkID).slideDown('slow').show();
			$('div#'+linkID).attr('aria-expanded','true');
			$('#'+linkID).focus();	
		} else {
			$('#'+linkID).slideUp('slow').show();			
		}
		return false;			
	});
	$(document).keyup(function(e) {
		if(e.keyCode == 27) {
			if($('div#'+linkID).is(':visible')){
				$('#'+linkID).slideUp('slow').show(); 
				$('#'+linkID).attr('aria-expanded','false');				
			}
		}
	});	
});