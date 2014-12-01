(function ($) {
	"use strict";
	
	
		/**
	 *	Add Mobile Menu Slider to the page
	 *	Builds the mobile menu
	 */
	function mobileMenuSlider(){
		if ($.fn.sidr) {
			
		//	Initiate the mobile menu slider
		$('#mobile-menu-toggle').sidr({
			name: 'mobile-menu',
			side: 'left'
		});
	
		//	Set Mobile meuu objects
			var oMobileMenu = $('#mobile-menu');
			var oMainMenu = $('.webpart-site-menu .homemenu').clone();
			var oSubMenu = $('.sub-navigation .sub-navigation-inner .homemenu-reveal').clone();
			var oSideMenu = $('.webpart-page-submenu .navigation_sub ul.tier-2');
			
			//	Business units or no Sidemenu
			if(oSideMenu.length == 0){
				var oBreadCrumbsSideMenu = $('.webpart-page-submenu #navigation_sub_old li.foster-section ul').first().clone();
				var oBreadCrumbs 		 = $('.webpart-page-breadcrumbs #breadcrumbs li.current').addClass('ancestor').clone();
				oBreadCrumbs.append(oBreadCrumbsSideMenu);
				oBreadCrumbs.find('a').first().addClass('ancestor');
				var oSideMenu = oBreadCrumbs;
			}else{
				var oSideMenu = oSideMenu.clone();
			}
			//	Remove the close button and infomration basket items from menu
			oMainMenu.find('.basket-reveal-container,#closeConstant').remove();
			
			
			
			//	Add the sub menu items to the mobile menu parents
			oMainMenu.find('li').each(function(index,value){
				
				var oSubMenuA = $(this).find('a');
				
				var iSubmenuId = oSubMenuA.attr('data-submenu-id');
				var iSubmenuLabel = oSubMenuA.text();
				
				//	Add classes to topmost a tag
				oSubMenuA.addClass($(this).attr("class"))				
				if(oSubMenuA.hasClass("active"))oSubMenuA.addClass('toggled');
				
					
				//	Clear out the attributes
				oSubMenuA.removeAttr('data-submenu-id');
				
				var oSubMenuItems = oSubMenu.find('ul.submenu-'+iSubmenuId +' li');
				
				
				//	Looks for the corresponding submenu item in the list that matches the topmost parent link
				//	IF it is marked as a no-click then it wont click
				var oParentItemInSub = oSubMenuItems.find("a").filter(function() {
					if($(this).text() == iSubmenuLabel){
						$(this).addClass('parent-duplicate');
						return $(this);
					}
				});




				
				
				if(oParentItemInSub.length > 0 && oParentItemInSub.hasClass("no-click")){
					oSubMenuA.addClass("no-click").removeAttr('href');
					
				}
					
					
					
				/*
				*	If it has a submenu structure
				*	Gets all the a tags from the submenns that ARNT a copy of the parent
				*/

				var oCurrentSubMenuItems = oSubMenuItems.find('a:not(.parent-duplicate)');
				if(oCurrentSubMenuItems.length > 0 ){
					
					//	Add the submenu and its items
					$(this).append('<ul class="submenu"></ul>').find('ul.submenu').html(oCurrentSubMenuItems).find('a').wrap('<li />');
					var oThisSubMenu = $(this).find('.submenu');

					//	Add a dropdown button for the submenu then make it slide the submenu
					oSubMenuA.append('<span class="toggle"></span>').find('.toggle').on('click', function(e){
						e.preventDefault();
						oThisSubMenu.slideToggle();	
						$(this).parent().toggleClass('toggled');			
					});	
				}
				
				//	Add the topmost element to the mobile menu
				oMobileMenu.append($(this));
			});	

				
			/*
			*	IF there is a sidemenu submenu for this area
				Search through the sidebar for this pages menu
			*/
			var oSideSubMenu 		= oSideMenu.find('li.ancestor').first();
			var oSideSubMenuCurrent = oSideMenu.find('li.current').first();
			//	NOrmal Side Menu
			if(oSideSubMenu.length > 0 ){
				var oSideSubMenuUl = oSideSubMenu.find('ul').first();
				var sParentUrl = oSideSubMenu.find('a.ancestor').first().attr('href');
				//	Find the children parent that corrosponds to the above url
				var oChildParent = oMobileMenu.find('a[href="'+sParentUrl+'"]').addClass('active').closest('li').addClass('active');
				oSideSubMenu.find('ul,li,a').removeAttr('class');
				oSideSubMenu = oSideSubMenu.find('ul').first();
				oChildParent.append(oSideSubMenu);
			//	Business Units menu, on sub item
			}else if(oSideSubMenuCurrent.length > 0){
				var oSideSubMenuUl = oSideSubMenuCurrent.find('ul').first();
				var sParentUrl = oSideSubMenuCurrent.find('a.current').first().attr('href');	
				var sParentName = oSideMenu.find('a').first().html();
						
				//	Find the children parent that corrosponds to the above url
				var oChildParent = oMobileMenu.find('a[href="'+sParentUrl+'"]');

				if(oChildParent.length == 0){//	Breadcrumbs
					//var oChildParent = oMobileMenu.find("a:contains('"+sParentName+"')");
					var oChildParent = oMobileMenu.find("a").filter(function() {
						if($(this).text() == sParentName){
							return $(this);
						}
					});
					oSideSubMenuCurrent = oSideMenu.find('ul').first();
					
				}else{
					oSideSubMenuCurrent = oSideSubMenuCurrent.find('ul').first();	
				}
				
				oChildParent.addClass('active').closest('li').addClass('active');
				oChildParent.after(oSideSubMenuCurrent);
				
			//	Business Units where we are on the parent item
			}else{
				
				var oSideSubMenuUl = oSideSubMenuCurrent.find('ul').first();
				var sParentUrl = oSideMenu.find('a').first().attr('href');
				var oChildParent = oMobileMenu.find('a[href="'+sParentUrl+'"]');
				var sParentName = oSideMenu.find('a').first().html();
				
				if(oChildParent.length == 0){//	Breadcrumbs
					//var oChildParent = oMobileMenu.find("a:contains('"+sParentName+"')");
					var oChildParent = oMobileMenu.find("a").filter(function() {
						if($(this).text() == sParentName){
							return $(this);
						}
					});
					
				}
				
				oChildParent.after(oSideMenu.find('ul').first());
				
			}

			//	Add Current class
			var sPageUrl = window.location.pathname;
			oMobileMenu.find('a[href="'+sPageUrl+'"]').addClass('current');		
		}
	}
		
		
	
	
	
	
	
	
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
			$.error('Method ' +  str_Method + ' does not exist on jQuery.basketlinks');
		}

		return mix_Return;
	};

}(jQuery));