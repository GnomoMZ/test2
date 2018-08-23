angular.module('threejsModule').service("mouserotationService", ["threeService","$timeout", function (threeService,$timeout) {

    var ref = this;
    var objectToRotate;

    var speed = 0.004; // si es mas chico el numero, se va a mover mas rapido, se nombro "speed" para que sea mas facil de ubicar

    var targetRotationX = 0;
    var targetRotationOnMouseDownX = 0;

    var targetRotationY = 0;
    var targetRotationOnMouseDownY = 0;

    var mouseX = 0;
    var mouseXOnMouseDown = 0;

    var mouseY = 0;
    var mouseYOnMouseDown = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var started = false;

    var slowed = 1;

    var pix2 = Math.PI * 2;

    var container = document.getElementById("DisplayCanvas");

    var paning = false;

    var extraInputElementAdded = null;

    var animationSpeed = .0015;

    var animationDirection = -1;

    var animationTimeIddle = 2000;

    var pauseAnimation = false;

    var date = new Date();

    var lasTime = date.getTime();

    var allowAnimation = false;

    var lastRotationSet = {
        x: 0,
        y: 0
    };

    var limitXCamera = 0;

    var maximunVerticalRotation = Math.PI / 2;

    var paused = false;

    var lockVerticalRotation = false;
	var lockVerticalValue = .5;
	
    var limitHorizontalRotation = false;
    var angleToLimitHorizontalRotation = 0;
	var originalAngleToLimitHorizontalRotation = 0;

    var borderToLimitHorizontalRotation = 0;
    var camera;
	
	var placeholderGyro;
	var isGyroActive = false;

    this.SetPaused = function (value) {
        paused = value;
    }

    this.SetObjectToRotate = function (object) {
        objectToRotate = object;
    };

    this.SetCamera = function(cameraToSet){
        camera = cameraToSet;
    }

    this.SetSpeed = function (newSpeed) {
        speed = newSpeed;
    }

	var fistUpdateAfterGyro = false;
	this.SetGyroActive = function(active){
		isGyroActive = active;
		if(active)
			fistUpdateAfterGyro = true;
	}

	this.SetGyroPlaceholder = function(object){
		placeholderGyro = object;
	}
	
    this.Init = function () {
        container.addEventListener('mousedown', onDocumentMouseDown, false);
        container.addEventListener('touchstart', onDocumentTouchStart, false);
        container.addEventListener('touchend', onDocumentTouchEnd, false);
        container.addEventListener('touchmove', onDocumentTouchMove, false);
        container.addEventListener('mousewheel', onMouseWheel, false);
        container.addEventListener('DOMMouseScroll', onMouseWheel, false);

    };



    this.addRotationEventsToElement = function (id) {
        var elementToAddEvents = document.getElementById(id);

        elementToAddEvents.addEventListener('mousedown', onDocumentMouseDown, false);
        elementToAddEvents.addEventListener('touchstart', onDocumentTouchStart, false);
        elementToAddEvents.addEventListener('touchend', onDocumentTouchEnd, false);
        elementToAddEvents.addEventListener('touchmove', onDocumentTouchMove, false);

        extraInputElementAdded = id;

    }


    this.removeRotationEventsToElement = function (id) {
        var elementToAddEvents = document.getElementById(id);

        elementToAddEvents.removeEventListener('mousedown', onDocumentMouseDown);
        elementToAddEvents.removeEventListener('touchstart', onDocumentTouchStart);
        elementToAddEvents.removeEventListener('touchend', onDocumentTouchEnd);
        elementToAddEvents.removeEventListener('touchmove', onDocumentTouchMove);

        extraInputElementAdded = null;

    }

    this.setLastRotation = function () {
        this.SetRotation(lastRotationSet.x, lastRotationSet.y);
    }


    this.SetRotation = function (x, y) {

        container.removeEventListener('mousemove', onDocumentMouseMove, false);
        container.removeEventListener('mouseup', onDocumentMouseUp, false);
        container.removeEventListener('mouseout', onDocumentMouseOut, false);

        if (extraInputElementAdded) {
            var elementToAddEvents = document.getElementById(extraInputElementAdded);
            elementToAddEvents.removeEventListener('mousemove', onDocumentMouseMove);
            elementToAddEvents.removeEventListener('mouseup', onDocumentMouseUp);
            elementToAddEvents.removeEventListener('mouseout', onDocumentMouseOut);
        }

        started = false;
        
       
        
        lastRotationSet = {
            x: x,
            y: y
        };

        objectToRotate.rotation.x = x;
        targetRotationX = y;
        objectToRotate.rotation.y = y;
        targetRotationY = x;
        targetRotationOnMouseDownX = targetRotationX;
        targetRotationOnMouseDownY = targetRotationY;
        mouseXOnMouseDown = targetRotationX;
		
		if(limitHorizontalRotation)
		{
			limitHorizontalRotationFnc();
		}

        //		allowAnimation = false;
        //		var numberOfTimesOver = Math.trunc(objectToRotate.rotation.y / pix2);
        //		if (numberOfTimesOver != 0) {
        //			objectToRotate.rotation.y -= numberOfTimesOver * pix2;
        //
        //		}
        //
        //		var numberOfTimesOverY = Math.trunc(y / pix2);
        //		if (numberOfTimesOverY != 0) {
        //			y -= numberOfTimesOverY * pix2;
        //		}
        //
        //		// lo posiciono el la rotacion valida mas cercana al punto deseado
        //
        //		function shorterObject(distance, y, objecty) {
        //			this.distance = distance;
        //			this.y = y;
        //			this.objecty = objecty;
        //		}
        //
        //		var shorter = new shorterObject(Math.abs(y - objectToRotate.rotation.y), y, objectToRotate.rotation.y);
        //
        //		var shorterList = [];
        //
        //		shorterList.push(new shorterObject(Math.abs((y - pix2) - objectToRotate.rotation.y), y - pix2, objectToRotate.rotation.y));
        //		shorterList.push(new shorterObject(Math.abs((y + pix2) - objectToRotate.rotation.y), y + pix2, objectToRotate.rotation.y));
        //		shorterList.push(new shorterObject(Math.abs(y - (objectToRotate.rotation.y - pix2)), y, objectToRotate.rotation.y - pix2));
        //		shorterList.push(new shorterObject(Math.abs(y - (objectToRotate.rotation.y + pix2)), y, objectToRotate.rotation.y + pix2));
        //		shorterList.push(new shorterObject(Math.abs((y - pix2) - (objectToRotate.rotation.y - pix2)), y - pix2, objectToRotate.rotation.y - pix2));
        //		shorterList.push(new shorterObject(Math.abs((y + pix2) - (objectToRotate.rotation.y - pix2)), y + pix2, objectToRotate.rotation.y + pix2));
        //		shorterList.push(new shorterObject(Math.abs((y - pix2) - (objectToRotate.rotation.y + pix2)), y - pix2, objectToRotate.rotation.y + pix2));
        //		shorterList.push(new shorterObject(Math.abs((y + pix2) - (objectToRotate.rotation.y - pix2)), y + pix2, objectToRotate.rotation.y - pix2));
        //
        //		var ii = 0;
        //
        //		while (ii < shorterList.length) {
        //			if (shorter.distance > shorterList[ii].distance) {
        //				shorter = shorterList[ii];
        //
        //			}
        //
        //			ii++;
        //		}
        //
        //		y = shorter.y;
        //		objectToRotate.rotation.y = shorter.objecty;
        //
        //
        //		//        var ratio = 180 / Math.PI;
        //		var ratio = 1;
        //
        //		targetRotationX = y / ratio;
        //		targetRotationY = Math.max(-(Math.PI / 2 + threeService.camera.rotation.x), Math.min((Math.PI / 2 - threeService.camera.rotation.x), x / ratio));
        //
        //
        //		slowed = .05;
        //		var intervarSlow = setInterval(function () {
        //			ref.restartAnimationTime();
        //			if (slowed < 1) {
        //				slowed += .0010;
        //			} else {
        //				allowAnimation = true;
        //				clearInterval(intervarSlow);
        //				slowed = 1;
        //			}
        //
        //		}, 10)
        //
        //		paning = true;

    }
	
	this.mouseOut = function(){
		onDocumentMouseOut()
	}

    function onMouseWheel(event) {
        ref.restartAnimationTime();
        if(limitHorizontalRotation)
        {
			limitHorizontalRotationFnc();

        }
    }

    function onDocumentMouseDown(event) {

        ref.restartAnimationTime();

        if (paused)
            return;

        event.preventDefault();

        //		if (paning) {
        //			paning = false;
        //			targetRotationX = objectToRotate.rotation.y;
        //			targetRotationY = objectToRotate.rotation.x;
        //			slowed = 1;
        //			allowAnimation = true;
        //
        //		}

        container.addEventListener('mousemove', onDocumentMouseMove, false);
        container.addEventListener('mouseup', onDocumentMouseUp, false);
        container.addEventListener('mouseout', onDocumentMouseOut, false);

        if (extraInputElementAdded) {
            var elementToAddEvents = document.getElementById(extraInputElementAdded);
            elementToAddEvents.addEventListener('mousemove', onDocumentMouseMove, false);
            elementToAddEvents.addEventListener('mouseup', onDocumentMouseUp, false);
            elementToAddEvents.addEventListener('mouseout', onDocumentMouseOut, false);
        }

        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;



    }

    this.SetPositionCameraForLimits = function (xCamera, yCamera) {
        limitXCamera = xCamera;
    }


    function onDocumentMouseMove(event) {

        ref.restartAnimationTime();

        if (paused)
            return;

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

		targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * speed;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * speed;

        if (targetRotationY < -(maximunVerticalRotation + limitXCamera)) {
            targetRotationY = -(maximunVerticalRotation + limitXCamera);
        }
        if (targetRotationY > maximunVerticalRotation - limitXCamera) {
            targetRotationY = maximunVerticalRotation - limitXCamera;
        }

        if(limitHorizontalRotation)
        {
			limitHorizontalRotationFnc();
        }
		
		if(lockVerticalRotation)   
		{
			if(isGyroActive)
				targetRotationY = Math.max(-lockVerticalValue - placeholderGyro.rotation.x , Math.min(lockVerticalValue - placeholderGyro.rotation.x, targetRotationY ));	
			else 	targetRotationY = Math.max(-lockVerticalValue, Math.min(lockVerticalValue, targetRotationY));	
		}

        //		targetRotationY = Math.max(-(Math.PI/2 + threeService.camera.rotation.x), Math.min((Math.PI/2 - threeService.camera.rotation.x), targetRotationY));
    }

    function onDocumentMouseUp(event) {

        ref.restartAnimationTime();

        container.removeEventListener('mousemove', onDocumentMouseMove, false);
        container.removeEventListener('mouseup', onDocumentMouseUp, false);
        container.removeEventListener('mouseout', onDocumentMouseOut, false);

        if (extraInputElementAdded) {
            var elementToAddEvents = document.getElementById(extraInputElementAdded);
            elementToAddEvents.removeEventListener('mousemove', onDocumentMouseMove);
            elementToAddEvents.removeEventListener('mouseup', onDocumentMouseUp);
            elementToAddEvents.removeEventListener('mouseout', onDocumentMouseOut);
        }

    }

    function onDocumentMouseOut(event) {

        container.removeEventListener('mousemove', onDocumentMouseMove, false);
        container.removeEventListener('mouseup', onDocumentMouseUp, false);
        container.removeEventListener('mouseout', onDocumentMouseOut, false);

        if (extraInputElementAdded) {
            var elementToAddEvents = document.getElementById(extraInputElementAdded);
            elementToAddEvents.removeEventListener('mousemove', onDocumentMouseMove);
            elementToAddEvents.removeEventListener('mouseup', onDocumentMouseUp);
            elementToAddEvents.removeEventListener('mouseout', onDocumentMouseOut);
        }

    }


    function onDocumentTouchStart(event) {

        ref.restartAnimationTime();

        if (paused)
            return;

        if (event.touches.length == 1) {
            started = true;

            //			if (paning) {
            //				paning = false;
            //				targetRotationX = objectToRotate.rotation.y;
            //				targetRotationY = objectToRotate.rotation.x;
            //				slowed = 1;
            //				allowAnimation = true;
            //
            //			}

            event.preventDefault();

            mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
            targetRotationOnMouseDownX = targetRotationX;

            mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
            targetRotationOnMouseDownY = targetRotationY;



        }

        if (event.touches.length == 2) {
            started = false;
        }
    }

    function onDocumentTouchEnd(event) {

        ref.restartAnimationTime();

        if (event.touches.length == 1) {
            mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;

            mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;

            started = true;
        } else {
            started = false;
        }
    }


    function onDocumentTouchMove(event) {

        ref.restartAnimationTime();

        if (paused)
            return;

        if (event.touches.length == 1 && started) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * speed;

			mouseY = event.touches[0].pageY - windowHalfY;
			targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * speed;

            if (targetRotationY < -(maximunVerticalRotation + limitXCamera))
                targetRotationY = -(maximunVerticalRotation + limitXCamera);

            if (targetRotationY > maximunVerticalRotation - limitXCamera)
                targetRotationY = maximunVerticalRotation - limitXCamera;
			
			if(lockVerticalRotation)   
            {
				if(isGyroActive)
					targetRotationY = Math.max(-lockVerticalValue - placeholderGyro.rotation.x , Math.min(lockVerticalValue - placeholderGyro.rotation.x, targetRotationY ));	
				else 	targetRotationY = Math.max(-lockVerticalValue, Math.min(lockVerticalValue, targetRotationY));	
			}

        }

        if(limitHorizontalRotation)
        {
			limitHorizontalRotationFnc();

        }

        if(event.touches.length == 2)
        {
            if(limitHorizontalRotation)
            {
				limitHorizontalRotationFnc();
            }    
        }
    }
	
	function limitHorizontalRotationFnc(){
		var vFOV = camera.fov * Math.PI / 180;
		var hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * camera.aspect );

		borderToLimitHorizontalRotation = (hFOV/ 720) * (Math.PI*2);

		borderToLimitHorizontalRotation = borderToLimitHorizontalRotation * 180 / Math.PI;
		
		//0.2892010570554602
		var angleToUseCamera = objectToRotate.rotation.x;
		if(isGyroActive)
			angleToUseCamera = objectToRotate.rotation.x + placeholderGyro.rotation.x;
		
		var angleToSubstract =( Math.abs( angleToUseCamera) * 100 / 0.2892010570554602) * .07 / 100;
		angleToLimitHorizontalRotation = originalAngleToLimitHorizontalRotation - angleToSubstract;

		var trueHorizontalLimit = angleToLimitHorizontalRotation - borderToLimitHorizontalRotation;

		if(trueHorizontalLimit < 0)
			trueHorizontalLimit = 0;

		if(isGyroActive)
		{
			if(targetRotationX  > trueHorizontalLimit - placeholderGyro.rotation.y)
			{
				targetRotationX = trueHorizontalLimit - placeholderGyro.rotation.y;
			}                
			else
			{ 
				if(targetRotationX < -trueHorizontalLimit - placeholderGyro.rotation.y)
					targetRotationX =  -trueHorizontalLimit - placeholderGyro.rotation.y;
			}
		}
		else
		{
			if(targetRotationX  > trueHorizontalLimit)
			{
				targetRotationX = trueHorizontalLimit;
			}                
			else
			{ 
				if(targetRotationX < -trueHorizontalLimit)
					targetRotationX =  -trueHorizontalLimit;
			}

		}	
	}
	
	this.callHardLimit = function(){
		hardlimitHorizontalRotationFnc();
	}
	
	function hardlimitHorizontalRotationFnc(){
		var vFOV = camera.fov * Math.PI / 180;
		var hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * camera.aspect );

		borderToLimitHorizontalRotation = (hFOV/ 720) * (Math.PI*2);

		borderToLimitHorizontalRotation = borderToLimitHorizontalRotation * 180 / Math.PI

		var trueHorizontalLimit = angleToLimitHorizontalRotation - borderToLimitHorizontalRotation;

		if(trueHorizontalLimit < 0)
			trueHorizontalLimit = 0;

		if(isGyroActive)
		{
			if(objectToRotate.rotation.y  > trueHorizontalLimit - placeholderGyro.rotation.y)
			{
				objectToRotate.rotation.y = trueHorizontalLimit - placeholderGyro.rotation.y;
			}                
			else
			{ 
				if(objectToRotate.rotation.y < -trueHorizontalLimit - placeholderGyro.rotation.y)
					objectToRotate.rotation.y =  -trueHorizontalLimit - placeholderGyro.rotation.y;
			}
		}
		else
		{
			if(objectToRotate.rotation.y  > trueHorizontalLimit)
			{
				objectToRotate.rotation.y = trueHorizontalLimit;
			}                
			else
			{ 
				if(objectToRotate.rotation.y < -trueHorizontalLimit)
					objectToRotate.rotation.y =  -trueHorizontalLimit;
			}

		}	
		
		var distanceToBorder = Math.abs(objectToRotate.rotation.y) - trueHorizontalLimit;
		distanceToBorder = Math.abs(Math.round(distanceToBorder * 100) / 100);
		var maxVerticalFovPermited = 53.14;

		if(distanceToBorder <= 0.04){
			maxVerticalFovPermited = distanceToBorder * maxVerticalFovPermited / 0.04;
		}
		lockVerticalValue = ((maxVerticalFovPermited - camera.fov) * (Math.PI / 180))/2;

		if(lockVerticalValue < 0)
			lockVerticalValue = 0;
		
		if(isGyroActive)
			objectToRotate.rotation.x = Math.max(-lockVerticalValue - placeholderGyro.rotation.x , Math.min(lockVerticalValue - placeholderGyro.rotation.x, objectToRotate.rotation.x ));	
		else 	objectToRotate.rotation.x = Math.max(-lockVerticalValue, Math.min(lockVerticalValue, objectToRotate.rotation.x));	
	}

    this.UpdateRotation = function () {

        if (paused)
            return;
		if(limitHorizontalRotation)
			limitHorizontalRotationFnc();
		
        objectToRotate.rotation.y += (targetRotationX - objectToRotate.rotation.y) * 0.1 * slowed;



        var finalRotationY = (targetRotationY - objectToRotate.rotation.x);

        if (objectToRotate.rotation.x <= (maximunVerticalRotation - threeService.camera.rotation.x) && objectToRotate.rotation.x >= -(maximunVerticalRotation + threeService.camera.rotation.x)) {

            objectToRotate.rotation.x += finalRotationY * 0.1 * slowed;

        }
        if (objectToRotate.rotation.x > (maximunVerticalRotation - threeService.camera.rotation.x)) {
            objectToRotate.rotation.x = (maximunVerticalRotation - threeService.camera.rotation.x);
            targetRotationY = (maximunVerticalRotation - threeService.camera.rotation.x);
        }

        if (objectToRotate.rotation.x < -(maximunVerticalRotation + threeService.camera.rotation.x)) {
            objectToRotate.rotation.x = -(maximunVerticalRotation + threeService.camera.rotation.x);
            targetRotationY = -(maximunVerticalRotation + threeService.camera.rotation.x);
        }
		
		//check for small pano
		if(limitHorizontalRotation)
		{
			if(originalAngleToLimitHorizontalRotation <= borderToLimitHorizontalRotation)
			{
				var camH = Math.tan(originalAngleToLimitHorizontalRotation) / camera.aspect;
				var fovJustRight = Math.atan(camH)*2;
				camera.fov = fovJustRight * 180 / Math.PI;
				camera.updateProjectionMatrix();
				objectToRotate.rotation.y = 0;

			}

			if(objectToRotate.rotation.y != 0)
			{
				if(Math.abs(originalAngleToLimitHorizontalRotation - borderToLimitHorizontalRotation) < 0.00000001)
				{
					objectToRotate.rotation.y = 0;
				}
			}	

		}

		
		if(lockVerticalRotation){
			
			var vFOV = camera.fov * Math.PI / 180;
			var hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * camera.aspect );

			borderToLimitHorizontalRotation = (hFOV/ 720) * (Math.PI*2);

			borderToLimitHorizontalRotation = borderToLimitHorizontalRotation * 180 / Math.PI
			
			var trueHorizontalLimit = originalAngleToLimitHorizontalRotation - borderToLimitHorizontalRotation;
			
			if(trueHorizontalLimit < 0)
				trueHorizontalLimit = 0;

			
			var distanceToBorder = Math.abs(objectToRotate.rotation.y) - trueHorizontalLimit;
			distanceToBorder = Math.abs(Math.round(distanceToBorder * 100) / 100);
			
			var maxVerticalFovPermited = 53.14;
			
			if(distanceToBorder <= 0.01){
				maxVerticalFovPermited = distanceToBorder * maxVerticalFovPermited / 0.01;
			}
			
			lockVerticalValue = ((maxVerticalFovPermited - camera.fov) * (Math.PI / 180))/2;

			if(lockVerticalValue < 0)
				lockVerticalValue = 0;
			
//			targetRotationY = Math.max(-lockVerticalValue, Math.min(lockVerticalValue, targetRotationY));	
			if(fistUpdateAfterGyro){
				objectToRotate.rotation.x = Math.max(-lockVerticalValue - placeholderGyro.rotation.x , Math.min(lockVerticalValue - placeholderGyro.rotation.x, objectToRotate.rotation.x ));	targetRotationY = objectToRotate.rotation.x;	
				fistUpdateAfterGyro = false;
			}
			else{
				if(isGyroActive)
					targetRotationY= Math.max(-lockVerticalValue - placeholderGyro.rotation.x , Math.min(lockVerticalValue - placeholderGyro.rotation.x, targetRotationY ));	
				else 	targetRotationY = Math.max(-lockVerticalValue, Math.min(lockVerticalValue, targetRotationY));	
			}
		}
		
        animationOnIdle();
    };
	
	this.resize = function(){
		if(limitHorizontalRotation)
		{
			if(camera.fov < threeService.getLimitFovMin())
			{
				camera.fov = threeService.getLimitFovMin();
				camera.updateProjectionMatrix();
			}
			if(angleToLimitHorizontalRotation <= borderToLimitHorizontalRotation)
			{
				var camH = Math.tan(angleToLimitHorizontalRotation) / camera.aspect;
				var fovJustRight = Math.atan(camH)*2;
				camera.fov = fovJustRight * 180 / Math.PI;
				camera.updateProjectionMatrix();
				targetRotationY = 0;	
				objectToRotate.rotation.y = 0;

			}
			limitHorizontalRotationFnc();

		}
	}

    this.destroy = function () {
        document.removeEventListener('mousedown', onDocumentMouseDown);
        document.removeEventListener('touchstart', onDocumentTouchStart);
        document.removeEventListener('touchend', onDocumentTouchEnd);
        document.removeEventListener('touchmove', onDocumentTouchMove);
        document.removeEventListener('mousewheel', onMouseWheel);
        document.removeEventListener('DOMMouseScroll', onMouseWheel);

    }

    this.setEnabled = function (enabled) {
        if (enabled) {
            ref.Init();
        } else {
            ref.destroy();
        }
    }

	var animationBorderDelay = 2000;
    function animationOnIdle() {
        if (paused || pauseAnimation)
            return;

        var date = new Date();
        if ((date.getTime() - lasTime) < animationTimeIddle) {
            return;
        }

        if (allowAnimation) {
            if (!limitHorizontalRotation) {
                targetRotationX = targetRotationX + animationSpeed * animationDirection;
            } else {
//				if(animationDirection != 0)
//                {
//					var trueHorizontalLimit = angleToLimitHorizontalRotation - borderToLimitHorizontalRotation;
//					if (animationDirection == 1) {
//						if (targetRotationX + animationSpeed > trueHorizontalLimit) {
//
//							targetRotationX = trueHorizontalLimit;
//							animationDirection = 0;
//							$timeout(function () {
//								animationDirection = -1;
//
//							}, animationBorderDelay);
//						} else {
//							targetRotationX = targetRotationX + animationSpeed;
//						}
//					} else {
//						if (targetRotationX + animationSpeed < -trueHorizontalLimit) {
//							targetRotationX = -trueHorizontalLimit;
//							animationDirection = 0;
//							$timeout(function () {
//								animationDirection = 1;
//
//							}, animationBorderDelay);
//						} else {
//							targetRotationX = targetRotationX - animationSpeed;
//						}
//					}
//				}
            }
        }
    }

    this.restartAnimationTime = function() {
        var date = new Date();
        lasTime = date.getTime();
    }

	
	
    this.setAllowAnimation = function (enable) {
        allowAnimation = enable;
        ref.restartAnimationTime();
    }

    this.setPauseAnimation = function (enable) {
        pauseAnimation = enable;
    }

    this.SetMaximunVerticalRotation = function (angle) {
        maximunVerticalRotation = angle;
    }

    this.setVerticalLock = function(lock){
        lockVerticalRotation = lock;
        if(lock)
        {
            objectToRotate.rotation.x = 0; 
            targetRotationY = 0;
			hardlimitHorizontalRotationFnc();
        }
    }

    this.setLimitsHorizontalRotation = function(limit, angle){
        limitHorizontalRotation = limit;
        angleToLimitHorizontalRotation = angle;
		originalAngleToLimitHorizontalRotation = angle;
    }

}]);