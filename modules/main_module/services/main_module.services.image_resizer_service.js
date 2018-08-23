angular.module('mainModule').service('imageResizerService', ['$q', function ($q) {
	
    this.resize = function(imageUrl, width, height) {
        var deferred = $q.defer();
        var image = new Image();
        image.onload = function () {
            // create an off-screen canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // set its dimension to target size
            canvas.width = width ? width : this.width;
            canvas.height = height ? height : this.height;

            // draw source image into the off-screen canvas:
            ctx.drawImage(image, 0, 0, width, height);

            // encode image to data-uri with base64 version of compressed image
            var resizedImage = canvas.toDataURL('image/jpeg', 0.5);
            deferred.resolve(resizedImage);
            
            canvas = null;
            ctx = null;
            image = null;
        }
        image.onerror = function (error) {
            deferred.reject(error);
        }
        image.src = imageUrl;
        return deferred.promise;
    }
	
	/* euclidean GCD (feel free to use any other) */
	function gcd(a,b) {
		if(b>a){
			var temp = a; 
			a = b; 
			b = temp
		} 
		while(b!=0){
			var m=a%b; 
			a=b; 
			b=m;
		}
		return a;
	}
	/* ratio is to get the gcd and divide each component by the gcd, then return a string with the typical colon-separated value */
	function ratio(x,y){
		var c=gcd(x,y); 
		return ""+(x/c)+":"+(y/c)
	}
	this.getImageInfo = function(imageURL){
		var deferred = $q.defer();
        var image = new Image();
		var imageInfo = {};
        image.onload = function () {
			var aspectRatio = ratio(this.width, this.height);
			imageInfo.apspectRatio = aspectRatio;
			imageInfo.size = {
				width: this.width, 
				height: this.height
			}
			deferred.resolve(imageInfo);
			image = null;
        }
        image.onerror = function (error) {
            deferred.reject(error);
        }
        image.src = imageURL;
        return deferred.promise;
	}
}]);