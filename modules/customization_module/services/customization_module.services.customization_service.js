angular.module('customizationModule').service("customizationService", function () {

	this.isInIframe = function(){
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
});
