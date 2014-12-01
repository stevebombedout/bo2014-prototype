// JavaScript Document


	// tabs
	
	 // When the document loads do everything inside here ...  
  $(document).ready(function(){  
      
		// When a link is clicked  
		$("ul.tab-nav li a").click(function () {  
			  
			// switch all tabs off  
			$("ul.tab-nav li a.active").removeClass("active");  
			  
			// switch this tab on  
			$(this).addClass("active");  
			
			var item_count = $("ul.tab-nav li").length;
			  
			var backgroundPos = 100/item_count;
			
			backgroundPos = (backgroundPos * $(this).parent().index()) + (100/(item_count * 2));  
			
			$('div.marker').animate({left: backgroundPos + '%'}); 
			 
			// Now figure out what the 'title' attribute value is and find the element with that id.  Then slide that down.  
			var content_show = $(this).attr("title");  
			 
			$("ul.tab-content li.active").fadeOut(500, function() {
				$("ul.tab-content li.active").removeClass("active");
				
				var content_show = $('ul.tab-nav a.active').attr("title"); 
				  
				$("li."+content_show).fadeIn(500).addClass("active");   
			});  

			return false;
		});  
	  
	  var item_count = $("ul.tab-nav li").length;
	  var backgroundPos = 100/item_count;
	  backgroundPos = (100/(item_count * 2)); 
	  $('div.marker').animate({left: backgroundPos + '%'}); 
	  
	  });  