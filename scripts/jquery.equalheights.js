/*
 * Equal Heights
 * ver 1.0
 * Given a selector set the elements to have the exact same heights
 */

/*global  jQuery, document*/

(function ($) {
	"use strict";
	
		function resizeElements($obj) {
			
			// If elements have 100% width we reset the height
			
			var maxHeight = 0;
				
			$obj.each( function() {
				
				// clear height value
				$(this).css('min-height', '')
				
				var objHeight = $(this).innerHeight();
	
				maxHeight = Math.max(maxHeight, objHeight);
			});
			
			return $obj.css('min-height', maxHeight);
		}
			
		/**
		 *	Plugin entry point
		 */
		$.fn.equalHeights = function() {
			
			var resizeId,
				$this = $(this);
			
			//when resizing the site, we adjust the heights of the columns
			$(window).resize(function() {
				//in order to call the functions only when the resize is finished
				clearTimeout(resizeId);
				resizeId = setTimeout(function(){resizeElements($this);}, 200);
			});
		
			return resizeElements(this);
		};
		
}(jQuery));