// JavaScript Document
$(document).ready(function () {
    
      // JS for rollover management and navigation
      
      // For each rollover:
      $(".rollovers").each(function(index) {
      
        // Find all items, add ids to each of them (unique to a rollover only) and hide them
        $("div",$(this)).each(function(index) {
          if (!$(this).hasClass("insert")) {
            $(this).attr("data-id",index);
            $(".rolloverlabel",$(this)).attr("data-id",index);
            $(this).hide();
          }
        });
        
        // Create a nav area
        $("h3", $(this)).after('<div class="nav"></div>');

        $(".nav",$(this)).append($(".rolloverlabel",$(this)));
      });
      
      // Create hover action for all rolloverlabels to activate their own id within the rollover
      $(".rolloverlabel").hover(
        function () {
        
          if (!$(this).hasClass("hovering")) {
            $(".rolloverlabel", $(this).parent().parent()).removeClass("hovering");
            $(this).addClass("hovering");
            $("div", $(this).parent().parent()).hide();
            $("div .insert", $(this).parent().parent()).show();
            $(".nav", $(this).parent().parent()).show();
            $('div[data-id="' + $(this).attr("data-id") + '"]', $(this).parent().parent()).fadeIn(200);
          }
        },
        function () {
          //$(this).removeClass("hovering");
          //$('div[data-id="' + $(this).attr("data-id") + '"]', $(this).parent().parent()).hide();
        }      
      );
      
      $(".rolloverlabel").focus(
        function () {
          $(".rolloverlabel", $(this).parent().parent()).removeClass("hovering");
          $("div", $(this).parent().parent()).hide();
          $("div .insert", $(this).parent().parent()).show();
          $(".nav", $(this).parent().parent()).show();
          $(this).addClass("hovering");
          $('div[data-id="' + $(this).attr("data-id") + '"]', $(this).parent().parent()).fadeIn(200);
        } 
      );
      
      $(".rolloverlabel").click(
        function () {
          $(".rolloverlabel", $(this).parent().parent()).removeClass("hovering");
          $("div", $(this).parent().parent()).hide();
          $("div .insert", $(this).parent().parent()).show();
          $(".nav", $(this).parent().parent()).show();
          $(this).addClass("hovering");
          $('div[data-id="' + $(this).attr("data-id") + '"]', $(this).parent().parent()).fadeIn(200);
		  return false;
        } 
      );
      
    });