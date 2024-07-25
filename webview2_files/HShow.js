// JQuery Image Description Hide/Show
// CCristerna@devry.edu
$(document).ready(function() {
    if ((getURLParameter("edit") !== "true")) {
        $('.hs_inner *').not("input").attr("contenteditable","false");
	$('.hs_inner_ques *').not("input").attr("contenteditable","false");
        $('.hs_inner li').each(function(i, v) {
            var answer = $(this).find(".answer")
                    .css('display', 'none')
                    .attr('role', 'region')
                    .attr('aria-expanded', 'false')
                    .attr('tabindex', '-1');
            var link = $(this).find(".hs_link")
                    .attr('href', '#answer' + i)
                    .attr('role', 'button')
                    .attr('aria-controls', 'answer' + i);
            $(document).keyup(function(e) {
                if (e.keyCode === 27 && !answer.is(':hidden')) {
                    answer.slideUp('slow').show();
                    answer.attr('aria-expanded', 'false');
                    link.text('View Answer');
                }
            });
            link.click(function() {
                if (answer.is(':hidden')) {
                    $(this).text('Hide Answer');
                    answer.show('slow').attr('aria-expanded', 'true').focus();
                } else {
                    $(this).text('View Answer');
                    answer.slideUp('slow');
                }
                return false;
            });
        });
$('.hs_inner_ques li').each(function(i, v) {
            var answer = $(this).find(".answer")
                    .css('display', 'none')
                    .attr('role', 'region')
                    .attr('aria-expanded', 'false')
                    .attr('tabindex', '-1');
var yourspace = $(this).find('.your.space')
.css('display','none')
                    .attr('role', 'region')
                    .attr('aria-expanded', 'false')
                    .attr('tabindex', '-1');
            var link = $(this).find(".hs_link")
                    .attr('href', '#answer' + i)
                    .attr('role', 'button')
                    .attr('aria-controls', 'answer' + i);
            $(document).keyup(function(e) {
                if (e.keyCode === 27 && !answer.is(':hidden')) {
                    answer.slideUp('slow').show();
                    answer.attr('aria-expanded', 'false');
                    link.text('View Question');
                }
            });
            link.click(function() {
                if (answer.is(':hidden')) {
                    $(this).text('Hide Question');
                    answer.show('slow').attr('aria-expanded', 'true').focus();
                } else {
                    $(this).text('View Question');
                    answer.slideUp('slow');
                }
                return false;
            });
        });
    }
    function getURLParameter(name) {

        var urlcom = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        return urlcom;
    }
});