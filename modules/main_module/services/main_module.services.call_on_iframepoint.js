angular.module('mainModule').service("callOnIframePoint", function () {

    var functionsToCallOnIframePoint = [];

    this.addFunctionToCallOnIframePoint = function (functionToCall) {
        functionsToCallOnIframePoint.push(functionToCall);
	}

    this.callIframePoint = function(point){
        for (var i = 0; i < functionsToCallOnIframePoint.length; i++) {
            functionsToCallOnIframePoint[i](point);
        }
    }
    
});