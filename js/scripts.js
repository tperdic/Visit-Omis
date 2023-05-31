/**
 * @fileoverview dragscroll - scroll area by dragging
 * @version 0.0.8
 * 
 * @license MIT, see https://github.com/asvd/dragscroll
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 * 
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    var _window = window;
    var _document = document;
    var mousemove = 'mousemove';
    var mouseup = 'mouseup';
    var mousedown = 'mousedown';
    var EventListener = 'EventListener';
    var addEventListener = 'add'+EventListener;
    var removeEventListener = 'remove'+EventListener;
    var newScrollX, newScrollY;

    var dragged = [];
    
    var captureClick = function(e)  {
        e.stopPropagation();
        e.preventDefault();
        window.removeEventListener('click', captureClick, true);
        return false;
    };
    
    var reset = function(i, el) {
        for (i = 0; i < dragged.length;) {
            el = dragged[i++];
            el.classList.remove("dragging");
            el = el.container || el;
            el[removeEventListener](mousedown, el.md, 0);
            _window[removeEventListener](mouseup, el.mu, 0);
            _window[removeEventListener](mousemove, el.mm, 0);
        }

        // cloning into array since HTMLCollection is updated dynamically
        dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
        for (i = 0; i < dragged.length;) {
            (function(el, lastClientX, lastClientY, pushed, scroller, cont){
            	var initialX;
            	var initialY;
            	
                (cont = el.container || el)[addEventListener](
                    mousedown,
                    cont.md = function(e) {
                        if (!el.hasAttribute('nochilddrag') ||
                            _document.elementFromPoint(
                                e.pageX, e.pageY
                            ) == cont
                        ) {
                            pushed = 1;
                            initialX = lastClientX = e.clientX;
                            initialY = lastClientY = e.clientY;

                            e.preventDefault();
                        }
                    }, 0
                );

                _window[addEventListener](
                    mouseup, cont.mu = function(e) {
                    	if(el.classList.contains('dragging')) {
                    		window.addEventListener(
                    	        'click',
                    	        captureClick,
                    	        true 
                    	    );
                    	}
                    	pushed = 0;
                    	el.classList.remove("dragging");
                	}, 0
                );

                _window[addEventListener](
                    mousemove,
                    cont.mm = function(e) {
                        if (pushed) {
                            (scroller = el.scroller||el).scrollLeft -=
                                newScrollX = (- lastClientX + (lastClientX=e.clientX));
                            scroller.scrollTop -=
                                newScrollY = (- lastClientY + (lastClientY=e.clientY));
                            if (el == _document.body) {
                                (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                scroller.scrollTop -= newScrollY;
                            }
                            if(Math.abs(initialX - e.clientX) >= 5 || Math.abs(initialY - e.clientY) >= 5) {
                            	el.classList.add("dragging");
                            }
                        }
                    }, 0
                );
             })(dragged[i++]);
        }
    }
    if (_document.readyState == 'complete') {
        reset();
    } else {
        _window[addEventListener]('load', reset, 0);
    }
    exports.reset = reset;
}));


$(document).ready(function(){
	var $btns = $('.filter-butt').click(function() {
		event.preventDefault();
		var $el = $('.' + this.id).show();
		$('.filtering > .box').not($el).hide();
		$btns.removeClass('active');
		$(this).addClass('active');
	});

	$('.pictxt-img').each(function() {
		var $gallery = $(this);
		
		var $mfp = $gallery.magnificPopup({
		  delegate: 'a',
		  type: 'image',
		  tLoading: 'Loading image #%curr%...',
		  mainClass: 'mfp-img-mobile',
		  gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		  },
		  image: {
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
			titleSrc: function(item) {
			  return item.el.attr('title');
			}
		  },
		  callbacks: {
			    open: function() { //callback koji dodaje text
					$('<div>').addClass('mfp-addon  mfp-prevent-close').html($('<div>').addClass('mfp-addon-inner').html($gallery.siblings('.pictxt-txt').children('.pictxt-txt-inner').html())).insertAfter(".mfp-preloader");
					$('.mfp-addon-inner > h3:first-child').on('click.mft-addon-toggle', function(e) { 
						e.preventDefault();
						e.stopPropagation();
						$('body').toggleClass('mfp-open-addon');
					});
			    },
			    close: function() {
			    	$('.mfp-addon-inner > h3:first-child').off('click.mft-addon-toggle');
			    	$('body').removeClass('mfp-open-addon');
			    }
			}
		});
	});
	
	$('.pictxt-txt > a.readmore').click(function(e) {
		e.preventDefault();
		$('body').addClass('mfp-open-addon');
		$(this).parent().siblings('.pictxt-img').children('a:first-child').click();
	});
	
	
	$('.fullscreen').magnificPopup({
		type: 'image',
		items: [
		  {
			src: 'https://picsum.photos/id/1041/1920/1080'
		  },
		  {
			src: 'https://picsum.photos/id/1040/1920/1080'
		  },
		  {
			src: 'https://picsum.photos/id/1039/1920/1080'
		  },
		],
		gallery: {
			enabled: true
		}
	});
	
	$('.hero_owl').owlCarousel({
		loop:true,
		margin:0,
		responsiveClass:true,
		dots:true,
		nav:true,
		items:1
	});

	$('.imgslider').owlCarousel({
		loop:true,
		margin:0,
		responsiveClass:true,
		dots:true,
		nav:true,
		items:1
	});
	
	$('.imgslider a').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});
	
	$('.story_slider .owl-carousel').owlCarousel({
		items:1,
		loop:false,
		nav:true,
		responsive:{
			0:{
				stagePadding: 40,
				margin:30,
				nav:false
			},
			950:{
				stagePadding: 100,
				margin:135
			},
			1200:{
				stagePadding: 200,
				margin:135
			},
			1400:{
				stagePadding: 300,
				margin:135
			},
			1600:{
				stagePadding: 400,
				margin:135
			}
		}
	});
});

$(document).ready(function(){
	var body = $("body");
	var modal = $("#popup");

	var preModalFocused;
	var firstFocusable;
	var lastFocusable;
	
	function showSearchModal() {
		preModalFocused = document.activeElement;
		modal.show();
		body.css('overflow','hidden');
		var focusables = modal.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]');
		firstFocusable = focusables.first();
		lastFocusable = focusables.last();
		firstFocusable.focus();
		modal.on('keydown.searchmodal', keyboardHandler);
	}
	
	function hideSearchModal() {
		modal.off('keydown.searchmodal', keyboardHandler);
		modal.hide();
		body.css('overflow','auto');
		preModalFocused.focus();
	}
	
	function keyboardHandler(e) {
	    if (e.keyCode === 9) { // tab
	      if (e.shiftKey) { // shift + tab
	        if (document.activeElement === firstFocusable[0]) {
	          e.preventDefault();
	          lastFocusable.focus();
	        }
	      } else { // tab
	        if (document.activeElement === lastFocusable[0]) {
	          e.preventDefault();
	          firstFocusable.focus();
	        }
	      }
	    }
	    if(e.keyCode === 27) { // esc
	    	hideSearchModal();
	    }
	}
	
	$("#search").click(function(e) {
		e.preventDefault();
		showSearchModal();
	});
	
	$("#close").click(function(e) {
		e.preventDefault();
		hideSearchModal();
	});
	
	modal.click(function(e) {
		if (e.target !== this) {
			return;
		}
		e.preventDefault();
		hideSearchModal();
	});
});


$(document).ready(function() {
    function body(){
        var open = $('.menu').hasClass('open');   
         //$("body").toggleClass("hideoverflow" , !!open); 
    }  
	
	$(".menu_trigger").click(function(){
	    $(".menu").toggleClass("open");
	    $(".menu .has-sub").removeClass('open');
		body();
	});
	
	$('.menu .has-sub a').click(function(){
        var el = $(this).parent('li.has-sub'), active = el.hasClass('open');
        $('.menu .has-sub').removeClass('open');
        active || el.addClass('open');   
        body();
	});		
	
	$("#menu_close").click(function(){
	    $(".menu").toggleClass("open");
	    body();
	});	
	
	$(".search").click(function(){
	    $(".searchbar").toggleClass("open");
	});
	
	$(".close").click(function(){
	    $(".searchbar").toggleClass("open");
	});


});

$(document).ready(function() {
	
	$('.w20 ul li.has-sub > a').click(function(){
        var el2 = $(this).parent('li'), active = el2.hasClass('open');
        $('.w20 ul li.has-sub').removeClass('open');
        active || el2.addClass('open'); 
		return false;
	});	
});

$(function () {
    /**accesibility css toggler*/
    function createCookie(name, value, days) {
	    var expires;
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();
	    } else {
	        expires = "";
	    }
	    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
	}

	function readCookie(name) {
	    var nameEQ = encodeURIComponent(name) + "=";
	    var ca = document.cookie.split(';');
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) === ' ')
	            c = c.substring(1, c.length);
	        if (c.indexOf(nameEQ) === 0)
	            return decodeURIComponent(c.substring(nameEQ.length, c.length));
	    }
	    return null;
	}
	
	function enableAccessability() {
		$('link.accessibility').prop('disabled', false);
		$('.dragmenu_wrap').removeClass('dragscroll');
		dragscroll.reset();
		$('a[target]').each(function(){
			var $this = $(this);
			$this.data('target', $this.attr('target'));
			$this.attr('target', '');
		});
		$(".dragmenu_arrow").attr('tabindex', '-1');
	}
	
	function disableAccessability() {
		$('link.accessibility').prop('disabled', true);
		$('.dragmenu_wrap').addClass('dragscroll');
		dragscroll.reset();
		$('a[target=""], a:not([target])').each(function(){
			var $this = $(this);
			$this.attr('target', $this.data('target'));
		});
		$(".dragmenu_arrow").removeAttr('tabindex');
	}
	
	if(readCookie('accessibleCSS') == 'true'){
		enableAccessability();
	}
	$('a.accessibility').on('click', function(){
		var enabled = ! $('link.accessibility').prop('disabled');
		createCookie('accessibleCSS', !enabled, 365);
		if(enabled) {
			disableAccessability();
		}
		else {
			enableAccessability();
		}
		return false;
	});       
    
});

// horizontal scrolling menu
$(document).ready(function(){
	$('.dragmenu_wrap').each(function() {
		var scrollStep = 250;
		var scrollSpeed = 100;
		
		var el = $(this);
		
		var leftArr = el.parent().children(".dragmenu_arrow.left");
		var rightArr = el.parent().children(".dragmenu_arrow.right");
		
		leftArr.click(function(e) {
			e.preventDefault();
			if(leftArr.hasClass("disabled")) {
				return;
			}
			var leftPos = el.scrollLeft(); 
			el.animate({ scrollLeft: leftPos - scrollStep }, scrollSpeed);
		});
		
		rightArr.click(function(e) {
			e.preventDefault();
			if(rightArr.hasClass("disabled")) {
				return;
			}
			var leftPos = el.scrollLeft(); 
			el.animate({ scrollLeft: leftPos + scrollStep }, scrollSpeed);
		});
		
		function checkEndPosition() {
			if((el[0].offsetWidth + el.scrollLeft() >= el[0].scrollWidth)) {
				rightArr.addClass('disabled');
			}
			else {
				rightArr.removeClass('disabled');
			}
			if(el.scrollLeft() <= 0) {
				leftArr.addClass('disabled');
			}
			else {
				leftArr.removeClass('disabled');
			}
		}
		
		el.scroll(function () {
			checkEndPosition();
		});
		$(window).resize(function () {
			checkEndPosition();
		});
		checkEndPosition();
	});
});


/**/