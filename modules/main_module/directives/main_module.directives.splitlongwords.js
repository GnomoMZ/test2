angular.module('mainModule').directive('splitlongwords', function () {
	return {
		restrict: 'A',
		scope: {
			towatch: '=',
			tosplit: '=',
			fontvalue: '=',
			padding: '=?',
			toshow: '='
		},
		templateURL: "modules/threejs_player_module/templates/splitlongwords.html",
		link: function (scope, element, attrs) {

			var padding = scope.padding;
			var widthElement = element[0].clientWidth - padding;
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			context.font = scope.fontvalue;

			if (scope.padding == undefined) {
				padding = 0;
			}

			scope.$watch('tosplit', function (newValue, oldValue) {
				if (scope.tosplit) {
					widthElement = element[0].clientWidth - padding;
					SplitStringByWidth();
				}
			});

			scope.$watch('towatch', function (newValue, oldValue) {
				if (scope.tosplit) {
					setTimeout(function () {
						widthElement = element[0].clientWidth - padding;
						SplitStringByWidth();
					})

				}
			});

			window.addEventListener("resize", function () {
				if (element[0].clientWidth != widthElement) {
					widthElement = element[0].clientWidth - padding;
					if (scope.tosplit) {
						SplitStringByWidth();
					}
				}
			});

			function SplitStringByWidth() {

				var stringToSplit = scope.tosplit;
				var towork = stringToSplit;

				var words = stringToSplit.split(" ");
				var counterChanges = 0;


				for (var i = 0; i < words.length; i++) {
					var widthWord = context.measureText(words[i]);

					if (widthWord.width > widthElement) {
						towork = towork.replace(words[i], splitWord(words[i]));
						scope.toshow = towork;
						counterChanges++;
					}
				}
				if (counterChanges == 0 || widthElement <= 0 || !widthElement) {
					scope.toshow = stringToSplit;
				}
			
				setTimeout(function () {
					scope.$apply();
				});
			}

			function splitWord(wordToSplit) {
				if (context.measureText(wordToSplit).width > widthElement) {
					var j = wordToSplit.length;
					while (j > 0) {
						if (context.measureText(wordToSplit.substring(0, j) + '...').width < widthElement) {
							return wordToSplit.substring(0, j) + "... " + splitWord(wordToSplit.substring(j, wordToSplit.length));
						}
						j--;
					}
				} else {
					return wordToSplit;
				}
			}
		},
		controller: function ($scope) {}
	}
});