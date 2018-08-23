angular.module('mainModule').service("handleInputGUI", function () {
	
	var functionToHandleInputGUI;
	this.SetFunctionToHandleInput = function(functionToHandleInput){
		functionToHandleInputGUI = functionToHandleInput;
	}
	
	this.DisableInputGUI = function(){
		functionToHandleInputGUI(true);
	}
	
	this.EnableInputGUI = function(){
		functionToHandleInputGUI(false);
	}
	
	var functionToCloseButonsGUI;
	this.SetFunctionToCloseButons = function(functionToCloseButons){
		functionToCloseButonsGUI = functionToCloseButons;
	}
	
	this.CloseButtonGUI = function(){
		functionToCloseButonsGUI();
	}

});