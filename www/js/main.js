(function($) {
	'use strict';

	var navigation = {


		init: function(){
			this.isOpen = false;
			this.$nav = $('.navigation');
			this.$navWork = this.$nav.find('.nav-work');
			this.$navMulti = $('.js-nav-multi-button');
			this.$navOverlay = $('.navigation-overlay');
			this.$navFull = $("#fullpage");
			this.addEventHandlers();
		},
		openNav: function(e){
			e.preventDefault();
			var _this = this;
			this.$navWork.off('click', this.openNav);
			this.$navMulti.off('click', this.scrollToTop);
			this.$navMulti.on('click',	$.proxy(this.closeNav, this));
			this.$navFull.fullpage({
				//Navigation
				navigation: true,
				navigationPosition: 'right',

				//Scrolling
				css3: true,
				scrollingSpeed: 850,
				easingcss3: 'cubic-bezier(.86,0,.07,1)',

				//Design
				controlArrows: true,
				sectionsColor : ['#143658', '#ffc529'],
				afterRender: function(){
					console.log("after render");
					_this.$nav.toggleClass('active');
					_this.$navMulti.toggleClass('active');
					_this.$navOverlay.toggleClass('show');
				},
				afterLoad:function(anchorLink, index){
					var $section = $(this);
					var timeout = (index==1 && _this.isOpen==false)? 700: 0;

					setTimeout(function(){
						$section.find('h1 a').removeClass('fadeOut fadeOutUp fadeOutDown').addClass('fadeInDownSmall');
						$section.find('.nav-img img').removeClass('fadeOut fadeOutUp fadeOutDown').addClass('fadeIn');
					}, timeout);

					_this.isOpen = true;
				},
				onLeave: function(index, nextIndex, direction){
	            var $section = $(this);

	            if(direction =='down'){
	            	$section.find('h1 a').removeClass('fadeInDownSmall').addClass('fadeOutUp');
						$section.find('.nav-img img').removeClass('fadeIn').addClass('fadeOutUp');
	            }
	            else if(direction == 'up'){
	            	$section.find('h1 a').removeClass('fadeInDownSmall').addClass('fadeOutDown');
						$section.find('.nav-img img').removeClass('fadeIn').addClass('fadeOutDown');
	            }
	         }
		   });
		},
		closeNav: function(e){
			e.preventDefault();
			this.$navMulti.off('click', this.closeNav);
			this.addEventHandlers();
			this.$nav.toggleClass('active');
			this.$navMulti.toggleClass('active');
			this.$navOverlay.toggleClass('show');
			this.$navOverlay.find('h1 a').removeClass('fadeOut fadeOutUp fadeOutDown fadeIn fadeInUp fadeInDownSmall');
			this.$navOverlay.find('.nav-img img').removeClass('fadeOut fadeOutUp fadeOutDown fadeIn fadeInUp fadeInDownSmall');
			setTimeout(function(){
				$.fn.fullpage.destroy('all');
			},800);
			this.isOpen = false;
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

	var homepage = function(){

		var flightpath = {
			y : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: 170,	y: 285}
					]
			},
			o : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: -19,	y: 130}
					]
			},
			n : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: -42,	y: 390}
					]
			},
			j : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: -255, y: 220}
					]
			},
			i : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: -468, y: 80}
					]
			},
			k : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: 440,	y: -140}
					]
			},
			i2 : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: 243,	y: -325}
					]
			},
			m : {
				curviness: 0,
				autoRotate: false,
				values: [
						{x: -114,	y: -360}
					]
			}
		};
		// init controller
		var controller = new ScrollMagic.Controller();

		// create tween
		var tween = new TimelineMax();

		 tween.to($(".y"), 1, {css:{bezier:flightpath.y}, ease:Power1.easeInOut}, 0)
				.to($(".o"), 1, {css:{bezier:flightpath.o}, ease:Power1.easeInOut}, 0)
				.to($(".n"), 1, {css:{bezier:flightpath.n}, ease:Power1.easeInOut}, 0)
				.to($(".j"), 1, {css:{bezier:flightpath.j}, ease:Power1.easeInOut}, 0)
				.to($(".i"), 1, {css:{bezier:flightpath.i}, ease:Power1.easeInOut}, 0)
				.to($(".k"), 1, {css:{bezier:flightpath.k}, ease:Power1.easeInOut}, 0)
				.to($(".i2"), 1, {css:{bezier:flightpath.i2}, ease:Power1.easeInOut}, 0)
				.to($(".m"), 1, {css:{bezier:flightpath.m}, ease:Power1.easeInOut}, 0);


		// build scene
		var scene = new ScrollMagic.Scene({triggerElement: "#trigger", duration: 1200, triggerHook: 0, offset: -200})
						.setPin(".letters")
						.setTween(tween)
						.addTo(controller);
	}

	$(document).ready(function(){
		if($('body').hasClass('home')){
			homepage();
		}
		navigation.init();
		new WOW().init();
	});


})(jQuery);