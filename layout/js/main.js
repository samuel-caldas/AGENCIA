function valida(campo){
	if (campo.value==""){
		alert('Campos Vasios!');
		campo.focus();
	};
}
document.write('<script src="includes/jquery.cookie.js" type="text/javascript"></script><script src="includes/custom_config.js" type="text/javascript"></script><script src="includes/custom.js" type="text/javascript"></script><link href="includes/custom.css" rel="stylesheet" type="text/css"/><link rel="stylesheet" media="screen" type="text/css" href="includes/colorpicker/colorpicker.css" /><script type="text/javascript" src="includes/colorpicker/colorpicker.js"></script><link id="g_font" href="http://fonts.googleapis.com/css?family=Droid+Sans&v2" rel="stylesheet" type="text/css">');

// menu performance function
function menu_slide( item , nxt){
	var nav_block = $('#nav_block');
	
	if(nav_block.data('animated') != true){
		
		if( nxt.is(':visible') ){
			nav_block.data('animated' , true);
			nxt.animate({
					height : "hide"
				}, 1000, function(){
					item.removeClass('current-menu-item');
					nav_block.data('animated' , false);
			});
		}else{
			nav_block.data('animated' , true);
			nxt.animate({
					height : "show"
				}, 1000, function(){
					item.addClass('current-menu-item');
					nav_block.data('animated' , false);
			});
		}
		
	}
}

$('.top_link').live('click', function(e){
	var item = $(this);
	menu_slide( item , item.next());
	e.preventDefault();
}); // top_link end

$('.menu_button, .menu_button2').live('click' , function(e){
	var item = $(this).parents('.item_content').eq(0).prev();	
	menu_slide( item , item.next());
	e.preventDefault()
}); // menu_button end

// top shortcode menu
$('#shortcodes_menu')
	.live('mouseenter' , function(){
		$(this).addClass('shortcodes_menu_hovered');
	})
	.live('mouseleave' , function(){
		$(this).removeClass('shortcodes_menu_hovered');
	});

// top shortcode menu end

function top_nav_init(){
	var item = $('.top_nav_menu');
	item.find('.parent span').append('<em></em>');
	item.children('li').each(function(){
		$(this).append('<span class="separator"></span>');
	});
	
	var t;
	item.find('.parent').live('mouseenter' , function(){
		clearTimeout(t);
		$(this).find('.children').show('fast');
	}).live('mouseleave' , function(){
		var _item = $(this);
		t = setTimeout(function(){
			_item.find('.children').hide('fast');		
		} , 500);
	});
}


$(document).ready(function(){
	top_nav_init();
	
	$('#contact_form input, #contact_form textarea, #search_text, .fields.login input')
		.live('focus' , function(){
			var item = $(this);
			var the_val = item.val();
			item.data('the_val' , the_val);
			item.val('');
		})
		.blur('focus' , function(){
			var item = $(this);
			if(item.val() == ''){
				item.val(item.data('the_val'));
			}
		});
});

var WorksPageProjectGallery = function(){

// this function builds the html of gallery
	var _init = function(){
		//build category attr
		$('#thumbs .thumbs').children().each(function(){
			var item = $(this);
			item.attr( 'cat' , item.find('input.categories').val() );
		});
		// init gallery events		
		_events();
		// click the first gallery item
		$('#categories a:first').click();
		$('#slideshow').prettyPhoto();
	}
	
	var _events = function(){
	
	// switch category of images
		$('#categories a').live('click' , function(e){
			$('#gallery').data( 'current_category' , $(this).attr('href') );
			$('#categories a').removeClass('active');		$(this).addClass('active');
			$('._thumbs').find('*').removeClass('currently_previewed');
			
			// hide preview block
			$('._thumbs , .custom_controls').show();		$('._gallery , .custom_controls_switch').hide();
			
			filter_thumbs();
			adopt_thumbs_container_dimentions();
			pd(e);
		});// switch category of images END
		
	// click prev / next buttons
		$('#custom_controls .prev').live( 'click' , function(e){
			slide_thumbs(-311);
			pd(e)
		});	
		$('#custom_controls .next').live( 'click' , function(e){
			slide_thumbs(311);
			pd(e)
		});
	
	// click thumbnail and show preview state
		$('.thumbs .images a').live( 'click' , function(e){
			show_project_preview($(this));
			pd(e)
		});
	// click on prev / next in preview state
		$('.custom_controls_switch .prev').live( 'click' , function(e){
			switch_projects_in_preview_state();
			pd(e)
		});	
		$('.custom_controls_switch .next').live( 'click' , function(e){
			switch_projects_in_preview_state('next');			
			pd(e)
		});
		
	// click other images of the project and change preview state
		$('._caption_thumbs a').live('click' , function(e){
			var item = $(this);
			var _parent = item.parents('._gallery').eq(0);
			_parent.find('.slideshow').attr('href' , item.attr('href') )
						.html('<img src="'+ item.attr('href') +'" alt=""/>');
			slideshow_img_auto_fit();
			pd(e)
		});
	// click preview panel and show lightbox with fullsize image

	}

	var custom_scroll_apply = function(){
		//console.log('custom_scroll_apply');
		var cnt = $('#mcs_container');
		
		var _h = cnt.find('.customScrollBox').height();
		var _h2 = cnt.find('.container').css('top' , 0).height();		
		
		if( _h < _h2){			
			cnt.addClass('scrollable').removeClass('fixed_top');
		}else{
			cnt.removeClass('scrollable').addClass('fixed_top');
		}
		$("#mcs_container.scrollable").mCustomScrollbar("vertical",400,"easeOutCirc",1,"auto","yes","yes",10); 
		
	}
	
// AutofFit image
	var  slideshow_img_auto_fit = function(){
		var item = $('.slideshow-container .slideshow img');
		function check_it(){
			var current_w = 600;
			item.css('width' , 'auto');
			var native_w = item.width();
			
			if(native_w == 0){
				var t = setTimeout(function(){
					check_it();
				} , 100);
			}else{
				if( native_w < current_w) {
					item.width(native_w)
				}
				else {
					item.width(current_w)
				}
				
				if( item.height() < 370){
					item.height(370).width('auto');
				}
			}			
		}
		check_it();
	}
	
// Switch projects in preview state
	var switch_projects_in_preview_state = function(direction){
		var current_category = $('#gallery').data( 'current_category');
		var c_pr = $('.currently_previewed') , cc = '[cat*="' + current_category + '"]' ,
			c_next = c_pr.nextAll(cc + ':first') , 
			c_prev = c_pr.prevAll('[cat*="' + current_category + '"]:first');

		if( direction == 'next' ){
			var target_item = ( c_next.size() == 0 ) ? c_pr.siblings(cc + ':first') : c_next;			
		} else {
			var target_item = ( c_prev.size() == 0 ) ? c_pr.siblings(cc + ':last') : c_prev;
		}
		target_item.find('.images a:first').click();			
	}

// Show PREVIEW state
	var show_project_preview = function(item){
		$('._thumbs , .custom_controls').hide();		$('._gallery , .custom_controls_switch').show();
		var _parent = item.parents('li').eq(0);
		_parent.parents('._thumbs').eq(0).find('*').removeClass('currently_previewed');
		_parent.addClass('currently_previewed');
		
		// add main image
			var slideshow_a = $('.slideshow-container .slideshow');
			slideshow_a.attr('href' , item.attr('href')).html('<img src="'+ item.attr('href') +'" alt=""/>');
			slideshow_img_auto_fit();
		// add caption
			$('._caption_content .content').html(_parent.find('.caption').html());			
		// add thumbnails
			$('._caption_thumbs').html(_parent.find('.images a').clone());
			
		custom_scroll_apply();
	}
	
// SLIDE the thumbs 
	var slide_thumbs = function(step){
		var thmb = $('#thumbs') , thmb_max_scroll = thmb.data('max_scroll_left');	
		var current_scroll_left = thmb.scrollLeft() , scroll_step = current_scroll_left + step;
		
		if(current_scroll_left >= thmb_max_scroll && step > 0 ){
			//console.log('right');
			scroll_step = 0;
		} else if(current_scroll_left <= 0 && step < 0 ){
			//console.log('left');
			scroll_step = thmb_max_scroll;
		}		
		thmb.animate({		scrollLeft : scroll_step		} , 300 );
	}
	
// FILTERs items according to selected tag
	var filter_thumbs = function(){ 
	
		var current_category = $('#gallery').data( 'current_category' );		
		var target_elements = $('#thumbs .thumbs').children().hide().filter('[cat*="'+ current_category +'"]');	
		target_elements.show();		
		$('#gallery').data( 'current_size' , target_elements.size() );
	}
	
// function that check the number of visible elements and 
//		resize thumb container and show/hide prev/next buttons
	var adopt_thumbs_container_dimentions = function(){
		var cc = $('#custom_controls') , thmb = $('#thumbs'), thmbs = $('#thumbs ul.thumbs');
		var current_size = $('#gallery').data( 'current_size');

		cc.hide();
		if (current_size < 4){ // set thumb block 1 level			
			thmbs.height(208).width(3 * 311);
			
			//console.log( current_size + ' -> current_size < 4');
			
		} else if(current_size < 7){ // set thumb block 2 level			
			thmbs.height(416).width(3 * 311);
			
			//console.log( current_size + ' -> current_size < 7');
		
		} else if(current_size > 6){ // set width of thumb container			
			thmbs.height(416).width( Math.ceil(current_size / 2) * 311 );
			//console.log( current_size + ' -> current_size > 6');
			cc.show();
		}
		
		var max_scroll_left = thmbs.width() - thmb.width();
		thmb.data('max_scroll_left' , max_scroll_left)
	}
	
	function pd(e){e.preventDefault()}
	
_init();
}



