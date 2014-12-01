// NOTE: NEEDS TO BE RE-WRITTEN USING jQuery AS THIS IS A HACK JOB - STEVE 

(function ($) {
	"use strict";
		
	var _init = false;
		
	/**
	 *	Add Mobile Menu Slider to the page
	 *	Builds the mobile menu
	 */
	function mobileMenuSlider(){

			if (_init) {
				return;
			}
			_init = true; 

			var nav_open = false,
				$inner = $('#inner-wrap'),
				$submenu_items = $('#nav ul li.haschildren');

			$('#mobile-menu-toggle').on('click', function(e)
			{				
				e.preventDefault();
				if (!nav_open) {
					$inner.animate({ left: '80%' }, 500);
					nav_open = true;
				} else {
					$inner.animate({ left: '0' }, 500);
					nav_open = false;
				}
				$('#nav-overlay').toggleClass('on');
				return false;
			});

			$('#mobile-search-toggle').on('click', function(e)
			{				
				e.preventDefault();
				if (!nav_open) {
					$inner.animate({ left: '-80%' }, 500);
					nav_open = true;
				} else {
					$inner.animate({ left: '0' }, 500);
					nav_open = false;
				}
				$('#nav-overlay').toggleClass('on');
				return false;
			});

			$('#nav-close-btn, #search-close-btn').on('click', function(e)
			{
				e.preventDefault();
				if (nav_open) {
					$inner.animate({ left: '0' }, 500);
					nav_open = false;
					$('#nav-overlay').toggleClass('on');
				}
				return false;
			});
			
			//	Add a dropdown button for the submenu then make it slide the submenu
			$submenu_items.each(function () {
				$('.toggle', this).on('click', function(e){
					e.preventDefault();
					$(this).siblings('ul').slideToggle();	
					$(this).parent().toggleClass('toggled');			
				});	
			});	
			
			$submenu_items.find('.toggle').trigger('click').parent().toggleClass('toggled');			

			$(document.documentElement).addClass('js-ready');

		return this;

	};
	
	var obj_Methods = {
			
		/**
		 *	The user has clicked a link that makes a change to the basket contents
		 */
		init: function () {
			mobileMenuSlider(arguments);	
		}
	
	};
		
	/**
	 *	Plugin entry point
	 */
	$.fn.mobilemenu = function (str_Method) {
		var mix_Return;
			if (obj_Methods[str_Method]) {
			mix_Return = obj_Methods[str_Method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof str_Method === 'object' || !str_Method) {
			mix_Return = obj_Methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  str_Method + ' does not exist on jQuery.mobilemenu');
		}
			return mix_Return;
	};

}(jQuery));