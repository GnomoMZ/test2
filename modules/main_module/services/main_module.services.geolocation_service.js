angular.module('mainModule').service("geolocate", ["$q", function ($q) {
	var ref = this;
	this.geocoder;

	if(!ref.geocoder){
		ref.geocoder = new google.maps.Geocoder();
	}

	this.geolocate = function (address) {
		var deferred = $q.defer();
		ref.geocoder.geocode({'address': address}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK){
				deferred.resolve(results[0].geometry.location);
			} 
			else{
				deferred.reject(false);
			}
		});
		return deferred.promise;
	}
}]);