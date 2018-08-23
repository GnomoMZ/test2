angular.module('mainModule').service("statusLoadingScreen", function () {

	var currentAmbient;
	var functionsToCallOnStartLoading = [];
    var functionsToCallOnFinishLoading = [];

    this.addFunctionToCallOnStartLoading = function (functionToCall) {
        functionsToCallOnStartLoading.push(functionToCall);
	}

    this.addfunctionToCallOnFinishLoading = function (functionToCall) {
        functionsToCallOnFinishLoading.push(functionToCall);
	}

	this.LoadingStarted = function () {
        for (var i = 0; i < functionsToCallOnStartLoading.length; i++) {
            functionsToCallOnStartLoading[i]();
        }
		
	}

    this.LoadingFinish = function () {
        for (var i = 0; i < functionsToCallOnFinishLoading.length; i++) {
            functionsToCallOnFinishLoading[i]();
		}
	}
});