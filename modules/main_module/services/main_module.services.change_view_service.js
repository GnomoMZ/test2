angular.module('mainModule').service("changeViewService", function () {

	var functionToCallToChangeView;

	this.addFunctionToCallOnChangeView = function (functionToCall) {
		functionToCallToChangeView = functionToCall;
	}

	this.ChangeView = function (activate) {
		functionToCallToChangeView(activate);
	}
});