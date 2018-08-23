angular.module('customizationModule').directive('whithoutInfoControllsClass', function () {
	var domains = [
		"http://micsolutions.co",
		"http://www.homegate.ch",
		"https://www.homegate.ch",
		"http://test.homegate.ch",
		"http://homegate.ch",
		"https://homegate.ch"
	];
	
	function ParsedUrl(url) {
		var parser = document.createElement("a");
		parser.href = url;

		// IE 8 and 9 dont load the attributes "protocol" and "host" in case the source URL
		// is just a pathname, that is, "/example" and not "http://domain.com/example".
		parser.href = parser.href;

		// IE 7 and 6 wont load "protocol" and "host" even with the above workaround,
		// so we take the protocol/host from window.location and place them manually
		if (parser.host === "") {
			var newProtocolAndHost = window.location.protocol + "//" + window.location.host;
			if (url.charAt(1) === "/") {
				parser.href = newProtocolAndHost + url;
			} else {
				// the regex gets everything up to the last "/"
				// /path/takesEverythingUpToAndIncludingTheLastForwardSlash/thisIsIgnored
				// "/" is inserted before because IE takes it of from pathname
				var currentFolder = ("/"+parser.pathname).match(/.*\//)[0];
				parser.href = newProtocolAndHost + currentFolder + url;
			}
		}

		// copies all the properties to this object
		var properties = ['host', 'hostname', 'hash', 'href', 'port', 'protocol', 'search'];
		for (var i = 0, n = properties.length; i < n; i++) {
		  this[properties[i]] = parser[properties[i]];
		}

		// pathname is special because IE takes the "/" of the starting of pathname
		this.pathname = (parser.pathname.charAt(0) !== "/" ? "/" : "") + parser.pathname;
	}
	
	return {
		restrict: 'A',
		scope: {
			customClass: '='
		},
		link: function(scope, element, attrs){
			var embebed = (window.location != window.parent.location) ? true : false;
			if(embebed){
				var loc;
				if(window.location.ancestorOrigins){
					loc = window.location.ancestorOrigins[0];
				}
				else{
					var urlData = new ParsedUrl(document.referrer);
					loc = urlData.protocol + "//" + urlData.hostname;
				}
				var matches = domains.filter(function(domain){ return domain == loc; });
				if(matches.length > 0){
					element[0].className += (" " + attrs.whithoutInfoControllsClass);
				}
			}
		},
		controller: function($scope){}
	}
});