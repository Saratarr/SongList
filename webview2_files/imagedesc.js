// JQuery Image Description Hide/Show
// CCristerna@devry.edu

$(document).ready(function(){
	var n = 1;
	var i = 1;	
	$('.descbox').each(function(){
		$(this).attr('id','descbox'+n);
		$(this).attr('role','region');
		$(this).attr('aria-expanded','false');
		$(this).attr('tabindex','-1');
		n++;
	});
	$('.dlink').each(function(){		
		$(this).attr('rel','descbox'+i);
		$(this).attr('href','#descbox'+i);
		$(this).attr('role','button');
		$(this).attr('aria-controls','descbox'+i);
		
		i++;		
	});
	$('.instructions').each(function(){
		$(this).append("Press the ESC key to close the image description and return to the page.");
	});
	
	var linkID;
	$('.descbox').css('display','none');
	$('.dlink').click(function(){		
		linkID = $(this).attr('rel');
				
		if($('div#'+linkID).is(':hidden')) {
			$('div#'+linkID).slideDown('slow').show();
			$('div#'+linkID).attr('aria-expanded','true');
			$('#'+linkID).focus();	
		} else {
			/**/			
			$('#'+linkID).slideUp('slow').show();									
		}
		return false;			
	});
	$(document).keyup(function(e) {
		if(e.keyCode == 27) {
			if($('div#'+linkID).is(':visible')){
				$('#'+linkID).slideUp('slow').show(); 
				$('#'+linkID).attr('aria-expanded','false');
					//alert('test');
			}
		}
	});
});

onElementRendered(".tmce_tab_group",function(element){
    $(element).tabs()
})