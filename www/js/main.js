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
			this.$nav.toggleClass('active');
			this.$navMulti.toggleClass('active');
			this.$navOverlay.toggleClass('show');
			this.$navWork.off('click', this.openNav);
			this.$navMulti.off('click', this.scrollToTop);
			this.$navMulti.on('click',	$.proxy(this.closeNav, this));
			this.createFullpage();
		},
		closeNav: function(e){
			e.preventDefault();
			this.$navMulti.off('click', this.closeNav);
			this.addEventHandlers();
			this.$nav.toggleClass('active');
			this.$navMulti.toggleClass('active');
			this.$navOverlay.toggleClass('show');
			this.destroyFullpage();
		},
		createFullpage: function(){
			this.$navFull.fullpage(['sections']);
		},
		destroyFullpage: function(){
			$.fn.fullpage.destroy('all');
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
	});


})(jQuery);