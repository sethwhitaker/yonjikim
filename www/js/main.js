(function($) {
	'use strict';

	var navigation = {


		init: function(){
			this.$nav = $('.navigation');
			this.$navWork = this.$nav.find('.nav-work');
			this.$navMulti = $('.js-nav-multi-button');
			this.$navOverlay = $('.navigation-overlay');
			this.$navFull = $("#fullpage");
			this.addEventHandlers();
		},
		openNav: function(e){
			e.preventDefault();
			this.$navFull.fullpage(['sections']);
			this.$nav.toggleClass('active');
			this.$navMulti.toggleClass('active');
			this.$navOverlay.toggleClass('show');
			this.$navWork.off('click', this.openNav);
			this.$navMulti.off('click', this.scrollToTop);
			this.$navMulti.on('click',	$.proxy(this.closeNav, this));
		},
		closeNav: function(e){
			e.preventDefault();
			this.$navMulti.off('click', this.closeNav);
			this.addEventHandlers();
			this.$nav.toggleClass('active');
			this.$navMulti.toggleClass('active');
			this.$navOverlay.toggleClass('show');
			setTimeout(function(){
				$.fn.fullpage.destroy('all');
			},800);
		},
		scrollToTop: function(e){
			e.preventDefault;

		    var $this = $(this),
		        $target = $(this.hash);

		    if( $target.length ){
		      $('html,body').animate({
		          scrollTop: $target.offset().top
		        }, 700, 'swing');
		    }

		    return false;
		},
		addEventHandlers: function(){
			this.$navWork.on('click', $.proxy(this.openNav, this));
			this.$navMulti.on('click', this.scrollToTop);
		}


	};

	$(document).ready(function(){
		navigation.init();
		new WOW().init();
	});


})(jQuery);