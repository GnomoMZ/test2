angular.module('mainModule').controller("mapController", ["$scope", "infoService", "geolocate", function ($scope, infoService, geolocate) {

	var lat = 0;
	var long = 0;
	var mapCanvas, mapOptions, map, marker;

	var initGoogleMap = function (jsonData) {
		lat = jsonData.info.lat;
		long = jsonData.info.long;

		var geocoder;

		if (!geocoder) {
			geocoder = new google.maps.Geocoder();
		}

		if (!lat || !long) {
			var address = "";
			var streetnumber = jsonData.info.street_number ? (" " + jsonData.info.street_number + ", ") : ", ";
			address += jsonData.info.street ? (jsonData.info.street + streetnumber) : "";
			address += jsonData.info.district ? (jsonData.info.district + ", ") : "";
			address += jsonData.info.country ? (jsonData.info.country + ", ") : "";
			address += jsonData.info.city ? (jsonData.info.city) : "";

			geolocate.geolocate(address).then(function (result) {
				lat = result.lat();
				long = result.lng();
				$scope.refreshMap();
			}, function (error) {
				console.error(error);
			});
		}

		var coordsLocation = new google.maps.LatLng(lat, long);

		mapCanvas = document.getElementById('googlemap');
		mapOptions = {
			center: coordsLocation,
			zoom: 13,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP

		}
		map = new google.maps.Map(mapCanvas, mapOptions)

		marker = new google.maps.Marker({
			position: coordsLocation,
			map: map
		});
	};

	if (infoService.dataIsSet) {
		var jsonData = infoService.getDataJson();
		initGoogleMap(jsonData)
	} else {
		infoService.addFunctionOnDataReady(initGoogleMap);
	}

	$scope.refreshMap = function () {
		setTimeout(function () {
			google.maps.event.trigger(map, 'resize');
			var center = new google.maps.LatLng(lat, long);
			map.setCenter(center);
			marker.setPosition(center);
		}, 10);
	};
}]);