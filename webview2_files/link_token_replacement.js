/*
.external_url_link

This javascript will find external links to
http://www.survey-server2.com/hsdiscuniversity-sso/user_login.asp?dsi_number=Parameter1&section_id=Parameter2
and replace Parameter1 with the user's login_id (username) and Parameter2 with the
Canvas Course ID of the current course.

Using this means that you will provision Human Syngergistics with user DNumbers and
Canvas Course ID's each session.

  
/**
 * Look for elements with one of the following selectors
 * - a.external[href*="survey-server2.com"]
 * - .external_url_link[href*="survey-server2.com"]
 *
 * When one of these elements is found, trigger the callback that finds the token
 * strings and replaces them with the proper values.
 *
 */
//onElementRendered('#open_url_button, a.external[href*="survey-server2.com"], .external_url_link[href*="survey-server2.com"]', 
onElementRendered('a[href*="survey-server2.com"]', 
  function(el){

  /* Make jquery API call to canvas to fetch the user's full profile, which is where
   * the login_id is stored.
   */
  var user_r = $.get('/api/v1/users/self/profile');
  var course_r = $.get('/api/v1/courses/' + ENV.context_asset_string.split('_')[1]);
  var teacher_enr_r = $.get('/api/v1/courses/' + ENV.context_asset_string.split('_')[1] + '/enrollments?type[]=TeacherEnrollment');
  
  $.when(user_r, course_r, teacher_enr_r).then(function(u,c){
    //function(d){ 
    var course_name = (c[0].original_name === undefined) ? c[0].name : course_name = c[0].original_name; 
    console.log('replacing Parameter1 with ' + u[0].login_id, 'and Parameter2 with ' + course_name);
    console.log('course_name:'+ course_name);
      $(el).each(function(idx, el){
        el = $(el);
        // Set the href value of the link, replacing various pieces first
        el.attr('href', el.attr('href')
                          .replace('Parameter1', u[0].login_id)
                          .replace('Parameter2', encodeURIComponent(course_name)));
      });
    })
});

/*START kivuto*/
(function () {
// Adjust this array (list) to adjust the list of possible domains that may
// host the software store.
    var possible_domains = [
		'apps.devry.edu',
		'apps.qa.devry.edu'
	/*
        'apps.qa.adtalem.com',
        'apps.adtalem.com',
        'sso.logindvg.net'
		*/
    ];

	if (location.href.split('/').length>4){
		var KIVUTO_STORE = (function () {
			var reqs = {};
			var course_id = ENV.context_asset_string.split('_')[1];
			var req_urls = {
				'course': '/api/v1/courses/' + course_id,
				'section': '/api/v1/courses/' + course_id + '/sections'
			};
			var maybeFetchInfo = function (data_type) {
				var _d = $.Deferred();
				if (reqs[data_type] == undefined) {
					reqs[data_type] = $.get(req_urls[data_type]);
				}
				reqs[data_type].then(function (s) {
					_d.resolve(s);
				});
				return _d.promise();
			};
			return {
				modify_store_link: function (el) {
					$.when(maybeFetchInfo('course'), maybeFetchInfo('section')).then(function (c, s) {
						// Get section name value rather than course_code, put that in the
						// course_code field
						var data = {


						};
						if(s[0]){                        
							data.course_code = s[0]['name'];
						}else{
							data.course_code = c.course_code;
						}
						data.start_date =  c.start_at;
						$(el).attr('href', $(el).attr('href') + '&data=' + btoa(JSON.stringify(data)));
						/*
						 * This turns the link into something like this:
						 * https://sso.logindvg.net/ssobridge/?appLabel=kivuto&data=eyJjb3Vyc2VfY29kZSI6IkFDQ1QyMTIiLCJzdGFydF9kYXRlIjoiMjAxNy0wMy0zMVQxNDo1MjowMFoifQ==
						 *
						 * The data attribute is base64 encoded
						 */
					});
				}
			}
		}());


		$(possible_domains).each(function (i, domain) {
			onElementRendered(
					'a[href*="' + domain + '/ssobridge/?appLabel=kivuto"]',
					KIVUTO_STORE.modify_store_link
					);
		});
	}
})();


/*END kivuto*/

onElementRendered('a[href*="interactiveanatomy.com"][rel="noreferrer"]', 
  function(el){
    // A.D.A.M links need special treatment. Remove the noreferrer rel.
    console.log('found '+el.length+' A.D.A.M. links');
    $(el).removeAttr('rel');
  }
);


/**
 * find links that match http://www.oxfordartonline.com/subscriber/popup_fig/img/grove/art/F015538
 */


onElementRendered('a[href*="oxfordartonline.com/groveart"]>span>span', function(){ 
  var oxford_form = $(document.createElement('form')).attr({
      action: 'http://www.oxfordartonline.com/LOGIN',
      method: 'POST',
      target: '_blank',
      id: 'oxford_user_login'})

    .append(
      $(document.createElement("input")).attr({
        type:"hidden",
        id:"user",
        name:"user",
        value:"devry-inc"})
    )
    .append($(document.createElement("input")).attr({
      type:"hidden",
      id:"pass",
      name:"pass",
      value:"devry-inc"})
    )
    .append( $(document.createElement("input")).attr({
      type:"hidden",
      name:"dest",
      id:"oxford_dest",
      })
    );
  $('body').append(oxford_form);

  $('a[href*="oxfordartonline.com/groveart"]').each(function(idx, el){
      // A.D.A.M links need special treatment. Remove the noreferrer rel.
      console.log(idx, el);
      $(el).click(function(_el){
        _el.preventDefault();
        // Submit the form
        //$('#oxford_dest_'+idx).val($($(_el.target).parents('a')[0]).attr('href'));
        var _url = $(el).attr('href').replace('http://www.oxfordartonline.com','');
        console.log(_url);
        $('#oxford_dest').val(_url);
        console.log($('#oxford_dest').val());
        oxford_form.submit();
      });
      /*
      */
  });
});