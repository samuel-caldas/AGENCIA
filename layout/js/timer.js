
// Under construction timeout function
function get_the_timeout(){
	var today = new Date();
	var _diff = target_date - today;
	var time_diff_seconds = _diff / 1000;
	var time_diff_minutes = time_diff_seconds / 60;
	var time_diff_hours   = time_diff_minutes / 60;
	var D = {};
	D.weeks  = Math.floor(time_diff_hours / 168);
	D.days  = Math.floor((time_diff_hours / 24) - (D.weeks * 7));
	var d24 = D.days * 24;
	D.hours = Math.floor(time_diff_hours - d24);
	D.minutes = Math.floor(time_diff_minutes - ((D.hours + d24) * 60));
	D.seconds = Math.floor((time_diff_seconds - (D.hours + d24) * 3600) - (D.minutes * 60));
	for( p in D ){
		var the_value = D[p];
		if(the_value >= 0 && the_value < 10) D[p] = '0' + the_value;
	}
	return D;
}
// Under construction timeout function END

$(function () {
	// Under construction timeout init
	if(window.target_date){
		var _weeks   = $('#weeks');
		var _days    = $('#days');
		var _hours   = $('#hours');
		var _minutes = $('#minutes');
		var _seconds = $('#seconds');
		
		var t = setInterval( function(){
			var D = get_the_timeout();
			_days.text(D.days);
			_hours.text(D.hours);
			_minutes.text(D.minutes);
			_seconds.text(D.seconds);
			_weeks.text(D.weeks);
		} , 1000);// Under construction timeout init END
	}	
	$('.menu ul:eq(0)').children().addClass('top_menu');
	$('.top_menu:has(ul.children)').addClass('has_menu_p').append('<div class="has_menu"></div>');	
});