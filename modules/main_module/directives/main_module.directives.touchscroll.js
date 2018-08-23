angular.module('mainModule').directive('touchscroll', ['$interval', function ($interval) {
	return {
		restrict: 'A',
		scope: {
			toactive: '=?',
			towatch: '=?'
		},
		link: function (scope, element, attrs) {

			var speedScroll = 0;

			var intervalPromise;
			var elementToScroll = element[0];
			var elementToScrollSelected = false;
			var lastelementToScrollTouchPosition;
			elementToScroll.addEventListener('touchstart', onelementToScrollTouchStart, false);
			elementToScroll.addEventListener('touchend', onelementToScrollTouchEnd, false);
			elementToScroll.addEventListener('touchmove', onelementToScrollTouchMove, false);


			function scrollInterval() {
				elementToScroll.scrollTop += speedScroll;
				speedScroll *= .7;
				if (speedScroll < 0.00001 && speedScroll > 0)
					$interval.cancel(intervalPromise);
				if (speedScroll > -0.00001 && speedScroll < 0)
					$interval.cancel(intervalPromise);

			}

			function onelementToScrollTouchStart(event) {
				if (event.touches.length == 1) {
					event.preventDefault();
					event.stopPropagation();
					elementToScrollSelected = true;
					lastelementToScrollTouchPosition = event.touches[0].pageY;
					speedScroll = 0;
					$interval.cancel(intervalPromise);
					intervalPromise = $interval(scrollInterval, 17);
				}
			}

			function onelementToScrollTouchEnd(event) {
				if (elementToScrollSelected) {
					event.preventDefault();
					elementToScrollSelected = false;
				}
			}

			function onelementToScrollTouchMove(event) {
				if (event.touches.length == 1 && elementToScrollSelected) {
					event.preventDefault();
					var speedToAdd = lastelementToScrollTouchPosition - event.touches[0].pageY;

					speedScroll += speedToAdd;
					lastelementToScrollTouchPosition = event.touches[0].pageY;
				}
			}

			var toactiveelement;

			if (scope.toactive) {

				toactiveelement = document.getElementById(scope.toactive);
				scope.$watch('towatch', function (newValue, oldValue) {
					if (scope.towatch) {
						setData();
						setTimeout(function () {
							setData();
						})

					}
				});

				window.addEventListener("resize", function () {
					setData();
					setTimeout(function () {
						setData();
					})
				});
			}

			function setData() {
				if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
					toactiveelement.style.display = "inherit";
				} else {
					toactiveelement.style.display = "none";
				}
			}


		},
		controller: function ($scope) {}
	}
}]);