angular.module('mainModule').directive('copysizeandoverlap', function () {
	return {
		restrict: 'A',
		scope: {
			towatch: '=',
			tocopy: '='
		},
		link: function (scope, element, attrs) {

			var elementToModify = element[0];

			var elementoToCopy = document.getElementById(scope.tocopy);

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
			});

			function setData() {
				elementToModify.style.height = elementoToCopy.clientHeight + "px";
				elementToModify.style.marginTop = (-elementoToCopy.clientHeight) + "px";
				elementToModify.style.width = elementoToCopy.clientWidth + "px";
			}


		},
		controller: function ($scope) {}
	}
});