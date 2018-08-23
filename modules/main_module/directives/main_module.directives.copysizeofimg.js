angular.module('mainModule').directive('copysizeofimg', function () {
	return {
		restrict: 'A',
		scope: {
			towatch: '=',
			tocopy: '=',
			padding: '='
		},
		link: function (scope, element, attrs) {

			var elementToModify = element[0];

			var elementoToCopy = document.getElementById(scope.tocopy);
            
            var intervalSet = setInterval(setData, 50);

            scope.$watch(
                function () { 
                    return {
                        width: elementoToCopy.width,
                        height: elementoToCopy.height,
                    }
                },
                function () {setData();}, //listener 
                true //deep watch
            );
            setData();
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
            
            var stopedInterval = false;

			function setData() {
				if(!scope.padding)
					scope.padding = 0
				
				elementToModify.style.height = elementoToCopy.height + scope.padding + "px";
				elementToModify.style.width = elementoToCopy.width+ scope.padding + "px";

                if(!stopedInterval && elementoToCopy.height != 0)
                {
                    clearInterval(intervalSet);
                    stopedInterval = true;
                }
			}


		},
		controller: function ($scope) {}
	}
});