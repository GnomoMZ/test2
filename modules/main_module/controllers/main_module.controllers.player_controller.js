angular.module('mainModule').controller("playerController", ["$scope",
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
    function ($scope,
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
			   callOnIframePoint) {

        $scope.loadingLogo = "";
        $scope.custom_ambient_icon ="";
        //prevents zoom	
        var keyCodes = [61, 107, 173, 109, 187, 189];

        function onKeyDown(event) {
            if (event.ctrlKey == true && (keyCodes.indexOf(event.which) != -1)) {
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
        document.addEventListener('mousewheel', onMouseWheel, false);
        document.addEventListener('DOMMouseScroll', onMouseWheel, false);

        var is_firefox = /firefox/i.test(navigator.userAgent);
        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
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
			"x":0,
			"y":0
		}
		var currentlyPanoramic = false;
		var hoveringPoint = false;

        $scope.noProject = false;
        $scope.loading = true;
        $scope.destroyed = false;
        $scope.viewpointMode = false;
        $scope.viewpointState = '';
        $scope.newViewPortScene = "";
        $scope.scenelist = [];
        $scope.showPercentaje = false;
        $scope.showProgress = false;
        $scope.finishFirstLoading = false;
        $scope.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        $scope.loadingImgSource = "img/black.jpg";
        $scope.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        $scope.isSafari = isSafari;
        $scope.isAppleDevice = isSafari || $scope.isIOS;
        $scope.useLoadingWheel = $scope.isAppleDevice;
        $scope.fade = 'in';

        // TESTING 
//		urlJson = '{"status":"1","uid":"1236","nid":"23016","info":{"name":"Casona del Alto","street":null,"street_number":null,"postalcode":null,"city":null,"country":"","description":null,"contact_name":null,"contact_lastname":null,"contact_cel":null,"contact_tel":null,"contact_email":null,"contact_website":null,"contact_company":null,"contact_time":null,"lat":null,"long":null,"starter_ambientid":"244"},"ambients":[{"id":244,"name":"Casona del Alto","description":"","starter":null,"viewpoints":[{"x":-9.8706073760986,"modified":null,"y":0.47606492042542,"id":693,"z":1.5311676263809,"created":null,"project_id":23,"ambient_id":244,"name":"","ambient_target_id":245}],"rotx":-0.17482326283621,"roty":1.7513152666645,"imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084_5.jpg","nid":"23010","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1511097927084_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1511097927084_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1511097938213.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084_2.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084_0.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084_3.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511097927084_2.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511097927084_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511097927084_0.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511097927084_3.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511097927084_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511097927084.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":245,"name":"Ingreso","description":"","starter":null,"viewpoints":[{"x":-9.9357995986938,"modified":null,"y":-1.0140771865845,"id":694,"z":0.50152605772018,"created":null,"project_id":23,"ambient_id":245,"name":"","ambient_target_id":246},{"x":-4.7220425605774,"modified":null,"y":-0.2558351457119,"id":695,"z":8.8111782073975,"created":null,"project_id":23,"ambient_id":245,"name":"","ambient_target_id":244}],"rotx":-0.11222451029584,"roty":-4.6801542410358,"imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550_5.jpg","nid":"23011","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510513035550_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510513035550_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510513048615.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550_1.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550_3.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550_0.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513035550_1.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513035550_3.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513035550.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513035550_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513035550_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513035550_0.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":246,"name":"Recepci\u00f3n","description":"","starter":null,"viewpoints":[{"x":-9.6143598556519,"modified":null,"y":-2.719696521759,"id":696,"z":-0.40906637907028,"created":null,"project_id":23,"ambient_id":246,"name":"","ambient_target_id":247},{"x":-9.2989110946655,"modified":null,"y":2.5561525821686,"id":697,"z":-2.6450595855713,"created":null,"project_id":23,"ambient_id":246,"name":"","ambient_target_id":249},{"x":-4.2005033493042,"modified":null,"y":-0.35848531126976,"id":698,"z":9.0679244995117,"created":null,"project_id":23,"ambient_id":246,"name":"","ambient_target_id":248},{"x":9.8354043960571,"modified":null,"y":-0.47752475738525,"id":699,"z":-1.7426383495331,"created":null,"project_id":23,"ambient_id":246,"name":"","ambient_target_id":245},{"x":8.2761945724487,"modified":null,"y":-0.3969731926918,"id":713,"z":5.5988402366638,"created":null,"project_id":23,"ambient_id":246,"name":"","ambient_target_id":254},{"x":6.6098599433899,"modified":null,"y":-2.1056363582611,"id":717,"z":7.2025022506714,"created":null,"project_id":23,"ambient_id":246,"name":"","ambient_target_id":256},{"x":6.6617670059204,"modified":null,"y":1.4471952915192,"id":721,"z":7.3161797523499,"created":null,"project_id":23,"ambient_id":246,"name":"","ambient_target_id":258}],"rotx":-0.17599572093436,"roty":-4.7077701187365,"imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_40.jpg","nid":"23012","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510513075413_40.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510513075413_40.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510513093276_4.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_37.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_36.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_35.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_38.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_39.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_34.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513075413_37.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513075413_36.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513075413_35.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513075413_38.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513075413_39.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513075413_34.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":247,"name":"Sala de Estar","description":"","starter":null,"viewpoints":[{"x":-0.042152557522058,"modified":null,"y":-0.19217059016228,"id":700,"z":9.998064994812,"created":null,"project_id":23,"ambient_id":247,"name":"","ambient_target_id":248},{"x":9.9834280014038,"modified":null,"y":-0.51016962528229,"id":701,"z":0.26624298095703,"created":null,"project_id":23,"ambient_id":247,"name":"","ambient_target_id":246}],"rotx":-0.13637195716736,"roty":-4.7039459046302,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/icono_sala_estar_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_18.jpg","nid":"23017","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510513104986_18.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510513104986_18.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510513125295_1.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_15.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_17.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_12.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_13.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_16.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_14.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513104986_15.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513104986_17.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513104986_12.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513104986_13.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513104986_16.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513104986_14.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":248,"name":"Restaurante","description":"","starter":null,"viewpoints":[{"x":-6.672486782074,"modified":null,"y":-0.1956452280283,"id":702,"z":-7.445779800415,"created":null,"project_id":23,"ambient_id":248,"name":"","ambient_target_id":247},{"x":-1.1074063777924,"modified":null,"y":-0.041085839271545,"id":703,"z":-9.9384088516235,"created":null,"project_id":23,"ambient_id":248,"name":"","ambient_target_id":246},{"x":-9.9097557067871,"modified":null,"y":-0.35542732477188,"id":708,"z":-1.2924463748932,"created":null,"project_id":23,"ambient_id":248,"name":"","ambient_target_id":251}],"rotx":-0.03617909877735,"roty":-4.8043959661578,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/icono_sala_estar_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_19.jpg","nid":"23013","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510513135886_19.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510513135886_19.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510513150674_1.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_17.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_16.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_14.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_15.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_18.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_13.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513135886_17.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513135886_16.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513135886_14.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513135886_15.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513135886_18.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513135886_13.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":249,"name":"Sala de Estar Planta Alta","description":"","starter":null,"viewpoints":[{"x":-8.3946905136108,"modified":null,"y":-0.32574996352196,"id":704,"z":-5.4243030548096,"created":null,"project_id":23,"ambient_id":249,"name":"","ambient_target_id":250},{"x":4.3745536804199,"modified":null,"y":-0.85235965251923,"id":705,"z":-8.9519138336182,"created":null,"project_id":23,"ambient_id":249,"name":"","ambient_target_id":246}],"rotx":-0.084315544954699,"roty":-4.4472753232846,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/icono_sala_estar_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286_5.jpg","nid":"23014","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510513167286_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510513167286_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510513180069.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286_3.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286_2.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286_0.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513167286_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513167286_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513167286.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513167286_3.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513167286_2.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513167286_0.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":250,"name":"Vista a la monta\u00f1a","description":"","starter":null,"viewpoints":[{"x":9.3791875839233,"modified":null,"y":-0.20594570040703,"id":706,"z":3.4624302387238,"created":null,"project_id":23,"ambient_id":250,"name":"","ambient_target_id":249}],"rotx":-0.17202371221665,"roty":-5.2162198857395,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/dia_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850_5.jpg","nid":"23015","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510513192850_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510513192850_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510513210576.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850_0.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510513192850_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513192850_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513192850.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513192850_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513192850_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510513192850_0.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":251,"name":"Deck","description":"","starter":null,"viewpoints":[{"x":0.9628569483757,"modified":null,"y":-0.141387373209,"id":707,"z":-9.9525337219238,"created":null,"project_id":23,"ambient_id":251,"name":"","ambient_target_id":248},{"x":3.3221044540405,"modified":null,"y":0.17096631228924,"id":710,"z":9.4305028915405,"created":null,"project_id":23,"ambient_id":251,"name":"","ambient_target_id":252},{"x":-7.9714803695679,"modified":null,"y":-2.5786876678467,"id":711,"z":5.4594750404358,"created":null,"project_id":23,"ambient_id":251,"name":"","ambient_target_id":253}],"rotx":-0.030752274862038,"roty":-4.4561353406422,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/balcon_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768_5.jpg","nid":"23018","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510514610768_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510514610768_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510514625140.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768_2.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768_3.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768_1.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768_0.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510514610768_2.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514610768_3.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514610768.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514610768_1.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514610768_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514610768_0.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":252,"name":"Piscina","description":"","starter":null,"viewpoints":[{"x":-9.9972429275513,"modified":null,"y":-0.19662924110889,"id":709,"z":-0.12834694981575,"created":null,"project_id":23,"ambient_id":252,"name":"","ambient_target_id":251}],"rotx":-0.46443776118465,"roty":-4.8077580210241,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/pileta.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772_5.jpg","nid":"23019","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1511098281772_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1511098281772_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1511098295646.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772_2.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772_0.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772_4.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772_1.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772_3.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511098281772_2.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098281772_0.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098281772.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098281772_4.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098281772_1.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098281772_3.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":253,"name":"Vista Casona del Alto","description":"","starter":null,"viewpoints":[{"x":9.8327474594116,"modified":null,"y":0.96601837873459,"id":712,"z":1.5439841747284,"created":null,"project_id":23,"ambient_id":253,"name":"","ambient_target_id":251}],"rotx":0.12914915868618,"roty":-7.9467610483103,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/dia_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100_5.jpg","nid":"23020","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510514716100_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510514716100_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510514730548.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100_1.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100_2.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100_4.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100_3.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100_0.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510514716100_1.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514716100_2.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514716100.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514716100_4.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514716100_3.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510514716100_0.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":254,"name":"Habitaci\u00f3n Suite Junior","description":"","starter":null,"viewpoints":[{"x":8.6030435562134,"modified":null,"y":-0.8040184378624,"id":714,"z":-5.0340037345886,"created":null,"project_id":23,"ambient_id":254,"name":"","ambient_target_id":255},{"x":9.4308795928955,"modified":null,"y":-0.80405879020691,"id":715,"z":-3.2267639636993,"created":null,"project_id":23,"ambient_id":254,"name":"","ambient_target_id":246}],"rotx":-0.13525312978967,"roty":-4.6826487436911,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/dormitorio_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091_5.jpg","nid":"23021","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510515226091_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510515226091_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510515249917.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091_3.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091_0.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510515226091_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515226091_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515226091_3.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515226091_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515226091_0.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515226091.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":255,"name":"Ba\u00f1o","description":"","starter":null,"viewpoints":[{"x":-9.9715251922607,"modified":null,"y":-0.72650575637817,"id":716,"z":-0.20216751098633,"created":null,"project_id":23,"ambient_id":255,"name":"","ambient_target_id":254}],"rotx":-0.048371895049654,"roty":0.48190667204616,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/banio_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917_5.jpg","nid":"23022","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1511098139917_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1511098139917_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1511098202555.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917_2.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917_0.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917_1.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511098139917_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098139917_2.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098139917_0.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098139917_1.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098139917_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098139917.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":256,"name":"Habitaci\u00f3n Suite con Hidro","description":"","starter":null,"viewpoints":[{"x":8.4013481140137,"modified":null,"y":-0.99604058265686,"id":718,"z":-5.3315329551697,"created":null,"project_id":23,"ambient_id":256,"name":"","ambient_target_id":257},{"x":9.2891674041748,"modified":null,"y":-1.0354404449463,"id":719,"z":-3.5551705360413,"created":null,"project_id":23,"ambient_id":256,"name":"","ambient_target_id":246}],"rotx":-0.12548300216202,"roty":-4.6678876979141,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/dormitorio_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439_5.jpg","nid":"23023","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510515777439_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510515777439_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510515802287.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439_3.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439_0.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510515777439_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515777439_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515777439.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515777439_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515777439_3.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515777439_0.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":257,"name":"Hidro","description":"","starter":null,"viewpoints":[{"x":9.9032487869263,"modified":null,"y":-0.56278175115585,"id":720,"z":1.2684407234192,"created":null,"project_id":23,"ambient_id":257,"name":"","ambient_target_id":256}],"rotx":-0.23484009575054,"roty":-4.9355123868639,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/banio_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458_5.jpg","nid":"23024","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510515817458_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510515817458_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510515833474.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458_0.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458_1.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458_3.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510515817458_4.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515817458_0.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515817458_1.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515817458_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515817458_3.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510515817458.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":258,"name":"Habitaci\u00f3n Superior","description":"","starter":null,"viewpoints":[{"x":1.9697575569153,"modified":null,"y":-0.0095735937356949,"id":722,"z":-9.8040790557861,"created":null,"project_id":23,"ambient_id":258,"name":"","ambient_target_id":246},{"x":4.1736736297607,"modified":null,"y":-0.0081610130146146,"id":723,"z":-9.0873746871948,"created":null,"project_id":23,"ambient_id":258,"name":"","ambient_target_id":259}],"rotx":-0.13277355915625,"roty":-5.5557840755526,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/dormitorio_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070_5.jpg","nid":"23025","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1510516073070_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1510516073070_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1510516095716.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070_2.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070_4.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070_1.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070_0.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1510516073070_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510516073070.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510516073070_2.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510516073070_4.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510516073070_1.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1510516073070_0.jpg"},"panoramic":0,"panoramic_ratio":0},{"id":259,"name":"Ba\u00f1o","description":"","starter":null,"viewpoints":[{"x":-9.8252801895142,"modified":null,"y":0.18046200275421,"id":724,"z":-1.8523770570755,"created":null,"project_id":23,"ambient_id":259,"name":"","ambient_target_id":258}],"rotx":-0.18278838756042,"roty":2.3582836284956,"custom_img_viewpoint":"https://america.360magictour.com/admin/sites/default/files/styles/thumbnail/public/banio_0.png","imgUrl":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314_5.jpg","nid":"23026","imgLowResolutionUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1511098069314_5.jpg","mobileUrl":"https://america.360magictour.com/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1511098069314_5.jpg","imgMiniatureUrl":"https://america.360magictour.com/admin/sites/default/files/360MT_Thumbnail-1511098084261.jpg","cubemap":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314_0.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314.jpg"},"cubemapLow":{"negy":"https://america.360magictour.com/admin/sites/default/files/360image1511098069314_3.jpg","posz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098069314_1.jpg","posy":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098069314_0.jpg","negx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098069314_2.jpg","posx":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098069314_4.jpg","negz":"https://america.360magictour.com/admin/sites/default/files/styles/cube_low/public/360image1511098069314.jpg"},"panoramic":0,"panoramic_ratio":0}],"customization":{"custom_project_logo":"https://america.360magictour.com/admin/sites/default/files/customization/project_logo/logo%20splash_18.png","custom_loading_splash_logo":"https://america.360magictour.com/admin/sites/default/files/customization/splash_logo/casona-del-alto.png","custom_ambient_icon":"https://america.360magictour.com/admin/sites/default/files/customization/ambient_icon/interior_0.png","label_color":"#ffffff","custom_window_background_image":"","about_us_title_icon":"https://america.360magictour.com/admin/sites/default/files/casona-del-alto.png","custom_floor_stamp":"https://america.360magictour.com/admin/sites/default/files/customization/floor_logo/logo%20piso_22.png","custom_color":"","about_us_span":["Casona del Alto es un lugar pensado para quienes gusten de la paz, la tranquilidad, la buena comida y la vista insuperable de las monta\u00f1as andinas. Un refugio \u00edntimo y m\u00e1gico para reencontrar su energ\u00eda. Porque aqu\u00ed cada espacio fue dise\u00f1ado para crear una atm\u00f3sfera de descanso, de informalidad, de casa que re\u00fane amigos. Bienvenido a Casona del Alto."],"about_us_title":"Casona Del Alto","about_us_subtitle":"La calidez de una casa con el cuidado de un hotel.","about_us_web":"http://www.casonadelalto.com.ar/","about_us_email":"info@casonadelalto.com.ar","hide_buttons":{"gallery":false,"information":false,"ambient":false,"location":false,"share":false,"gyroscope":false,"fullscreen":false,"vr":false,"about_us":false}}}';
		//only txt https://autocity.com.ar/
//		urlJson = '{"status":"1","uid":"276","nid":"4275","info":{"name":"Bhhhhh","street":null,"street_number":null,"postalcode":null,"city":null,"country":"","description":null,"contact_name":null,"contact_lastname":null,"contact_cel":null,"contact_tel":null,"contact_email":null,"contact_website":null,"contact_company":null,"contact_time":null,"lat":null,"long":null,"starter_ambientid":"1"},"ambients":[{"id":1,"name":"Saludos","description":"","starter":null,"viewpoints":[],"rotx":0,"roty":0,"infopoints":[{"name":"lalala","title":"USM Haller System","info":["Growth in all directions.","From storage furniture to bookshelves: the origin of modularity is a chrome ball joint. From there, chrome tubes and metal insert panels allow whatever the user imagines to come to life.","An intimate home office or an open office environment, with USM Haller your individual visions become reality.","An intimate home office or an open office environment, with USM Haller your individual visions become reality."],"image":"","link":"","changed":"1506963314","uuid":"0e9d8a65-0d0a-4975-9543-cbbc27a7c82f","nid":"4276","deleted":0,"x":"5.3312816619873","y":"2.6032433509827","z":"8.049880027771","project":"4275","ambient":"4274"}],"imgUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/styles/ricoh_theta_style/public/360image1506620724249.jpg","nid":"4274","imgLowResolutionUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1506620724249.jpg","mobileUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1506620724249.jpg","imgMiniatureUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/360MT_Thumbnail-1506620737764.jpg","cubemap":{},"cubemapLow":{},"panoramic":0,"panoramic_ratio":0}]}';
		
//		urlJson = '{"status":"1","uid":"276","nid":"4275","info":{"name":"Bhhhhh","street":null,"street_number":null,"postalcode":null,"city":null,"country":"","description":null,"contact_name":null,"contact_lastname":null,"contact_cel":null,"contact_tel":null,"contact_email":null,"contact_website":null,"contact_company":null,"contact_time":null,"lat":null,"long":null,"starter_ambientid":"1"},"ambients":[{"id":1,"name":"Saludos","description":"","starter":null,"viewpoints":[],"rotx":0,"roty":0,"infopoints":[{"title":"this is the title.","changed":"1507059465","uuid":"0e9d8a65-0d0a-4975-9543-cbbc27a7c82f","nid":"4276","deleted":0,"info":["here is all the information about the info pointr","we will se what wrapper to use when the user hits enter.r","r","so when its separated we can send it as an array."],"name":"this is the info name","x":"5.3312816619873","show_title":"1","y":"2.6032433509827","z":"8.049880027771","project":"4275","ambient":"4274"}],"imgUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/styles/ricoh_theta_style/public/360image1506620724249.jpg","nid":"4274","imgLowResolutionUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/styles/ricoh_theta_style_low/public/360image1506620724249.jpg","mobileUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/styles/ricoh_theta_style_mobile/public/360image1506620724249.jpg","imgMiniatureUrl":"https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/sites/default/files/360MT_Thumbnail-1506620737764.jpg","cubemap":{},"cubemapLow":{},"panoramic":0,"panoramic_ratio":0}]}';
		
		urlJson = '{"status":1,"uid":"21","nid":"1673","info":{"name":"KANSEMBATCHSTRASESEES 221, ZURICH","street":"Urquiza","street_number":"1280","district":"Entre Rios","postalcode":"3100","city":"Parana","country":"Argentina","description":"descripcion con detalles, si cuantos detalles, totalmente no escribiendo para llenar espacio y probar que anda bien la estructura en la gui. Y ya que estamos escribimos un poco mas, porque Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz bueno, hay que llenar la seccion y con palabras queda mas fiel que si escribo fafduifheaiuwhfaiew, lo cual tiene sentido si uno lo piensa. Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz","contact_name":"pedro","contact_lastname":"garcia","contact_cel":"154789995","contact_tel":"154789995","contact_email":"pacunia@interactive-3d.com","contact_website":"http://pagina.com","contact_company":"pepe inc.","contact_time":"8hs a 16hs","lat":"","long":"","starter_ambientid":1},"ambients":[{"name":"Sphere Image","id":1,"nid":"553","imgUrl":"img/panoimages/bottom_logo.jpg","imgLowResolutionUrl":"img/imageLowRes1.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes1.jpg","description":"descripcion ambiente 1 nowrap Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz","rotx":0,"roty":-2,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":10,"y":0,"z":0}],"blueprint":[1]},{"name":"Pano 360 Image","id":2,"nid":"554","imgUrl":"img/panoimages/pano_img14.jpg","imgLowResolutionUrl":"img/panoimages/pano_img14_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img14_thumb.jpg","mobileUrl":"img/imageLowRes2.jpg","description":null,"rotx":0,"roty":0,"viewpoints":[{"name":"Sphere Image","ambient_target_id":1,"x":-9,"y":0,"z":-2},{"name":"Pano 180 Image","ambient_target_id":3,"x":5,"y":0,"z":-5}],"blueprint":[1]},{"name":"Pano 180 Image","id":3,"nid":"555","imgUrl":"img/panoimages/pano_img12.jpg","imgLowResolutionUrl":"img/panoimages/pano_img12_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes3.jpg","description":"","rotx":0,"roty":0,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":3,"y":0,"z":-3}],"blueprint":[2]},{"name":"Pano 180 Image","id":4,"nid":"555","imgUrl":"img/panoimages/pano_img12.jpg","imgLowResolutionUrl":"img/panoimages/pano_img12_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes3.jpg","description":"","rotx":0,"roty":0,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":3,"y":0,"z":-3}]},{"name":"Pano 180 Image","id":5,"nid":"555","imgUrl":"img/panoimages/pano_img12.jpg","imgLowResolutionUrl":"img/panoimages/pano_img12_lowres.jpg","imgMiniatureUrl":"img/panoimages/pano_img12_thumb.jpg","mobileUrl":"img/imageLowRes3.jpg","description":"","rotx":0,"roty":0,"viewpoints":[{"name":"Pano 360 Image","ambient_target_id":2,"x":3,"y":0,"z":-3}],"blueprint":[1,2]}],"customization":{"custom_color":"red","label_color":"red","custom_loading_splash_logo":"img/dominicana/customLoadingIcon.png","custom_project_logo":"img/dominicana/Logo_blanco.png","custom_floor_stamp":"","custom_window_background_image":"","about_us_title":"Custom title","about_us_title_icon":"img/dominicana/Logo_blanco.png","about_us_subtitle":"custom subtitle","about_us_span":["span1","span2","span3"],"about_us_web":"www.google.com.ar","about_us_email":"info@360magictour.co","about_us_mobile_icon":"img/dominicana/Logo_blanco.png","hide_buttons":{"gallery":"","information":"","ambient":"","location":"","share":"","gyroscope":"","fullscreen":"","vr":"","about_us":""}},"blueprint_info":{"scale":{"x":100,"y":98},"blueprints":[{"name":"Planta baja","plant_number":1,"id":1,"url_img":"img/blueprints/p_2.png","points":[{"x":100,"y":49,"target_ambient":1},{"x":50,"y":49,"target_ambient":2}]},{"name":"Primer piso","plant_number":2,"id":2,"url_img":"img/blueprints/p_1.png","points":[{"x":100,"y":98,"target_ambient":3},{"x":50,"y":49,"target_ambient":1}]}]}}';


		
		
        var setProgressBarValues = function (progress) {
            var truncProgress = Math.floor(progress);
            $scope.progressPercentaje = "%" + truncProgress;
            $scope.progressBarStyle = {
                "width": progress + "%"
            };
            $timeout(function () {
                $scope.$apply();
            })
        }

        function OnMouseDown(event) {
            if (infoService.currentButtonSelected != "location" && $scope.hideLoading) {
                labelsService.checkForColitionInActive(event);
            }
        }

        function OnMouseUp(event) {
            if (infoService.currentButtonSelected != "location" && $scope.hideLoading) {
                labelsService.checkForColitionInActive(event);
            }
        }

        function OnTouchStart(event) {
            if (infoService.currentButtonSelected != "location" && $scope.hideLoading) {
                labelsService.checkForColitionInActive(event);
            }
        }

        function OnTouchEnd(event) {
            if (infoService.currentButtonSelected != "location" && $scope.hideLoading) {
                labelsService.checkForColitionInActive(event);
            }
        }
		
		function OnMouseMove(event){
			if (infoService.currentButtonSelected != "location" && $scope.hideLoading) {
				hoveringPoint = labelsService.checkForHover(event);
			}

		}

        function destroy() {
            $scope.destroyed = true;

            var container = document.getElementById("DisplayCanvas");

            container.removeEventListener('mousedown', OnMouseDown);
            document.removeEventListener("mouseup", OnMouseUp);
            container.removeEventListener('touchstart', OnTouchStart);
            document.removeEventListener('touchend', OnTouchEnd);
			document.removeEventListener('mousemove', OnMouseMove);

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
                imageResizerService.resize(image, 2048, 1024).then(function (resizedImg) {
                    threeService.setSimpleChangeSphericTexture(resizedImg).then(function () { }, function (error) {
                        console.error(error);
                    }).finally(function () {
                        //mouserotationService.SetRotation(viewpoint.rotx, viewpoint.roty);
                        $scope.fade = 'out';
                        $timeout(function () {
                            labelsService.changeSection(viewpoint.sectionTarget);
                            $scope.hideLoading = true;
                            $scope.finishFirstLoading = true;
                            $scope.showProgress = false;
                            handleInputGUI.EnableInputGUI();
                            $timeout(function () {
                                $scope.$apply();
                            });
                            mouserotationService.removeRotationEventsToElement("loadingScreen");
                            mouserotationService.setAllowAnimation(true);
                            

                            image = null;
                            setProgressBarValues(100);
                            if (isSafari) {
                                $scope.showCounituousLoadingBar = false;
                            }
                            statusLoadingScreen.LoadingFinish();
                        }, 500);
                    });
                }, function (error) {
                    console.error(error);
                });
            } else {
                threeService.setSimpleChangeSphericTexture(image).then(function () { }, function (error) {
                    console.error(error);
                }).finally(function () {
                    $scope.fade = 'out';

                    $timeout(function () {
                        labelsService.changeSection(viewpoint.sectionTarget);
                        $scope.hideLoading = true;
                        $scope.finishFirstLoading = true;
                        $scope.showProgress = false;
                        handleInputGUI.EnableInputGUI();

                        $timeout(function () {
                            $scope.$apply();
                        });
                        mouserotationService.removeRotationEventsToElement("loadingScreen");
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
            var cubeTextures = getCubeTexturesArrayFromCubemap(ambient.cubemap)
            threeService.setSimpleChangeCubeTextures(cubeTextures).then(function () { }, function (error) {
                console.error(error);
            }).finally(function () {
                $scope.fade = 'out';
                $timeout(function () {
                    labelsService.changeSection(viewpoint.sectionTarget);
                    $scope.hideLoading = true;
                    $scope.finishFirstLoading = true;
                    $scope.showProgress = false;
                    handleInputGUI.EnableInputGUI();
                    $timeout(function () {
                        $scope.$apply();
                    });
                    mouserotationService.removeRotationEventsToElement("loadingScreen");
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
            threeService.setSimpleChangeCilinderTextures(image, viewpoint.panoramic_ratio).then(function () { }, function (error) {
                console.error(error);
            }).finally(function () {
                $scope.fade = 'out';
                $timeout(function () {
                    labelsService.changeSection(viewpoint.sectionTarget);
                    $scope.hideLoading = true;
                    $scope.finishFirstLoading = true;
                    $scope.showProgress = false;
                    handleInputGUI.EnableInputGUI();
                    $timeout(function () {
                        $scope.$apply();
                    });
                    
                    mouserotationService.removeRotationEventsToElement("loadingScreen");
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
                    setProgressBarValues(e.loaded / e.total * 100);
                } else {
                    console.log(e);
                }
            }

            function onLoadRequest(result) {
                setProgressBarValues(100);
                var base64img = "data:image/jpeg;base64," + base64.encode(requestImg.responseText);
                setFullTexture(viewpoint, base64img);
            }

            if ($scope.isMobile && viewpoint.imageTargetMobile) {
                requestImg = threeService.getImgFromXMLHttpRequest(viewpoint.imageTargetMobile, onLoadRequest, onProgressRequest);
            } else {
                requestImg = threeService.getImgFromXMLHttpRequest(viewpoint.imageTarget, onLoadRequest, onProgressRequest);
            }
        }
        
        function downloadAndSetFullPanoramicTexture(viewpoint) {
            var requestImg;

            function onProgressRequest(e) {
                if (e.lengthComputable) {
                    setProgressBarValues(e.loaded / e.total * 100);
                } else {
                    console.log(e);
                }
            }

            function onLoadRequest(result) {
                setProgressBarValues(100);
                var base64img = "data:image/jpeg;base64," + base64.encode(requestImg.responseText);
                setFullPanoramicTexture(viewpoint, base64img);
            }

            requestImg = threeService.getImgFromXMLHttpRequest(viewpoint.imageTarget, onLoadRequest, onProgressRequest);
        }
        
        function downloadAndSetFullCubicTexture(viewpoint) {
            var requestImg;

            function onProgressRequest(e) {
                if (e.lengthComputable) {
                    setProgressBarValues(e.loaded / e.total * 100);
                } else {
                    console.log(e);
                }
            }

            function onLoadRequest(result) {
                setProgressBarValues(100);
                var base64img = "data:image/jpeg;base64," + base64.encode(requestImg.responseText);
                setFullCubeTexture(viewpoint, base64img);
            }

            requestImg = threeService.getImgFromXMLHttpRequest(viewpoint.imageTarget, onLoadRequest, onProgressRequest);
        }

		function setSphericTextureRoutine(viewpoint, galleryClick) {
            $timeout(function () {
                if (isSafari) {
                    $scope.showCounituousLoadingBar = true;
                }
                labelsService.changeSection('');
                infoService.setAmbientChange(viewpoint.target_id);
                threeService.setSimpleChangeSphericTexture(viewpoint.imageTargetLowRes).then(function () { }, function (error) {
                    console.error(error);
                }).finally(function () {
                    $scope.fadeBackground = true;
                    $scope.showPercentaje = true;
                    if(!$scope.isAppleDevice)
                    {
                        $scope.useLoadingWheel = false;    
                    }
                    mouserotationService.setLimitsHorizontalRotation(false,0);
                    mouserotationService.setVerticalLock(false);
					currentlyPanoramic = false;
					if(!galleryClick)
						mouserotationService.SetRotation(viewpoint.rotx + (threeService.rotationCameraPlaceholder.rotation.x - lastRotationToSet.x), viewpoint.roty + (threeService.rotationCameraPlaceholder.rotation.y - lastRotationToSet.y));
					else
						mouserotationService.SetRotation(viewpoint.rotx, viewpoint.roty);

					lastRotationToSet.x = viewpoint.rotx;
					lastRotationToSet.y = viewpoint.roty;

					
					mouserotationService.SetPaused(false);
                    if ($scope.isMobile) {
                        $scope.controlsOrientantion.connect();
                    }

                    lasRotationCameraX = 0;
                    lasRotationCameraY = 0;

                    mouserotationService.addRotationEventsToElement("loadingScreen");
                    $scope.showProgress = true;
                    if (!isSafari) {
                        downloadAndSetFullTexture(viewpoint);
                    } else {
                        if ($scope.isMobile && viewpoint.imageTargetMobile) {
                            setFullTexture(viewpoint, viewpoint.imageTargetMobile);
                        } else {
                            setFullTexture(viewpoint, viewpoint.imageTarget);
                        }
                    }
                });
            }, 550);
        }
        
		function setPanoramicTextureRoutine(viewpoint, galleryClick) {
            $timeout(function () {
                if (isSafari) {
                    $scope.showCounituousLoadingBar = true;
                }
                labelsService.changeSection('');
                infoService.setAmbientChange(viewpoint.target_id);
                threeService.setSimpleChangeCilinderTextures(viewpoint.imageTargetLowRes,viewpoint.panoramic_ratio).then(function () { }, function (error) {
                    console.error(error);
                }).finally(function () {

                    $scope.fadeBackground = true;
                    $scope.showPercentaje = true;
                    if(!$scope.isAppleDevice)
                    {
                        $scope.useLoadingWheel = false;    
                    }
                    if(viewpoint.panoramic_ratio < 6.3)
                        mouserotationService.setLimitsHorizontalRotation(true, (viewpoint.panoramic_ratio/6.3 * (Math.PI*2))/2 );
                    else 
                        mouserotationService.setLimitsHorizontalRotation(false,0);
					
					if(!galleryClick)
						mouserotationService.SetRotation(viewpoint.rotx + (threeService.rotationCameraPlaceholder.rotation.x - lastRotationToSet.x), viewpoint.roty + (threeService.rotationCameraPlaceholder.rotation.y - lastRotationToSet.y));
					else
						mouserotationService.SetRotation(viewpoint.rotx, viewpoint.roty);

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

                    mouserotationService.addRotationEventsToElement("loadingScreen");
                    $scope.showProgress = true;
                    if($scope.isAppleDevice)
                        setFullPanoramicTexture(viewpoint, viewpoint.imageTarget);
                    else downloadAndSetFullPanoramicTexture(viewpoint);
                });
            }, 550);
        }

		function setCubicTextureRoutine(viewpoint, galleryClick) {
            var ambientID = viewpoint.target_id;
            var ambient = urlJson.ambients.filter(function (_currentAmbient) {
                return _currentAmbient.id == ambientID;
            })[0];
            $timeout(function () {
                if (isSafari) {
                    $scope.showCounituousLoadingBar = true;
                }
                labelsService.changeSection('');
                infoService.setAmbientChange(ambientID);
                var cubeTexturesLow = getCubeTexturesArrayFromCubemap(ambient.cubemapLow);
                threeService.setSimpleChangeCubeTextures(cubeTexturesLow).then(function () { }, function (error) {
                    console.error(error);
                }).finally(function () {
                    $scope.fadeBackground = true;
                    $scope.showPercentaje = true;
                    if(!$scope.isAppleDevice)
                    {
                        $scope.useLoadingWheel = true;    
                    }
                    mouserotationService.setLimitsHorizontalRotation(false,0);
                    mouserotationService.setVerticalLock(false);
					currentlyPanoramic = false;

					if(!galleryClick)
						mouserotationService.SetRotation(viewpoint.rotx + (threeService.rotationCameraPlaceholder.rotation.x - lastRotationToSet.x), viewpoint.roty + (threeService.rotationCameraPlaceholder.rotation.y - lastRotationToSet.y));
					else
						mouserotationService.SetRotation(viewpoint.rotx, viewpoint.roty);


					lastRotationToSet.x = viewpoint.rotx;
					lastRotationToSet.y = viewpoint.roty;

					mouserotationService.SetPaused(false);
                    if ($scope.isMobile) {
                        $scope.controlsOrientantion.connect();
                    }

                    lasRotationCameraX = 0;
                    lasRotationCameraY = 0;

                    mouserotationService.addRotationEventsToElement("loadingScreen");
                    $scope.showProgress = true;
                    
                    setFullCubeTexture(ambient, viewpoint);
                });
            }, 550);
        }

		function onViewportAfterScreenShoot(viewpoint, galleryClick) {
            setProgressBarValues(0);
            var date = new Date(); //aseguro que no cambie 2 veces seguidas por si viewpoint esta en una posicion similar o igual

            if ((date.getTime() - lasTime) < 1500) {
                return;
            }
            setProgressBarValues(0);
            lasTime = date.getTime();

            if (!first) {
                $scope.hideLoading = false;

                $scope.fade = 'in';
                statusLoadingScreen.LoadingStarted();
                $timeout(function () {
                    $scope.$apply();
                })
            }
            $scope.fadeBackground = true;
            $scope.showPercentaje = false;
            first = false;

            changeToAmbientService.setCurrentAmbient(viewpoint.target_id);
            
            switch (viewpoint.targetImageType) {
                case 0:
					setSphericTextureRoutine(viewpoint,galleryClick);
                    break;
                case 1:
					setCubicTextureRoutine(viewpoint,galleryClick);
                    break;
                case 2:
					setPanoramicTextureRoutine(viewpoint,galleryClick);
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
                    image.onload = function () {
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
            analyticsService.sendViewpointClickEvent(viewpoint.name, viewpoint.target_id); // Analytics

            mouserotationService.SetPaused(true);
            handleInputGUI.DisableInputGUI();
            handleInputGUI.CloseButtonGUI();
            mouserotationService.setAllowAnimation(false);

			if(first)
            {
				onViewportAfterScreenShoot(viewpoint, galleryClick);
            }
            else{
                if (threeService.stereoActivated || $scope.isIOS){
					setFadeImg('img/black.jpg', viewpoint, galleryClick);
                } else {
                    threeService.renderToTexture(function (base64img) {
						setFadeImg(base64img, viewpoint, galleryClick);
                    });
                }
            }
        }
			
		/*iframepoint*/
		function onIframepointClick(iframepoint){
			callOnIframePoint.callIframePoint(iframepoint);
		}
		/*popup*/
		function onInfopointClick(infopoint){
			callOnPopupPoint.callPopupPoint(infopoint);
		}

		

        function init(starterAmb, floorImage) {
            var polyCountSphere = 90;
            if ($scope.isMobile) {
                polyCountSphere = 50;
            }

            if (starterAmb.cubemap && starterAmb.cubemap.negy) {
                var cubeTextures = getCubeTexturesArrayFromCubemap(starterAmb.cubemapLow);
                threeService.init(false, polyCountSphere, cubeTextures, floorImage);
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

            container.addEventListener('mousedown', OnMouseDown, false);
            document.addEventListener("mouseup", OnMouseUp, false);
            container.addEventListener('touchstart', OnTouchStart, false);
            document.addEventListener('touchend', OnTouchEnd, false);
			document.addEventListener('mousemove', OnMouseMove, false);


            $(window).resize(function () {
                threeService.resize();
				mouserotationService.resize();
            });

            window.onfocus = function () {
                $(window).resize();
            }

            mouserotationService.SetObjectToRotate(threeService.rotationCameraPlaceholder);
            mouserotationService.SetCamera(threeService.camera);
            $scope.newmap;

            var placeHolderCameraOrientation = new THREE.Object3D();
            placeHolderCameraOrientation.rotation.reorder("YXZ");
            threeService.camera.rotation.reorder("YXZ");
            $scope.controlsOrientantion = new THREE.DeviceOrientationControls(placeHolderCameraOrientation);
			mouserotationService.SetGyroPlaceholder(placeHolderCameraOrientation);
			
            changeToAmbientService.addFunctionToCallOnChangeAmbient(onViewportClick);

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
                                    threeService.camera.rotation.y = lastPosRotationAnimationGyro.y;
                                    if (threeService.camera.rotation.y != placeHolderCameraOrientation.rotation.y) {
                                        if (threeService.camera.rotation.y > placeHolderCameraOrientation.rotation.y) {
                                            if (threeService.camera.rotation.y - deltaTime * speedForAjust < placeHolderCameraOrientation.rotation.y) {
                                                threeService.camera.rotation.y = placeHolderCameraOrientation.rotation.y;
                                                animationGyroY = false;
                                            } else {
                                                threeService.camera.rotation.y = threeService.camera.rotation.y - deltaTime * speedForAjust;
                                            }
                                        }
                                        if (threeService.camera.rotation.y < placeHolderCameraOrientation.rotation.y) {
                                            if (threeService.camera.rotation.y + deltaTime * speedForAjust > placeHolderCameraOrientation.rotation.y) {
                                                threeService.camera.rotation.y = placeHolderCameraOrientation.rotation.y;
                                                animationGyroY = false;
                                            } else {
                                                threeService.camera.rotation.y = threeService.camera.rotation.y + deltaTime * speedForAjust;
                                            }
                                        }
                                    } else {
                                        animationGyroY = false;
                                    }
                                } else {
                                    threeService.camera.rotation.y = placeHolderCameraOrientation.rotation.y;
                                }

                                if (animationGyroX) {

                                    threeService.camera.rotation.x = lastPosRotationAnimationGyro.x;


                                    if (threeService.camera.rotation.x != placeHolderCameraOrientation.rotation.x) {
                                        if (threeService.camera.rotation.x > placeHolderCameraOrientation.rotation.x) {
                                            if (threeService.camera.rotation.x - deltaTime * speedForAjust < placeHolderCameraOrientation.rotation.x) {
                                                threeService.camera.rotation.x = placeHolderCameraOrientation.rotation.x;
                                                animationGyroX = false;
                                            } else {
                                                threeService.camera.rotation.x = threeService.camera.rotation.x - deltaTime * speedForAjust;
                                            }
                                        }
                                        if (threeService.camera.rotation.x < placeHolderCameraOrientation.rotation.x) {
                                            if (threeService.camera.rotation.x + deltaTime * speedForAjust > placeHolderCameraOrientation.rotation.x) {
                                                threeService.camera.rotation.x = placeHolderCameraOrientation.rotation.x;
                                                animationGyroX = false;
                                            } else {
                                                threeService.camera.rotation.x = threeService.camera.rotation.x + deltaTime * speedForAjust;
                                            }
                                        }
                                    } else {
                                        animationGyroX = false;
                                    }
                                } else {
                                    threeService.camera.rotation.x = placeHolderCameraOrientation.rotation.x;
                                }

                                if (animationGyroZ) {
                                    if (threeService.camera.rotation.z != placeHolderCameraOrientation.rotation.z) {
                                        if (threeService.camera.rotation.z > placeHolderCameraOrientation.rotation.z) {
                                            if (threeService.camera.rotation.z - deltaTime * speedForAjust < placeHolderCameraOrientation.rotation.z) {
                                                threeService.camera.rotation.z = placeHolderCameraOrientation.rotation.z;
                                                animationGyroZ = false;
                                            } else {
                                                threeService.camera.rotation.z = threeService.camera.rotation.z - deltaTime * speedForAjust;
                                            }
                                        }
                                        if (threeService.camera.rotation.z < placeHolderCameraOrientation.rotation.z) {
                                            if (threeService.camera.rotation.z + deltaTime * speedForAjust > placeHolderCameraOrientation.rotation.z) {
                                                threeService.camera.rotation.z = placeHolderCameraOrientation.rotation.z;
                                                animationGyroZ = false;
                                            } else {
                                                threeService.camera.rotation.z = threeService.camera.rotation.z + deltaTime * speedForAjust;
                                            }
                                        }
                                    } else {
                                        animationGyroZ = false;
                                    }
                                } else {
                                    threeService.camera.rotation.z = placeHolderCameraOrientation.rotation.z;
                                }

                                if (!animationGyroX && !animationGyroY && !animationGyroZ)
                                    animationGyro = false;

                            } else {
                                threeService.camera.rotation.y = placeHolderCameraOrientation.rotation.y;
                                threeService.camera.rotation.x = placeHolderCameraOrientation.rotation.x;
								if(currentlyPanoramic)
									threeService.camera.rotation.z = 0;
								else	threeService.camera.rotation.z = placeHolderCameraOrientation.rotation.z;
								
                            }

                            lasRotationCameraX = threeService.camera.rotation.x;
                            lasRotationCameraY = threeService.camera.rotation.y;
                        } else {
							if(currentlyPanoramic)
							{
								threeService.camera.rotation.x = 0;
								threeService.camera.rotation.y = 0;
							}
							else
							{
								threeService.camera.rotation.x = lasRotationCameraX;
								threeService.camera.rotation.y = lasRotationCameraY;
							}
                            if (threeService.camera.rotation.z != 0) { //ajusto la rotacion eje X
                                if (threeService.camera.rotation.z > 0) {
                                    if (threeService.camera.rotation.z - deltaTime * speedForAjust < 0) {
                                        threeService.camera.rotation.z = 0;
                                    } else {
                                        threeService.camera.rotation.z = threeService.camera.rotation.z - deltaTime * speedForAjust;
                                    }
                                }
                                if (threeService.camera.rotation.z < 0) {
                                    if (threeService.camera.rotation.z + deltaTime * speedForAjust > 0) {
                                        threeService.camera.rotation.z = 0;
                                    } else {
                                        threeService.camera.rotation.z = threeService.camera.rotation.z + deltaTime * speedForAjust;
                                    }
                                }
                            }
                        }
                    } else {
                        threeService.camera.rotation.x = 0;
                        threeService.camera.rotation.y = 0;
                    }

                    mouserotationService.SetPositionCameraForLimits(threeService.camera.rotation.x, threeService.camera.rotation.y);
                    mouserotationService.UpdateRotation();

                    lastPosRotationAnimationGyro.x = threeService.camera.rotation.x;
                    lastPosRotationAnimationGyro.y = threeService.camera.rotation.y;

                    threeService.camera.rotation.x += threeService.rotationCameraPlaceholder.rotation.x;
                    threeService.camera.rotation.y += threeService.rotationCameraPlaceholder.rotation.y;

					if(hoveringPoint)
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


        $scope.$on('$destroy', function () {
            destroy();
            threeService.destroy();
            mouserotationService.destroy();
        });

        $scope.activateViewPointMode = function () {
            $scope.viewpointMode = true;
            $scope.viewpointState = "";
        };

        $scope.deactivateVeiwPointMode = function () {
            $scope.viewpointMode = false;
            $scope.viewpointState = "";
        };

        $scope.addViewPoint = function () {
            $scope.viewpointState = "adding";
        };

        $scope.editViewPoint = function () {
            $scope.viewpointState = "editing";
        };

        $scope.removeViewPoint = function () {
            $scope.viewpointState = "removing";
        };

        $scope.setAmbientToViewpoint = function (scene) {
            $scope.newViewPortScene = scene;
        }

        $scope.changeViewMode = function (activate) {
            if ($scope.activeDeviceOrientation != activate) {
                $scope.activeDeviceOrientation = activate;
				mouserotationService.SetGyroActive($scope.activeDeviceOrientation);
                if ($scope.activeDeviceOrientation) //si se prendio el control por giro
                {
					if(!currentlyPanoramic)
					{
						animationGyro = true;
						animationGyroX = true;
						animationGyroY = true;
						animationGyroZ = true;
					}
					else{
						mouserotationService.callHardLimit();
					}
                    mouserotationService.setPauseAnimation(true);
                } else {
                    mouserotationService.setPauseAnimation(false);
					if(currentlyPanoramic)
						mouserotationService.SetRotation(0,0);

                }
            }
        }

        changeViewService.addFunctionToCallOnChangeView($scope.changeViewMode);

        function getAmbientById(ambients, id) {
            return ambients.filter(function (_ambient) {
                return _ambient.id == id;
            })[0];
        }

        function processJsonData(datajson) {
            if (datajson.status == 1) {
                setTimeout(function () {
                    //init labels
                    var ii = 0;
                    var starterAmbient = getAmbientById(datajson.ambients, datajson.info.starter_ambientid);
                    if(datajson.customization)
                    {
                        if(datajson.customization.label_color)
                        {
                            labelsService.setLabelColor(datajson.customization.label_color);
                        }
						
						if(datajson.customization.chat_link){
							var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
							(function(){
								var s1=document.createElement("script");
								s1.async=false;
								s1.src=datajson.customization.chat_link;
								s1.charset='UTF-8';
								s1.setAttribute('crossorigin','*');
								document.body.appendChild(s1);
							})();
						}
                    }
                    
					$timeout(function(){
						while (ii < datajson.ambients.length) {
							var currentAmbient = datajson.ambients[ii];
							var jj = 0;
							while (jj < datajson.ambients[ii].viewpoints.length) {
								var currentViewpoint = datajson.ambients[ii].viewpoints[jj];
								if (currentViewpoint.ambient_target_id < 0) {
									jj++;
									continue;
								}

								var ambientTarget = getAmbientById(datajson.ambients, currentViewpoint.ambient_target_id);
								if (ambientTarget) {
									if (!ambientTarget.rotx) {
										ambientTarget.rotx = 0;
									}
									if (!ambientTarget.roty) {
										ambientTarget.roty = 0;
									}
									var hotspotLabelName = currentViewpoint.name;
									if (!hotspotLabelName) {
										hotspotLabelName = ambientTarget.name;
									}

									var ambientType = (ambientTarget.cubemap && ambientTarget.cubemap.negy) ? 1 : 0;
									if(ambientTarget.panoramic == 1)
										ambientType = 2;


									if($scope.custom_ambient_icon == ""){
										$scope.custom_ambient_icon = "img/hotspots/viewpoint.png";
									}

									var imgForViewpoint = $scope.custom_ambient_icon;

									if(ambientTarget.custom_img_viewpoint)
									{
										imgForViewpoint = ambientTarget.custom_img_viewpoint;
									}

									labelsService.addNewLabel(imgForViewpoint, currentAmbient.id, currentViewpoint.x, currentViewpoint.y, currentViewpoint.z, onViewportClick, ambientTarget.id, ambientTarget.imgUrl, ambientTarget.imgLowResolutionUrl, ambientTarget.rotx, ambientTarget.roty, hotspotLabelName, currentViewpoint.ambient_target_id, ambientTarget.mobileUrl, ambientType, ambientTarget.panoramic, ambientTarget.panoramic_ratio, {});
								}
								jj++;
							}

							if(datajson.ambients[ii].infopoints){

								for(var kk = 0; kk< datajson.ambients[ii].infopoints.length; kk++)
								{
									var ambientInfopoint = datajson.ambients[ii].infopoints[kk];

									var infopoint_data = {
										'title': ambientInfopoint.name,
										'image':ambientInfopoint.image,
										'info':ambientInfopoint.info,
										'link':ambientInfopoint.link
									}

									if(!ambientInfopoint.name)
										ambientInfopoint.name = '';

									var titleForPoint = ambientInfopoint.title;
									if(ambientInfopoint.show_title != 1)
										titleForPoint = '';

									var imgForInfopoint = "img/hotspots/infopoint.png";
									if(ambientInfopoint.custom_img_viewpoint)
										imgForInfopoint = ambientInfopoint.custom_img_viewpoint;
									//								if(infopoint_data.link && !infopoint_data.title && !infopoint_data.info && !infopoint_data.image)
									if(infopoint_data.link)
									{  
										//iframePoint
										labelsService.addNewLabel(imgForInfopoint, currentAmbient.id, ambientInfopoint.x, ambientInfopoint.y, ambientInfopoint.z, onIframepointClick, "", "", "", "", "", titleForPoint, "", "", "", "", "",infopoint_data);
									}
									else
									{
										//infopoint
										labelsService.addNewLabel(imgForInfopoint, currentAmbient.id, ambientInfopoint.x, ambientInfopoint.y, ambientInfopoint.z, onInfopointClick, "", "", "", "", "", titleForPoint, "", "", "", "", "",infopoint_data);
									} 


								}
							}

							ii++;
						}
					},500);
                   
                    starterAmbient.targetImageType = (starterAmbient.cubemap && starterAmbient.cubemap.negy) ? 1 : 0;
                    if(starterAmbient.panoramic == 1)
                        starterAmbient.targetImageType = 2;

                    changeToAmbientService.ChangeToAmbient(starterAmbient);
                }, 500);
            } else {
                $scope.noProject = true;
            }

            return datajson.ambients.filter(function (currentAmbient) {
                return currentAmbient.id == datajson.info.starter_ambientid;
            })[0];
        };

        /**
         * get a url param
         * @params String
         * @return String
         */
        function getUrlParam(param) {
            var paramValue = location.search.split(param + '=')[1];
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

            if (urlJson.customization && urlJson.uid != 167 && urlJson.uid != 218) {
                if (urlJson.customization.custom_loading_splash_logo) {

                    function getAndSetsplashLogoSize(url) {
                        var img = new Image();
                        img.onload = function () {

                            customSplashLoadingSize = {
                                x: this.width,
                                y: this.height
                            }

                            var correctSizeSplashLogo;
                            var marginBottom;

                            if (window.innerHeight <= 550) {
                                correctSizeSplashLogo = limitSizeAndKeepRatio(customSplashLoadingSize.x, customSplashLoadingSize.y, 180, 120);
                                marginBottom = '15px';
                            } else {
                                correctSizeSplashLogo = limitSizeAndKeepRatio(customSplashLoadingSize.x, customSplashLoadingSize.y, 300, 200);
                                marginBottom = '0px';
                            }

                            $scope.sizeLoadingSplashLogo = {
                                'width': correctSizeSplashLogo.x + 'px',
                                'height': correctSizeSplashLogo.y + 'px',
                                'margin-bottom': marginBottom
                            }

                            $scope.loadingLogo = urlJson.customization.custom_loading_splash_logo;
                            $scope.fadeInLoadingLogo = true;

                        };
                        img.src = url;
                    }

                    getAndSetsplashLogoSize(urlJson.customization.custom_loading_splash_logo);



                } else {
                    $scope.loadingLogo = "img/marca.png";
                }

                if (urlJson.customization.custom_floor_stamp) {
                    floorImg = urlJson.customization.custom_floor_stamp;
                }
            } else {
                $scope.loadingLogo = "img/marca.png";
            }

            if (urlJson.uid == 167) { // CUSTOM AB-GADGETS
                $scope.loadingLogo = "img/dominicana/customLoadingIcon.png";
                floorImg = "img/dominicana/floor_stamp.png"
            } else if (urlJson.uid == 218) { // CUSTOM PACAL
                $scope.loadingLogo = "img/pacal/about_us.png";
                floorImg = "img/pacal/floor_stamp.png"
            }
            /////
            if(urlJson.customization && urlJson.customization.custom_ambient_icon){
                $scope.custom_ambient_icon = urlJson.customization.custom_ambient_icon;
            }

            init(starterAmbient, floorImg);
        } else {
            var url = $location.absUrl();
            var numberToSlice = url.lastIndexOf("#/project/");
            var slicedurl = url.slice(numberToSlice, url.length);
            var projectUUID = slicedurl.replace("#/project/", ""); // server
            if (projectUUID && projectUUID.length > 5) {
                window.location = "https://www.360magictour.com/projects/?project=" + projectUUID;
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


        var resizePlayerFunction = function () {
            $scope.screenWidth = {
                "width": $window.innerWidth + "px"
            };
            $timeout(function () {
                $scope.$apply();
            })

            if (customSplashLoadingSize) {
                if (window.innerHeight <= 550) {
                    var correctSizeSplashLogo = limitSizeAndKeepRatio(customSplashLoadingSize.x, customSplashLoadingSize.y, 180, 120);

                    $scope.sizeLoadingSplashLogo = {
                        'width': correctSizeSplashLogo.x + 'px',
                        'height': correctSizeSplashLogo.y + 'px',
                        'margin-bottom': '15px'
                    }
                } else {
                    var correctSizeSplashLogo = limitSizeAndKeepRatio(customSplashLoadingSize.x, customSplashLoadingSize.y, 300, 200);

                    $scope.sizeLoadingSplashLogo = {
                        'width': correctSizeSplashLogo.x + 'px',
                        'height': correctSizeSplashLogo.y + 'px',
                        'margin-bottom': "0px"
                    }
                }
            }
        }

        window.addEventListener("resize", resizePlayerFunction);
        resizePlayerFunction();
    }]);