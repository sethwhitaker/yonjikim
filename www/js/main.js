(function($) {
	'use strict';

	var _containerHeight = 1200;
	var _width, _height, _scrollHeight;
	var _movingElements = [];
	var _scrollOffset = 0;
	var _scrollPercent = 0;
	var pre = prefix();
	var _jsPrefix  = pre.lowercase;
	if(_jsPrefix == 'moz') _jsPrefix = 'Moz'
	var _cssPrefix = pre.css;
	var _positions = [
		{
		  name: 'y',
		  start: {
				percent: 0, x: 0.1 ,y: 0.1
		  },
		  end: {
				percent: 1, x: 0.3, y: .85
		  }
		},
	];

	resize();
	initMovingElements();

	function initMovingElements() {
		for (var i = 0; i < _positions.length; i++) {
			_positions[i].diff = {
			  percent: _positions[i].end.percent - _positions[i].start.percent,
			  x: _positions[i].end.x - _positions[i].start.x,
			  y: _positions[i].end.y - _positions[i].start.y,
			}
			_positions[i].target = {};
			_positions[i].current = {};
			var el = document.getElementsByClassName('letter '+_positions[i].name)[0];
			_movingElements.push(el);
			console.log(_positions);
		}
	}

	function resize() {
		_width = window.innerWidth;
		_height = window.innerHeight;
		_scrollHeight = _containerHeight-_height;
	}


	function updateElements() {
		for (var i = 0; i < _movingElements.length; i++) {
			var p = _positions[i];
			if(_scrollPercent <= p.start.percent) {
				p.target.x = p.start.x*_width;
				p.target.y = p.start.y*_containerHeight;
			} else if(_scrollPercent >= p.end.percent) {
				p.target.x = p.end.x*_width;
				p.target.y = p.end.y*_containerHeight;
			} else {
				p.target.x = p.start.x*_width + (p.diff.x*(_scrollPercent-p.start.percent)/p.diff.percent*_width);
				p.target.y = p.start.y*_containerHeight + (p.diff.y*(_scrollPercent-p.start.percent)/p.diff.percent*_containerHeight);
			}

			// lerp
			if(!p.current.x) {
				p.current.x = p.target.x;
				p.current.y = p.target.y;
			} else {
				p.current.x = p.current.x + (p.target.x - p.current.x)*0.1;
				p.current.y = p.current.y + (p.target.y - p.current.y)*0.1;
			}
			_movingElements[i].style[_jsPrefix+'Transform'] = 'translate3d('+p.current.x+'px, '+
			  p.current.y+'px, 0px)';
		}

	}



	function loop() {
		_scrollOffset = window.pageYOffset || window.scrollTop;
		_scrollPercent = _scrollOffset/_scrollHeight || 0;
		updateElements();
		requestAnimationFrame(loop);
	}
	loop();

	window.addEventListener('resize', resize);

	/* prefix detection http://davidwalsh.name/vendor-prefix */

	function prefix() {
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('')
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
			)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	}



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

	$(document).ready(function(){
		navigation.init();
		new WOW().init();
	});


})(jQuery);