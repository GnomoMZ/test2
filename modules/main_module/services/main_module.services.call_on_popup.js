angular.module('mainModule').service("callOnPopupPoint", function () {

    var functionsToCallOnPopupPoint = [];

    this.addFunctionToCallOnPopupPoint = function (functionToCall) {
        functionsToCallOnPopupPoint.push(functionToCall);
	}

    this.callPopupPoint = function(point){
        for (var i = 0; i < functionsToCallOnPopupPoint.length; i++) {
            functionsToCallOnPopupPoint[i](point);
        }
    }
    
});