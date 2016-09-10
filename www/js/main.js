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
						$section.find('h1 a').removeClass('fadeOut fadeOutUp fadeOutDown').addClass('fadeInDown');
						$section.find('.nav-img img').removeClass('fadeOut fadeOutUp fadeOutDown').addClass('fadeIn');
					}, timeout);

					_this.isOpen = true;
				},
				onLeave: function(index, nextIndex, direction){
	            var $section = $(this);

	            if(direction =='down'){
	            	$section.find('h1 a').removeClass('fadeInDown').addClass('fadeOutUp');
						$section.find('.nav-img img').removeClass('fadeIn').addClass('fadeOut');
	            }
	            else if(direction == 'up'){
	            	$section.find('h1 a').removeClass('fadeInDown').addClass('fadeOutDown');
						$section.find('.nav-img img').removeClass('fadeIn').addClass('fadeOut');
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
			this.$navOverlay.find('h1 a').removeClass('fadeOut fadeOutUp fadeOutDown fadeIn fadeInUp fadeInDown');
			this.$navOverlay.find('.nav-img img').removeClass('fadeOut fadeOutUp fadeOutDown fadeIn fadeInUp fadeInDown');
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

	$(document).ready(function(){
		navigation.init();
		new WOW().init();
	});


})(jQuery);