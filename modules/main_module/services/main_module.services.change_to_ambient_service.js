angular.module('mainModule').service("changeToAmbientService", function () {

	var currentAmbient;
	var functionsToCallToChangeAmbient = [];
	var functionsToCallOnSetCurrentAmbient = [];

	this.addFunctionToCallOnChangeAmbient = function (functionToCall) {
		functionsToCallToChangeAmbient.push(functionToCall);
	}

	this.addfunctionToCallOnSetCurrentAmbient = function (functionToCall) {
		functionsToCallOnSetCurrentAmbient.push(functionToCall);
	}

	this.ChangeToAmbient = function (ambient) {
		if (ambient.id != currentAmbient) {
			var ambientToChange = {};
			ambientToChange.sectionTarget = ambient.id;
			ambientToChange.imageTarget = ambient.imgUrl;
			ambientToChange.target_id = ambient.id;
			ambientToChange.imageTargetLowRes = ambient.imgLowResolutionUrl;
			ambientToChange.imageTargetMobile = ambient.mobileUrl;
			ambientToChange.targetImageType = ambient.targetImageType;
            ambientToChange.blueprint = ambient.blueprint;
            ambientToChange.panoramic = ambient.panoramic;
            ambientToChange.panoramic_ratio = ambient.panoramic_ratio;
			if (ambient.rotx)
				ambientToChange.rotx = ambient.rotx;
			else ambientToChange.rotx = 0;
			if (ambient.roty)
				ambientToChange.roty = ambient.roty;
			else ambientToChange.roty = 0;

			for (var i = 0; i < functionsToCallToChangeAmbient.length; i++) {
				functionsToCallToChangeAmbient[i](ambientToChange, true);
			}
		}
	}

	this.setCurrentAmbient = function (ambient_id) {
		currentAmbient = ambient_id;
		for (var i = 0; i < functionsToCallOnSetCurrentAmbient.length; i++) {
			functionsToCallOnSetCurrentAmbient[i](ambient_id);
		}
	}
});