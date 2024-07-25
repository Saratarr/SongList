    $(document).ready(function() {
    var groupLocArray = window.location.pathname.split('/');
    var groupCheck = groupLocArray[1];
    var cCheck = groupLocArray[3];
    
        if ((groupCheck == 'groups' ) && (cCheck == 'conferences'))  {
        $('button.btn.btn-primary.new-conference-btn').before("<a style='color:white;' href='/courses/899/pages/student-collaboration-tools' target='_blank'><button class='Button btn btn-primary'><strong>HELP</strong></button></a>");
        }  else {
        console.log("Not in Group HomePage or Conferences Area!")
        }
        if ((groupCheck == 'groups') && (cCheck == 'collaborations'))  {
        $('a.btn.add_collaboration_link').before("<a style='color:white;position: relative;left: 20px;' href='/courses/899/pages/student-collaboration-tools' target='_blank'><button class='Button btn btn-primary'><strong>HELP</strong></button></a>");
        }  else {
        console.log("Not in Group HomePage or Conferences Area!")
        }
        if ((groupCheck == 'groups') && (cCheck == 'lti_collaborations'))  {
        $('.create-collaborations-dropdown').before("<a style='color:white;position: relative;left: 20px;' href='/courses/899/pages/student-collaboration-tools' target='_blank'><button class='Button btn btn-primary'><strong>HELP</strong></button></a>");
        }  else {
        console.log("Not in Group HomePage or Conferences Area!")
        }

            });
    