
function keyCodes() {
    // Define values for keycodes
    this.enter = 13;
    this.space = 32;
    this.left = 37;
    this.up = 38;
    this.right = 39;
    this.down = 40;
}
var keyTest = new keyCodes();
//Used to generate the tab index dynamicly to work wwith mutiple pages and tools
var tabIndexNumber = 0;

function getTabIndex() {
    tabIndexNumber++;
    return tabIndexNumber;
}
intructions = {
    quiz: "Select the answer(s) that best match(es) the question.",
    flashcards: {
        single: "Click \"Flip\" to see the term. ",
        multiple: "View each term then click \"Flip Card\" to see the definition. "},
    glossary: "Click each active letter below for a list of terms.",
    draganddrop: {
        keyboard: "Use \"Tab\" to select the terms and move them to the matching definitions. Use \"Enter\" to select and drop.",
        mouse: "Drag the terms at the bottom to their matching definitions below."},
    bucketdrop: {
        keyboard: "Use \"Tab\" to select the terms and move them to the matching column. Use \"Enter\" to select and drop.",
        mouse: "Drag each of the terms below to the most appropriate column."},
    matching: {
        mouse: "Drag each term from the center column to its corresponding definition on the left or right side.",
        keyboard: "Use the arrow keys to select each term  from the center column and move it to the matching statements. Use \"Enter\" to select and drop."
    },
    timeline: "Roll over each date below for its events. Use the slider at the bottom to adjust the date range. "

};

/*QUIZ VARS*/
//Stores raw quiz HTML to simplify resetting Quiz
var quizHTML = new Array();
/*END VARs*/

/*GLOSSARY VARS*/
var glossaryIndexAray = new Array();
var alphabet = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
var alphaArray = alphabet.split(',');
var glossaryTimerArray = new Array();
var glossaryHTML = new Array();
/*END VARS*/

/*DRAG AND DROP VARS*/
var dragHTML = new Array();
/*END VARS*/

var matchingHTML = new Array();


/*QUIZ SETTINGS*/
var correctColor = "#6F6";
var incorrectColor = "#F66";
var quizAnimationSpeed = 500;
/*END SETTINGS*/

/*FLASHCARD SETTINGS*/
var flashcardAnimationSpeed = 500;
var flashTimerArray = new Array();
var flashHTML = new Array();
/*END SETTINGS*/

/*BUCKET DROP VARS*/
var bucketHTML = new Array();
/*END VARS*/
/*You Decide*/
var scenarioHTML = new Array();

$(document).ready(function (e) {
    setInteractives();
    if (onElementRendered) {
        onElementRendered(".scenario",function(e){$(e).setScenario()});
        onElementRendered(".quiz_holder",function(e){$(e).setQuiz()});
        onElementRendered(".dragdrop",function(e){$(e).setDragDrop()});
        onElementRendered(".matching",function(e){$(e).setMatching()});
        onElementRendered(".flashcard",function(e){$(e).setFlash()});
        onElementRendered(".glossary",function(e){$(e).setGlossary()});
        onElementRendered(".bucket_drop",function(e){$(e).setBucket()});
        onElementRendered(".timeline",function(e){$(e).setTimeline()});
    }
});
/*custom jquery plugins*/


function changeVisiblity() {
    console.log("trigger resize")
    $(window).trigger("resize");
    /*   $("div").children(".flexing:first-child").parent().each(function() {
     console.log("run")
     if (!$(this).hasClass("flex-resized")) {
     $(this).addClass("flex-resized");
     console.log($(this).children().html())
     var sibs = $(this).children(".flexing").length;
     var width = parseInt($(this).css("width"));
     console.log("width: " + width + " Siblings :" + sibs)
     var flexWidth = (width - parseInt($(this).children(".flexing").attr("data-flex-padding"))) / sibs;
     console.log(flexWidth);
     $(this).children(".flexing").css("width", flexWidth + "px");
     if ($(this).children(".flexing").hasClass("match-height")) {
     var lHeight = 0;
     $(this).children(".flexing").each(function() {
     $(this).css("height", "auto");
     var myHeight = $(this).height();
     //console.log(lHeight + " to " + myHeight + " " + $(this).text());
     
     if (myHeight > lHeight)
     lHeight = myHeight;
     });
     $(this).children(".flexing").css("height", (lHeight + 20) + "px");
     }
     }
     
     //console.log("next");
     });
     $("div").children(".match-height").parent().each(function() {
     
     var lHeight = 0;
     $(this).children(".match-height").each(function() {
     $(this).css("height", "auto");
     var myHeight = $(this).height();
     //console.log(lHeight + " to " + myHeight + " " + $(this).text());
     
     if (myHeight > lHeight)
     lHeight = myHeight;
     });
     $(this).children(".match-height").each(function() {
     $(this).css("height", (lHeight + parseInt($(this).attr("data-height-padding"))) + "px");
     });
     
     
     });
     $(".flexing").parent().removeClass("flex-resized");*/
}

function setInteractives() {

    //automaticly adjusts the width of child elements to fit their parent
    $.fn.flexWidth = function (options) {
        var settings = $.extend({
            padding: 100,
            matchHeight: false,
            resize: function () {
            }
        }, options);
        lHeight = 0;
        var $this = this;
        $this.addClass("flexing").attr("data-flex-padding", settings.padding);
        if (settings.matchHeight)
            $this.addClass("match-height")
        resizeFlex();

        function resizeFlex() {
            var sibs = $this.parent().children(".flexing").length;
            var width = parseInt($this.parent().css("width"));
            var flexWidth = (width - settings.padding) / sibs;
            if (settings.matchHeight) {
                lHeight = 0;
                $this.each(function () {
                    $(this).css("height", "auto");
                    myHeight = $(this).height();
                    //console.log(lHeight + " to " + myHeight + " " + $(this).text());

                    if (myHeight > lHeight)
                        lHeight = myHeight;
                });
                $this.css("height", (lHeight + 20) + "px");
            }
            $this.css("width", flexWidth + "px");
            //console.log("next");
            settings.resize();
        }
        setTimeout(resizeFlex, 500);
        $(window).resize(function () {
            resizeFlex();
        });
        return this;
    };

    $.fn.matchHeight = function (options) {
        var settings = $.extend({
            padding: 20,
            resize: function () {
            }
        }, options);
        lHeight = 0;
        var $this = this;
        $this.addClass("match-height")
        $this.addClass("flexing").attr("data-height-padding", settings.padding);
        resizeHeight();

        function resizeHeight() {

            lHeight = 0;
            $this.each(function () {
                $(this).css("height", "auto");
                myHeight = $(this).height();
                //console.log(lHeight + " to " + myHeight + " " + $(this).text());
                if (myHeight > lHeight)
                    lHeight = myHeight;
            });
            $this.css("height", (lHeight + settings.padding) + "px");
            settings.resize();
        }
        setTimeout(resizeHeight, 500);
        $(window).resize(function () {
            resizeHeight();
        });
        return this;
    };

    //randomize children 
    $.fn.randomize = function (childElem, beforeElem) {
        return this.each(function () {
            var $this = $(this);
            var elems = $this.children(childElem);
            elems.sort(function () {
                return (Math.round(Math.random()) - 0.5);
            });
            $this.remove(childElem);
            if (typeof beforeElem === 'undefined') {
                for (var i = 0; i < elems.length; i++)
                    $this.append(elems[i]);
            } else {
                for (var i = 0; i < elems.length; i++)
                    $(elems[i]).insertBefore($(this).children(beforeElem));
            }

        });
    };
    //load the content of a div or data passed in to a modal window(popup in IE) to be printed
    $.fn.printElement = function (data) {
        if (data === undefined)
            data = $(this).html();

        var contentString = '<!doctype html><html><head><title>Print</title><link rel="stylesheet" type="text/css" href="css/study-tools-main.css"><link rel="stylesheet" type="text/css" href="css/animate-custom.css"><link href="css/start/jquery-ui-1.10.3.custom.css" rel="stylesheet"></head><body ><dic class="print_layout">' + data + '</div></body></html>';
        if (!window.ActiveXObject) {
            $("<div>", {
                id: "print_holder"
            }).appendTo($(this));
            $("<iframe/>", {
                id: "print_window",
                width: "100%",
                height: "100%",
                html: contentString
            }).appendTo($("#print_holder"));
            //$("#print_window").contents().append(contentString);
            $("#print_holder").dialog({
                height: 400,
                width: 800,
                modal: true,
                close: function () {
                    $(this).dialog("close");
                    $("#print_window").remove();
                },
                buttons: [{
                        text: "Ok",
                        click: function () {
                            $(this).dialog("close");
                            $("#print_window").remove();
                        }
                    }]
            });
            mywindow = document.getElementById("print_window");
            mywindow = (mywindow.contentWindow) ? mywindow.contentWindow : (mywindow.contentDocument.document) ? mywindow.contentDocument.document : mywindow.contentDocument;
            mywindow.document.write(contentString);
            //fix Firefox continous load glitch
            setTimeout(function () {

                mywindow.window.stop();

            }, 500);
            setTimeout(function () {
                mywindow.print();
            }, 500);
        } else {
            mywindow = window.open('', 'Print', 'width=800, height=800, scrollbars=yes, status=no');
            mywindow.document.write(contentString);
            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
        }


        return this;
    };
    /*   //allows ofr editing content of an element
     $.fn.makeEditable = function() {
     
     bindClick = function(element, html) {
     
     $(element).html(html);
     setTimeout(function() {
     $(element).bind("click", edit);
     }, 100);
     
     };
     edit = function() {
     $(this).unbind("click");
     var cont = $(this).html();
     $(this).empty();
     $(this).append("<textarea class='editing'></textarea><button class='save_editing'>Save</button><button class='cancel_editing'>Cancel</button>");
     $(this).children(".save_editing").button({
     icons: {
     primary: "ui-icon-check"
     },
     text: false
     });
     $(this).children(".cancel_editing").button({
     icons: {
     primary: "ui-icon-cancel"
     },
     text: false
     });
     
     $(this).children(".editing").val(cont);
     
     $(this).children(".save_editing").bind("click", function() {
     var ret = $(this).parent().children(".editing").val();
     bindClick($(this).parent(), ret);
     });
     $(this).children(".cancel_editing").click(function() {
     bindClick($(this).parent(), cont);
     });
     };
     
     
     
     $(this).bind("click", edit);
     return this;
     };*/

    /*QUIZ*/
    //Randomize the question order

    //populate all quizes on the page
    $.fn.setQuiz = function (options) {

        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    $(this).html($(this).find(".original-html").html());
            });

        } else {

            var settings = $.extend({}, options);


            return this.each(function (quizindex, quiz_holder) {
                //store the original HTML in an array for later
                try {
                    ga('send', 'event', 'TYK', 'QuizDrawn', $(quiz_holder).attr("title"));

                } catch (e) {
                    try {
                        console.log(e)
                    } catch (e) {

                    }
                }
                ;
                $(quiz_holder).attr("id", "quiz" + quizindex);
                $(quiz_holder).data("index", quizindex);

                quizHTML[quizindex] = $(quiz_holder).html();
                $(quiz_holder).append("<div class='original-html' style='display:none;'>" + $(quiz_holder).html() + "</div>");
                //generate quiz for this element
                populateQuiz(quiz_holder);
            });
        }

        function populateQuiz(quiz_holder) {
            if ($(quiz_holder).find(".cw-custom-instructions").length > 0)
                var instruction = $(quiz_holder).find(".cw-custom-instructions").html();
            else
                var instruction = intructions.quiz;
            $(quiz_holder).find(".cw-custom-instructions").remove();
            //randomize quiz and answer
            $(quiz_holder).randomize('.quiz');
            $(quiz_holder).children(".quiz").randomize(".answer");
            //Add the title bar to the quiz
            $(quiz_holder).prepend("<div class='quiz_head'><h3>" + $(quiz_holder).attr("title") + "</h3><div class='quiz_print'>Print</div><br><br><div class='tyk-instructions'>" + instruction + "</div></div>");
            //Add a div to display the results after quiz is complete	
            $(quiz_holder).append("<div class='results hidden'><div tabindex='" + getTabIndex() + "' class='quiz_reset nav_button'>Reset</div></div>");
            //Cycle through the childeren of each quiz to allow multiple quizes on one page that behave independantly
            $(quiz_holder).children(".quiz_head").children(".quiz_print").button();
            //bind print click event
            $(quiz_holder).children(".quiz_head").children(".quiz_print").click(function () {
                //PRINTING
                //retrieve original html and put it in a hidden element
                try {
                    ga('send', 'event', 'TYK', 'QuizPrint', $(quiz_holder).attr("title"));
                } catch (e) {
                }
                ;
                var quizID = $(quiz_holder).data("index");
                $("<div class='print_out hidden'/>").appendTo($(quiz_holder));
                $(quiz_holder).children(".print_out").html(quizHTML[(parseInt(quizID))]);
                //add correct answer index at bottom
                var correct_answers = "<div class='quiz_key'>";
                //cycle though questions and retrive correct answer for each
                $(quiz_holder).children(".print_out").children(".quiz").each(function (quiz_print_index, print_quiz) {
                    correct_answers += (quiz_print_index + 1) + ":";
                    $(print_quiz).children(".question").css("font-weight", "bold").prepend("<br>" + (quiz_print_index + 1) + ". ");
                    $(print_quiz).children(".answer").css("padding-left", "2em").each(function (print_a_index, print_a) {
                        $(print_a).prepend(alphaArray[print_a_index] + ") ");
                        if ($(print_a).hasClass("correct")) {
                            correct_answers += alphaArray[print_a_index] + ", ";
                        }
                    });

                });
                correct_answers += "</div>";
                //store content of the hidden print div then remove it
                var print_string = $(quiz_holder).children(".print_out").html();
                $(quiz_holder).children(".print_out").remove();
                //load print content with .printElement() plugin
                $(quiz_holder).printElement("<div class='quiz_head'><h3>" + $(quiz_holder).attr("title") + "</h3></div>" + print_string + correct_answers);
            });
            $(quiz_holder).children(".quiz").each(function (i, e) {
                //hide all quiz questions
                $(e).addClass("hidden");
                //wrap wrap each question in a holder for formatting
                $(e).wrapInner("<div class='question_holder'/>");
                //Add status line to the quiz question
                $(e).prepend("<div class='quiz_stats'><span class='num_question'><p>Question " + (i + 1) + " of " + $(quiz_holder).children(".quiz").length + "</p></span><span class='num_correct'></span></div>");
                //Wrap the answer test in <p> tags
                $("<form />", {
                    "id": "question_" + (i + 1)
                }).appendTo($(e).children('.question_holder'));
                //setup each answer
                $(e).children('.question_holder').children(".answer").each(function (ai, ae) {
                    //find number of correct answers to determin if the question should be mutiple-choice or multiple-answer
                    var i_type = $(e).children('.question_holder').children(".correct").length > 1 ? "checkbox" : "radio";
                    //find if answer is correct
                    var i_value = $(ae).hasClass("correct") ? "correct" : "incorrect";
                    //append answer to answer_holder, <span class='letter_num'>" + alphaArray[ai] + ")</span> - adds leter index to answer
                    $(e).children('.question_holder').children("#question_" + (i + 1)).append("<label><input tabindex='" + getTabIndex() + "' type='" + i_type + "' name='question_" + i + "' id ='answer_" + (i + 1) + "_" + (ai + 1) + "' value='" + i_value + "'><div><span class='letter_num'>" + alphaArray[ai] + ")</span> " + $(ae).html() + "</div></label>");

                });
                //remove original answer element
                $(e).children('.question_holder').children(".answer").remove();
                //Add the navigation button to the bottom of the question
                $(e).append("<br><div class='quiz_nav quiz_submit nav_button' tabindex='" + getTabIndex() + "'>Submit</div>");
                //initialize buttons in jquery UI
                $(".nav_button").button();
                //submit the current answer
                $(e).children(".quiz_submit").click(function (e) {
                    submitQuiz($(this));
                });
                //use "Enter" key to submit
                $(e).children(".quiz_submit").bind('keypress', function (e) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    if (code === 13 && $(this).is(":focus")) {
                        submitQuiz($(this));
                    }
                });
                //if question has multiple answers check to see if any are not selected and increment incorrect
                var submitQuiz = (function (button) {
                    //verify an answer is selected
                    if ($(button).parent().children('.question_holder').children("form").children("label").children("input").is(":checked")) {
                        var incorrect = 0;
                        var incorrectInputs = new Array();
                        var correctInputs = new Array();
                        $(button).parent().children('.question_holder').children("form").children("label").each(function (submitIndex, submitAnswer) {

                            if ($(submitAnswer).children("input[value=correct]").length > 0) {
                                correctInputs.push($(submitAnswer));
                                if (!$(submitAnswer).children("input[value=correct]").is(":checked")) {
                                    incorrect++;
                                }
                            } else {
                                if ($(submitAnswer).children("input").is(":checked")) {
                                    incorrect++;
                                    $(submitAnswer).css("background", incorrectColor);
                                }
                            }
                        });
                        if (incorrect > 0) {
                            var correct = "";
                            for (var j = 0; j < correctInputs.length; j++) {
                                if (j > 0) {
                                    correct += (j + 1 < correctInputs.length ? ", " : " and ");
                                }
                                correct += $(correctInputs[j]).text()[0];
                                $(correctInputs[j]).css("background", correctColor);
                            }
                            $(e).append("<div class='popup'>" + (j > 1 ? "The Correct Answers are " : "The Correct Answer is ") + correct + "</div>");
                        } else {
                            $(e).addClass("CA");
                            $(e).append("<div class='popup'>That is correct</div>");
                            $(correctInputs).each(function (cii, cie) {
                                $(cie).css("background", correctColor);
                            });
                        }
                        $(e).children(".popup").dialog({
                            height: "auto",
                            modal: true,
                            buttons: {
                                Ok: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });

                        //if selected answer is correct and all correct answers are correct
                        $(button).parent().children(".quiz_stats").children(".num_correct").html("<p>   " + $(quiz_holder).children(".CA").length + " of " + (i + 1) + " correct</p>");
                        incorrect = 0;
                        //all questions except the last one.
                        if ((i + 1) < $(e).parent(".quiz_holder").children(".quiz").length) {
                            //Change label on button to "Next"
                            $(button).children("span").html("Next");
                            //Add nect question click function
                            $(button).unbind('click').click(function (e) {
                                nextPage($(this));
                            });
                            $(button).unbind('keypress').bind('keypress', function (e) {
                                var code = (e.keyCode ? e.keyCode : e.which);
                                if (code === 13 && $(this).is(":focus")) {
                                    nextPage($(this));
                                }
                            });
                            //animate page transitions
                            var nextPage = (function (next) {

                                $(next).parent(".quiz").addClass("hidden", quizAnimationSpeed);
                                $(next).parent(".quiz").next(".quiz").children(".quiz_stats").children(".num_correct").html("   " + $(quiz_holder).children(".CA").length + " of " + (i + 1) + " correct");
                                $(next).parent(".quiz").next(".quiz").removeClass("hidden", quizAnimationSpeed);
                                $(next).parent(".quiz").next(".quiz").children(".question").focus();
                            });
                        } else {
                            //Change label on button to finish
                            $(button).children("span").html("Finish");
                            //display Stats Page after final question
                            $(button).unbind('click').click(function (e) {
                                finish($(this));
                            });
                            $(button).unbind('keypress').bind('keypress', function (e) {
                                var code = (e.keyCode ? e.keyCode : e.which);
                                if (code === 13 && $(this).is(":focus")) {
                                    finish($(this));
                                }
                            });

                            var finish = (function (next) {
                                try {
                                    ga('send', 'event', 'TYK', 'QuizFinished', $(quiz_holder).attr("title"));

                                } catch (e) {
                                }
                                ;
                                $(button).parent(".quiz").addClass("hidden", quizAnimationSpeed);
                                $(button).parent(".quiz").next(".results").removeClass("hidden", quizAnimationSpeed, function () {
                                    $(quiz_holder).children('.results').children(".quiz_reset").focus();
                                });
                                //Feedback on student performance
                                $(button).parent(".quiz").next(".results").prepend("<div class='correct_answer_disp'>You Answered " + $(quiz_holder).children(".CA").length + " of " + $(quiz_holder).children(".quiz").length + " Questions Correctly!</div><div class='average_disp'>That is an Average of " + (parseInt(($(quiz_holder).children(".CA").length / $(quiz_holder).children(".quiz").length) * 100)) + "%");
                                try {
                                    ga('send', 'event', 'TYK', 'QuizScore', $(quiz_holder).attr("title"), parseInt(($(quiz_holder).children(".CA").length / $(quiz_holder).children(".quiz").length) * 100));
                                } catch (e) {
                                }
                                ;
                            });
                        }
                    }
                });

            });
            //Reset function. Restores the original html to .quiz_holder
            $(quiz_holder).children('.results').children(".quiz_reset").click(function () {
                try {
                    ga('send', 'event', 'TYK', 'QuizDrawn', $(quiz_holder).attr("title"));
                } catch (e) {
                }
                ;
                resetQuiz();
            });
            $(quiz_holder).children('.results').children(".quiz_reset").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    resetQuiz();
                }
            });

            var resetQuiz = (function () {
                var quizID = $(quiz_holder).attr("id");
                $(quiz_holder).html(quizHTML[(parseInt(quizID.substr(quizID.length - 1)))]);
                populateQuiz(quiz_holder);

            });

            //Show the first question
            $(quiz_holder).children(".quiz").first().removeClass("hidden");
            //prevent selection of quiz
            //$(quiz_holder).disableSelection();
        }

    };
    $.fn.setDragDrop = function (options) {
        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    $(this).html($(this).find(".original-html").html());
            });

        } else {

            var settings = $.extend({}, options);
            /*DRAG*/
            return this.each(function (dindex, dragdrop) {
                try {
                    ga('send', 'event', 'TYK', 'DragDrawn', $(dragdrop).attr("title"));
                } catch (e) {
                }
                ;
                $(dragdrop).attr("id", "drag" + dindex);
                $(dragdrop).data("index", dindex);
                dragHTML[dindex] = $(dragdrop).html();
                $(dragdrop).append("<div class='original-html' style='display:none;'>" + $(dragdrop).html() + "</div>");
                populateDrag(dragdrop);
            });
        }
        function populateDrag(dragdrop) {
            $(dragdrop).randomize(".drag_item");
            $(dragdrop).prepend("<div class='drag_head'><h3>" + $(dragdrop).attr("title") + "</h3></div><div tabindex='" + getTabIndex() + "' class='drag_print'>Print</div><div tabindex='" + getTabIndex() + "' class='drag_reset'>Reset</div><div tabindex='" + getTabIndex() + "' class='drag_key'>Use Keyboard</div><div class='drag_results'></div><br><br><div class='tyk-instructions'>" + intructions.draganddrop.mouse + "</div>");
            $(dragdrop).append("<div class='target_holder'></div><div class='drag_holder'></div");
            $(dragdrop).children(".drag_item").each(function (i, target) {
                $(target).data("dragable",true);
                $(target).children(".target").html("<div class='target_slot'>Drop Here</div><div class='target_text'>" + $(target).children(".target").html() + "</div>");
                $(target).children(".target").attr("data-accept", "drop_" + $(target).children(".drag").index(".drag"));
                $(target).children(".drag").addClass("drop_" + $(target).children(".drag").index(".drag"));
                $(target).children(".target").addClass("open_target");
                $(target).children(".target").appendTo($(dragdrop).children(".target_holder"));


            });
            $(dragdrop).children(".target_holder").children(".target").each(function (index, element) {
                $(element).children(".target_slot").droppable({
                    hoverClass: "target_hovered",
                    drop: function (event, ui) {
                        if (ui.draggable.hasClass($(this).parent().attr("data-accept"))) {
                            ui.draggable.addClass('correct');
                            ui.draggable.draggable('disable');
                            $(this).droppable('disable');
                            ui.draggable.position({
                                of: $(this),
                                my: 'left top',
                                at: 'left top'
                            });
                            ui.draggable.draggable('option', 'revert', false);
                            if ($(dragdrop).children(".drag_holder").children(".drag").length === $(dragdrop).children(".drag_holder").children(".correct").length) {
                                $(dragdrop).children(".drag_results").html("Good Job!");
                                try {
                                    ga('send', 'event', 'TYK', 'DragFinished', $(dragdrop).attr("title"));
                                } catch (e) {
                                }
                                ;
                            }
                        }
                    }
                });
            });
            $(dragdrop).children(".drag_item").children(".drag").appendTo($(dragdrop).children(".drag_holder"));

            $(dragdrop).children(".drag_holder").children(".drag").draggable({
                revert: true,
                containment: $(dragdrop),
                stack: ".dragdrop .drag",
                start: function (event, ui) {
                    $(this).addClass("dragging");
                },
                stop: function (event, ui) {
                    $(this).removeClass("dragging");
                }
            });
            $(dragdrop).children(".drag_holder").randomize(".drag");
            //$(dragdrop).children(".drag_holder").disableSelection();
            //Reset function. Restores the original html to .quiz_holder
            $(dragdrop).children(".drag_reset").button();
            $(dragdrop).children(".drag_reset").click(function () {
                var dragID = $(dragdrop).data("index");
                $(dragdrop).html(dragHTML[(parseInt(dragID))]);
                populateDrag(dragdrop);

            });
            $(dragdrop).children(".drag_print").button().click(function () {
                var dragID = $(dragdrop).data("index");
                $(dragdrop).printElement("<div class='drag_head'><h3>" + $(dragdrop).attr("title") + "</h3></div>" + dragHTML[(parseInt(dragID))]);
            });
            $(dragdrop).children(".drag_key").button().click(function () {
                var dragID = $(dragdrop).attr("id");
                $(dragdrop).html(dragHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
                populateKeyboardDrag(dragdrop);

            });
            $(".dragdrop .ui-button").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });

        }

        function populateKeyboardDrag(dragdrop) {
            try {
                ga('send', 'event', 'TYK', 'DragKeyboardUsed', $(dragdrop).attr("title"));
            } catch (e) {
            }
            ;
            $(dragdrop).randomize(".drag_item");
            $(dragdrop).prepend("<div class='drag_head'><h3>" + $(dragdrop).attr("title") + "</h3></div><div tabindex='" + getTabIndex() + "' class='drag_mouse'>Use Mouse</div><div tabindex='" + getTabIndex() + "' class='drag_reset'>Reset</div><div tabindex='" + getTabIndex() + "' class='drag_print'>Print</div><div class='drag_results'></div><br><br><div class='tyk-instructions'>" + intructions.draganddrop.keyboard + "</div>");
            $(dragdrop).append("<div class='target_holder'></div><div class='drag_holder'></div");
            $(dragdrop).children(".drag_item").each(function (i, target) {
                $(target).children(".target").html("<div class='target_slot'>Drop Here</div><div class='target_text'>" + $(target).children(".target").html() + "</div>");
                $(target).children(".target").attr("data-accept", "drop_" + $(target).children(".drag").index(".drag"));
                $(target).children(".drag").addClass("drop_" + $(target).children(".drag").index(".drag"));
                $(target).children(".target").addClass("open_target");
                $(target).children(".target").appendTo($(dragdrop).children(".target_holder"));



            });
            $(dragdrop).children(".target_holder").children(".target").attr("tabindex", getTabIndex());
            $(dragdrop).children(".drag_item").children(".drag").appendTo($(dragdrop).children(".drag_holder"));
            $(dragdrop).children(".drag_holder").children(".drag").addClass("grab").addClass("open_grab").attr("tabindex", getTabIndex());

            $(dragdrop).children(".drag_holder").randomize(".drag");
            //$(dragdrop).children(".drag_holder").disableSelection();
            $(dragdrop).children(".drag_holder").children(".grab").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus") && $(dragdrop).children(".drag_holder").children(".grabbed").length < 1) {
                    $(this).attr("data-original_left", $(this).offset().left);
                    $(this).attr("data-original_top", $(this).offset().top);
                    $(this).css("left", $(this).offset().left + "px");
                    $(this).css("top", $(this).offset().top + "px");
                    $(this).addClass("grabbed");
                    $("<div class='ph active'></div>").css("width", $(this).css("width")).css("height", $(this).css("height")).insertAfter($(this));

                    $(dragdrop).children(".target_holder").children(".open_target").first().focus();
                }
            });
            $(dragdrop).children(".target_holder").children(".target").focus(function () {
                $(dragdrop).children(".drag_holder").children(".grabbed").css("left", ($(this).children(".target_slot").offset().left - 2) + "px").css("top", ($(this).children(".target_slot").offset().top - 2) + "px");
                $(dragdrop).children(".target_holder").children(".target").bind('keypress', function (e) {
                    var accept = $(this).attr("data-accept");
                    var code = (e.keyCode ? e.keyCode : e.which);
                    if (code === 13 && $(this).is(":focus")) {
                        if ($(dragdrop).children(".drag_holder").children(".grabbed").hasClass(accept)) {
                            $(dragdrop).children(".drag_holder").children(".grabbed").addClass('correct').removeClass("grabbed").removeClass("open_grab").attr("tabindex", -1);
                            $(dragdrop).children(".drag_holder").children(".active").removeClass("active");
                            $(this).attr("tabindex", -1);
                            $(this).removeClass("open_target");
                            if ($(dragdrop).children(".drag_holder").children(".drag").length === $(dragdrop).children(".drag_holder").children(".correct").length) {
                                $(dragdrop).children(".drag_results").html("Good Job!");
                                try {
                                    ga('send', 'event', 'TYK', 'DragFinished', $(dragdrop).attr("title"));
                                } catch (e) {
                                }
                                ;
                            }
                            //console.log($(dragdrop).children(".drag_holder").children("open_grab").first());
                        } else {
                            $(dragdrop).children(".drag_holder").children(".grabbed").css("left", $(dragdrop).children(".drag_holder").children(".grabbed").attr("data-original_left") + "px");
                            $(dragdrop).children(".drag_holder").children(".grabbed").css("top", $(dragdrop).children(".drag_holder").children(".grabbed").attr("data-original_top") + "px");
                            setTimeout(function () {
                                $(dragdrop).children(".drag_holder").children(".active").remove();
                                $(dragdrop).children(".drag_holder").children(".grabbed").removeClass("grabbed");
                            }, 400);
                        }
                        $(dragdrop).children(".drag_holder").children(".open_grab").first().focus();
                    }
                });
            });
            //Reset function. Restores the original html to .quiz_holder
            $(dragdrop).children(".drag_reset").button();
            $(dragdrop).children(".drag_reset").click(function () {
                var dragID = $(dragdrop).attr("id");
                $(dragdrop).html(dragHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
                populateDrag(dragdrop);

            });
            $(dragdrop).children(".drag_print").button();

            $(dragdrop).children(".drag_print").click(function () {
                try {
                    ga('send', 'event', 'TYK', 'DragPrint', $(dragdrop).attr("title"));
                } catch (e) {
                }
                ;
                var dragID = $(dragdrop).attr("id");
                $(dragdrop).printElement("<div class='drag_head'><h3>" + $(dragdrop).attr("title") + "</h3></div>" + dragHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
            });
            $(dragdrop).children(".drag_mouse").button();
            $(dragdrop).children(".drag_mouse").click(function () {
                var dragID = $(dragdrop).attr("id");
                $(dragdrop).html(dragHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
                populateDrag(dragdrop);

            });
            $(".dragdrop .ui-button").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });
            $(dragdrop).children(".drag_holder").children(".grab").first().focus();

        }
    };

    /*FLASH CARDS*/
    /*
     //Generate additiona html needed to diplay as a flash card
     $.fn.setFlash = function(options) {
     if (options === "disable") {
     return this.each(function(quizindex, quiz_holder) {
     if ($(this).find(".original-html").length > 0)
     $(this).html($(this).find(".original-html").html());
     });
     
     } else {
     
     var settings = $.extend({}, options);
     return this.each(function(flashindex, flashcard) {
     try {
     ga('send', 'event', 'TYK', 'FlashcardsDrawn', $(flashcard).attr("title"));
     } catch (e) {
     }
     ;
     $(flashcard).attr("id", "quiz" + flashindex);
     $(flashcard).data("index", flashindex);
     flashHTML[flashindex] = $(flashcard).html();
     $(flashcard).append("<div class='original-html' style='display:none;'>" + $(flashcard).html() + "</div>");
     populateFlash(flashcard);
     });
     }
     function populateFlash(flashcard) {
     var i = $(flashcard).index('.flashcard');
     flashTimerArray[i] = true;
     $(flashcard).prepend("<div class='flash_head'><h3>" + $(flashcard).attr("title") + "</h3><div tabindex='" + getTabIndex() + "' class='flash_print'>Print</div>" + "<div tabindex='" + getTabIndex() + ($(flashcard).children(".card").length > 1 ? "' class='card_shuffle nav_button'>Shuffle</div></div>" : "</div>"));
     $(flashcard).children(".card").each(function(index, element) {
     $(element).addClass("cardstack");
     
     if ($(flashcard).hasClass("accept_input") || $(element).hasClass("accept_input")) {
     $(element).children(".question").html("<p>" + $(element).children(".question").html() + "</p><textarea tabindex='" + getTabIndex() + "'  class='card_input'></textarea>");
     }
     //Set animations for older browsers if css tranfor 3d is not supported
     if (Modernizr.csstransforms3d) {
     $(element).children(".answer").addClass("back").addClass("animated").addClass("flipOutX");
     $(element).children(".question").addClass("front").addClass("animated").addClass("flipInX");
     $(element).addClass("animated").addClass("rollOutR").addClass("hidden");
     } else {
     $(element).children(".answer").addClass("back").hide();
     $(element).children(".question").addClass("front").show();
     $(element).hide();
     }
     
     // $(element).wrapInner("<div class='card_holder' />");
     //;
     });
     if ($(flashcard).children(".card").length > 1)
     $("<div class='card_count'>Card 1 of " + $(flashcard).children(".card").length + "</div><div class='tyk-instructions'>" + intructions.flashcards.multiple + "</div><div tabindex='" + getTabIndex() + "' class='card_prev nav_button'></div><div tabindex='" + getTabIndex() + "' class='card_flip nav_button'>Flip Card</div><div tabindex='" + getTabIndex() + "' class='card_next nav_button'></div>").insertAfter($(flashcard).find(".flash_head"));
     else
     $(flashcard).append("<br><br><div class='tyk-instructions'>" + intructions.flashcards.single + "</div><div tabindex='" + getTabIndex() + "' class='card_flip nav_button'>Flip</div>");
     
     
     $(flashcard).children(".nav_button").disableSelection();
     $(flashcard).children(".card").first().removeClass("rollOutR").removeClass("hidden").show().addClass("active_card");
     $(flashcard).children(".card").children(".card_prev").first().hide();
     $(flashcard).children(".card").addClass("animated");
     $(flashcard).children(".card").children(".card_next").last().hide();
     
     
     
     $(flashcard).children(".flash_print").click(function() {
     try {
     ga('send', 'event', 'TYK', 'FlashcardsPrint', $(flashcard).attr("title"));
     } catch (e) {
     }
     ;
     var flashID = $(flashcard).data("index");
     $(flashcard).printElement("<div class='flash_print_layout'><div class='flash_head'><h3>" + $(flashcard).attr("title") + "</h3></div>" + flashHTML[(parseInt(flashID))] + "</div>");
     });
     //Add interactivity
     $(flashcard).children(".card_flip").click(function(e) {
     try {
     ga('send', 'event', 'TYK', 'FlashcardsFlipped', $(flashcard).attr("title"));
     } catch (e) {
     }
     ;
     if (Modernizr.csstransforms3d) {
     $(this).parent().children(".active_card").children().toggleClass("flipInX").toggleClass('flipOutX');
     $(this).parent().children(".active_card").children("flipInX").focus();
     } else {
     $(this).parent().children(".active_card").children().stop(true, true).toggle("blind", {}, 500);
     $(this).parent().children(".active_card").children(":visible").focus();
     }
     });
     $(flashcard).children(".card_next").click(function(e) {
     try {
     ga('send', 'event', 'TYK', 'FlashcardsChanged', $(flashcard).attr("title"));
     } catch (e) {
     }
     ;
     if (flashTimerArray[i]) {
     setTimeout(function() {
     flashTimerArray[i] = true;
     }, 500);
     flashTimerArray[i] = false;
     var last = $(this).parent().children(".active_card");
     var next;
     var cardIndex = $(last).index(".card") - $(this).parent().children('.card').first().index(".card");
     if (cardIndex >= $(flashcard).children(".card").length - 1) {
     next = $(this).parent().children(".card").first();
     } else {
     next = $(this).parent().children(".active_card").next('.card');
     }
     $(this).parent().children(".card_count").html("Card " + ($(next).index(".card") + 1 - $(this).parent().children('.card').first().index(".card")) + " of " + $(flashcard).children(".card").length);
     if (Modernizr.csstransforms3d) {
     $(last).removeClass("rollInR").removeClass("rollInL").removeClass('active_card').addClass("rollOutR");
     $(next).removeClass("rollOutR").removeClass("rollOutL").removeClass("hidden").addClass('active_card').addClass("rollInR");
     setTimeout(function() {
     hideCards();
     $(this).parent().children(".active_card").children("flipInX").focus();
     }, 500);
     } else {
     $(last).removeClass('active_card').hide("drop", {
     complete: function() {
     $(next).addClass('active_card').show("drop", {}, 500);
     $(this).parent().children(".active_card").children(":visible").focus();
     }
     }, 500);
     
     }
     }
     
     
     });
     
     
     $(flashcard).children(".card_prev").click(function(e) {
     try {
     ga('send', 'event', 'TYK', 'FlashcardsChanged', $(flashcard).attr("title"));
     } catch (e) {
     }
     ;
     if (flashTimerArray[i]) {
     setTimeout(function() {
     flashTimerArray[i] = true;
     }, 500);
     flashTimerArray[i] = false;
     var last = $(this).parent().children(".active_card");
     var next;
     var cardIndex = $(last).index(".card") - $(this).parent().children('.card').first().index(".card");
     if (cardIndex < 1) {
     next = $(this).parent().children(".card").last();
     } else {
     next = $(this).parent().children(".active_card").prev(".card");
     }
     $(this).parent().children(".card_count").html("Card " + ($(next).index(".card") + 1 - $(this).parent().children('.card').first().index(".card")) + " of " + $(flashcard).children(".card").length);
     if (Modernizr.csstransforms3d) {
     $(last).removeClass("rollInL").removeClass("rollInR").removeClass('active_card').addClass("rollOutL");
     $(next).removeClass("rollOutR").removeClass("rollOutL").removeClass("hidden").addClass("rollInL").addClass('active_card');
     setTimeout(function() {
     hideCards();
     $(this).parent().children(".active_card").children("flipInX").focus();
     }, 500);
     } else {
     $(last).removeClass('active_card').hide("drop", {
     complete: function() {
     $(next).addClass('active_card').show("drop", {}, 500);
     $(this).parent().children(".active_card").children(":visible").focus();
     }
     }, 500);
     
     }
     }
     
     });
     var hideCards = (function() {
     $(flashcard).children(".card:not('.active_card')").addClass("hidden");
     });
     $(flashcard).children(".card_shuffle").click(function(e) {
     try {
     ga('send', 'event', 'TYK', 'FlashcardsShuffle', $(flashcard).attr("title"));
     } catch (e) {
     }
     ;
     $(this).parent(".flashcard").randomize(".card");
     $(this).parent(".flashcard").children(".card").each(function(index, element) {
     $(element).parent().children(".card_count").html("Card 1 of " + ($(this).parent().children(".card").length + 1));
     if (Modernizr.csstransforms3d) {
     $(element).removeClass("active_card").removeClass("rollInR").removeClass('rollInL').addClass("rollOutL");
     setTimeout(function() {
     hideCards();
     $(this).parent().children(".active_card").children("flipInX").focus();
     }, 500);
     } else {
     $(element).removeClass("active_card").hide();
     $(this).parent().children(".active_card").children(":visible").focus();
     }
     });
     $(flashcard).children(".nav_button").hide();
     if (Modernizr.csstransforms3d) {
     $(this).parent(".flashcard").children(".card").first().removeClass("rollOutL").removeClass("rollOutR").addClass("rollInL").removeClass("hidden").addClass('active_card');
     $(this).parent(".flashcard").children(".card").children(".answer").addClass("flipOutX").removeClass("flipInX");
     $(this).parent(".flashcard").children(".card").children(".question").addClass("flipInX").removeClass("flipOutX");
     setTimeout(function() {
     hideCards();
     }, 500);
     } else {
     $(this).parent(".flashcard").children(".card").first().addClass('active_card').show("drop", {}, 500);
     $(this).parent(".flashcard").children(".card").children(".answer").hide();
     $(this).parent(".flashcard").children(".card").children(".question").show();
     }
     
     
     });
     }
     ;
     $(".flashcard .ui-button").bind('keypress', function(e) {
     var code = (e.keyCode ? e.keyCode : e.which);
     if (code === 13 && $(this).is(":focus")) {
     $(this).trigger("click");
     }
     });
     };
     */
    $.fn.setFlash = function (options) {
        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    $(this).html($(this).find(".original-html").html());
            });

        } else {

            var settings = $.extend({}, options);
            return this.each(function (flashindex, flashcard) {
                try {
                    ga('send', 'event', 'TYK', 'FlashcardsDrawn', $(flashcard).attr("title"));
                } catch (e) {
                }
                ;
                $(flashcard).attr("id", "quiz" + flashindex);
                $(flashcard).data("index", flashindex);
                flashHTML[flashindex] = $(flashcard).html();
                $(flashcard).append("<div class='original-html' style='display:none;'>" + $(flashcard).html() + "</div>");
                populateFlash(flashcard);
            });
        }
        function populateFlash(flashcard) {
            var i = $(flashcard).index('.flashcard');
            flashTimerArray[i] = true;
            $(flashcard).prepend("<div class='flash_head'><h3>" + $(flashcard).attr("title") + "</h3></div><div tabindex='" + getTabIndex() + "' class='flash_print'>Print</div>" + "<div tabindex='" + getTabIndex() + ($(flashcard).children(".card").length > 1 ? "' class='card_shuffle nav_button'>Shuffle</div>" : ""));
            $(flashcard).children(".card").each(function (index, element) {
                $(element).addClass("cardstack");

                if ($(flashcard).hasClass("accept_input") || $(element).hasClass("accept_input")) {
                    $(element).children(".question").html("<p>" + $(element).children(".question").html() + "</p><textarea tabindex='" + getTabIndex() + "'  class='card_input'></textarea>");
                }
                //Set animations for older browsers if css tranfor 3d is not supported
                if (Modernizr.csstransforms3d) {
                    $(element).children(".answer").addClass("back").addClass("animated").addClass("flipOutX");
                    $(element).children(".question").addClass("front").addClass("animated").addClass("flipInX");
                    $(element).addClass("animated").addClass("rollOutR").addClass("hidden");
                } else {
                    $(element).children(".answer").addClass("back").hide();
                    $(element).children(".question").addClass("front").show();
                    $(element).hide();
                }

                // $(element).wrapInner("<div class='card_holder' />");
                //;
            });
            if ($(flashcard).children(".card").length > 1)
                $(flashcard).append("<div class='card_count'>Card 1 of " + $(flashcard).children(".card").length + "</div><div class='tyk-instructions'>" + intructions.flashcards.multiple + "</div><div tabindex='" + getTabIndex() + "' class='card_prev nav_button'>Previous Card</div><div tabindex='" + getTabIndex() + "' class='card_flip nav_button'>Flip Card</div><div tabindex='" + getTabIndex() + "' class='card_next nav_button'>Next Card</div>");
            else
                $(flashcard).append("<br><br><div class='tyk-instructions'>" + intructions.flashcards.single + "</div><div tabindex='" + getTabIndex() + "' class='card_flip nav_button'>Flip</div>");


            $(flashcard).children(".nav_button").button();
            //$(flashcard).children(".nav_button").disableSelection();
            $(flashcard).children(".card").first().removeClass("rollOutR").removeClass("hidden").show().addClass("active_card");
            $(flashcard).children(".card").children(".card_prev").first().button({
                disabled: true
            });
            $(flashcard).children(".card").addClass("animated");
            $(flashcard).children(".card").children(".card_next").last().button({
                disabled: true
            });

            $(flashcard).children(".flash_print").button();

            $(flashcard).children(".flash_print").click(function () {
                try {
                    ga('send', 'event', 'TYK', 'FlashcardsPrint', $(flashcard).attr("title"));
                } catch (e) {
                }
                ;
                var flashID = $(flashcard).data("index");
                $(flashcard).printElement("<div class='flash_print_layout'><div class='flash_head'><h3>" + $(flashcard).attr("title") + "</h3></div>" + flashHTML[(parseInt(flashID))] + "</div>");
            });
            //Add interactivity
            $(flashcard).children(".card_flip").click(function (e) {
                try {
                    ga('send', 'event', 'TYK', 'FlashcardsFlipped', $(flashcard).attr("title"));
                } catch (e) {
                }
                ;
                if (Modernizr.csstransforms3d) {
                    $(this).parent().children(".active_card").children().toggleClass("flipInX").toggleClass('flipOutX');
                    $(this).parent().children(".active_card").children("flipInX").focus();
                } else {
                    $(this).parent().children(".active_card").children().stop(true, true).toggle("blind", {}, 500);
                    $(this).parent().children(".active_card").children(":visible").focus();
                }
            });
            $(flashcard).children(".card_next").click(function (e) {
                try {
                    ga('send', 'event', 'TYK', 'FlashcardsChanged', $(flashcard).attr("title"));
                } catch (e) {
                }
                ;
                if (flashTimerArray[i]) {
                    setTimeout(function () {
                        flashTimerArray[i] = true;
                    }, 500);
                    flashTimerArray[i] = false;
                    var last = $(this).parent().children(".active_card");
                    var next;
                    var cardIndex = $(last).index(".card") - $(this).parent().children('.card').first().index(".card");
                    if (cardIndex >= $(flashcard).children(".card").length - 1) {
                        next = $(this).parent().children(".card").first();
                    } else {
                        next = $(this).parent().children(".active_card").next('.card');
                    }
                    $(this).parent().children(".card_count").html("Card " + ($(next).index(".card") + 1 - $(this).parent().children('.card').first().index(".card")) + " of " + $(flashcard).children(".card").length);
                    if (Modernizr.csstransforms3d) {
                        $(last).removeClass("rollInR").removeClass("rollInL").removeClass('active_card').addClass("rollOutR");
                        $(next).removeClass("rollOutR").removeClass("rollOutL").removeClass("hidden").addClass('active_card').addClass("rollInR");
                        setTimeout(function () {
                            hideCards();
                            $(this).parent().children(".active_card").children("flipInX").focus();
                        }, 500);
                    } else {
                        $(last).removeClass('active_card').hide("drop", {
                            complete: function () {
                                $(next).addClass('active_card').show("drop", {}, 500);
                                $(this).parent().children(".active_card").children(":visible").focus();
                            }
                        }, 500);

                    }
                }


            });


            $(flashcard).children(".card_prev").click(function (e) {
                try {
                    ga('send', 'event', 'TYK', 'FlashcardsChanged', $(flashcard).attr("title"));
                } catch (e) {
                }
                ;
                if (flashTimerArray[i]) {
                    setTimeout(function () {
                        flashTimerArray[i] = true;
                    }, 500);
                    flashTimerArray[i] = false;
                    var last = $(this).parent().children(".active_card");
                    var next;
                    var cardIndex = $(last).index(".card") - $(this).parent().children('.card').first().index(".card");
                    if (cardIndex < 1) {
                        next = $(this).parent().children(".card").last();
                    } else {
                        next = $(this).parent().children(".active_card").prev(".card");
                    }
                    $(this).parent().children(".card_count").html("Card " + ($(next).index(".card") + 1 - $(this).parent().children('.card').first().index(".card")) + " of " + $(flashcard).children(".card").length);
                    if (Modernizr.csstransforms3d) {
                        $(last).removeClass("rollInL").removeClass("rollInR").removeClass('active_card').addClass("rollOutL");
                        $(next).removeClass("rollOutR").removeClass("rollOutL").removeClass("hidden").addClass("rollInL").addClass('active_card');
                        setTimeout(function () {
                            hideCards();
                            $(this).parent().children(".active_card").children("flipInX").focus();
                        }, 500);
                    } else {
                        $(last).removeClass('active_card').hide("drop", {
                            complete: function () {
                                $(next).addClass('active_card').show("drop", {}, 500);
                                $(this).parent().children(".active_card").children(":visible").focus();
                            }
                        }, 500);

                    }
                }

            });
            var hideCards = (function () {
                $(flashcard).children(".card:not('.active_card')").addClass("hidden");
            });
            //Shuffle script
            $(flashcard).children(".card_shuffle").click(function (e) {
                try {
                    ga('send', 'event', 'TYK', 'FlashcardsShuffle', $(flashcard).attr("title"));
                } catch (e) {
                }
                ;
                $(this).parent(".flashcard").randomize(".card");
                $(this).parent(".flashcard").children(".card").each(function (index, element) {
                    $(element).parent().children(".card_count").html("Card 1 of " + ($(this).parent().children(".card").length));
                    if (Modernizr.csstransforms3d) {
                        $(element).removeClass("active_card").removeClass("rollInR").removeClass('rollInL').addClass("rollOutL");
                        setTimeout(function () {
                            hideCards();
                            $(this).parent().children(".active_card").children("flipInX").focus();
                        }, 500);
                    } else {
                        $(element).removeClass("active_card").hide();
                        $(this).parent().children(".active_card").children(":visible").focus();
                    }
                });
                $(flashcard).children(".nav_button").button({
                    disabled: false
                });
                if (Modernizr.csstransforms3d) {
                    $(this).parent(".flashcard").children(".card").first().removeClass("rollOutL").removeClass("rollOutR").addClass("rollInL").removeClass("hidden").addClass('active_card');
                    $(this).parent(".flashcard").children(".card").children(".answer").addClass("flipOutX").removeClass("flipInX");
                    $(this).parent(".flashcard").children(".card").children(".question").addClass("flipInX").removeClass("flipOutX");
                    setTimeout(function () {
                        hideCards();
                    }, 500);
                } else {
                    $(this).parent(".flashcard").children(".card").first().addClass('active_card').show("drop", {}, 500);
                    $(this).parent(".flashcard").children(".card").children(".answer").hide();
                    $(this).parent(".flashcard").children(".card").children(".question").show();
                }


            });
        }
        ;
        $(".flashcard .ui-button").bind('keypress', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code === 13 && $(this).is(":focus")) {
                $(this).trigger("click");
            }
        });
    };

    $.fn.setGlossary = function (options) {
        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    $(this).html($(this).find(".original-html").html());
            });

        } else {

            var settings = $.extend({}, options);
            return this.each(function (gindex, glossary) {
                try {
                    ga('send', 'event', 'TYK', 'GlossaryDrawn', $(glossary).attr("title"));
                } catch (e) {
                    // console.log(a);
                }
                ;
                $(glossary).attr("id", "glossary" + gindex);
                $(glossary).data("index", gindex);
                glossaryHTML[gindex] = $(glossary).html();
                $(glossary).append("<div class='original-html' style='display:none;'>" + $(glossary).html() + "</div>");
                populateGlossary(gindex, glossary);
            });
        }
        function populateGlossary(gindex, glossary) {
            glossaryTimerArray[gindex] = true;
            $(glossary).prepend("<div class='glossary_head'><h3>" + $(glossary).attr("title") + "</h3></div><div tabindex='" + getTabIndex() + "' class='gloss_print'>Print</div><br><br><div class='tyk-instructions'>" + intructions.glossary + "</div><ul class='index_buttons'></ul>");
            alphaArray.forEach(function (letter) {
                $(glossary).children('.index_buttons').append("<li class='" + letter + "_select'>" + letter + "</li>");
            });

            $(glossary).children('.index_buttons').children("li").button({
                disabled: true
            });
            $(glossary).children('.index_buttons').children("li").click(function (e) {
                try {
                    ga('send', 'event', 'TYK', 'GlossaryLetterSelected', $(glossary).attr("title"));
                } catch (e) {
                }
                ;
                if (!$(this).hasClass("ui-state-disabled") && !$(this).hasClass("ui-state-highlight")) {
                    $(this).parent().children("li").removeClass("ui-state-highlight");
                    $(this).addClass("ui-state-highlight");
                    $(glossary).children(".letter_holder").hide(300);

                    if (Modernizr.csstransforms3d) {		$(glossary).children(".letter_holder").children(".term_display").children("div").addClass("bounceOutDown").removeClass("bounceIn");
                    } else {
                        $(glossary).children(".letter_holder").children(".term_display").children("div").hide();
                    }
                    $(glossary).children(".letter_holder").children(".term_display").removeClass("vis_term");
                    $(glossary).children("." + $(this).attr("class")[0] + "_holder").show(1000);
                    $(glossary).children(".letter_holder").children(".term_list").children("div").removeClass("ui-state-highlight");
                }
            });
            $(glossary).children(".gloss_print").button();

            $(glossary).children(".gloss_print").click(function () {
                try {
                    ga('send', 'event', 'TYK', 'GlossaryPrint', $(glossary).attr("title"));
                } catch (e) {
                }
                ;
                var glossID = $(glossary).data("index");
                $(glossary).printElement("<div class='gloss_pring_layout'><div class='glossary_head'><h3>" + $(glossary).attr("title") + "</h3></div>" + glossaryHTML[(parseInt(glossID))] + "</div>");
            });
            var usedLetters = new Array();
            var terms = [];
            $(glossary).children(".term").each(function (tindex, term) {
                var item = {term: $(term).children("p").text().trim(), definition: $(this).find(".definition").html()};
                terms.push(item);
                var t_letter = $(term).children("p").text();
                t_letter = t_letter.replace(/(\r\n|\n|\r)/gm, "").replace(" ", '').trim();
                //alert(usedLetters.indexOf(t_letter[0].toUpperCase()));
                if (t_letter[0] !== undefined) {
                    if (usedLetters.indexOf(t_letter[0].toUpperCase()) < 0) {
                        $(glossary).append("<div class='" + t_letter[0].toUpperCase() + "_holder letter_holder'><div class='term_list'></div><div class='term_display'></div></div>");
                        usedLetters.push(t_letter[0].toUpperCase());
                    }

                    var term_temp = $(term);
                    $(term).remove();
                    $(glossary).children("." + t_letter[0].toUpperCase() + "_holder").children(".term_display").append($(term_temp));
                    $(glossary).children("." + t_letter[0].toUpperCase() + "_holder").children(".term_list").append("<div>" + $(term_temp).children("p").text() + "</div>");
                    $(glossary).children(".index_buttons").children("." + t_letter[0].toUpperCase() + "_select").button("enable");
                }
            });
            terms.sort(sortTermLength);
            function sortTermLength(a, b) {
                return a.term.length < b.term.length;
            }
            $(glossary).data("terms", terms)
            $.each(terms, function (ind, term) {
                inTextCitation(term.term, ind, term.definition);
            })
			
            $(".tyk-inline-def").each(function () {
                if ($(this).find(".tyk-inline-def").length > 0) {
                    $(this).html($(this).text());
                }
            });
			
			//Error after this point
			/*
            $(document).tooltip({items: ".tyk-inline-def", content: function () {
				console.log('inside document tooltip function');
                    var gloss = $(this).attr("data-glossary-index");
					console.log(gloss);
                    var index = gloss.split(",")[1];
					console.log(index);
                    gloss = gloss.split(",")[0]
					console.log(gloss);
                    var terms = $("#" + gloss).data("terms");
					console.log(terms);
                    console.log(terms[index]);
                    return terms[index].definition;
                }});
			*/

            /*   $(".tyk-inline-def").unbind("hover").hover(function(event) {
             $(".tyk-inline-term-display").remove();
             var term = $("<div class='tyk-inline-term-display' style='position:absolute;width:200px;background:#999;padding:12px;border-radius:10px;'><div>" + $(this).attr("data-tyk-definition") + "</div></div>");
             $("body").append(term);
             console.log($(window).height() / 2);
             console.log($(this).position().top - term.height(true)  - 30 + "px")
             if (event.clientY < $(window).height() / 2) {
             term.css("top", $(this).position().top + 30 + "px");
             term.prepend("<div style='position: absolute; width: 20px; height: 20px; background:#999; transform: rotate(45deg); top: -10px; left: 20px;'></div>");
             }else{
             term.css("top", $(this).position().top - term.height()  - 42 + "px");
             term.prepend("<div style='position: absolute; width: 20px; height: 20px; background:#999; transform: rotate(45deg); bottom: -10px; left: 20px;'></div>");
             }
             term.css("left", $(this).position().left + "px");
             }, function() {
             setTimeout(function() {
             $(".tyk-inline-term-display").remove();
             }, 500)
             })*/

            function inTextCitation(term, index, def) {
                var found = false;
                $("p, li").each(function () {
                    if ($(this).parents(".glossary").length === 0) {
                        $(this).contents().each(function (i, v) {

                            if (v.nodeType === 3) {
                                var code = v.textContent;
                                try {
                                    var clean = term.replace(/\([^\),\n]*[\)]*/g, "").replace(/\[[^\),\n]*[\]]*/g, "")
                                    var interm = new RegExp('\\b' + clean + '\\b', "i");
                                    if (code.match(interm) && !found) {

                                        code = code.replace(interm, "<span class='tyk-inline-def' title='"+def+"' data-glossary-index='" + $(glossary).attr("id") + "," + index + "'style='cursor: help;text-decoration: underline;text-shadow: 0 0 2px steelblue;'>" + clean + "</span>");
                                        $(v).replaceWith(code);
                                        found = true;
                                    }
                                } catch (e) {
                                    try{
                                        console.log(e)
                                    }catch(e){}
                                }
                            }
                        })
                    }
                });
            }
			

            function compare(strA, strB) {
                var icmp = strA.toLowerCase().localeCompare(strB.toLowerCase());
                return icmp === 0 ? (strA > strB ? 1 : (
                        strA < strB ? -1 : 0)) : icmp;
            }
            usedLetters = usedLetters.sort(compare);
            for (var j = 0; j < usedLetters.length; j++) {
                //tabindex='" + getTabIndex() +  "' 
                $(glossary).children(".index_buttons").children("." + usedLetters[j].toUpperCase() + "_select").attr("tabindex", getTabIndex());
                $(glossary).children("." + usedLetters[j].toUpperCase() + "_holder").children(".term_list").children("div").attr("tabindex", getTabIndex());
            }
            if (Modernizr.csstransforms3d) {		$(glossary).children(".letter_holder").children(".term_display").children("div").addClass("animated").addClass("ap-term").addClass("bounceOutDown").removeClass("bounceIn");
            } else {
			    $(glossary).children(".letter_holder").children(".term_display").children("div").hide();
            }
            $(glossary).children(".letter_holder").children(".term_list").children("div").button();
            //$(glossary).children(".letter_holder").children(".term_list").children("div").disableSelection();
            $(glossary).children(".letter_holder").children(".term_list").children("div").click(function (e) {
                try {
                    ga('send', 'event', 'TYK', 'GlossaryTermSelected', $(glossary).attr("title"));
                } catch (e) {
					console.log(e);
                }
                ;
                if (glossaryTimerArray[gindex]) {
                    if (!$(this).hasClass("ui-state-highlight")) {
                        setTimeout(function () {
                            glossaryTimerArray[gindex] = true;
                            $(this).parent().parent().children(".term_display").children(".bounceOutDown").hide();
                        }, 1000);
                        glossaryTimerArray[gindex] = false;

                        var childIndex = $(this).index() + 1;
                        if (Modernizr.csstransforms3d) {
                            $(this).parent().parent().children(".term_display").children("div").addClass("bounceOutDown").removeClass("bounceIn").attr("tabindex", -1);

                            $(this).parent().parent().children(".term_display").children("div :nth-child(" + childIndex + ")").show().removeClass("bounceOutDown").addClass("bounceIn").attr("tabindex", ($(this).attr("tabindex")) - 1).focus();
                        } else {
                            $(this).parent().parent().children(".term_display").children("div").hide().attr("tabindex", -1);

                            $(this).parent().parent().children(".term_display").children("div :nth-child(" + childIndex + ")").show().attr("tabindex", ($(this).attr("tabindex")) - 1).focus();
                        }
                        $(this).parent().parent().children(".term_display").addClass("vis_term");
                        $(this).parent().children("div").removeClass("ui-state-highlight");
                        $(this).addClass("ui-state-highlight");
                    }
                }
            });
            $(glossary).children(".letter_holder").hide(1000);
            $(glossary).children(".index_buttons").children("li").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });
            $(glossary).children(".letter_holder").children(".term_list").children("div").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });
        }
    };


    /*BUCKET DRAG*/
    $.fn.setBucket = function (options) {
        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    $(this).html($(this).find(".original-html").html());
            });

        } else {
            var settings = $.extend({}, options);
            return this.each(function (bindex, bucket) {
                $(bucket).attr("id", "bucket" + bindex);
                $(bucket).data("index", bindex);
                bucketHTML[bindex] = $(bucket).html();
                $(bucket).append("<div class='original-html' style='display:none;'>" + $(bucket).html() + "</div>");
                populateBucket(bucket);
            });
        }
        function populateBucket(bucket) {
            $(bucket).prepend("<div class='bucket_head'><h3>" + $(bucket).attr("title") + "</h3><div class='interface'><div tabindex='" + getTabIndex() + "' class='bucket_key'>Use Keyboard</div><div tabindex='" + getTabIndex() + "' class='bucket_reset'>Reset</div><div tabindex='" + getTabIndex() + "' class='bucket_print'>Print</div><div class='bucket_results'></div></div></div><br clear:both;><div class='tyk-instructions'>" + intructions.bucketdrop.mouse + "</div>");
            $(bucket).append("<div class='group_holder'></div><div class='item_holder'></div");
            $(bucket).children(".group").each(function (i, group) {
                $(group).attr("data-accept", "group" + i);
                $(group).children(".item").addClass("group" + i);
                $(group).addClass("open_target");
                $(group).appendTo($(bucket).children(".group_holder"));

                $(group).droppable({
                    hoverClass: "group_hovered",
                    drop: function (event, ui) {
                        if (ui.draggable.hasClass($(this).attr("data-accept"))) {
                            ui.draggable.addClass('correct');
                            ui.draggable.draggable('disable');
                            //$(this).droppable('disable');
                            $("<div class='ph'></div>").css("width", ui.draggable.css("width")).css("height", ui.draggable.css("height")).insertAfter(ui.draggable);
                            $(this).append("<div class='item'>" + ui.draggable.html() + "</div>");
                            ui.draggable.remove();

                            if ($(bucket).children(".item_holder").children(".item").length === $(bucket).children(".drag_holder").children(".correct").length) {
                                $(bucket).children(".bucket_results").html("Good Job!");
                            }
                        }
                    }
                });
            });
            $(bucket).children(".group_holder").children(".group").flexWidth();
            $(bucket).children(".group_holder").children(".group").children(".item").appendTo($(bucket).children(".item_holder"));

            $(bucket).children(".item_holder").children(".item").draggable({
                revert: true,
                containment: $(bucket),
                stack: ".bucket_drop .item",
                start: function (event, ui) {
                    $(this).addClass("dragging");
                },
                stop: function (event, ui) {
                    $(this).removeClass("dragging");
                }
            });
            $(bucket).children(".item_holder").randomize(".item");
            //$(bucket).children(".item_holder").disableSelection();
            //Reset function. Restores the original html to .quiz_holder
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_reset").button();
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_reset").click(function () {
                var bucketID = $(bucket).attr("id");
                $(bucket).html(bucketHTML[(parseInt(bucketID.substr(bucketID.length - 1)))]);
                populateBucket(bucket);

            });
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_print").button();

            $(bucket).children(".bucket_head").children(".interface").children(".bucket_print").click(function () {
                var bucketID = $(bucket).data("index");
                $(bucket).printElement("<div class='bucket_head'><h3>" + $(bucket).attr("title") + "</h3></div>" + bucketHTML[(parseInt(bucketID))]);
            });
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_key").button();
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_key").click(function () {
                var bucketID = $(bucket).attr("id");
                $(bucket).html(bucketHTML[(parseInt(bucketID.substr(bucketID.length - 1)))]);
                populateKeyboardBucket(bucket);

            });
            $(".bucket_drop .ui-button").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });

        }

        function populateKeyboardBucket(bucket) {
            $(bucket).prepend("<div class='bucket_head'><h3>" + $(bucket).attr("title") + "</h3><div class='interface'><div tabindex='" + getTabIndex() + "' class='bucket_mouse'>Use Mouse</div><div tabindex='" + getTabIndex() + "' class='bucket_reset'>Reset</div><div tabindex='" + getTabIndex() + "' class='bucket_print'>Print</div><div class='bucket_results'></div></div></div><br clear:both;><div class='tyk-instructions'>" + intructions.bucketdrop.keyboard + "</div>");
            $(bucket).append("<div class='group_holder'></div><div class='item_holder'></div");
            $(bucket).children(".group").each(function (i, group) {
                $(group).attr("data-accept", "group" + i);
                $(group).children(".item").addClass("group" + i);
                $(group).appendTo($(bucket).children(".group_holder"));

            });
            $(bucket).children(".group_holder").children(".group").flexWidth();
            $(bucket).children(".group_holder").children(".group").attr("tabindex", getTabIndex());
            $(bucket).children(".group_holder").children(".group").children(".item").appendTo($(bucket).children(".item_holder"));
            $(bucket).children(".item_holder").children(".item").addClass("grab").addClass("open_grab").attr("tabindex", getTabIndex());

            $(bucket).children(".item_holder").randomize(".item");
            //$(bucket).children(".item_holder").disableSelection();
            $(bucket).children(".item_holder").children(".grab").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus") && $(bucket).children(".item_holder").children(".grabbed").length < 1) {
                    $(this).attr("data-original_left", $(this).offset().left);
                    $(this).attr("data-original_top", $(this).offset().top);
                    $(this).css("left", $(this).offset().left + "px");
                    $(this).css("top", $(this).offset().top + "px");
                    $(this).addClass("grabbed");
                    $("<div class='ph active'></div>").css("width", $(this).css("width")).css("height", $(this).css("height")).insertAfter($(this));
                    $(bucket).children(".group_holder").children(".group").first().focus();
                }
            });
            $(bucket).children(".group_holder").children(".group").focus(function () {
                $(bucket).children(".item_holder").children(".grabbed").css("left", ($(this).offset().left - 2) + "px").css("top", ($(this).offset().top - 2) + "px");
                $(bucket).children(".group_holder").children(".group").bind('keypress', function (e) {
                    var accept = $(this).attr("data-accept");
                    var code = (e.keyCode ? e.keyCode : e.which);
                    if (code === 13 && $(this).is(":focus")) {
                        if ($(bucket).children(".item_holder").children(".grabbed").hasClass(accept)) {
                            $(this).append("<div class='item'>" + $(bucket).children(".item_holder").children(".grabbed").html() + "</div>");
                            $(bucket).children(".item_holder").children('.active').removeClass('active');
                            $(bucket).children(".item_holder").children(".grabbed").remove();
                            if ($(bucket).children(".item_holder").children(".item").length === $(bucket).children(".item_holder").children(".correct").length) {
                                $(bucket).children(".item_holder").html("Good Job!");
                            }


                        } else {
                            $(bucket).children(".item_holder").children(".grabbed").css("left", $(bucket).children(".item_holder").children(".grabbed").attr("data-original_left") + "px");
                            $(bucket).children(".item_holder").children(".grabbed").css("top", $(bucket).children(".item_holder").children(".grabbed").attr("data-original_top") + "px");
                            setTimeout(function () {
                                $(bucket).children(".item_holder").children(".grabbed").removeClass("grabbed");
                                $(bucket).children(".item_holder").children('.active').remove();
                            }, 400);
                        }
                        $(bucket).children(".item_holder").children(".open_grab").first().focus();
                    }
                });
            });
            //Reset function. Restores the original html to .quiz_holder
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_reset").button();
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_reset").click(function () {
                var bucketID = $(bucket).attr("id");
                $(bucket).html(bucketHTML[(parseInt(bucketID.substr(bucketID.length - 1)))]);
                populateKeyboardBucket(bucket);

            });
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_print").button();

            $(bucket).children(".bucket_head").children(".interface").children(".bucket_print").click(function () {
                var bucketID = $(bucket).attr("id");
                $(bucket).printElement("<div class='bucket_head'><h3>" + $(bucket).attr("title") + "</h3></div>" + bucketHTML[(parseInt(bucketID.substr(bucketID.length - 1)))]);
            });
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_mouse").button();
            $(bucket).children(".bucket_head").children(".interface").children(".bucket_mouse").click(function () {
                var bucketID = $(bucket).attr("id");
                $(bucket).html(bucketHTML[(parseInt(bucketID.substr(bucketID.length - 1)))]);
                populateBucket(bucket);

            });
            $(".bucket_drop .ui-button").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });
            $(bucket).children(".item_holder").children(".grab").first().focus();

        }
    };

    $.fn.setScenario = function (options) {
        var resizeInterval = new Array();


        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    for (var i = resizeInterval.length - 1; i >= 0; i--) {
                        //console.log("clear " + i)
                        clearInterval(resizeInterval[i]);
                        resizeInterval.pop();
                    }

                $(this).html($(this).find(".original-html").html());
            });

        } else {

            var settings = $.extend({}, options);

            return this.each(function (si, scenario) {
                $(scenario).append("<div class='original-html' style='display:none;'>" + $(scenario).html() + "</div>");
                $(scenario).prepend("<div class='scenario_head'><h3>" + ($(scenario).attr("title") !== undefined ? $(scenario).attr("title") : "You Decide") + "</h3></div>");
                $(scenario).attr("tabindex", "0").find("*").attr("tabindex", "-1");
                // if ($(scenario).children(".desc").length > 0) {
                $(scenario).children(".page").each(function (i, pageElement) {
                    scenarioHTML.push($(pageElement).html());
                    $(pageElement).data("index", i);
                    $(pageElement).data("flow-tab", "flow-tab-" + i);
                    $(pageElement).addClass("scenario-page-" + i);
                    var label = ""//$(pageElement).children(".label").html() === null ? "" : $(pageElement).children(".label").html();
                    $(scenario).children(".scenario_head").append("<div class='flow flow-tab-" + i + "' data-scenario-page='scenario-page-" + i + "' >" + $(pageElement).attr("title") + "<div class='label'>" + label + "</div></div>");
                    renderPage($(pageElement));
                });
                $(scenario).children(".scenario_head").children(".flow").flexWidth({
                    padding: 5,
                    matchHeight: true,
                    resize: function () {
                        $(scenario).children(".scenario_head").children(".flowframe").css("width", $(scenario).children(".scenario_head").children(".flow.active").css("width")).css("height", $(scenario).children(".scenario_head").children(".flow.active").css("height"));
                        if ($(scenario).children(".scenario_head").children(".flow.active").length > 0) {
                            $(scenario).children(".scenario_head").children(".flowframe").css("left", $(scenario).children(".scenario_head").children(".flow.active").position().left + "px");
                            $(scenario).children(".scenario_head").children(".flowframe").css("top", $(scenario).children(".scenario_head").children(".flow.active").position().top + "px");
                        }
                    }
                });
                $(scenario).children(".scenario_head").append("<div class='flowframe'></div>");
                $(scenario).children(".scenario_head").children(".flowframe").css("width", $(scenario).children(".scenario_head").children(".flow").first().css("width")).css("height", $(scenario).children(".scenario_head").children(".flow").first().css("height"));
                $(scenario).children(".scenario_head").children(".flowframe").css("top", $(scenario).children(".scenario_head").children(".flow").first().position().top + "px").css("left", $(scenario).children(".scenario_head").children(".flow").first().position().left + "px");
                // }
                $(scenario).append('<div class="nav-prev-page"></div><div class="nav-next-page"></div>');
                $(scenario).children(".nav-prev-page").bind("click", function () {
                    //$(scenario).children(".scenario_head").children(".flow").unbind("click");
                    var next = $(scenario).children(".page[aria-hidden='false']").prev(".page");
                    nextPage(next);
                });
                $(scenario).children(".nav-next-page").bind("click", function () {

                    var next = $(scenario).children(".page[aria-hidden='false']").next(".page");
                    nextPage(next);
                });
                $(scenario).bind('keydown', function (e) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    if (code === keyTest.left) {
                        //if ($(this).children(".scenario_head").children(".active").index()>0){
                        if ($(this).children(".scenario_head").children(".active").prev(".flow").length) {
                            nextPage($(scenario).children("." + $(this).children(".scenario_head").children(".active").prev(".flow").data("scenario-page")));
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    } else if (code === keyTest.right) {
                        // if ($(this).children(".scenario_head").children(".active").index() < $(this).children(".scenario_head").children(".flow").length - 1){
                        if ($(this).children(".scenario_head").children(".active").next(".flow").length) {
                            nextPage($(scenario).children("." + $(this).children(".scenario_head").children(".active").next(".flow").data("scenario-page")));
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    } else if (code === keyTest.down) {
                        //if ($(this).children(".scenario_head").children(".active").index()>0){
                        if ($(this).find(".page[aria-hidden='false']").hasClass("players")) {
                            if ($(this).find(".page[aria-hidden='false']").find(".selected").length > 0) {
                                if ($(this).find(".page[aria-hidden='false']").find(".selected").next(".speaker").length) {
                                    $(this).find(".page[aria-hidden='false']").find(".selected").next(".speaker").trigger("click");
                                } else {
                                    $(this).find(".page[aria-hidden='false']").find(".selected").removeClass("selected");
                                }
                            } else {
                                $(this).find(".page[aria-hidden='false']").find(".speaker").first().trigger("click");
                            }
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    } else if (code === keyTest.up) {
                        if ($(this).find(".page[aria-hidden='false']").hasClass("players")) {
                            if ($(this).find(".page[aria-hidden='false']").find(".selected").length > 0) {
                                if ($(this).find(".page[aria-hidden='false']").find(".selected").prev(".speaker").length) {
                                    $(this).find(".page[aria-hidden='false']").find(".selected").prev(".speaker").trigger("click");
                                } else {
                                    $(this).find(".page[aria-hidden='false']").find(".selected").removeClass("selected");
                                }
                            } else {
                                $(this).find(".page[aria-hidden='false']").find(".speaker").last().trigger("click");
                            }
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    return true;
                });
                $(scenario).children(".scenario_head").children(".flow").bind("click", function () {
                    var next = $(scenario).children("." + $(this).data("scenario-page"));
                    nextPage(next);
                });

                function nextPage(next) {
                    if ($(next).data("index") < 1) {
                        $(scenario).children(".nav-prev-page").hide();
                    } else if ($(next).data("index") >= $(scenario).children(".page").length - 1) {
                        $(scenario).children(".nav-next-page").hide();
                    } else {
                        $(scenario).children(".nav-prev-page").show();
                        $(scenario).children(".nav-next-page").show();
                    }
                    $(scenario).children(".page[aria-hidden='false']").attr("aria-hidden", "true");
                    $(next).attr("aria-hidden", "false");
                    $(scenario).children(".scenario_head").children(".active").removeClass("active");
                    $(scenario).children(".scenario_head").children("." + $(scenario).children(".page[aria-hidden='false']").data("flow-tab")).addClass("active");
                    $(scenario).children(".scenario_head").children(".flowframe").css("left", $(scenario).children(".scenario_head").children(".active").position().left + "px");
                    $(scenario).css("height", size());
                    if ($(".scenario:focus").length) {
                        $("html, body").stop().animate({scrollTop: $(scenario).offset().top + "px"}, 0);
                    }
                    $(window).trigger("resize");
                    setTimeout(function () {
                        $(window).trigger("resize");
                    });

                }

                nextPage($(scenario).children(".page").first());


                /*$(window).resize(function(e) {
                 $(".scenario").each(function() {
                 if ($(this).children(".page[aria-hidden='false']").position() !== null) {
                 $(this).css("height", ($(this).children(".page[aria-hidden='false']").height() + $(this).children(".page[aria-hidden='false']").position().top + 20) + "px");
                 }
                 });
                 
                 
                 });**/
                var resval = setInterval(function () {

                    //$(scenario).children(".players[aria-hidden='false']").css("height","auto");
                    if ($(scenario).find(".scenario_head").length > 0) {
                        if ($(scenario).children(".page[aria-hidden='false']").hasClass("players")) {
                            $(scenario).children(".players[aria-hidden='false']").children(".selected").children(".statement").css("top", $(scenario).find(".speaker").first().height() + $(scenario).find(".speaker").first().position().top + 15 + "px");
                            var height = parseInt($(scenario).children(".players[aria-hidden='false']").children(".selected").children(".statement").css("top")) + $(scenario).children(".players[aria-hidden='false']").children(".selected").children(".statement").height() + 50 + "px";
                            $(scenario).children(".players[aria-hidden='false']").css("height", height);
                        }
                        $(window).trigger("resize");
                        $(scenario).css("height", size());
                    } else {
                        clearInterval(this);
                    }
                }, 1000);
                resizeInterval.push(resval);
                function renderPage(page) {

                    if ($(page).hasClass("desc")) {
                        populateDescription($(page));
                    }
                    if ($(page).hasClass("players")) {
                        populateKeyPlayers($(page));
                    }
                }
                ;
                function size() {
                    //console.log("Height: " + $(scenario).children(".page[aria-hidden='false']").height());
                    //console.log("Position: " + $(scenario).find(".page[aria-hidden='false']").position().top);
                    heightO = ($(scenario).children(".page[aria-hidden='false']").height() + $(scenario).children(".page[aria-hidden='false']").position().top + 20) + "px";
                    return heightO;
                }
                ;
                function populateDescription(pageElement, index) {
                    $(pageElement).prepend("<div class='page_head'><h3>" + $(pageElement).attr("title") + "</h3></div>");
                    $(pageElement).find("audio, .acorn-player").wrap("<div class='audio-player-holder'>");
                    $(pageElement).find(".acorn-player").each(function () {
                        if ($(this).find("source").length < 1) {
                            $(this).remove();
                        }
                    });
                    $(pageElement).find("audio").each(function () {
                        if ($(this).find("source").length < 1) {
                            $(this).remove();
                        }
                    });
                }
                function populateKeyPlayers(pageElement) {
                    $(pageElement).prepend("<div class='page_head'><h3>" + $(pageElement).attr("title") + "</h3></div>");
                    var conversation = false;
                    $(pageElement).children(".speaker").flexWidth({padding: 50});
                    $(pageElement).children(".speaker").each(function () {
                        var text = $(this).children(".statement").text();
                        text = text.toString();
                        if (text === 'none') {
                            conversation = true;
                            $(this).children(".statement").remove();
                        } else {
                            $(this).addClass("selected");
                        }
                    });
                    if (conversation) {
                        $(pageElement).children(".speaker").each(function () {
                            $(this).prepend("<div class='title'>" + $(this).data("speakertitle") + "</div>");
                            $(this).prepend("<div class='name'>" + $(this).data("speakername") + "</div>");
                            $(this).prepend("<img width='100%' src='" + $(this).data("speakerimage") + "' alt='Photo of " + $(this).data("speakername") + "'>");
                            $(this).find("audio, .acorn-player").wrap("<div class='audio-player-holder'>");
                            if ($(this).find(".acorn-player").find("audio").find("source").length < 1) {
                                $(this).find(".acorn-player").remove();
                            }
                        });
                        $(pageElement).find(".title").matchHeight({padding: 5});
                        $(pageElement).find(".name").matchHeight({padding: 5});
                        //console.log($(pageElement).find(".name").length);
                        //$("<div class='description_area'></div>").insertAfter($(pageElement).children(".speaker").last());
                        //$(pageElement).children(".description_area").html($(pageElement).children(".conv-holder").children(".statement").html());
                        //$(pageElement).parent().css("height", size);

                    } else {
                        $(pageElement).children(".speaker").each(function () {
                            $(this).removeClass("selected");
                            $(this).prepend("<div class='title'>" + $(this).data("speakertitle") + "</div>");
                            $(this).prepend("<div class='name'>" + $(this).data("speakername") + "</div>");
                            $(this).prepend("<img width='100%' src='" + $(this).data("speakerimage") + "' alt='Photo of " + $(this).data("speakername") + "'>");
                            $(this).find("audio, .acorn-player").wrap("<div class='audio-player-holder'>");
                            if ($(this).find(".acorn-player").find("audio").find("source").length < 1) {
                                $(this).find(".acorn-player").remove();
                            }
                            $(this).bind("click", function () {
                                $(this).siblings(".speaker").removeClass("selected");
                                $(this).addClass("selected");
                                $(pageElement).children(".selected").children(".statement").css("top", $(scenario).find(".speaker").first().height() + $(scenario).find(".speaker").first().position().top + 15 + "px");
                                var height = parseInt($(pageElement).children(".selected").children(".statement").css("top")) + $(pageElement).children(".selected").children(".statement").height() + 50 + "px";
                                $(pageElement).parent().css("height", size);
                            });
                            textIndex = 1;
                        });
                        $(pageElement).find(".title").matchHeight({padding: 5});
                        $(pageElement).find(".name").matchHeight({padding: 5});
                    }
                }
                $(scenario).attr("aria-live", "assertive");
            });
        }
    };


    $.fn.setMatching = function (options) {
        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    $(this).html($(this).find(".original-html").html());
            });

        } else {

            var settings = $.extend({}, options);
            /*DRAG*/
            return this.each(function (dindex, matching) {
                try {
                    ga('send', 'event', 'TYK', 'DragDrawn', $(matching).attr("title"));
                } catch (e) {
                }
                ;
                $(matching).attr("id", "match" + dindex);
                $(matching).attr("tabindex", 0);
                $(matching).data("index", dindex);
                matchingHTML[dindex] = $(matching).html();
                $(matching).append("<div class='original-html' style='display:none;'>" + $(matching).html() + "</div>");
                populateMatching(matching);
            });
        }
        function populateMatching(matching) {
            //$(matching).randomize(".drag_item");
            $(matching).prepend("<div class='match_head'><h3>" + $(matching).attr("title") + "</h3></div><div tabindex=-1 class='match_print'>Print</div><div tabindex=-1 class='match_reset'>Reset</div><div tabindex=-1 class='match_key'>Use Keyboard</div><div class='match_results'></div><div class='tyk-instructions'>" + intructions.matching.mouse + "</div>");
            $(matching).append("<div class='target_holder'></div><div class='target-left'></div><div class='match_holder'></div><div class='target-right'></div>");
            $(matching).children(".group").each(function (i, group) {
                $(group).children(".group_label").attr("id", "match-group-" + i);
                $(group).children(".item").attr("data-match-element", $(group).children(".group_label").attr("id"));
                $(group).parent().children(".target_holder").append($(group).children(".item"));
                $(group).parent().children(".match_holder").append($(group).children(".group_label"));
                $(group).remove();
            });
            $(matching).children(".target_holder").randomize(".item");
            $(matching).children(".target_holder").children(".item").each(function (i, item) {
                $(item).prepend("<div class='match-display'>");
                //console.log(i % 2);
                if (i % 2) {
                    $(matching).children(".target-right").append($(item));
                }
                else {
                    $(matching).children(".target-left").append($(item));
                }
            });
            $(matching).children(".target_holder").remove();
            //$(matching).find(".item").matchHeight({padding: 5}).disableSelection();
            //$(matching).find(".group_label").matchHeight({padding: 5}).disableSelection();
            $(matching).find(".group_label").draggable({rever: true, helper: "clone", cursor: "move", cursorAt: {top: 35, left: 80}, containment: "#" + $(matching).attr("id")});
            $(matching).find(".item").droppable({
                drop: function (event, ui) {
                    //console.log($(this).attr("data-match-element") + "  " + ui.draggable.attr("id"));
                    if ($(this).attr("data-match-element") === ui.draggable.attr("id")) {
                        $(this).children(".match-display").addClass("matched");
                        $(this).children(".match-display").text(ui.draggable.text());
                        //console.log("matches left " + $(matching).find(".match-display").not(".matched").length);
                        if ($(matching).find(".match-display").not(".matched").length < 1)
                        {
                            $(matching).append("<div class='finished-matching'>Great Job!</div>");
                        }
                    }
                }
            });
            $(matching).children(".match_print").button().click(function () {
                var dragID = $(matching).data("index");
                $(matching).printElement("<div class='match_head'><h3>" + $(matching).attr("title") + "</h3></div>" + matchingHTML[(parseInt(dragID))]);
            });
            $(matching).children(".match_key").button().click(function () {
                var dragID = $(matching).attr("id");
                $(matching).html(matchingHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
                populateKeyMatching(matching);


            });
            $(matching).children(".match_reset").button().click(function () {
                var dragID = $(matching).attr("id");
                $(matching).html(matchingHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
                populateMatching(matching);

            });
            $(matching).find(".ui-button").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });
            $(matching).unbind("keydown").bind('keydown', function (e) {
                //console.log("key");
                var code = (e.keyCode ? e.keyCode : e.which);
                if ($(matching).is(":focus"))
                    $(matching).find(".match_key").focus();
                else if (code === keyTest.left) {
                    $(matching).find(":focus").next().focus();
                    return false;
                } else if (code === keyTest.right) {
                    $(matching).find(":focus").prev().focus();
                    return false;
                } else if (code === keyTest.up) {
                    $(matching).find(":focus").next().focus();
                    return false;
                } else if (code === keyTest.down) {
                    $(matching).find(":focus").prev().focus();
                    return false;
                }
                return true;
            });


        }
        function populateKeyMatching(matching) {
            $(matching).prepend("<div class='match_head'><h3>" + $(matching).attr("title") + "</h3></div><div tabindex=-1 class='match_print'>Print</div><div tabindex=-1 class='match_reset'>Reset</div><div tabindex=-1 class='match_key'>Use Mouse</div><div class='match_results'></div><div class='tyk-instructions'>" + intructions.matching.keyboard + "</div>");
            $(matching).append("<div class='target_holder'></div><div class='target-left'></div><div class='match_holder'></div><div class='target-right'></div>");
            $(matching).children(".group").each(function (i, group) {
                $(group).children(".group_label").attr("id", "match-group-" + i).attr("tabindex", -1);
                ;
                $(group).children(".item").attr("data-match-element", $(group).children(".group_label").attr("id"));
                $(group).parent().children(".target_holder").append($(group).children(".item"));
                $(group).parent().children(".match_holder").append($(group).children(".group_label"));
                $(group).remove();
            });
            $(matching).children(".target_holder").randomize(".item");
            $(matching).children(".target_holder").children(".item").each(function (i, item) {
                $(item).attr("tabindex", -1);
                $(item).prepend("<div class='match-display'>");
                //console.log(i % 2);
                if (i % 2) {
                    $(matching).children(".target-right").append($(item));
                }
                else {
                    $(matching).children(".target-left").append($(item));
                }
            });
            $(matching).children(".target_holder").remove();
            //$(matching).find(".item").matchHeight({padding: 5}).disableSelection();
            //$(matching).find(".group_label").matchHeight({padding: 5}).disableSelection();
            $(matching).find(".group_label").bind("keydown", function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === keyTest.enter) {
                    $(matching).find(".grabbed").remove();
                    $grabbed = $(this).clone().addClass("grabbed").appendTo($(matching));
                    $(matching).find(".target-left, .target-right").children().bind("keydown", function (e) {
                        var code = (e.keyCode ? e.keyCode : e.which);
                        if (code === keyTest.enter) {
                            if ($(matching).find(".grabbed").length) {
                                // console.log($(this).attr("data-match-element")+" "+$(matching).find(".grabbed").attr("id"));
                                if ($(this).attr("data-match-element") === $(matching).find(".grabbed").attr("id")) {

                                    $(this).children(".match-display").addClass("matched");
                                    $(this).children(".match-display").text($(matching).find(".grabbed").text());
                                    //console.log("matches left " + $(matching).find(".match-display").not(".matched").length);
                                    if ($(matching).find(".match-display").not(".matched").length < 1)
                                    {
                                        $(matching).append("<div class='finished-matching'>Great Job!</div>");
                                    }
                                    $(matching).find(".grabbed").remove();
                                }
                            }
                        }
                    });

                    $(matching).find(".target-left").children().first().focus();
                }
            });
            $(matching).find(".item").bind("focus", function (e) {
                $(matching).find(".grabbed").css({left: $(this).position().left + "px", top: ($(this).position().top - $(matching).find(".grabbed").height() + 15) + "px"});
            });
            /*$(matching).find(".group_label").draggable({rever: true, helper: "clone"});
             $(matching).find(".item").droppable({
             drop: function(event, ui) {
             console.log($(this).attr("data-match-element") + "  " + ui.draggable.attr("id"));
             if ($(this).attr("data-match-element") === ui.draggable.attr("id")) {
             $(this).children(".match-display").addClass("matched");
             $(this).children(".match-display").text(ui.draggable.text());
             }
             }
             });
             */
            /******************************************************/

            $(matching).unbind("keydown").bind('keydown', function (e) {
                //console.log("key");
                var code = (e.keyCode ? e.keyCode : e.which);
                // console.log($(matching).find(":focus").attr("class"));
                if ($(matching).is(":focus")) {
                    $(matching).find(".match_key").focus();
                    //console.log(".matching");
                }
                else if (code === keyTest.left) {
                    if ($(matching).find(".target-right").children().is(":focus")) {
                        $(matching).find(".match_holder").children().not(".matched").first().focus();
                        // console.log(".target-right");
                    } else if ($(matching).find(".match_holder").children().is(":focus")) {
                        //  console.log(".match_holder");
                        $(matching).find(".target-left").children().not(".matched").first().focus();
                    } else if ($(matching).find(".ui-button").is(":focus")) {
                        //   console.log("top");
                        $(matching).find(":focus").next().focus();
                    }
                    return false;
                } else if (code === keyTest.right) {
                    if ($(matching).find(".target-left").children().is(":focus")) {
                        //    console.log(".target-left");
                        $(matching).find(".match_holder").children().not(".matched").first().focus();
                    } else if ($(matching).find(".match_holder").children().is(":focus")) {
                        // console.log(".match_holder");
                        $(matching).find(".target-right").children().not(".matched").first().focus();
                    } else if ($(matching).find(".ui-button").is(":focus")) {
                        //  console.log("top");
                        $(matching).find(":focus").prev().focus();
                    }
                    return false;
                } else if (code === keyTest.up) {
                    if ($(matching).find(".target-left").children().first().is(":focus") || $(matching).find(".match_holder").children().first().is(":focus") || $(matching).find(".target-right").children().first().is(":focus")) {
                        $(matching).find(".match_key").focus();
                        //   console.log("bottom");
                    }
                    else {
                        $(matching).find(":focus").not(".matched").prev().focus();
                    }
                    return false;
                } else if (code === keyTest.down) {
                    if ($(matching).find(".ui-button").is(":focus")) {
                        //    console.log("top");
                        $(matching).find(".match_holder").children().first().focus();
                    }
                    else {
                        $(matching).find(":focus").not(".matched").next().focus();
                    }
                    return false;
                }
                return true;
            });

            /***********************************************************/


            $(matching).children(".match_print").button().click(function () {
                var dragID = $(matching).data("index");
                $(matching).printElement("<div class='match_head'><h3>" + $(matching).attr("title") + "</h3></div>" + matchingHTML[(parseInt(dragID))]);
            });
            $(matching).children(".match_key").button().click(function () {
                var dragID = $(matching).attr("id");
                $(matching).html(matchingHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
                populateMatching(matching);
                $(matching).find(".match_holder").children().first().focus();

            });
            $(matching).children(".match_reset").button().click(function () {
                var dragID = $(matching).attr("id");
                $(matching).html(matchingHTML[(parseInt(dragID.substr(dragID.length - 1)))]);
                populateKeyMatching(matching);

            });
            $(matching).find(".ui-button").bind('keypress', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13 && $(this).is(":focus")) {
                    $(this).trigger("click");
                }
            });


            $(matching).find(".match_holder").children().first().focus();
        }
    };



    $.fn.setTimeline = function (options) {
        if (options === "disable") {
            return this.each(function (quizindex, quiz_holder) {
                if ($(this).find(".original-html").length > 0)
                    $(this).html($(this).find(".original-html").html());
            });

        } else {

            var settings = $.extend({}, options);

            return this.each(function (ti, timeline) {
                var originalHTML = "<div class='original-html'>" + $(timeline).html() + "</div>";
				
				//Checking to see if start/end dates are set
				if(!$(timeline).data("start") || !$(timeline).data("end")) {
					var sdate, edate, cdate, drange;
					$(timeline).children(".timeline-item").each(function (i, item){
						cdate = $(item).children(".item-date").text();
						if (cdate.indexOf("-")>=0){
							drange = $(item).children(".item-date").text().split("-");
						} else {
							drange = 0;
						}
						if(i==0){
							if (drange!=0){
								sdate = parseInt(drange[0]);
								edate = parseInt(drange[1]);
							} else {
								sdate = parseInt(cdate);
								edate = parseInt(cdate);
							}
						} else {
							if (drange!=0){
								if (parseInt(drange[0]) < sdate){
									sdate = drange[0];
								}
								if (parseInt(drange[1]) > edate){
									edate = drange[1];
								}
							} else {
								if (parseInt(cdate) < sdate){
									sdate = parseInt(cdate);
								}
								if (parseInt(cdate) > edate){
									edate = parseInt(cdate);								
								}	
							}
						}
					});
					$(timeline).data("start", sdate);
					$(timeline).data("end", edate);
				}

                $(timeline).children(".timeline-item").wrapAll("<div class='timeline-list'>");
                $(timeline).append("<div class='time-line-graphic'></div><div class='range-display'></div>");
                $(timeline).children().wrapAll("<div class='timeline-display'>");

                $(timeline).prepend("<div class='timeline_head'><h3>" + $(timeline).attr("title") + "</h3><button class='timeline-list-view'>List View</button><button class='timeline-print'>Print</button></div><div class='tyk-instructions'>" + intructions.timeline + "</div>");

                $(timeline).children('.timeline-display').children(".timeline-list").children(".timeline-item").each(function (itenmIndex, item) {
                    $(item).children().not(".item-date").wrapAll("<div class='date-tooltip'>");
                    if (itenmIndex % 2 > 0) {
                        $(item).children(".item-date").tooltip({
                            items: ".item-date",
                            content: function(){return $(item).children(".date-tooltip").html();},
                            position: {
                                my: "left+15 center",
                                at: "right center"
                            }
                        });
                    } else {
                        $(item).children(".item-date").tooltip({
                            items: ".item-date",
                            content: function(){return $(item).children(".date-tooltip").html();},
                            position: {
                                my: "left+15 center",
                                at: "right center"
                            }
                        });
                    }
                    var dates = $(item).children(".item-date").text();
                    if (dates.indexOf("-") >= 0) {
                        var start = parseInt($(timeline).data("start"));
                        var end = parseInt($(timeline).data("end"));
                        $(item).addClass("date-range");
                        aDates = dates.split("-");
                        var offset1 = (aDates[0] - start) / (end - start) * 100;
                        var offset2 = (aDates[1] - start) / (end - start) * 100;
                        var range = Math.abs(offset2 - offset1);
                        var offset = (offset1 + offset2) / 2;
                        $(item).parent().siblings(".range-display").append("<div class='timeline-range range" + itenmIndex + "' style='width:" + range + "%;left:" + offset1 + "%'>");
                        $(item).attr("data-range-class", "range" + itenmIndex);

                    } else {
                        var lineDate = parseInt(dates);
                        var offset = (lineDate - parseInt($(timeline).data("start"))) / (parseInt($(timeline).data("end")) - parseInt($(timeline).data("start"))) * 100;
                        $(item).parent().siblings(".range-display").append("<div class='timeline-range range" + itenmIndex + "' style='width:4px;margin-left:1px;left:" + offset + "%'>");
                        $(item).attr("data-range-class", "range" + itenmIndex);
                    }
                    $(item).children(".item-date").bind("mouseenter", function () {
                        $(this).parents(".timeline").find("." + $(item).data("range-class")).addClass("range-highlight");
                        $(this).bind("mouseleave", function () {
                            $(this).unbind("mouseleave");
                            $(this).parents(".timeline").find("." + $(item).data("range-class")).removeClass("range-highlight");
                        });
                    });

                    $(item).css("left", offset + "%");
                });
                $(timeline).append("<div class='timeline-slider-location'></div><div class='timeline-display-slider'></div>");
                $(timeline).children(".timeline-display-slider").slider({
                    min: 0,
                    max: 100,
                    values: [0, 100],
                    range: true,
                    slide: function (event, ui) {
                        var start = ui.values[0];
                        var end = 100 + 100 - ui.values[1];
                        var zoom = start + end;
                        $(timeline).children(".timeline-display").css("left", -start + "%");
                        $(timeline).children(".timeline-display").css("width", zoom + "%");
                        var dateRange = parseInt($(timeline).data("end")) - parseInt($(timeline).data("start"));
                        $(timeline).children(".timeline-display-slider").children(".ui-slider-handle").first().attr("data-date-value", parseInt(dateRange * start / 200) + parseInt($(timeline).data("start")));
                        $(timeline).children(".timeline-display-slider").children(".ui-slider-handle").last().attr("data-date-value", parseInt($(timeline).data("end")) + parseInt(dateRange * (100 - end) / 200));
                        /* $(timeline).children(".timeline-slider-location").slider("option","value", (ui.values[0]+ui.values[1])/2);
                         $(timeline).children(".timeline-slider-location").slider("option","min", ui.values[0]);
                         $(timeline).children(".timeline-slider-location").slider("option","max", ui.values[1]);
                         $(timeline).children(".timeline-slider-location").css("width",(ui.values[1]-ui.values[0])+"%");
                         $(timeline).children(".timeline-slider-location").css("left",(ui.values[0])+"%");*/
                    }
                });
                /*    $(timeline).children(".timeline-slider-location").slider({
                 min: 0,
                 max: 100,
                 value: 50,
                 slide: function(event, ui) {
                 var values = $(timeline).children(".timeline-display-slider").slider( "option", "values" );
                 var avgValue = (values[0]+ values[1])/2;
                 $(timeline).children(".timeline-display-slider").slider( "option", "values", [ (ui.value - avgValue) + values[0] , (ui.value - avgValue) + values[1] ] );
                 $(timeline).children(".timeline-display").css("left", -1*((ui.value - avgValue) + values[0]) + "%");
                 $(timeline).children(".timeline-display").css("width", (100 + 100 - (ui.value - avgValue) + values[1]) + "%");
                 $(timeline).children(".timeline-display-slider").children(".ui-slider-handle").first().attr("data-date-value", parseInt(((ui.value - avgValue) + values[1] - (ui.value - avgValue) + values[0]) * (ui.value - avgValue) + values[0] / 200) + parseInt($(timeline).data("start")));
                 $(timeline).children(".timeline-display-slider").children(".ui-slider-handle").last().attr("data-date-value", parseInt($(timeline).data("end")) + parseInt(((ui.value - avgValue) + values[1] - (ui.value - avgValue) + values[0]) * (100 - (ui.value - avgValue) + values[1]) / 200));
                 $(timeline).children(".timeline-slider-location").css("left",(ui.value - avgValue) + values[0]+"%");
                 }
                 }); */
                $(timeline).children(".timeline-display-slider").children(".ui-slider-handle").first().attr("data-date-value", $(timeline).data("start"));
                $(timeline).children(".timeline-display-slider").children(".ui-slider-handle").last().attr("data-date-value", $(timeline).data("end"));
                $(timeline).append(originalHTML);
                $(timeline).find(".timeline-print").button().bind("click", function () {
                    $(timeline).find(".original-html").printElement();
                });
                $(timeline).find(".timeline-list-view").button().bind("click", function () {

                    $(timeline).html($(timeline).find(".original-html").html());
                    //var originalHTML = "<div class='original-html'><div class='timeline_head'><h3>" + $(timeline).attr("title") + "</h3></div>" + $(timeline).html() + "</div>";
                    $(timeline).prepend("<div class='timeline_head'><h3>" + $(timeline).attr("title") + "</h3><button class='timeline-line-view'>Timeline View</button><button class='timeline-print'>Print</button></div>");
                    $(timeline).find(".timeline-print").button().bind("click", function () {
                        $(timeline).find(".original-html").printElement();
                    });
                    $(timeline).find(".timeline-line-view").button().bind("click", function () {
                        $(timeline).html($(timeline).find(".original-html").html());
                        $(timeline).setTimeline();
                    });
                    $(timeline).append(originalHTML);
                });
            });
        }
    };
};




$(document).ready(function () {
    var lymphaticInteractive =
            [
                {answer: "Tonsils", position: "0,23"},
                {answer: "Cervical nodes", position: "0,95"},
                {answer: "Right lymphatic duct", position: "0,169"},
                {answer: "Thoratic duct", position: "0,252"},
                {answer: "Intestinal nodes", position: "5,322"},
                {answer: "Inguinal nodes", position: "0,394"},
                {answer: "Thymus gland", position: "510,80"},
                {answer: "Axillary nodes", position: "510,163"},
                {answer: "Spleen", position: "510,232"},
                {answer: "Small intestine", position: "510,308"},
                {answer: "Large intestine", position: "510,3800"}
            ]
    var backgroundImage = "BIOS260_Lecture_W1_Fig2-4.jpg";
    $("#md-lympatic-interactive").each(function () {
        var interactive = $(this);
        interactive.append("<img src='" + backgroundImage + "'>");
        interactive.find("img").load(function () {
            interactive.css({width: interactive.find("img")[0].clientWidth + "px"});
        })
        interactive.css({width: interactive.find("img")[0].clientWidth + "px", position: "relative", margin: "auto"});

        $.each(lymphaticInteractive, function (i, v) {
            var position = v.position.split(",");
            var answerBloc = $('<div class="md-lymphatic-point" style="width:230px;position:absolute;top:' + position[1] + 'px;left:' + position[0] + 'px">Type answer:\n\
                         <input type="text" style="width:110px; margin:2px;" title="Type answer here">\n\
                         <br><button>See Answer</button>\n\
                         <input class="md-lymphatic-answer" type="text" style="width:110px; margin:2px;" title="The answer is:">\n\
                         </div>');
            interactive.append(answerBloc);
            answerBloc.find("button").click(function () {
                answerBloc.find(".md-lymphatic-answer").val(v.answer).focus();
            });
        });

    })
});
