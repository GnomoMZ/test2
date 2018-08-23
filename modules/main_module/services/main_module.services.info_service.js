angular.module('mainModule').service("infoService", function () {
    this.dataIsSet = false;
	this.currentButtonSelected = "";
    
	var jsonData;
    var functionsOnDataLoaded = [];
    var functionsOnChangeAmbient = [];
    
    this.setDataJson = function (data) {
        jsonData = data;
        this.dataIsSet = true;
        var ii = 0;
        while (ii < functionsOnDataLoaded.length) {
            functionsOnDataLoaded[ii](jsonData);            
            ii++;
        }
    }

    this.getDataJson = function () {
        return jsonData;
    }

    this.addFunctionOnDataReady = function (functionToAdd) {
        functionsOnDataLoaded.push(functionToAdd);
    }
    
    this.setAmbientChange = function(id)
    {
        var data;
        var ii = 0;
        while (ii < jsonData.ambients.length) {
            if(jsonData.ambients[ii].id == id)
                data = jsonData.ambients[ii];
            ii++;
        }
                
        ii = 0;
        while (ii < functionsOnChangeAmbient.length) {
            functionsOnChangeAmbient[ii](data);            
            ii++;
        }
    }
    
    this.addFunctionOnChangeAmbient = function(functionToAdd)
    {
        functionsOnChangeAmbient.push(functionToAdd);
    }
	
});