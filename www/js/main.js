(function(){

	$(document).ready(function(){
		console.log('hi');

		$('.nav-work').on('click', function(e){
			e.preventDefault();
			$('#fullpage').fullpage(['sections']);
			console.log('work clicked');
			$('.navigation-overlay').toggleClass('show');
		});

		$('.nav-close').on('click', function(e){
			e.preventDefault();
			$('.navigation-overlay').toggleClass('show');
			$.fn.fullpage.destroy('all');
		});
	});


})();
