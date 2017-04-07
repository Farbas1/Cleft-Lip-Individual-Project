document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
	//Make container fullscreen and dynamically adjust the screen when resized.       
	function create_paddings() {
		var no_padding = $(window).width();

		if($(window).width() < 766) {
			$('.content').css('padding-left', '20px');   
			$('.content').css('padding-right', '20px');   
			$('.container-fullscreen, .image-fullscreen').css('margin-left', '-21px');
			$('.container-fullscreen, .image-fullscreen').css('width', no_padding +2);   
		}        
		if($(window).width() >= 766) {
			$('.content').css('padding-left', '50px');   
			$('.content').css('padding-right', '50px');  
			$('.container-fullscreen, .image-fullscreen').css('margin-left', '-51px');
			$('.container-fullscreen, .image-fullscreen').css('width', no_padding +2);
		}
	}

	$(window).resize(function() { 
		create_paddings();
	});
	
	create_paddings();
}
