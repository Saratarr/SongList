// JavaScript Document
$(document).ready(function() {
	/*Provide Skin for Player*/
		
	$('audio,video').acornMediaPlayer({
		theme:'access accesslight'
	});
	
	/*Set Parent and Child acorn-controls width*/
	$('.acorn-player > video').each(function(){
		/*Get width and height of videos inside acorn-player container*/
		var vidWidth = $(this).attr('width');
		var vidHeight = $(this).attr('height');
		
		/*Set width from video to parent acorn-player container*/
		$(this).parent('.acorn-player').css({
			'width':vidWidth			
		});
		/*Set width from video to acorn-player child acorn-controls container*/
		$(this).parent('.acorn-player').children('.acorn-controls').css({
			'width':vidWidth
		});
	});
	
	
	var src_array = new Array(); //Array of src attributes
	var location = document.location; //get document location
	var path  = location.toString(); //convert location to string format
	var url_path = path.substring(0, path.lastIndexOf("/")+1); //get current path of document's location plus the slash
	
	//Increment variables  
	var i= 0;
	var j = 0;	  	  
	
	//An array that will hold html lines of code
	var newHTML = [];
	  
	//for each source element check to see if its src attribute starts/contains http and if it doesn not add current path before the src value  
	$('source').each(function(){
		if($(this).attr('src').indexOf('http') > -1)
		{
			src_array[i] = $(this).attr('src');
		}else{
			src_array[i] = url_path+$(this).attr('src');
		}
		i++;
	});	  	   
	 
	//IF browser detected is IE version 8 or below  
	if(!supports_video()){
		//alert('test');
		
		for(var n=0; n<src_array.length;n++){
			//newHTML.push('<a href="'+url_path+'/'+src_array[n]+'" target="_blank"><b>' + src_array[n] + '</b></a><br/><br/>');
			newHTML.push('<p style="clear:both; margin:20px 0px 20px 0px;">Your browser does not support newer technologies for video or audio components. Your experience will be better using a newer browser. Please review the <a href="http://www.devry.edu/online-education/technical-specs-requirements.html" target="_blank">list of browsers officially supported</a> by DeVry University and Keller Graduate School of Management.<br/><br/> Please be sure to <a href="'+src_array[n]+'" target="_blank"><b>Download the File.</b></a></p>');
		}
		//$('#test').html(newHTML.join(""));
		
		$('.acorn-player').each(function(){
			$(this).after(newHTML[j]);			
			j++;
		});		
	} /*IF browser detected is Opera else if(jQuery.browser.opera){
		for(var n=0; n<src_array.length;n++){
			newHTML.push('<p class="audio message">Your browser does not support newer technologies for video or audio components. Your experience will be better using a newer browser. Please review the <a href="http://www.devry.edu/online-education/technical-specs-requirements.html" target="_blank">list of browsers officially supported</a> by DeVry University and Keller Graduate School of Management.<br/><br/> Please be sure to <a href="'+src_array[n]+'"  target="_blank"><b>Download the File.</b></a></p>');
		}
		
		$('.acorn-player').each(function(){
			$(this).after(newHTML[j]);
			j++;
		});
	} else if(navigator.platform.indexOf("Mac") >= 0 && jQuery.browser.mozilla){
		for(var n=0; n<src_array.length;n++){
			newHTML.push('<p class="audio message">Your browser does not support newer technologies for video or audio components. Your experience will be better using a newer browser. Please review the <a href="http://www.devry.edu/online-education/technical-specs-requirements.html" target="_blank">list of browsers officially supported</a> by DeVry University and Keller Graduate School of Management.<br/><br/> Please be sure to <a href="'+src_array[n]+'"  target="_blank"><b>Download the File.</b></a></p>');
		}
		
		$('.acorn-player').each(function(){
			$(this).after(newHTML[j]);
			j++;
		});
	}*/
});

function supports_video() {
  return !!document.createElement('video').canPlayType;
}