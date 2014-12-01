/*
 * Content Slider Widget
 * ver1.1
 */

/*global  jQuery*/

(function ($) {
	"use strict";
		
	var obj_Methods = {
		init: function (obj_Options) {
			return this.each(function () {
				var obj_Placeholder = $(this),
					int_WidgetType_Id = obj_Placeholder.data('widget-type-id'),
					int_Widget_Id = obj_Placeholder.data('widget-id'),
					str_AjaxData,
					int_SectionId;
				
				int_SectionId = parseInt($("body").attr("data-section-id"), 10);
		
				// Define data to post with the ajax request
				str_AjaxData = 'wtid=' + int_WidgetType_Id + '&wid=' + int_Widget_Id + '&sid=' + int_SectionId;
		
				// Make the ajax request
				$.ajax({
					'url': '/resources_global/scripts/ajax_widget.php',
					'type': 'GET',
					'data': str_AjaxData,
					'success': function (str_Response) {
						obj_Placeholder.html(str_Response).removeClass('widget-placeholder');
						if ($.fn.carousel) {
							obj_Placeholder.find('.latest-list').carousel({
								'maxItems': 6
							});
						}
					},
					'error': function () {
						obj_Placeholder.remove();
					}
				});
			});
		}
	};

	$.fn.contentsliderWidget = function (sMethod) {
		var mix_Return;
		if (obj_Methods[sMethod]) {
			mix_Return = obj_Methods[sMethod].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof sMethod === 'object' || !sMethod) {
			mix_Return = obj_Methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  sMethod + ' does not exist on jQuery.accordionWidget');
		}

		return mix_Return;
	};

}(jQuery));