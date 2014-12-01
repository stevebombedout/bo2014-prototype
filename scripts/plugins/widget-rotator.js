/*
 * Rotator Widget
 * ver1.0
 */

/*global  jQuery*/

(function ($) {
	"use strict";
		
	/**
	 *	Hide the current options panel (when the roundabout animation begins)
	 */
		var hideOptions = function() {
			var obj_Widget = $(this),
				obj_Roundabout = obj_Widget.find('ul.rotator-categories');
			
			// Hide the visible options
			obj_Widget.find('div.rotator-options-container ul:visible').fadeTo('default', 0, function() {
				var obj_Options = $(this);
				obj_Options.hide();
				obj_Options.children().removeClass('active');
			});
			
			// Hide the visible option panels
			obj_Widget.find('div.rotator-panels-container > div:visible').slideUp();
		},
		
	/**
	 *	Reveal the new options panel (when the roundabout animation ends)
	 */
		revealOptions = function() {
			var obj_Widget = $(this),
				obj_Roundabout = obj_Widget.find('ul.rotator-categories'),
				arr_OptionsContainers = obj_Widget.find('div.rotator-options-container ul'),
				int_VisibleIndex = obj_Roundabout.roundabout('getChildInFocus');
			
			arr_OptionsContainers.eq(int_VisibleIndex).css('opacity', 0).show().fadeTo('default', 1);
		},
	
	/**
	 *	Reveal an option panel when clicking on an option
	 */
		revealOptionPanel = function(e) {
			var obj_OptionLink = $(this),
				obj_Option = obj_OptionLink.parents('li').eq(0),
				obj_Widget = obj_Option.parents('div.widget').eq(0),
				arr_Options = obj_Widget.find('div.rotator-options-container ul.rotator-options:visible').children(),
				str_PanelClass = obj_OptionLink.attr('href').replace('#', ''),
				arr_Panels = obj_Widget.find('div.rotator-panels-container').children(),
				obj_VisiblePanel = arr_Panels.filter(':visible');
			
			e.preventDefault();
			
			arr_Options.removeClass('active');
			
			if(obj_VisiblePanel.length == 0) {
				obj_Option.addClass('active');
				arr_Panels.filter('.' + str_PanelClass).slideDown();
			} else {
				if(obj_VisiblePanel.hasClass(str_PanelClass)) {
					obj_VisiblePanel.slideUp();
				} else {
					obj_VisiblePanel.slideUp(function() {
						obj_Option.addClass('active');
						arr_Panels.filter('.' + str_PanelClass).slideDown();
					});
				}
			}
		},
	
	/**
	 *
	 */
		attachEvents = function(str_Response) {
			var obj_Widget = $(this),
				obj_Roundabout = obj_Widget.find('ul.rotator-options');
			
			obj_Widget.bind('animationStart', hideOptions);
			obj_Widget.bind('animationEnd', revealOptions);
			
			obj_Roundabout.on('click', 'a', revealOptionPanel);
		},
		
	
	/**
	 *
	 */
		setupWidget = function(str_Response) {
			var obj_Widget = $(this),
				obj_Roundabout = obj_Widget.find('ul.rotator-categories');
			
			// Replace the contents of the widget
			if(typeof str_Response == 'string') {
				obj_Widget.html(str_Response);
			}
			
			// Remove the place holder to make the widget visible
			obj_Widget.removeClass('widget-placeholder');
			
			// turn the categories into a rotator
			obj_Widget.find('ul.rotator-categories').roundabout({
				shape: 'lazySusan',
				minOpacity: 1,
				tilt: -3,
				btnNext: ".rotator-controls a.rotate-next",
				btnPrev: ".rotator-controls a.rotate-back",
				responsive: true
			});
			
			// Hide all but the first set of options
			obj_Widget.find('div.rotator-options-container ul:not(:first-child)').hide();
			
			// Hide all option panels
			obj_Widget.find('div.rotator-panels-container').children().hide();
			
			var iTimeout = 200;
			
			$('.rotator-categories li', obj_Widget).each( function() {
															
				setTimeout(function() { 
					obj_Widget.find('ul.rotator-categories').roundabout("animateToNextChild");
				}, iTimeout); 
				
				iTimeout += 1000;

			});
			
			attachEvents.apply(this);
		},
		
	/**
	 *	Set up the plugin on all elements
	 *	@param		object		obj_Options		An object containing parameters for the plugin
	 */
		init = function (obj_Options) {
			return this.each(function () {
				var obj_Placeholder = $(this),
					int_WidgetType_Id = obj_Placeholder.data('widget-type-id'),
					int_Widget_Id = obj_Placeholder.data('widget-id'),
					str_AjaxData,
					obj_Settings,
					int_SectionId;
				
				int_SectionId = parseInt($("body").attr("data-section-id"), 10);
				
				// Define the plugin options
				obj_Settings = $.extend({
					'retrieveContent': false
				}, obj_Options);
				
				// Define data to post with the ajax request
				str_AjaxData = 'wtid=' + int_WidgetType_Id + '&wid=' + int_Widget_Id + '&sid=' + int_SectionId;

				if(obj_Settings.retrieveContent === true) {
					// Make the ajax request
					$.ajax({
						'url': '/resources_global/scripts/ajax_widget.php',
						'type': 'GET',
						'data': str_AjaxData,
						'success': function (str_Response) {
							setupWidget.apply(obj_Placeholder, [str_Response]);
						},
						'error': function () {
							obj_Placeholder.remove();
						}
					});
				} else {
					setupWidget.apply(obj_Placeholder);
				}
			});
		},

	/**
	 *	Map public functions
	 */
		obj_Methods = {
			'init': init
		};

	/**
	 *	Plugin entry point
	 */
	$.fn.rotatorWidget = function (sMethod) {
		var mix_Return;

		if (obj_Methods[sMethod]) {
			mix_Return = obj_Methods[sMethod].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof sMethod === 'object' || !sMethod) {
			mix_Return = obj_Methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  sMethod + ' does not exist on jQuery.rotatorWidget');
		}

		return mix_Return;
	};

}(jQuery));