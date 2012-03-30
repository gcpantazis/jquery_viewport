/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {

	// Boolean Indicators for ':' Selector filters

	$.belowthefold = function(element, settings) {
		var fold = $(window).height() + $(window).scrollTop();
		return fold <= $(element).offset().top - settings.threshold;
	};

	$.abovethetop = function(element, settings) {
		var top = $(window).scrollTop();
		return top >= $(element).offset().top + $(element).height() - settings.threshold;
	};

	$.rightofscreen = function(element, settings) {
		var fold = $(window).width() + $(window).scrollLeft();
		return fold <= $(element).offset().left - settings.threshold;
	};

	$.leftofscreen = function(element, settings) {
		var left = $(window).scrollLeft();
		return left >= $(element).offset().left + $(element).width() - settings.threshold;
	};

	$.inviewport = function(element, settings) {
		return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
	};

	$.isclipped = function(element, settings) {
		var clippedPositionData = methods.clippedPosition(element);
		return !( clippedPositionData.portionOnScreen === 0 || clippedPositionData.portionOnScreen === 1 );
	};

	// Methods

	var methods = {

		// TODO : Expand for vertical clipping.
		clippedPosition : function( element, settings ) {
			var $el = $(element),
				$window = $(window);

			var windowWidth = $window.width(),
				elemWidth = $el.width(),
				elemViewportLeft = $el.offset().left - $window.scrollLeft();

			var data = {};

			// Object is completely off-screen, return.
			if ( !$.inviewport(element, {threshold: 0}) ) {
				data.portionOnScreen = 0;
				return data;
			}

			// Overflows on both sides.
			if ( elemViewportLeft < 0 && elemViewportLeft + elemWidth > windowWidth ) {
				data.portionOnScreen = windowWidth / elemWidth;
				data.portionOffScreenLeft = -1 * elemViewportLeft / elemWidth;
				data.portionOffScreenRight = 1 - data.portionOnScreen - data.portionOffScreenLeft;
				data.horizontal = 'both';

			// Overflows on the left only.
			} else if ( elemViewportLeft < 0 ) {
				data.portionOnScreen = ( elemWidth + elemViewportLeft ) / elemWidth;
				data.portionOffScreenLeft = 1 - data.portionOnScreen;
				data.horizontal = 'left';

			// Overflows on the right only.
			} else if ( elemViewportLeft < windowWidth && elemViewportLeft + elemWidth > windowWidth ) {
				data.portionOnScreen = ( windowWidth - elemViewportLeft ) / elemWidth;
				data.portionOffScreenRight = 1 - data.portionOnScreen;
				data.horizontal = 'right';

			// Does not overflow.
			} else {
				data.portionOnScreen = 1;
			}

			return data;
		}
	};

	// EXTEND

	$.fn.clippedPosition = function() {
		return methods.clippedPosition(this);
	};

	$.extend($.expr[':'], {
		"below-the-fold": function(a, i, m) {
			return $.belowthefold(a, {threshold : 0});
		},
		"above-the-top": function(a, i, m) {
			return $.abovethetop(a, {threshold : 0});
		},
		"left-of-screen": function(a, i, m) {
			return $.leftofscreen(a, {threshold : 0});
		},
		"right-of-screen": function(a, i, m) {
			return $.rightofscreen(a, {threshold : 0});
		},
		"in-viewport": function(a, i, m) {
			return $.inviewport(a, {threshold : 0});
		},
		"clipped": function(a, i, m) {
			return $.isclipped(a, {
				threshold: 0
			});
		}
	});

})(jQuery);
