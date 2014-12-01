/*
 * Subnav
 * ver1.0
 * Handle the reveal of sub menus on the site navigation
 */

/*global  jQuery*/

(function ($) {
	"use strict";
		
	/**
	 *
	 */
		var homemenuClicked = function(e) {
			var obj_HomemenuLink = $(this),
				obj_HomemenuReveal = $('.homemenu-reveal'),
				str_SubmenuClass = 'submenu-' + obj_HomemenuLink.data('submenu-id'),
				obj_Submenu = obj_HomemenuReveal.find('.' + str_SubmenuClass),
				arr_VisibleSubmenus = obj_HomemenuReveal.children('.open'),
				func_ResizeCallback,
				bool_Closing = false;
			
			// Abort if no submenu was found
			if (obj_Submenu.length === 0) {
				return;
			}
			
			// Don't follow the link if a submenu was found
			e.preventDefault();

			// Decide if we're closing the submenu
			bool_Closing = obj_Submenu.hasClass('open');

			// Remove the open class from menu items
			obj_HomemenuLink.parents('li').eq(0).removeClass('open').siblings().removeClass('open');

			// Add the open class if opening a menu item
			if (!bool_Closing) {
				obj_HomemenuLink.parents('li').eq(0).addClass('open');
			}
			
			//
			func_ResizeCallback = function() {
				var int_TargetHeight = (bool_Closing) ? 0 : obj_Submenu.outerHeight()

				obj_HomemenuReveal.stop().animate({
					'height': int_TargetHeight
				}, 'default', function() {
					if (!bool_Closing) {
						obj_Submenu.addClass('open').fadeTo('default', 1);
					}
				});
			}
			
			//
			if(arr_VisibleSubmenus.length === 0) {
				func_ResizeCallback();
			} else {
				arr_VisibleSubmenus.fadeTo('default', 0, function() {
					$(this).removeClass('open');
					func_ResizeCallback();
				});
			}
		},

	/**
	 *	Set up the plugin on all elements
	 *	@param		object		obj_Options		An object containing parameters for the plugin
	 */
		init = function (obj_Options) {
			return this.each(function () {
				// Define default settings for this plugin and then overwrite them with the parameter options
				var obj_Settings = $.extend({}, obj_Options),
					obj_Subnav = $(this),
					obj_Webpart = obj_Subnav.parents('.webpart').eq(0),
					obj_MoveTarget,
					obj_MoveTargetParent,
					obj_CloseButton;

				// Add a reference to the webpart that the subnav came from
				obj_Settings.webpart = obj_Webpart;
				
				// Move the sub nav if a target was supplied
				if (typeof obj_Settings.moveTo === 'string') {
					obj_MoveTarget = $(obj_Settings.moveTo);
					
					if (obj_MoveTarget.length >= 1) {
						obj_Subnav.prependTo(obj_MoveTarget);
						
					// Hack to make the nav work when the move target doesn't exist
					} else {
						obj_MoveTargetParent = $('<div>').addClass('sub-navigation');
						obj_MoveTarget = $('<div>').addClass('sub-navigation-inner');
						
						obj_MoveTarget.appendTo(obj_MoveTargetParent);
						obj_MoveTargetParent.insertAfter(obj_Webpart.parent());
						obj_Subnav.prependTo(obj_MoveTarget);
					}
				}
				
				// Hide all sub nav items
				obj_Subnav.children().css('opacity', 0);
			
				// Add click events to the homemenu links
				obj_Webpart.delegate('ul.homemenu li a', 'click.subnav', homemenuClicked);
				
				// Crate a close button to append to the sub navs
				obj_CloseButton = $('<a>').attr('href', '#').addClass('close').text(jQuery('#closeConstant').val());
				obj_CloseButton.appendTo(obj_Subnav.children());
			
				// Attach the click event to the close button
				obj_Subnav.delegate('.close', 'click.subnav', function(e) {
					e.preventDefault();
					$('ul.homemenu li.open').children('a').click();
				});
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
	$.fn.subnav = function (sMethod) {
		var mix_Return;

		if (obj_Methods[sMethod]) {
			mix_Return = obj_Methods[sMethod].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof sMethod === 'object' || !sMethod) {
			mix_Return = obj_Methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  sMethod + ' does not exist on jQuery.subnav');
		}

		return mix_Return;
	};

}(jQuery));