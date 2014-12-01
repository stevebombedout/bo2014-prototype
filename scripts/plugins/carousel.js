/*
 * Carousel
 * ver1.1
 * Create a carousel out of a list (used for banners, latest news, latest events, customer quotes etc)
 */

/*global  jQuery*/

(function ($) {
	"use strict";

	/**
	 *	Move to the an item
	 */
	function show (obj_Carousel, int_Index) {
		var obj_ItemList = obj_Carousel.find('ul.carousel-items'),
			obj_Item = obj_ItemList.find('.item-' + int_Index),
			arr_PreviousItems = obj_Item.prevAll(),
			int_PreviousItemCount = arr_PreviousItems.length,
			arr_Controls = obj_Carousel.find('.controls li.goto'),
			arr_Items = obj_Carousel.find('.carousel-items').children(),
			int_ItemCount = arr_Items.length,
			int_Left;
		
		// Change the selected control
		arr_Controls.removeClass('selected');	
		
		obj_ItemList.animate({
			left: -100 * (int_Index+1) + '%'
			}, 500, function() {
				// Switcharoony!
				
				if (int_Index == arr_Items.length-2) {
					int_Index = 0;
					$(this).css({ 
						left: '-100%'
					 }); 
				} else if (int_Index < 0) {
					$(this).css({ 
						left: -100 * (int_ItemCount-2) + '%'
					 }); 	
				}
		});  
		
		 if (int_Index == arr_Items.length-2) {
			 arr_Controls.eq(0).addClass('selected');
			 int_Index = 0;
		 } else if (int_Index < 0) {
			 arr_Controls.eq(int_ItemCount-3).addClass('selected');
			 int_Index = int_ItemCount-3;
		 } else {
			 arr_Controls.eq(int_Index).addClass('selected');
		 } 
		
		// Make the all items opaque
		obj_Carousel.find('ul.carousel-items > li').css('opacity', '1');
		
		//Get new index
		
		$('#carouseltext').fadeOut( function() {
			$('#carouseltext').html($('ul.carousel-items > li .description').eq(int_Index+1).html());					
		});
						
		$('#carouseltext').fadeIn(); 
		
		$('img#carousel-album-cover').fadeOut( function() {
			$('img#carousel-album-cover').attr("src", $('ul.carousel-items > li .album-cover').eq(int_Index+1).find("img").attr("src"));					
		});
						
		$('img#carousel-album-cover').fadeIn(); 
		
		// move marker			  
		var backgroundPos = 100/(int_ItemCount - 2);
			
		backgroundPos = (backgroundPos * int_Index) + (100/((int_ItemCount-2) * 2));  
			
		$('div.marker').animate({left: backgroundPos + '%'});
		
		obj_ItemList = null;
		obj_Item = null;
		arr_PreviousItems = null;
		arr_Controls = null;
	}
	
	function createControls (int_ItemCount, obj_Settings) {
		var obj_ControlList, obj_Control, obj_ControlLink, str_Html;
		
		// Limit the number of items available
		int_ItemCount = Math.min(int_ItemCount, obj_Settings.maxItems)

		// Don't need controls when only 1 item exists
		if(int_ItemCount <= 1) {
			return '';
		}
		
		obj_ControlList = $('<ul>', {
			'class': 'controls'
		});
		
		// Create each control
		for(var i = 0; i < int_ItemCount; i += 1) {
			// Create the control link
			obj_ControlLink = $('<a>', {
				'href': '#',
				'text': (i+1)
			});
			
			// Create the control
			obj_Control = $('<li>', {
				'class': 'goto'
			});
			
			// Add the control to the container
			obj_ControlLink.appendTo(obj_Control);
			obj_Control.appendTo(obj_ControlList);
		}
		
				
		$('div.marker-container').width(26 * (int_ItemCount+1));


		str_Html = ($('<div>').append(obj_ControlList)).html()
		return str_Html
	}
	
	function createContainers () {
		var obj_Carousel, obj_Clip, str_Html;
		
		obj_Carousel = $('<div>', {
			'class': 'carousel'
		});
		obj_Clip = $('<div>', {
			'class': 'carousel-clip'
		});
		
		obj_Clip.appendTo(obj_Carousel);
		
		str_Html = ($('<div>').append(obj_Carousel)).html();

		return str_Html;
	}

	var obj_Methods = {
			
		/**
		 *	Start auto rotating the carousel
		 */
		start: function () {
			var obj_Carousel = $(this),
				obj_Settings = obj_Carousel.data('carousel-settings'),
				int_IntervalHandle;
			
			int_IntervalHandle = setInterval((function () {
				$(this).carousel('next');
			}).bind(this), obj_Settings.Interval);
			
			obj_Carousel.data('carousel-interval', int_IntervalHandle);

			obj_Carousel = null;
		},
		
		/**
		 *	Stop auto rotating the carousel
		 */
		stop: function () {
			var obj_Carousel = $(this),
				int_IntervalHandle = obj_Carousel.data('carousel-interval');
			
			if (!isNaN(int_IntervalHandle)) {
				clearInterval(int_IntervalHandle);
			}
			
			obj_Carousel.removeData('carousel-interval');
		},
		
		/**
		 *	Start auto rotating the carousel
		 */
		next: function () {
			var obj_Carousel = $(this),
				arr_Controls = obj_Carousel.find('ul.controls li.goto'),
				obj_CurrentControl = arr_Controls.filter('.selected'),
				obj_NextControl,
				int_Index;
			
			// If there's no selected control then goto the first
			if(obj_CurrentControl.length == 0) {
				show(obj_Carousel, -1)
				return;
			}
			
			// Try to get the next control
			obj_NextControl = obj_CurrentControl.next('li.goto');
			
			// If there isn't a next control then get the first one
			if(obj_NextControl.length == 0) {
				show(obj_Carousel, arr_Controls.length);
				//show(obj_Carousel, 0);
			} else {
				int_Index = arr_Controls.index(obj_NextControl);
				show(obj_Carousel, int_Index);
			}

			obj_Carousel = null;
			arr_Controls = null;
			obj_CurrentControl = null;
			obj_NextControl = null;
		},
		
		/**
		 *  
		 */
		prev: function () {
			var obj_Carousel = $(this),
				arr_Controls = obj_Carousel.find('ul.controls li.goto'),
				obj_CurrentControl = arr_Controls.filter('.selected'),
				obj_PrevControl,
				int_Index;
			
			// If there's no selected control then goto the first
			if(obj_CurrentControl.length == 0) {
				show(obj_Carousel, 0)
				return;
			}
			
			// Try to get the previous control
			obj_PrevControl = obj_CurrentControl.prev('li.goto');
			
			// If there isn't a previous control then get the last one
			if(obj_PrevControl.length == 0) {
				show(obj_Carousel, -1);
			} else {
				int_Index = arr_Controls.index(obj_PrevControl);
				show(obj_Carousel, int_Index);
			}

			obj_Carousel = null;
			arr_Controls = null;
			obj_CurrentControl = null;
			obj_PrevControl = null;
		},

		/**
		 *	Set up the plugin on all elements
		 *	@param		object		obj_Options		An object containing parameters for the plugin
		 *
		 */
		init: function (obj_Options) {
			return this.each(function () {
				var	obj_ItemList = $(this),
					str_ClickNamespaced = 'click.carousel',
					str_ContainersHtml = createContainers(),
					str_ControlsHtml, obj_Settings;
				
				// Wrap the item list in the carousel containers
				var obj_Carousel = $(str_ContainersHtml);
				obj_Carousel.insertBefore(obj_ItemList);
				obj_ItemList.remove().addClass('carousel-items');
				obj_ItemList.appendTo(obj_Carousel.children('.carousel-clip'));
	
				// Define the plugin options
				obj_Settings = $.extend({
					'maxItems': 50,
					'Interval': 5000,
					'autoScroll': false
				}, obj_Options);
				
				// Collect a list of carousel items
				var arr_Items = obj_Carousel.find('.carousel-items').children();
				var int_ItemCount = arr_Items.length

		
				if (int_ItemCount > 1) {	
					obj_Carousel.append('<a class="left carousel-control" href="#myCarousel" data-slide="prev"><span>Previous</span></a><a class="right carousel-control" href="#myCarousel" data-slide="next"><span>Next</span></a>');
				}


				// Make all but the first item transparent
				arr_Items.filter(':gt(0)').css({
					'display': 'block',
					'opacity': '0'
				});

				// Save the plugin options in the element
				obj_Carousel.data('carousel-settings', obj_Settings);
				
				// Add controls
				str_ControlsHtml = createControls(int_ItemCount, obj_Settings);
				var obj_Controls = $(str_ControlsHtml);
				obj_Controls.appendTo(obj_Carousel);
				
				// Add item classes to the items
				for (var i = 0; i < int_ItemCount; i += 1) {
					arr_Items.eq(i).addClass('item-' + i)
				}
				
				
				// Pad the carousel out with fake items to allow for continious scrolling
				
				arr_Items.filter(':first').before(arr_Items.slice(int_ItemCount-1).clone().addClass('cloned'));
				arr_Items.filter(':last').after(arr_Items.slice(0, 1).clone().addClass('cloned'));
				
				// refresh
				arr_Items = obj_Carousel.find('.carousel-items').children();
				int_ItemCount = arr_Items.length;
				// Resize elements
				obj_ItemList.width((100 * int_ItemCount) + '%');
				arr_Items.width((100 / int_ItemCount) + '%');
				
				// Add events when clicking a goto link
				obj_Carousel.delegate('.controls li.goto a', str_ClickNamespaced, function(e) {
					var obj_ControlLink = $(this),
						obj_Carousel = obj_ControlLink.parents('.carousel').eq(0),
						obj_ParentControl = obj_ControlLink.parents('li.goto').eq(0),
						obj_ControlList = obj_ParentControl.parents('ul.controls').children('li.goto'),
						int_Index = obj_ControlList.index(obj_ParentControl);
					
					e.preventDefault();
					
					show(obj_Carousel, int_Index);
				})
				
				// Add events when clicking a prev link
				obj_Carousel.delegate('a.left', str_ClickNamespaced, function(e) {
					var obj_Carousel = $(this).parents('.carousel').eq(0);
					e.preventDefault();
					obj_Carousel.carousel('prev');
				})
				
				// Add events when clicking a next link
				obj_Carousel.delegate('a.right', str_ClickNamespaced, function(e) {
					var obj_Carousel = $(this).parents('.carousel').eq(0);
					e.preventDefault();
					obj_Carousel.carousel('next');
				});
				
				// Add swipe actions
				
				obj_Carousel.swipe( {
					//Generic swipe handler for all directions
					swipeLeft:function(event, direction, distance, duration, fingerCount) {
						
						var arr_Controls = $(this).find('ul.controls li.goto');
						var CurrentControl = arr_Controls.filter('.selected').index();
						var int_ItemCount = arr_Controls.length;
						
						if (CurrentControl < int_ItemCount-1) $(this).carousel('next');
					
					},
					swipeRight:function(event, direction, distance, duration, fingerCount) {

						var arr_Controls = $(this).find('ul.controls li.goto');
						var CurrentControl = arr_Controls.filter('.selected').index();

						if (CurrentControl > 0) $(this).carousel('prev');				
					}
				 });
							
				
				// Activate the first item
				show(obj_Carousel, 0);

				// Start the carousel
				if(obj_Settings.autoScroll === true) {
					obj_Carousel.carousel('start');
				}
				
				// Release the variables
				obj_ItemList = null;
				arr_Items = null;
				obj_Carousel = null;
				obj_Controls = null;
			});
		}
	
	};

	/**
	 *	Plugin entry point
	 */
	$.fn.carousel = function (str_Method) {
		var mix_Return;

		if (obj_Methods[str_Method]) {
			mix_Return = obj_Methods[str_Method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof str_Method === 'object' || !str_Method) {
			mix_Return = obj_Methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  str_Method + ' does not exist on jQuery.carousel');
		}

		return mix_Return;
	};

}(jQuery));