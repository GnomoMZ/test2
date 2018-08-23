angular.module('threejsModule').service("threeService", ['$q', '$timeout', function ($q, $timeout) {

    this.camera;
    this.rotationCameraPlaceholder = new THREE.Object3D;
    this.orthocamera;
    this.scene;
    this.orthoscene;
    this.renderer;
    this.container;
    this.controls;
    this.target = new THREE.Sprite();
    this.target_fill = new THREE.Sprite();
    this.floorLogo = new THREE.Sprite();
    this.stereoActivated = false;
    this.sphere;
    this.skyBox = null;
    this.cilinder = null;

    var clock;
    var delta;
    var ref = this;
    var performScreenShoot = false;
    var screenShootCallback = null;
    var initialFov = 81;
    var initialCylinderFov = 48;
    var polyCountSphere = 0;
    var limitFovMin = 20;
    var limitFovMax = 100;
    var stereoEffect;
    var pinchStart;
    var pinchEnd;
    var pinchDelta;
    var camera;
    var isSpheric = true;
    var textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '*';
    var vectorForDir = new THREE.Vector3();
   


    this.ImageTypes = {
        SPHERE: 0,
        CUBIC: 1,
        PANORAMIC: 2
    }
	
	this.getLimitFovMin = function(){
		return limitFovMin;
	}
    
    function setCubeMaterials(textures, index, sectors) {
        var deferred = $q.defer();
        
        var closestSector = ref.getCameraSectorDirection(sectors);
                
        var sectors_ = sectors.filter(function(el) {
            return el.name !== closestSector.name;
        });
                
        var indexOfSector;
        
        switch(closestSector.name){
            case "posx":
                indexOfSector = 0;
                break;
            case "negx":
                indexOfSector = 1;
                break;
            case "posy":
                indexOfSector = 2;
                break;
            case "negy":
                indexOfSector = 3;
                break;
            case "negz":
                indexOfSector = 4;
                break;
            case "posz":
                indexOfSector = 5;
                break;
        }
        
        textureLoader.load(textures[indexOfSector], function (texture) {
			if(ref.skyBox.material.materials[indexOfSector].map){
				ref.skyBox.material.materials[indexOfSector].map.dispose();
				ref.skyBox.material.materials[indexOfSector].dispose();
			}
            ref.skyBox.material.materials[indexOfSector].map = texture;
            ref.skyBox.material.materials[indexOfSector].needsUpdate = true;
            index++;
            if (index < textures.length) {
                setCubeMaterials(textures, index, sectors_).then(function () {
                    deferred.resolve();
                }, function (error) {
                    console.error(error);
                    deferred.reject(error);
                }); 
            } else {
                deferred.resolve();
            }
        }, function (error) {
            console.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function makeSkybox(textures) {
        var deferred = $q.defer();


        if (!ref.skyBox) {
            var cubeMaterials = [];
            for (var i = 0; i < 6; i++) {
                cubeMaterials.push(new THREE.MeshBasicMaterial({}));
            }
            ref.skyBox = new THREE.Mesh(new THREE.CubeGeometry(15, 15, 15), new THREE.MeshFaceMaterial(cubeMaterials));
            ref.skyBox.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
			ref.skyBox.rotation.y = Math.PI / 2;
            ref.scene.add(ref.skyBox);
			if(camera)
			{
				camera.fov = initialFov;
				camera.updateProjectionMatrix();
			}
        }

        var sectors = [
            {
                name:"posx",
                vecDirection: new THREE.Vector3(-1,0,0)
            },
            {
                name:"negx",
                vecDirection: new THREE.Vector3(1,0,0)
            },
            {
                name:"posy",
                vecDirection: new THREE.Vector3(0,1,0)
            },
            {
                name:"negy",
                vecDirection: new THREE.Vector3(0,-1,0)
            },
            {
                name:"negz",
                vecDirection: new THREE.Vector3(0,0,1)
            },
            {
                name:"posz",
                vecDirection: new THREE.Vector3(0,0,-1)
            }
        ];
        

        setCubeMaterials(textures, 0,sectors).then(function (materials) {
            limitFovMax = 100;
            camera.fov = Math.max(limitFovMin, Math.min(limitFovMax, camera.fov));
            camera.updateProjectionMatrix();

            deferred.resolve(true);
        }, function (error) {
            deferred.reject(error);
            console.error(error);
        });
        return deferred.promise;
    }

    function makeSkysphere(image) {
        var deferred = $q.defer();
        textureLoader.load(image, function (texture) {
            ref.sphere = new THREE.Mesh(
                new THREE.SphereGeometry(10, polyCountSphere, polyCountSphere),
                new THREE.MeshBasicMaterial({
                    map: texture
                })
            );
            ref.sphere.scale.x = -1;
            ref.scene.add(ref.sphere);
            limitFovMax = 100;
//            camera.fov = Math.max(limitFovMin, Math.min(limitFovMax, camera.fov));
			camera.fov = initialFov;
            camera.updateProjectionMatrix();

            deferred.resolve(true);
        });
        return deferred.promise;
    }
    
    function makeSkyCilinder(image,thetaLength){
        var deferred = $q.defer();
                
        if(thetaLength > 6.3)
            thetaLength = 6.3;
        
        var amountToDisplace = (6.283185307179586 - (thetaLength  / 6.3 * 6.283185307179586))/2;

        textureLoader.load(image, function (texture) {

            ref.cilinder = new THREE.Mesh(
                new THREE.CylinderGeometry( 5, 5, 5, 30, 1, true, amountToDisplace, thetaLength),
                new THREE.MeshBasicMaterial({
                    map: texture
                })
            );
            ref.cilinder.scale.x = -1;
//            ref.sphere.scale.x = -1;
            ref.scene.add(ref.cilinder);
            limitFovMax = 48;
//            camera.fov = Math.max(limitFovMin, Math.min(limitFovMax, camera.fov));
			camera.fov = initialCylinderFov;

            camera.updateProjectionMatrix();

            deferred.resolve(true);
        });
        return deferred.promise;
    }

    this.init = function (_isSpheric, _polyCountSphere, cubeTextures, floorImg) {
        polyCountSphere = _polyCountSphere;
        isSpheric = _isSpheric;
        //----------------------- setup camera y render
        this.container = $("#DisplayCanvas");
        this.scene = new THREE.Scene();
        this.orthoscene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(initialFov, window.innerWidth / window.innerHeight, 1, 100);
        this.orthocamera = new THREE.OrthographicCamera(-this.container.width() / 2, this.container.width() / 2, this.container.height() / 2, -this.container.height() / 2, 1, 100);
        this.orthocamera.position.z = 10;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.width(), this.container.height());
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        this.renderer.setDepthTest = true;
        this.container.append(this.renderer.domElement);

        this.scene.add(this.camera);
        textureLoader.load("img/camera_target.png", function (texture) {
            var targetMaterial = new THREE.SpriteMaterial({
                map: texture,
                color: 0xffffff
            });
            ref.target.material = targetMaterial;
            ref.target.material.depthWrite = false;
            ref.target.material.depthTest = false;
            ref.target.material.opacity = 0;
            ref.target.scale.set(0.32, 0.32, 0.3);
            ref.target.position.set(0, 0, -10);
            ref.camera.position.set(0, 0, 0);
            ref.camera.rotation.set(0, 0, 0);
            ref.camera.add(ref.target);

            textureLoader.load("img/camera_target_fill.png", function (_texture) {
                var targetFillMaterial = new THREE.SpriteMaterial({
                    map: _texture,
                    color: 0xffffff
                });
                ref.target_fill.material = targetFillMaterial;
                ref.target_fill.material.depthWrite = false;
                ref.target_fill.material.depthTest = false;
                ref.target_fill.scale.set(0, 0, 1);
                ref.target_fill.position.set(0, 0, 0.01);
                ref.target.add(ref.target_fill);
            });

        });



        // Estereo effect ----------- //
        stereoEffect = new THREE.StereoEffect(this.renderer);
        stereoEffect.setSize(this.container.width(), this.container.height());
        //		stereoEffect.eyeSeparation = 10;

        this.camera.position.z = 0;
        //----------------------- fin setup camera y render

        if (isSpheric) {
            makeSkysphere('img/black.jpg');
        } else {
            makeSkybox(cubeTextures);
        }

        clock = new THREE.Clock();

        textureLoader.load(floorImg, function (_texture) {
            var material = new THREE.SpriteMaterial({
                map: _texture,
                color: 0xffffff
            });
            ref.floorLogo.material = material;
            ref.floorLogo.material.depthWrite = false;
            ref.floorLogo.material.depthTest = false;
            ref.floorLogo.scale.set(6, 6, 1);
            ref.floorLogo.position.set(0, -10, 0);
            ref.scene.add(ref.floorLogo);
        }, function (error) {
            console.log(error);
        });

        this.scene.add(this.rotationCameraPlaceholder);

    };

    function doScreenshot() {
        performScreenShoot = false;
        var contentType = 'image/jpeg';
        var b64Img = ref.renderer.domElement.toDataURL(contentType);
        var width = ref.renderer.domElement.width;
        var height = ref.renderer.domElement.height;
        $timeout(function(){
            var image = new Image();
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);
                var imgData = ctx.getImageData(0, 0, width, height);

                var canvas2 = document.createElement('canvas');
                canvas2.width = width;
                canvas2.height = height;
                var ctx2 = canvas2.getContext('2d');
                ctx2.putImageData(imgData, 0, 0);

                var finalB64Img = canvas2.toDataURL(contentType, 0.7).substring(23);
                screenShootCallback("data:image/jpg;base64," + finalB64Img);
            };
            image.src = b64Img;
        }, 0);
    }

    this.updateRender = function () {
        if (this.renderer !== null) {
            this.renderer.clear(); // 
            if (!this.stereoActivated) {
                this.renderer.render(this.scene, this.camera);
            } else {
                stereoEffect.render(this.scene, this.camera);
            }

            if (performScreenShoot) {
                doScreenshot();
            }
            
            if (!this.stereoActivated) {
                this.renderer.clearDepth();
                this.renderer.render(this.orthoscene, this.orthocamera);
            }
        }
    };

    this.resize = function () {
        this.camera.aspect = this.container.width() / this.container.height();
        this.camera.updateProjectionMatrix();
        this.orthocamera.left = -this.container.width() / 2;
        this.orthocamera.right = this.container.width() / 2;
        this.orthocamera.top = this.container.height() / 2;
        this.orthocamera.bottom = -this.container.height() / 2;
        this.orthocamera.updateProjectionMatrix();

        if (!this.stereoActivated) {
            this.renderer.setSize(this.container.width(), this.container.height());
        } else {
            stereoEffect.setSize(this.container.width(), this.container.height());
        }
		this.camera.updateProjectionMatrix();
    };

    this.updateThreeClock = function () {
        if (clock !== null) {
            delta = clock.getDelta();
        }
    };

    this.getDeltaTime = function () {
        return delta.valueOf();
    };

    this.getImgFromXMLHttpRequest = function (imageURI, onload, onprogress, onloadstart, onloadend) {
        var requestXML;
        if (!onloadstart) {
            onloadstart = null;
        }
        if (!onloadend) {
            onloadend = null;
        }
        if (!onprogress) {
            onprogress = null;
        }
        requestXML = new XMLHttpRequest();
        requestXML.onloadstart = onloadstart;
        requestXML.onprogress = onprogress;
        requestXML.onload = onload;
        requestXML.onloadend = onloadend;
        requestXML.open("GET", imageURI, true);
        requestXML.overrideMimeType('text/plain; charset=x-user-defined');
        requestXML.send(null);
        return requestXML;
    }

    this.setSimpleChangeSphericTexture = function (image) {        
        var deferred = $q.defer();
        if (ref.skyBox && ref.skyBox.material && ref.skyBox.material.materials.length > 0) {
            ref.scene.remove(ref.skyBox);
            ref.skyBox.material.materials.forEach(function (_material) {
                _material.map.dispose();
                _material.map.dispose();
            });
            ref.skyBox = null;
        }
        
        if(ref.cilinder)
        {
            ref.scene.remove(ref.cilinder);
            ref.cilinder.material.map.dispose();
            ref.cilinder.material.dispose();
            ref.cilinder = null;
        }
        
        if (!ref.sphere) {
            makeSkysphere(image).then(function () {
                deferred.resolve();
            })
        } else {
            textureLoader.load(image, function (t) {
                ref.sphere.material.map.dispose();
                ref.sphere.material.dispose();
                ref.sphere.material.map = t;
				camera.fov = Math.max(limitFovMin, Math.min(limitFovMax, camera.fov));
				camera.updateProjectionMatrix();
                deferred.resolve(true);
            }, function (error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    };

    this.setSimpleChangeCubeTextures = function (cubeTextures) {
        var deferred = $q.defer();
                
        if (ref.sphere) {
            ref.scene.remove(ref.sphere);
            ref.sphere.material.map.dispose();
            ref.sphere.material.dispose();
            ref.sphere = null;
        }
        if(ref.cilinder)
        {
            ref.scene.remove(ref.cilinder);
            ref.cilinder.material.map.dispose();
            ref.cilinder.material.dispose();
            ref.cilinder = null;
        }
        makeSkybox(cubeTextures).then(function () {
            deferred.resolve(true);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    this.setSimpleChangeCilinderTextures = function(image, thetaLength){
        var deferred = $q.defer();
        if (ref.skyBox && ref.skyBox.material && ref.skyBox.material.materials.length > 0) {
            ref.scene.remove(ref.skyBox);
            ref.skyBox.material.materials.forEach(function (_material) {
                _material.map.dispose();
                _material.map.dispose();
            });
            ref.skyBox = null;
        }

        if (ref.sphere) {
            ref.scene.remove(ref.sphere);
            ref.sphere.material.map.dispose();
            ref.sphere.material.dispose();
            ref.sphere = null;
        }    
        
        if (!ref.cilinder) {
            makeSkyCilinder(image,thetaLength).then(function () {
                deferred.resolve();
            })
        } else {
            if(thetaLength > 6.3)
                thetaLength = 6.3;

            var amountToDisplace = (6.283185307179586 - (thetaLength  / 6.3 * 6.283185307179586))/2;            
            
            textureLoader.load(image, function (t) {
                ref.cilinder.material.map.dispose();
                ref.cilinder.material.dispose();
                ref.cilinder.geometry = new THREE.CylinderGeometry( 5, 5, 5, 30, 1, true, amountToDisplace, thetaLength);
                ref.cilinder.material.map = t;
				camera.fov = Math.max(limitFovMin, Math.min(limitFovMax, camera.fov));
				camera.updateProjectionMatrix();
                deferred.resolve(true);
            }, function (error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    }

    function onMouseWheel(event) {
		if(event.ctrlKey){
			if (event.wheelDeltaY) { // WebKit
				camera.fov -= event.wheelDeltaY * 0.05;
			} else if (event.wheelDelta) { // Opera / IE9
				camera.fov -= event.wheelDelta * 0.05;
			} else if (event.detail) { // Firefox
				camera.fov += event.detail * 1.0;
			}
			camera.fov = Math.max(limitFovMin, Math.min(limitFovMax, camera.fov));
			camera.updateProjectionMatrix();
			event.preventDefault();
		}
    }

    this.setFovChangeOnScroll = function () {

        camera = this.camera;
        var container = document.getElementById("DisplayCanvas");

        container.addEventListener('mousewheel', onMouseWheel, false);
        container.addEventListener('DOMMouseScroll', onMouseWheel, false);
    };

    function touchstart(event) {
        if (event.touches.length == 2) {
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            var distance = Math.sqrt(dx * dx + dy * dy);
            pinchStart.set(0, distance);
        }
    }

    function touchmove(event) {
        event.preventDefault();
        event.stopPropagation();

        if (event.touches.length == 2) {
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            var distance = Math.sqrt(dx * dx + dy * dy);

            pinchEnd.set(0, distance);
            pinchDelta.subVectors(pinchEnd, pinchStart);

            if (pinchDelta.y > 0) {
                pinchOut();
            } else if (pinchDelta.y < 0) {
                pinchIn();
            }
            pinchStart.copy(pinchEnd);
            updatePinch();
        }
    }

    function pinchOut() {
        camera.fov -= pinchDelta.length() * 0.12;
    }

    function pinchIn() {
        camera.fov += pinchDelta.length() * 0.12;
    }

    function updatePinch() {
        camera.fov = Math.max(limitFovMin, Math.min(limitFovMax, camera.fov));
        camera.updateProjectionMatrix();
    }

    this.setFovChangeOnPinch = function () {
        pinchStart = new THREE.Vector2();
        pinchEnd = new THREE.Vector2();
        pinchDelta = new THREE.Vector2();

        camera = this.camera;

        document.addEventListener('touchstart', touchstart, false);
        document.addEventListener('touchmove', touchmove, false);
    };

    this.getCameraTargetPosition = function () {
        var target = new THREE.Object3D();
        this.camera.add(target);
        target.position.set(0, 0, -10);
        this.camera.updateMatrixWorld();
        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition(target.matrixWorld);
        return vector;
    };

    this.dispose = function () {
        sphere.material.map.dispose();
        sphere.material.dispose();
        this.scene = null;
        this.orthoscene = null;
        this.camera = null;
        this.orthocamera = null;
        this.renderer = null;
        this.container = null;
        this.controls = null;
        clock = null;

        $("#DisplayCanvas").empty();

        document.removeEventListener('mousewheel', onMouseWheel);
        document.removeEventListener('DOMMouseScroll', onMouseWheel);
        document.removeEventListener('touchstart', touchstart);
        document.removeEventListener('touchmove', touchmove);
    };

    this.renderToTexture = function (callback) {
        performScreenShoot = true;
        screenShootCallback = callback;
    }

    this.SetLimitFOV = function (limitMin, limitMax) {
        limitFovMin = limitMin;
        limitFovMax = limitMax;
    }

    this.activateStereoEffect = function (activeted) {
        this.camera.fov = activeted ? 100 : initialFov;
        var opacity = 0;
        var logoOpacity = 1;
        if (activeted) {
            opacity = 1;
            logoOpacity = 0;
        }
        this.target.material.opacity = opacity;
        this.target_fill.material.opacity = opacity;
        //		this.floorLogo.material.opacity = logoOpacity;
        this.stereoActivated = activeted;
    }
    
    
    
    this.getCameraSectorDirection = function(sectors){
        
        var closestSector = sectors[0];
        
        if(camera)
        {
            var vecDir = camera.getWorldDirection( vectorForDir );
            
            var closestDistance = vecDir.distanceTo(sectors[0].vecDirection);
            for(var i = 1; i < sectors.length; i++)
            {
                var tempDist = vecDir.distanceTo(sectors[i].vecDirection);

                if(tempDist < closestDistance)
                {
                    closestSector =  sectors[i];
                    closestDistance = tempDist;
                }
            }
        }
       
        
        return closestSector;
        
    }
}]);