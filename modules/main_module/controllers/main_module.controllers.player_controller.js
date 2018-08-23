angular.module("mainModule").controller("playerController", [
    "$scope",
    "threeService",
    "mouserotationService",
    "labelsService",
    "$timeout",
    "$http",
    "infoService",
    "$location",
    "changeToAmbientService",
    "$window",
    "base64",
    "imageResizerService",
    "changeViewService",
    "handleInputGUI",
    "analyticsService",
    "$q",
    "statusLoadingScreen",
    "callOnPopupPoint",
    "callOnIframePoint",
    function(
        $scope,
        threeService,
        mouserotationService,
        labelsService,
        $timeout,
        $http,
        infoService,
        $location,
        changeToAmbientService,
        $window,
        base64,
        imageResizerService,
        changeViewService,
        handleInputGUI,
        analyticsService,
        $q,
        statusLoadingScreen,
        callOnPopupPoint,
        callOnIframePoint
    ) {
        $scope.loadingLogo = "";
        $scope.custom_ambient_icon = "";
        //prevents zoom
        var keyCodes = [61, 107, 173, 109, 187, 189];

        function onKeyDown(event) {
            if (event.ctrlKey == true && keyCodes.indexOf(event.which) != -1) {
                event.preventDefault();
            }
            if (event.keyCode == 122) {
                event.preventDefault();
            }
        }

        function onMouseWheel(event) {
            if (event.ctrlKey == true) {
                event.preventDefault();
            }
        }

        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("mousewheel", onMouseWheel, false);
        document.addEventListener("DOMMouseScroll", onMouseWheel, false);

        var is_firefox = /firefox/i.test(navigator.userAgent);
        var isSafari =
            /Safari/.test(navigator.userAgent) &&
            /Apple Computer/.test(navigator.vendor);
        var enableMouseControlls = true;
        var lasTime = 0;
        var first = true;
        var lasRotationCameraX = 0;
        var lasRotationCameraY = 0;
        var animationGyro = false;
        var animationGyroX = false;
        var animationGyroY = false;
        var animationGyroZ = false;
        var project = {};
        var url = $location.absUrl();
        var projectUUID = getUrlParam("project");
        var numberToSlice = url.lastIndexOf("#/project/");
        var slicedurl = url.slice(numberToSlice, url.length);
        var fillerbar = document.getElementById("fillerBar");
        var host = location.protocol + "//" + location.host;
        var customSplashLoadingSize;
        var lastRotationToSet = {
            x: 0,
            y: 0
        };
        var currentlyPanoramic = false;
        var hoveringPoint = false;

        $scope.noProject = false;
        $scope.loading = true;
        $scope.destroyed = false;
        $scope.viewpointMode = false;
        $scope.viewpointState = "";
        $scope.newViewPortScene = "";
        $scope.scenelist = [];
        $scope.showPercentaje = false;
        $scope.showProgress = false;
        $scope.finishFirstLoading = false;
        $scope.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
            navigator.userAgent
        );
        $scope.loadingImgSource = "img/black.jpg";
        $scope.isIOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        $scope.isSafari = isSafari;
        $scope.isAppleDevice = isSafari || $scope.isIOS;
        $scope.useLoadingWheel = $scope.isAppleDevice;
        $scope.fade = "in";

      

        urlJson =
            '{"status":1,"uid":"21","nid":"1673","info":{"name":"KANSEMBATCHSTRASESEES 221, ZURICH","street":"Urquiza","street_number":"1280","district":"Entre Rios","postalcode":"3100","city":"Parana","country":"Argentina","description":"descripcion con detalles, si cuantos detalles, totalmente no escribiendo para llenar espacio y probar que anda bien la estructura en la gui. Y ya que estamos escribimos un poco mas, porque Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz bueno, hay que llenar la seccion y con palabras queda mas fiel que si escribo fafduifheaiuwhfaiew, lo cual tiene sentido si uno lo piensa. Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz","contact_name":"pedro","contact_lastname":"garcia","contact_cel":"154789995","contact_tel":"154789995","contact_email":"pacunia@interactive-3d.com","contact_website":"http://pagina.com","contact_company":"pepe inc.","contact_time":"8hs a 16hs","lat":"","long":"","starter_ambientid":1},"ambients":[{"name":"Sphere Image","id":1,"nid":"553","imgUrl":"img/panoimages/bottom_logo.jpg","imgLowResolutionUrl":"img/imageLowRes1.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes1.jpg","description":"descripcion ambiente 1 nowrap Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz","rotx":0,"roty":-2,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":10,"y":0,"z":0}],"blueprint":[1]},{"name":"Pano 360 Image","id":2,"nid":"554","imgUrl":"img/panoimages/pano_img14.jpg","imgLowResolutionUrl":"img/panoimages/pano_img14_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img14_thumb.jpg","mobileUrl":"img/imageLowRes2.jpg","description":null,"rotx":0,"roty":0,"viewpoints":[{"name":"Sphere Image","ambient_target_id":1,"x":-9,"y":0,"z":-2},{"name":"Pano 180 Image","ambient_target_id":3,"x":5,"y":0,"z":-5}],"blueprint":[1]},{"name":"Pano 180 Image","id":3,"nid":"555","imgUrl":"img/panoimages/pano_img12.jpg","imgLowResolutionUrl":"img/panoimages/pano_img12_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes3.jpg","description":"","rotx":0,"roty":0,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":3,"y":0,"z":-3}],"blueprint":[2]},{"name":"Pano 180 Image","id":4,"nid":"555","imgUrl":"img/panoimages/pano_img12.jpg","imgLowResolutionUrl":"img/panoimages/pano_img12_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes3.jpg","description":"","rotx":0,"roty":0,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":3,"y":0,"z":-3}]},{"name":"Pano 180 Image","id":5,"nid":"555","imgUrl":"img/panoimages/pano_img12.jpg","imgLowResolutionUrl":"img/panoimages/pano_img12_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes3.jpg","description":"","rotx":0,"roty":0,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":3,"y":0,"z":-3}],"blueprint":[1,2]}],"customization":{"custom_color":"red","label_color":"red","custom_loading_splash_logo":"img/dominicana/customLoadingIcon.png","custom_project_logo":"img/dominicana/Logo_blanco.png","custom_floor_stamp":"","custom_window_background_image":"","about_us_title":"Custom title","about_us_title_icon":"img/dominicana/Logo_blanco.png","about_us_subtitle":"custom subtitle","about_us_span":["span1","span2","span3"],"about_us_web":"www.google.com.ar","about_us_email":"info@360magictour.co","about_us_mobile_icon":"img/dominicana/Logo_blanco.png","hide_buttons":{"gallery":"","information":"","ambient":"","location":"","share":"","gyroscope":"","fullscreen":"","vr":"","about_us":""}},"blueprint_info":{"scale":{"x":100,"y":98},"blueprints":[{"name":"Planta baja","plant_number":1,"id":1,"url_img":"img/blueprints/p_2.png","points":[{"x":100,"y":49,"target_ambient":1},{"x":50,"y":49,"target_ambient":2}]},{"name":"Primer piso","plant_number":2,"id":2,"url_img":"img/blueprints/p_1.png","points":[{"x":100,"y":98,"target_ambient":3},{"x":50,"y":49,"target_ambient":1}]}]}}';

      
        var setProgressBarValues = function(progress) {
            var truncProgress = Math.floor(progress);
            $scope.progressPercentaje = "%" + truncProgress;
            $scope.progressBarStyle = {
                width: progress + "%"
            };
            $timeout(function() {
                $scope.$apply();
            });
        };

        function OnMouseDown(event) {
            if (
                infoService.currentButtonSelected != "location" &&
                $scope.hideLoading
            ) {
                labelsService.checkForColitionInActive(event);
            }
        }

        function OnMouseUp(event) {
            if (
                infoService.currentButtonSelected != "location" &&
                $scope.hideLoading
            ) {
                labelsService.checkForColitionInActive(event);
            }
        }

        function OnTouchStart(event) {
            if (
                infoService.currentButtonSelected != "location" &&
                $scope.hideLoading
            ) {
                labelsService.checkForColitionInActive(event);
            }
        }

        function OnTouchEnd(event) {
            if (
                infoService.currentButtonSelected != "location" &&
                $scope.hideLoading
            ) {
                labelsService.checkForColitionInActive(event);
            }
        }

        function OnMouseMove(event) {
            if (
                infoService.currentButtonSelected != "location" &&
                $scope.hideLoading
            ) {
                hoveringPoint = labelsService.checkForHover(event);
            }
        }

        function destroy() {
            $scope.destroyed = true;

            var container = document.getElementById("DisplayCanvas");

            container.removeEventListener("mousedown", OnMouseDown);
            document.removeEventListener("mouseup", OnMouseUp);
            container.removeEventListener("touchstart", OnTouchStart);
            document.removeEventListener("touchend", OnTouchEnd);
            document.removeEventListener("mousemove", OnMouseMove);

            $scope.controlsOrientantion = null;
            $scope.image = null;
            $scope.ambient = null;
            $scope.ambientNew = null;
        }

        function getCubeTexturesArrayFromCubemap(cubemap) {
            var cubeTextures = [];
            /*cubeTextures[0] = cubemap.right;
            cubeTextures[1] = cubemap.left;
            cubeTextures[2] = cubemap.top;
            cubeTextures[3] = cubemap.bottom;
            cubeTextures[4] = cubemap.front;
            cubeTextures[5] = cubemap.back;*/
            cubeTextures[0] = cubemap.posx;
            cubeTextures[1] = cubemap.negx;
            cubeTextures[2] = cubemap.posy;
            cubeTextures[3] = cubemap.negy;
            cubeTextures[4] = cubemap.negz;
            cubeTextures[5] = cubemap.posz;
            return cubeTextures;
        }

        function setFullTexture(viewpoint, image) {
            if ($scope.isMobile && !viewpoint.imageTargetMobile) {
                imageResizerService.resize(image, 2048, 1024).then(
                    function(resizedImg) {
                        threeService
                            .setSimpleChangeSphericTexture(resizedImg)
                            .then(
                                function() {},
                                function(error) {
                                    console.error(error);
                                }
                            )
                            .finally(function() {
                                //mouserotationService.SetRotation(viewpoint.rotx, viewpoint.roty);
                                $scope.fade = "out";
                                $timeout(function() {
                                    labelsService.changeSection(
                                        viewpoint.sectionTarget
                                    );
                                    $scope.hideLoading = true;
                                    $scope.finishFirstLoading = true;
                                    $scope.showProgress = false;
                                    handleInputGUI.EnableInputGUI();
                                    $timeout(function() {
                                        $scope.$apply();
                                    });
                                    mouserotationService.removeRotationEventsToElement(
                                        "loadingScreen"
                                    );
                                    mouserotationService.setAllowAnimation(
                                        true
                                    );

                                    image = null;
                                    setProgressBarValues(100);
                                    if (isSafari) {
                                        $scope.showCounituousLoadingBar = false;
                                    }
                                    statusLoadingScreen.LoadingFinish();
                                }, 500);
                            });
                    },
                    function(error) {
                        console.error(error);
                    }
                );
            } else {
                threeService
                    .setSimpleChangeSphericTexture(image)
                    .then(
                        function() {},
                        function(error) {
                            console.error(error);
                        }
                    )
                    .finally(function() {
                        $scope.fade = "out";

                        $timeout(function() {
                            labelsService.changeSection(
                                viewpoint.sectionTarget
                            );
                            $scope.hideLoading = true;
                            $scope.finishFirstLoading = true;
                            $scope.showProgress = false;
                            handleInputGUI.EnableInputGUI();

                            $timeout(function() {
                                $scope.$apply();
                            });
                            mouserotationService.removeRotationEventsToElement(
                                "loadingScreen"
                            );
                            mouserotationService.setAllowAnimation(true);

                            image = null;
                            setProgressBarValues(100);
                            if (isSafari) {
                                $scope.showCounituousLoadingBar = false;
                            }
                            statusLoadingScreen.LoadingFinish();
                        }, 500);
                    });
            }
        }

        function setFullCubeTexture(ambient, viewpoint) {
            var cubeTextures = getCubeTexturesArrayFromCubemap(ambient.cubemap);
            threeService
                .setSimpleChangeCubeTextures(cubeTextures)
                .then(
                    function() {},
                    function(error) {
                        console.error(error);
                    }
                )
                .finally(function() {
                    $scope.fade = "out";
                    $timeout(function() {
                        labelsService.changeSection(viewpoint.sectionTarget);
                        $scope.hideLoading = true;
                        $scope.finishFirstLoading = true;
                        $scope.showProgress = false;
                        handleInputGUI.EnableInputGUI();
                        $timeout(function() {
                            $scope.$apply();
                        });
                        mouserotationService.removeRotationEventsToElement(
                            "loadingScreen"
                        );
                        mouserotationService.setAllowAnimation(true);
                        image = null;
                        setProgressBarValues(100);
                        if (isSafari) {
                            $scope.showCounituousLoadingBar = false;
                        }
                        statusLoadingScreen.LoadingFinish();
                    }, 500);
                });
        }

        function setFullPanoramicTexture(viewpoint, image) {
            threeService
                .setSimpleChangeCilinderTextures(
                    image,
                    viewpoint.panoramic_ratio
                )
                .then(
                    function() {},
                    function(error) {
                        console.error(error);
                    }
                )
                .finally(function() {
                    $scope.fade = "out";
                    $timeout(function() {
                        labelsService.changeSection(viewpoint.sectionTarget);
                        $scope.hideLoading = true;
                        $scope.finishFirstLoading = true;
                        $scope.showProgress = false;
                        handleInputGUI.EnableInputGUI();
                        $timeout(function() {
                            $scope.$apply();
                        });

                        mouserotationService.removeRotationEventsToElement(
                            "loadingScreen"
                        );
                        mouserotationService.setAllowAnimation(true);
                        image = null;
                        setProgressBarValues(100);
                        if (isSafari) {
                            $scope.showCounituousLoadingBar = false;
                        }
                        statusLoadingScreen.LoadingFinish();
                    }, 500);
                });
        }

        function downloadAndSetFullTexture(viewpoint) {
            var requestImg;

            function onProgressRequest(e) {
                if (e.lengthComputable) {
                    setProgressBarValues((e.loaded / e.total) * 100);
                } else {
                    console.log(e);
                }
            }

            function onLoadRequest(result) {
                setProgressBarValues(100);
                var base64img =
                    "data:image/jpeg;base64," +
                    base64.encode(requestImg.responseText);
                setFullTexture(viewpoint, base64img);
            }

            if ($scope.isMobile && viewpoint.imageTargetMobile) {
                requestImg = threeService.getImgFromXMLHttpRequest(
                    viewpoint.imageTargetMobile,
                    onLoadRequest,
                    onProgressRequest
                );
            } else {
                requestImg = threeService.getImgFromXMLHttpRequest(
                    viewpoint.imageTarget,
                    onLoadRequest,
                    onProgressRequest
                );
            }
        }

        function downloadAndSetFullPanoramicTexture(viewpoint) {
            var requestImg;

            function onProgressRequest(e) {
                if (e.lengthComputable) {
                    setProgressBarValues((e.loaded / e.total) * 100);
                } else {
                    console.log(e);
                }
            }

            function onLoadRequest(result) {
                setProgressBarValues(100);
                var base64img =
                    "data:image/jpeg;base64," +
                    base64.encode(requestImg.responseText);
                setFullPanoramicTexture(viewpoint, base64img);
            }

            requestImg = threeService.getImgFromXMLHttpRequest(
                viewpoint.imageTarget,
                onLoadRequest,
                onProgressRequest
            );
        }

        function downloadAndSetFullCubicTexture(viewpoint) {
            var requestImg;

            function onProgressRequest(e) {
                if (e.lengthComputable) {
                    setProgressBarValues((e.loaded / e.total) * 100);
                } else {
                    console.log(e);
                }
            }

            function onLoadRequest(result) {
                setProgressBarValues(100);
                var base64img =
                    "data:image/jpeg;base64," +
                    base64.encode(requestImg.responseText);
                setFullCubeTexture(viewpoint, base64img);
            }

            requestImg = threeService.getImgFromXMLHttpRequest(
                viewpoint.imageTarget,
                onLoadRequest,
                onProgressRequest
            );
        }

        function setSphericTextureRoutine(viewpoint, galleryClick) {
            $timeout(function() {
                if (isSafari) {
                    $scope.showCounituousLoadingBar = true;
                }
                labelsService.changeSection("");
                infoService.setAmbientChange(viewpoint.target_id);
                threeService
                    .setSimpleChangeSphericTexture(viewpoint.imageTargetLowRes)
                    .then(
                        function() {},
                        function(error) {
                            console.error(error);
                        }
                    )
                    .finally(function() {
                        $scope.fadeBackground = true;
                        $scope.showPercentaje = true;
                        if (!$scope.isAppleDevice) {
                            $scope.useLoadingWheel = false;
                        }
                        mouserotationService.setLimitsHorizontalRotation(
                            false,
                            0
                        );
                        mouserotationService.setVerticalLock(false);
                        currentlyPanoramic = false;
                        if (!galleryClick)
                            mouserotationService.SetRotation(
                                viewpoint.rotx +
                                    (threeService.rotationCameraPlaceholder
                                        .rotation.x -
                                        lastRotationToSet.x),
                                viewpoint.roty +
                                    (threeService.rotationCameraPlaceholder
                                        .rotation.y -
                                        lastRotationToSet.y)
                            );
                        else
                            mouserotationService.SetRotation(
                                viewpoint.rotx,
                                viewpoint.roty
                            );

                        lastRotationToSet.x = viewpoint.rotx;
                        lastRotationToSet.y = viewpoint.roty;

                        mouserotationService.SetPaused(false);
                        if ($scope.isMobile) {
                            $scope.controlsOrientantion.connect();
                        }

                        lasRotationCameraX = 0;
                        lasRotationCameraY = 0;

                        mouserotationService.addRotationEventsToElement(
                            "loadingScreen"
                        );
                        $scope.showProgress = true;
                        if (!isSafari) {
                            downloadAndSetFullTexture(viewpoint);
                        } else {
                            if (
                                $scope.isMobile &&
                                viewpoint.imageTargetMobile
                            ) {
                                setFullTexture(
                                    viewpoint,
                                    viewpoint.imageTargetMobile
                                );
                            } else {
                                setFullTexture(
                                    viewpoint,
                                    viewpoint.imageTarget
                                );
                            }
                        }
                    });
            }, 550);
        }

        function setPanoramicTextureRoutine(viewpoint, galleryClick) {
            $timeout(function() {
                if (isSafari) {
                    $scope.showCounituousLoadingBar = true;
                }
                labelsService.changeSection("");
                infoService.setAmbientChange(viewpoint.target_id);
                threeService
                    .setSimpleChangeCilinderTextures(
                        viewpoint.imageTargetLowRes,
                        viewpoint.panoramic_ratio
                    )
                    .then(
                        function() {},
                        function(error) {
                            console.error(error);
                        }
                    )
                    .finally(function() {
                        $scope.fadeBackground = true;
                        $scope.showPercentaje = true;
                        if (!$scope.isAppleDevice) {
                            $scope.useLoadingWheel = false;
                        }
                        if (viewpoint.panoramic_ratio < 6.3)
                            mouserotationService.setLimitsHorizontalRotation(
                                true,
                                ((viewpoint.panoramic_ratio / 6.3) *
                                    (Math.PI * 2)) /
                                    2
                            );
                        else
                            mouserotationService.setLimitsHorizontalRotation(
                                false,
                                0
                            );

                        if (!galleryClick)
                            mouserotationService.SetRotation(
                                viewpoint.rotx +
                                    (threeService.rotationCameraPlaceholder
                                        .rotation.x -
                                        lastRotationToSet.x),
                                viewpoint.roty +
                                    (threeService.rotationCameraPlaceholder
                                        .rotation.y -
                                        lastRotationToSet.y)
                            );
                        else
                            mouserotationService.SetRotation(
                                viewpoint.rotx,
                                viewpoint.roty
                            );

                        lastRotationToSet.x = viewpoint.rotx;
                        lastRotationToSet.y = viewpoint.roty;

                        mouserotationService.SetPaused(false);
                        mouserotationService.setVerticalLock(true);
                        currentlyPanoramic = true;

                        if ($scope.isMobile) {
                            $scope.controlsOrientantion.connect();
                        }

                        lasRotationCameraX = 0;
                        lasRotationCameraY = 0;

                        mouserotationService.addRotationEventsToElement(
                            "loadingScreen"
                        );
                        $scope.showProgress = true;
                        if ($scope.isAppleDevice)
                            setFullPanoramicTexture(
                                viewpoint,
                                viewpoint.imageTarget
                            );
                        else downloadAndSetFullPanoramicTexture(viewpoint);
                    });
            }, 550);
        }

        function setCubicTextureRoutine(viewpoint, galleryClick) {
            var ambientID = viewpoint.target_id;
            var ambient = urlJson.ambients.filter(function(_currentAmbient) {
                return _currentAmbient.id == ambientID;
            })[0];
            $timeout(function() {
                if (isSafari) {
                    $scope.showCounituousLoadingBar = true;
                }
                labelsService.changeSection("");
                infoService.setAmbientChange(ambientID);
                var cubeTexturesLow = getCubeTexturesArrayFromCubemap(
                    ambient.cubemapLow
                );
                threeService
                    .setSimpleChangeCubeTextures(cubeTexturesLow)
                    .then(
                        function() {},
                        function(error) {
                            console.error(error);
                        }
                    )
                    .finally(function() {
                        $scope.fadeBackground = true;
                        $scope.showPercentaje = true;
                        if (!$scope.isAppleDevice) {
                            $scope.useLoadingWheel = true;
                        }
                        mouserotationService.setLimitsHorizontalRotation(
                            false,
                            0
                        );
                        mouserotationService.setVerticalLock(false);
                        currentlyPanoramic = false;

                        if (!galleryClick)
                            mouserotationService.SetRotation(
                                viewpoint.rotx +
                                    (threeService.rotationCameraPlaceholder
                                        .rotation.x -
                                        lastRotationToSet.x),
                                viewpoint.roty +
                                    (threeService.rotationCameraPlaceholder
                                        .rotation.y -
                                        lastRotationToSet.y)
                            );
                        else
                            mouserotationService.SetRotation(
                                viewpoint.rotx,
                                viewpoint.roty
                            );

                        lastRotationToSet.x = viewpoint.rotx;
                        lastRotationToSet.y = viewpoint.roty;

                        mouserotationService.SetPaused(false);
                        if ($scope.isMobile) {
                            $scope.controlsOrientantion.connect();
                        }

                        lasRotationCameraX = 0;
                        lasRotationCameraY = 0;

                        mouserotationService.addRotationEventsToElement(
                            "loadingScreen"
                        );
                        $scope.showProgress = true;

                        setFullCubeTexture(ambient, viewpoint);
                    });
            }, 550);
        }

        function onViewportAfterScreenShoot(viewpoint, galleryClick) {
            setProgressBarValues(0);
            var date = new Date(); //aseguro que no cambie 2 veces seguidas por si viewpoint esta en una posicion similar o igual

            if (date.getTime() - lasTime < 1500) {
                return;
            }
            setProgressBarValues(0);
            lasTime = date.getTime();

            if (!first) {
                $scope.hideLoading = false;

                $scope.fade = "in";
                statusLoadingScreen.LoadingStarted();
                $timeout(function() {
                    $scope.$apply();
                });
            }
            $scope.fadeBackground = true;
            $scope.showPercentaje = false;
            first = false;

            changeToAmbientService.setCurrentAmbient(viewpoint.target_id);

            switch (viewpoint.targetImageType) {
                case 0:
                    setSphericTextureRoutine(viewpoint, galleryClick);
                    break;
                case 1:
                    setCubicTextureRoutine(viewpoint, galleryClick);
                    break;
                case 2:
                    setPanoramicTextureRoutine(viewpoint, galleryClick);
                    break;
            }
        }

        function setFadeImg(img, viewpoint, galleryClick) {
            if (!is_firefox && !isSafari) {
                $scope.loadingImgSource = img;
                onViewportAfterScreenShoot(viewpoint, galleryClick);
            } else {
                if (is_firefox) {
                    var image = new Image();
                    image.onload = function() {
                        $scope.loadingImgSource = image.src;
                        onViewportAfterScreenShoot(viewpoint, galleryClick);
                    };
                    image.src = img;
                } else {
                    $scope.loadingImgSource = img;
                    onViewportAfterScreenShoot(viewpoint, galleryClick);
                }
            }
        }

        function onViewportClick(viewpoint, galleryClick) {
            $scope.fadeInLoadingLogo = false;
            analyticsService.sendViewpointClickEvent(
                viewpoint.name,
                viewpoint.target_id
            ); // Analytics

            mouserotationService.SetPaused(true);
            handleInputGUI.DisableInputGUI();
            handleInputGUI.CloseButtonGUI();
            mouserotationService.setAllowAnimation(false);

            if (first) {
                onViewportAfterScreenShoot(viewpoint, galleryClick);
            } else {
                if (threeService.stereoActivated || $scope.isIOS) {
                    setFadeImg("img/black.jpg", viewpoint, galleryClick);
                } else {
                    threeService.renderToTexture(function(base64img) {
                        setFadeImg(base64img, viewpoint, galleryClick);
                    });
                }
            }
        }

        /*iframepoint*/
        function onIframepointClick(iframepoint) {
            callOnIframePoint.callIframePoint(iframepoint);
        }
        /*popup*/
        function onInfopointClick(infopoint) {
            callOnPopupPoint.callPopupPoint(infopoint);
        }

        function init(starterAmb, floorImage) {
            var polyCountSphere = 90;
            if ($scope.isMobile) {
                polyCountSphere = 50;
            }

            if (starterAmb.cubemap && starterAmb.cubemap.negy) {
                var cubeTextures = getCubeTexturesArrayFromCubemap(
                    starterAmb.cubemapLow
                );
                threeService.init(
                    false,
                    polyCountSphere,
                    cubeTextures,
                    floorImage
                );
            } else {
                threeService.init(true, polyCountSphere, null, floorImage);
            }

            threeService.setFovChangeOnScroll();
            threeService.setFovChangeOnPinch();
            mouserotationService.Init();

            $scope.activeDeviceOrientation = false;

            $scope.ambient = "";
            $scope.imageSaved = false;
            $scope.ambientNew = false;
            var container = document.getElementById("DisplayCanvas");

            container.addEventListener("mousedown", OnMouseDown, false);
            document.addEventListener("mouseup", OnMouseUp, false);
            container.addEventListener("touchstart", OnTouchStart, false);
            document.addEventListener("touchend", OnTouchEnd, false);
            document.addEventListener("mousemove", OnMouseMove, false);

            $(window).resize(function() {
                threeService.resize();
                mouserotationService.resize();
            });

            window.onfocus = function() {
                $(window).resize();
            };

            mouserotationService.SetObjectToRotate(
                threeService.rotationCameraPlaceholder
            );
            mouserotationService.SetCamera(threeService.camera);
            $scope.newmap;

            var placeHolderCameraOrientation = new THREE.Object3D();
            placeHolderCameraOrientation.rotation.reorder("YXZ");
            threeService.camera.rotation.reorder("YXZ");
            $scope.controlsOrientantion = new THREE.DeviceOrientationControls(
                placeHolderCameraOrientation
            );
            mouserotationService.SetGyroPlaceholder(
                placeHolderCameraOrientation
            );

            changeToAmbientService.addFunctionToCallOnChangeAmbient(
                onViewportClick
            );

            var clockForDelta = new THREE.Clock();
            var speedForAjust = 3;
            var lastPosRotationAnimationGyro = new THREE.Vector3(0, 0, 0);

            function update() {
                if (!$scope.destroyed) {
                    var deltaTime = clockForDelta.getDelta();

                    threeService.updateThreeClock();
                    $scope.webGLid = requestAnimationFrame(update);
                    if ($scope.isMobile) {
                        if ($scope.activeDeviceOrientation) {
                            $scope.controlsOrientantion.update();

                            if (animationGyro && !currentlyPanoramic) {
                                if (animationGyroY) {
                                    threeService.camera.rotation.y =
                                        lastPosRotationAnimationGyro.y;
                                    if (
                                        threeService.camera.rotation.y !=
                                        placeHolderCameraOrientation.rotation.y
                                    ) {
                                        if (
                                            threeService.camera.rotation.y >
                                            placeHolderCameraOrientation
                                                .rotation.y
                                        ) {
                                            if (
                                                threeService.camera.rotation.y -
                                                    deltaTime * speedForAjust <
                                                placeHolderCameraOrientation
                                                    .rotation.y
                                            ) {
                                                threeService.camera.rotation.y =
                                                    placeHolderCameraOrientation.rotation.y;
                                                animationGyroY = false;
                                            } else {
                                                threeService.camera.rotation.y =
                                                    threeService.camera.rotation
                                                        .y -
                                                    deltaTime * speedForAjust;
                                            }
                                        }
                                        if (
                                            threeService.camera.rotation.y <
                                            placeHolderCameraOrientation
                                                .rotation.y
                                        ) {
                                            if (
                                                threeService.camera.rotation.y +
                                                    deltaTime * speedForAjust >
                                                placeHolderCameraOrientation
                                                    .rotation.y
                                            ) {
                                                threeService.camera.rotation.y =
                                                    placeHolderCameraOrientation.rotation.y;
                                                animationGyroY = false;
                                            } else {
                                                threeService.camera.rotation.y =
                                                    threeService.camera.rotation
                                                        .y +
                                                    deltaTime * speedForAjust;
                                            }
                                        }
                                    } else {
                                        animationGyroY = false;
                                    }
                                } else {
                                    threeService.camera.rotation.y =
                                        placeHolderCameraOrientation.rotation.y;
                                }

                                if (animationGyroX) {
                                    threeService.camera.rotation.x =
                                        lastPosRotationAnimationGyro.x;

                                    if (
                                        threeService.camera.rotation.x !=
                                        placeHolderCameraOrientation.rotation.x
                                    ) {
                                        if (
                                            threeService.camera.rotation.x >
                                            placeHolderCameraOrientation
                                                .rotation.x
                                        ) {
                                            if (
                                                threeService.camera.rotation.x -
                                                    deltaTime * speedForAjust <
                                                placeHolderCameraOrientation
                                                    .rotation.x
                                            ) {
                                                threeService.camera.rotation.x =
                                                    placeHolderCameraOrientation.rotation.x;
                                                animationGyroX = false;
                                            } else {
                                                threeService.camera.rotation.x =
                                                    threeService.camera.rotation
                                                        .x -
                                                    deltaTime * speedForAjust;
                                            }
                                        }
                                        if (
                                            threeService.camera.rotation.x <
                                            placeHolderCameraOrientation
                                                .rotation.x
                                        ) {
                                            if (
                                                threeService.camera.rotation.x +
                                                    deltaTime * speedForAjust >
                                                placeHolderCameraOrientation
                                                    .rotation.x
                                            ) {
                                                threeService.camera.rotation.x =
                                                    placeHolderCameraOrientation.rotation.x;
                                                animationGyroX = false;
                                            } else {
                                                threeService.camera.rotation.x =
                                                    threeService.camera.rotation
                                                        .x +
                                                    deltaTime * speedForAjust;
                                            }
                                        }
                                    } else {
                                        animationGyroX = false;
                                    }
                                } else {
                                    threeService.camera.rotation.x =
                                        placeHolderCameraOrientation.rotation.x;
                                }

                                if (animationGyroZ) {
                                    if (
                                        threeService.camera.rotation.z !=
                                        placeHolderCameraOrientation.rotation.z
                                    ) {
                                        if (
                                            threeService.camera.rotation.z >
                                            placeHolderCameraOrientation
                                                .rotation.z
                                        ) {
                                            if (
                                                threeService.camera.rotation.z -
                                                    deltaTime * speedForAjust <
                                                placeHolderCameraOrientation
                                                    .rotation.z
                                            ) {
                                                threeService.camera.rotation.z =
                                                    placeHolderCameraOrientation.rotation.z;
                                                animationGyroZ = false;
                                            } else {
                                                threeService.camera.rotation.z =
                                                    threeService.camera.rotation
                                                        .z -
                                                    deltaTime * speedForAjust;
                                            }
                                        }
                                        if (
                                            threeService.camera.rotation.z <
                                            placeHolderCameraOrientation
                                                .rotation.z
                                        ) {
                                            if (
                                                threeService.camera.rotation.z +
                                                    deltaTime * speedForAjust >
                                                placeHolderCameraOrientation
                                                    .rotation.z
                                            ) {
                                                threeService.camera.rotation.z =
                                                    placeHolderCameraOrientation.rotation.z;
                                                animationGyroZ = false;
                                            } else {
                                                threeService.camera.rotation.z =
                                                    threeService.camera.rotation
                                                        .z +
                                                    deltaTime * speedForAjust;
                                            }
                                        }
                                    } else {
                                        animationGyroZ = false;
                                    }
                                } else {
                                    threeService.camera.rotation.z =
                                        placeHolderCameraOrientation.rotation.z;
                                }

                                if (
                                    !animationGyroX &&
                                    !animationGyroY &&
                                    !animationGyroZ
                                )
                                    animationGyro = false;
                            } else {
                                threeService.camera.rotation.y =
                                    placeHolderCameraOrientation.rotation.y;
                                threeService.camera.rotation.x =
                                    placeHolderCameraOrientation.rotation.x;
                                if (currentlyPanoramic)
                                    threeService.camera.rotation.z = 0;
                                else
                                    threeService.camera.rotation.z =
                                        placeHolderCameraOrientation.rotation.z;
                            }

                            lasRotationCameraX = threeService.camera.rotation.x;
                            lasRotationCameraY = threeService.camera.rotation.y;
                        } else {
                            if (currentlyPanoramic) {
                                threeService.camera.rotation.x = 0;
                                threeService.camera.rotation.y = 0;
                            } else {
                                threeService.camera.rotation.x = lasRotationCameraX;
                                threeService.camera.rotation.y = lasRotationCameraY;
                            }
                            if (threeService.camera.rotation.z != 0) {
                                //ajusto la rotacion eje X
                                if (threeService.camera.rotation.z > 0) {
                                    if (
                                        threeService.camera.rotation.z -
                                            deltaTime * speedForAjust <
                                        0
                                    ) {
                                        threeService.camera.rotation.z = 0;
                                    } else {
                                        threeService.camera.rotation.z =
                                            threeService.camera.rotation.z -
                                            deltaTime * speedForAjust;
                                    }
                                }
                                if (threeService.camera.rotation.z < 0) {
                                    if (
                                        threeService.camera.rotation.z +
                                            deltaTime * speedForAjust >
                                        0
                                    ) {
                                        threeService.camera.rotation.z = 0;
                                    } else {
                                        threeService.camera.rotation.z =
                                            threeService.camera.rotation.z +
                                            deltaTime * speedForAjust;
                                    }
                                }
                            }
                        }
                    } else {
                        threeService.camera.rotation.x = 0;
                        threeService.camera.rotation.y = 0;
                    }

                    mouserotationService.SetPositionCameraForLimits(
                        threeService.camera.rotation.x,
                        threeService.camera.rotation.y
                    );
                    mouserotationService.UpdateRotation();

                    lastPosRotationAnimationGyro.x =
                        threeService.camera.rotation.x;
                    lastPosRotationAnimationGyro.y =
                        threeService.camera.rotation.y;

                    threeService.camera.rotation.x +=
                        threeService.rotationCameraPlaceholder.rotation.x;
                    threeService.camera.rotation.y +=
                        threeService.rotationCameraPlaceholder.rotation.y;

                    if (hoveringPoint)
                        mouserotationService.restartAnimationTime();

                    labelsService.updateLabels(deltaTime);
                    threeService.updateRender();
                } else if ($scope.webGLid !== undefined) {
                    cancelAnimationFrame($scope.webGLid);
                    $scope.webGLid = undefined;
                }
            }
            update();
        }

        $scope.$on("$destroy", function() {
            destroy();
            threeService.destroy();
            mouserotationService.destroy();
        });

        $scope.activateViewPointMode = function() {
            $scope.viewpointMode = true;
            $scope.viewpointState = "";
        };

        $scope.deactivateVeiwPointMode = function() {
            $scope.viewpointMode = false;
            $scope.viewpointState = "";
        };

        $scope.addViewPoint = function() {
            $scope.viewpointState = "adding";
        };

        $scope.editViewPoint = function() {
            $scope.viewpointState = "editing";
        };

        $scope.removeViewPoint = function() {
            $scope.viewpointState = "removing";
        };

        $scope.setAmbientToViewpoint = function(scene) {
            $scope.newViewPortScene = scene;
        };

        $scope.changeViewMode = function(activate) {
            if ($scope.activeDeviceOrientation != activate) {
                $scope.activeDeviceOrientation = activate;
                mouserotationService.SetGyroActive(
                    $scope.activeDeviceOrientation
                );
                if ($scope.activeDeviceOrientation) {
                    //si se prendio el control por giro
                    if (!currentlyPanoramic) {
                        animationGyro = true;
                        animationGyroX = true;
                        animationGyroY = true;
                        animationGyroZ = true;
                    } else {
                        mouserotationService.callHardLimit();
                    }
                    mouserotationService.setPauseAnimation(true);
                } else {
                    mouserotationService.setPauseAnimation(false);
                    if (currentlyPanoramic)
                        mouserotationService.SetRotation(0, 0);
                }
            }
        };

        changeViewService.addFunctionToCallOnChangeView($scope.changeViewMode);

        function getAmbientById(ambients, id) {
            return ambients.filter(function(_ambient) {
                return _ambient.id == id;
            })[0];
        }

        function processJsonData(datajson) {
            if (datajson.status == 1) {
                setTimeout(function() {
                    //init labels
                    var ii = 0;
                    var starterAmbient = getAmbientById(
                        datajson.ambients,
                        datajson.info.starter_ambientid
                    );
                    if (datajson.customization) {
                        if (datajson.customization.label_color) {
                            labelsService.setLabelColor(
                                datajson.customization.label_color
                            );
                        }

                        if (datajson.customization.chat_link) {
                            var Tawk_API = Tawk_API || {},
                                Tawk_LoadStart = new Date();
                            (function() {
                                var s1 = document.createElement("script");
                                s1.async = false;
                                s1.src = datajson.customization.chat_link;
                                s1.charset = "UTF-8";
                                s1.setAttribute("crossorigin", "*");
                                document.body.appendChild(s1);
                            })();
                        }
                    }

                    $timeout(function() {
                        while (ii < datajson.ambients.length) {
                            var currentAmbient = datajson.ambients[ii];
                            var jj = 0;
                            while (
                                jj < datajson.ambients[ii].viewpoints.length
                            ) {
                                var currentViewpoint =
                                    datajson.ambients[ii].viewpoints[jj];
                                if (currentViewpoint.ambient_target_id < 0) {
                                    jj++;
                                    continue;
                                }

                                var ambientTarget = getAmbientById(
                                    datajson.ambients,
                                    currentViewpoint.ambient_target_id
                                );
                                if (ambientTarget) {
                                    if (!ambientTarget.rotx) {
                                        ambientTarget.rotx = 0;
                                    }
                                    if (!ambientTarget.roty) {
                                        ambientTarget.roty = 0;
                                    }
                                    var hotspotLabelName =
                                        currentViewpoint.name;
                                    if (!hotspotLabelName) {
                                        hotspotLabelName = ambientTarget.name;
                                    }

                                    var ambientType =
                                        ambientTarget.cubemap &&
                                        ambientTarget.cubemap.negy
                                            ? 1
                                            : 0;
                                    if (ambientTarget.panoramic == 1)
                                        ambientType = 2;

                                    if ($scope.custom_ambient_icon == "") {
                                        $scope.custom_ambient_icon =
                                            "img/hotspots/viewpoint.png";
                                    }

                                    var imgForViewpoint =
                                        $scope.custom_ambient_icon;

                                    if (ambientTarget.custom_img_viewpoint) {
                                        imgForViewpoint =
                                            ambientTarget.custom_img_viewpoint;
                                    }

                                    labelsService.addNewLabel(
                                        imgForViewpoint,
                                        currentAmbient.id,
                                        currentViewpoint.x,
                                        currentViewpoint.y,
                                        currentViewpoint.z,
                                        onViewportClick,
                                        ambientTarget.id,
                                        ambientTarget.imgUrl,
                                        ambientTarget.imgLowResolutionUrl,
                                        ambientTarget.rotx,
                                        ambientTarget.roty,
                                        hotspotLabelName,
                                        currentViewpoint.ambient_target_id,
                                        ambientTarget.mobileUrl,
                                        ambientType,
                                        ambientTarget.panoramic,
                                        ambientTarget.panoramic_ratio,
                                        {}
                                    );
                                }
                                jj++;
                            }

                            if (datajson.ambients[ii].infopoints) {
                                for (
                                    var kk = 0;
                                    kk <
                                    datajson.ambients[ii].infopoints.length;
                                    kk++
                                ) {
                                    var ambientInfopoint =
                                        datajson.ambients[ii].infopoints[kk];

                                    var infopoint_data = {
                                        title: ambientInfopoint.name,
                                        image: ambientInfopoint.image,
                                        info: ambientInfopoint.info,
                                        link: ambientInfopoint.link
                                    };

                                    if (!ambientInfopoint.name)
                                        ambientInfopoint.name = "";

                                    var titleForPoint = ambientInfopoint.title;
                                    if (ambientInfopoint.show_title != 1)
                                        titleForPoint = "";

                                    var imgForInfopoint =
                                        "img/hotspots/infopoint.png";
                                    if (ambientInfopoint.custom_img_viewpoint)
                                        imgForInfopoint =
                                            ambientInfopoint.custom_img_viewpoint;
                                    //								if(infopoint_data.link && !infopoint_data.title && !infopoint_data.info && !infopoint_data.image)
                                    if (infopoint_data.link) {
                                        //iframePoint
                                        labelsService.addNewLabel(
                                            imgForInfopoint,
                                            currentAmbient.id,
                                            ambientInfopoint.x,
                                            ambientInfopoint.y,
                                            ambientInfopoint.z,
                                            onIframepointClick,
                                            "",
                                            "",
                                            "",
                                            "",
                                            "",
                                            titleForPoint,
                                            "",
                                            "",
                                            "",
                                            "",
                                            "",
                                            infopoint_data
                                        );
                                    } else {
                                        //infopoint
                                        labelsService.addNewLabel(
                                            imgForInfopoint,
                                            currentAmbient.id,
                                            ambientInfopoint.x,
                                            ambientInfopoint.y,
                                            ambientInfopoint.z,
                                            onInfopointClick,
                                            "",
                                            "",
                                            "",
                                            "",
                                            "",
                                            titleForPoint,
                                            "",
                                            "",
                                            "",
                                            "",
                                            "",
                                            infopoint_data
                                        );
                                    }
                                }
                            }

                            ii++;
                        }
                    }, 500);

                    starterAmbient.targetImageType =
                        starterAmbient.cubemap && starterAmbient.cubemap.negy
                            ? 1
                            : 0;
                    if (starterAmbient.panoramic == 1)
                        starterAmbient.targetImageType = 2;

                    changeToAmbientService.ChangeToAmbient(starterAmbient);
                }, 500);
            } else {
                $scope.noProject = true;
            }

            return datajson.ambients.filter(function(currentAmbient) {
                return currentAmbient.id == datajson.info.starter_ambientid;
            })[0];
        }

        /**
         * get a url param
         * @params String
         * @return String
         */
        function getUrlParam(param) {
            var paramValue = location.search.split(param + "=")[1];
            if (!paramValue) {
                return "";
            }
            return paramValue;
        }

        urlJson = JSON.parse(urlJson);
        if (urlJson.uid && urlJson.uid > 0) {
            analyticsService.setup(urlJson); // Analytics
            var starterAmbient = processJsonData(urlJson);
            infoService.setDataJson(urlJson);
            //console.log(urlJson)
            ///// CUSTOMIZATION
            //            $scope.loadingLogo = "img/marca.png";
            var floorImg = "img/imgpsh_fullsize2.png";

            if (
                urlJson.customization &&
                urlJson.uid != 167 &&
                urlJson.uid != 218
            ) {
                if (urlJson.customization.custom_loading_splash_logo) {
                    function getAndSetsplashLogoSize(url) {
                        var img = new Image();
                        img.onload = function() {
                            customSplashLoadingSize = {
                                x: this.width,
                                y: this.height
                            };

                            var correctSizeSplashLogo;
                            var marginBottom;

                            if (window.innerHeight <= 550) {
                                correctSizeSplashLogo = limitSizeAndKeepRatio(
                                    customSplashLoadingSize.x,
                                    customSplashLoadingSize.y,
                                    180,
                                    120
                                );
                                marginBottom = "15px";
                            } else {
                                correctSizeSplashLogo = limitSizeAndKeepRatio(
                                    customSplashLoadingSize.x,
                                    customSplashLoadingSize.y,
                                    300,
                                    200
                                );
                                marginBottom = "0px";
                            }

                            $scope.sizeLoadingSplashLogo = {
                                width: correctSizeSplashLogo.x + "px",
                                height: correctSizeSplashLogo.y + "px",
                                "margin-bottom": marginBottom
                            };

                            $scope.loadingLogo =
                                urlJson.customization.custom_loading_splash_logo;
                            $scope.fadeInLoadingLogo = true;
                        };
                        img.src = url;
                    }

                    getAndSetsplashLogoSize(
                        urlJson.customization.custom_loading_splash_logo
                    );
                } else {
                    $scope.loadingLogo = "img/marca.png";
                }

                if (urlJson.customization.custom_floor_stamp) {
                    floorImg = urlJson.customization.custom_floor_stamp;
                }
            } else {
                $scope.loadingLogo = "img/marca.png";
            }

            if (urlJson.uid == 167) {
                // CUSTOM AB-GADGETS
                $scope.loadingLogo = "img/dominicana/customLoadingIcon.png";
                floorImg = "img/dominicana/floor_stamp.png";
            } else if (urlJson.uid == 218) {
                // CUSTOM PACAL
                $scope.loadingLogo = "img/pacal/about_us.png";
                floorImg = "img/pacal/floor_stamp.png";
            }
            /////
            if (
                urlJson.customization &&
                urlJson.customization.custom_ambient_icon
            ) {
                $scope.custom_ambient_icon =
                    urlJson.customization.custom_ambient_icon;
            }

            init(starterAmbient, floorImg);
        } else {
            var url = $location.absUrl();
            var numberToSlice = url.lastIndexOf("#/project/");
            var slicedurl = url.slice(numberToSlice, url.length);
            var projectUUID = slicedurl.replace("#/project/", ""); // server
            if (projectUUID && projectUUID.length > 5) {
                window.location =
                    "https://www.360magictour.com/projects/?project=" +
                    projectUUID;
            } else {
                $scope.noProject = true;
            }
        }

        function limitSizeAndKeepRatio(width, height, maxWidth, maxHeight) {
            var finalSize = {
                x: width,
                y: height
            };
            if (width > maxWidth) {
                finalSize.x = maxWidth;
                finalSize.y = maxWidth * (height / width);
            }
            if (finalSize.y > maxHeight) {
                finalSize.y = maxHeight;
                finalSize.x = maxHeight * (width / height);
            }
            return finalSize;
        }

        var resizePlayerFunction = function() {
            $scope.screenWidth = {
                width: $window.innerWidth + "px"
            };
            $timeout(function() {
                $scope.$apply();
            });

            if (customSplashLoadingSize) {
                if (window.innerHeight <= 550) {
                    var correctSizeSplashLogo = limitSizeAndKeepRatio(
                        customSplashLoadingSize.x,
                        customSplashLoadingSize.y,
                        180,
                        120
                    );

                    $scope.sizeLoadingSplashLogo = {
                        width: correctSizeSplashLogo.x + "px",
                        height: correctSizeSplashLogo.y + "px",
                        "margin-bottom": "15px"
                    };
                } else {
                    var correctSizeSplashLogo = limitSizeAndKeepRatio(
                        customSplashLoadingSize.x,
                        customSplashLoadingSize.y,
                        300,
                        200
                    );

                    $scope.sizeLoadingSplashLogo = {
                        width: correctSizeSplashLogo.x + "px",
                        height: correctSizeSplashLogo.y + "px",
                        "margin-bottom": "0px"
                    };
                }
            }
        };

        window.addEventListener("resize", resizePlayerFunction);
        resizePlayerFunction();
    }
]);
