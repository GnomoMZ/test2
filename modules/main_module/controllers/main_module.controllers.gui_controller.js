angular.module('mainModule').controller("guiController", ["$scope",
														   "infoService",
														   "$location",
														   "$window",
														   "$timeout",
														   "changeToAmbientService",
														   "changeViewService",
														   "handleInputGUI",
														   "customizationService",
														   "threeService",
														   "analyticsService",
														   "geolocate",
														   "labelsService",
                                                           "statusLoadingScreen",
														   "callOnPopupPoint",
														   "$sce",
														  "callOnIframePoint",
														   function ($scope,
        infoService,
        $location,
        $window,
        $timeout,
        changeToAmbientService,
        changeViewService,
        handleInputGUI,
        customizationService,
        threeService,
        analyticsService,
        geolocate,
        labelsService,
		statusLoadingScreen,
		callOnPopupPoint,
		$sce,
		callOnIframePoint) {

        window.addEventListener("load", function () {
            var paragraph = document.querySelector("p"),
                button = document.querySelector("button");
            // Adding click event handler to button.
            detectWebGLContext();

            function detectWebGLContext() {
                // Create canvas element. The canvas is not added to the
                // document itself, so it is never displayed in the
                // browser window.
                var canvas = document.createElement("canvas");
                // Get WebGLRenderingContext from canvas element.
                var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                // Report the result.
                if (gl && gl instanceof WebGLRenderingContext) {
                    //                    console.log("Congratulations! Your browser supports WebGL.");
                } else {
                    alert("Failed to get WebGL context. " + "Your browser or device may not support WebGL.");

                }
            }
        }, false);

        $scope.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        $scope.isInIframe = customizationService.isInIframe();
        $scope.activeDeviceOrientation = false;
        $scope.isFullscreen = false;
        $scope.buttonClicked = "";
        $scope.descriptionAmbient = "";
        $scope.toolTipText = "";
        $scope.styleToolTip = {
            "right": 0
        };
        $scope.title = "";
        $scope.street = "";
        $scope.street_number = "";
        $scope.district = "";
        $scope.postalcode = "";
        $scope.city = "";
        $scope.country = "";
        $scope.description = "";
        $scope.contact_name = "";
        $scope.contact_lastname = "";
        $scope.contact_cel = "";
        $scope.contact_tel = "";
        $scope.contact_email = "";
        $scope.contact_website = "";
        $scope.contact_company = "";
        $scope.contact_description = "";
        $scope.toggleGallery = false;
        $scope.noInputGUI = true;
        $scope.isVRActivated = false;
        $scope.isGyroscopeActivated = false;
        $scope.styleSubtitleLine = {};
        $scope.fadeInMap = true;
        $scope.isLoading = true;
        $scope.loadingImageForBlueprint = false;

        var embebed = (window.location != window.parent.location) ? true : false;
        var timerTooltip;
        var currentTextWaitingToolTip = '';
        var mousePosition = {};
        var focusGallery = false;
        var targetScroll = document.getElementById("gallery-shortcuts");
        var gallerySelected = false;
        var windowHalfX = window.innerWidth / 2;
        var lastTouchPosition;
        var isVRFullscreen = false;
        var projectUUID = getUrlParam("project");
        var openOnceGallery = true;
        var userUid;
        var projectNID;
        var urlBackgroundWindowImage;
        var aboutUsLogoSize;
        var imageMapBlueprint = document.getElementById('map-image');
		$scope.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        $scope.urlToShare = embebed ? document.referrer : window.location.href;

        function getUrlParam(param) {
            var paramValue = location.search.split(param + '=')[1];
            if (!paramValue) {
                return "";
            }
            return paramValue;
        }

        $scope.openLink = function (link) {
            var linklower = link.toLowerCase();
            if (linklower.substr(0, 7) != "http://" && linklower.substr(0, 8) != "https://") {
                linklower = "http://" + linklower;
            }
            window.open(linklower, '_blank');
        };

        $scope.SetClicked = function (nameButton, ev) {
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            analyticsService.sendActionButtonClickEvent($scope.buttonClicked != nameButton ? nameButton : ""); // Analytics
            if (nameButton == 'ambient' && !$scope.descriptionAmbient) {
                return;
            }
            if ($scope.buttonClicked == nameButton) {
                $scope.buttonClicked = "";
            } else {
                $scope.buttonClicked = nameButton;
            }
            if (nameButton == 'gallery')
                setWidthGalleryElements();

            infoService.currentButtonSelected = $scope.buttonClicked;
        }

        //point style
        $scope.mapPointStyle = function (x, y) {
            return {
                'left': (x/$scope.blueprintScaleWidth - $scope.blueprintFixedX/2) - 6 + "px", //6 is half the image height
                'top':  (y/$scope.blueprintScaleHeight - $scope.blueprintFixedY/2) - 6 + "px" // 6 is half the image width
            }
        }
        $scope.changeAmbientById = function (id_ambient) {
            for (var i = 0; i < $scope.ambients.length; i++) {
                if ($scope.ambients[i].id == id_ambient) {
                    $scope.clickAmbientMini($scope.ambients[i]);
                }
            }
        }
        $scope.togleMiniMap = function () {
            $scope.fadeInMap = !$scope.fadeInMap;    
        }



        var colorHighlight = "#cd2562";

        $scope.customColorStyle = {
            color: colorHighlight
        }
        
        $scope.customBorderColorStyle = {
            'border-color': colorHighlight
        }

        $scope.isClicked = function (button) {
            if (button == $scope.buttonClicked) {
                if(colorHighlight != "#ffffff")
                {
                    return {
                        color: colorHighlight
                    }
                }
                else{
                    return {
                        color: "#cd2562"
                    }    
                }
            }
        }

        $scope.isFullscreenStyle = function () {
            if ($scope.isFullscreen) {
                if(colorHighlight != "#ffffff")
                {
                    return {
                        color: colorHighlight
                    }
                }
                else{
                    return {
                        color: "#cd2562"
                    }    
                }
            }
        }

        $scope.isActiveDeviceOrientationStyle = function () {
            if ($scope.activeDeviceOrientation) {
                if(colorHighlight != "#ffffff")
                {
                    return {
                        color: colorHighlight
                    }
                }
                else{
                    return {
                        color: "#cd2562"
                    }    
                }
            }
        }

        $scope.buttonBlueprintStyle = function () {
            if ($scope.fadeInMap) {
                if(colorHighlight != "#ffffff")
                {
                    return {
                        color: colorHighlight
                    }
                }
                else{
                    return {
                        color: "#cd2562"
                    }    
                }
            }
        }


        var colorTitles = "white";
        $scope.customColor = {
            color: colorTitles
        }

        $scope.logoTitleAboutUs = {
            'margin-left': "80px",
            'max-width': "calc(100% - 80px)"
        }
        $scope.hasCustomIcon = false;
        $scope.incona = "img/360-icon.png";
        $scope.inconb = "img/360-icon-b.png";
        $scope.iconAboutUsMobile = "img/aboutUsIconMobile.png";

        $scope.aboutUsTitle = "360 MT";
        $scope.aboutUsSubTitle = "WHAT IS IT?";
        $scope.aboutUsSpan = [
            "With a simple click you can capture a whole space in a 360 view with our 360 app you can perform an interactive tour (by connecting many 360 views) and publish a property in the market.",
            "We give support to every user of 360º MagicTour and we do some customization for corporative customers.",
            "Try our service!"
        ];
        $scope.aboutUsWeb = "www.360magictour.com";
        $scope.aboutUsEmail = "email: " + "info@360magictour.com";

        $scope.aboutUsLogo = "img/logo.png";

        var titleMarginCustom = '28px';

        var setInfo = function (jsonData) {

            $scope.title = jsonData.info.name;
            $scope.street = jsonData.info.street;
            $scope.street_number = jsonData.info.street_number;
            $scope.district = jsonData.info.district;
            $scope.postalcode = jsonData.info.postalcode;
            $scope.city = jsonData.info.city;
            $scope.country = jsonData.info.country;
            $scope.description = jsonData.info.description;
            $scope.contact_name = jsonData.info.contact_name;
            $scope.contact_lastname = jsonData.info.contact_lastname;
            $scope.contact_cel = jsonData.info.contact_cel;
            $scope.contact_tel = jsonData.info.contact_tel;
            $scope.contact_email = jsonData.info.contact_email;
            $scope.contact_website = jsonData.info.contact_website;
            $scope.contact_company = jsonData.info.contact_company;
            $scope.contact_time = jsonData.info.contact_time;

            // Blueprints queda comentado hasta que se defina y se pruebe.     

            if (jsonData.blueprint_info) {
                $scope.blueprints = jsonData.blueprint_info.blueprints;
                $scope.blueprintSize = jsonData.blueprint_info.scale;
                $scope.blueprintStyleSize = {
                    'width': $scope.blueprintSize.x + "px",
                    'height': $scope.blueprintSize.y + "px"
                }
                $scope.blueprintScaleWidth = 1;
                $scope.blueprintScaleHeight = 1;
                $scope.blueprintFixedX =0;
                $scope.blueprintFixedY =0;
                $scope.blueprintPosition = {
                    'top': "55px",
                    'left': "10px"
                }
            }
			
			if(jsonData.menu_points)
			{
				$scope.menu_points = jsonData.menu_points;
			}
			else{
				$scope.hideInformationButton = true;
			}

            if (jsonData.customization && jsonData.customization.hide_buttons && jsonData.uid != 167 && jsonData.uid != 218) {

                var buttonsCounter = 0;

                if (jsonData.customization.hide_buttons.gallery) {
                    $scope.hideGalleryButton = jsonData.customization.hide_buttons.gallery;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.information) {
                    $scope.hideInformationButton = jsonData.customization.hide_buttons.information;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.ambient) {
                    $scope.hideAmbientButton = jsonData.customization.hide_buttons.ambient;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.location) {
                    $scope.hideLocationButton = jsonData.customization.hide_buttons.location;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.share) {
                    $scope.hideShareButton = jsonData.customization.hide_buttons.share;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.gyroscope) {
                    $scope.hideGyroscopeButton = jsonData.customization.hide_buttons.gyroscope;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.fullscreen) {
                    $scope.hideFullscreenButton = jsonData.customization.hide_buttons.fullscreen;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.vr) {
                    $scope.hideVRButton = jsonData.customization.hide_buttons.vr;
                    buttonsCounter++;
                }
                if (jsonData.customization.hide_buttons.about_us) {
                    $scope.hideAboutUsButton = jsonData.customization.hide_buttons.about_us;
                    buttonsCounter++;
                }
                if (buttonsCounter == 9) {
                    $scope.noMenuButtons = true;
                    $scope.progressPercentajeStyle = {
                        bottom: "20px"
                    }
                }

            }

            var bottomMarginTitle = "64px";
            if ($scope.noMenuButtons && !$scope.currentBlueprint)
                bottomMarginTitle = "20px";
            
            $scope.leftCustomStyleTitle = {
                left: titleMarginCustom,
                bottom: bottomMarginTitle
            }

            if (jsonData.customization && jsonData.uid != 167 && jsonData.uid != 218) {
                if (jsonData.customization.custom_color) {
                    colorHighlight = jsonData.customization.custom_color;
                    colorTitles = jsonData.customization.custom_color;
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                }

                if (jsonData.customization.custom_window_background_image) {
                    urlBackgroundWindowImage = jsonData.customization.custom_window_background_image;
                } else {
                    urlBackgroundWindowImage = 'img/background-pattern.jpg';
                }
            } else {
                urlBackgroundWindowImage = 'img/background-pattern.jpg';
            }

            function getAndSetIconTitleAboutUs(url) {
                var img = new Image();
                img.onload = function () {

                    aboutUsLogoSize = {
                        x: this.width,
                        y: this.height
                    }

                    var correctSizeAbousUsLogo = limitSizeAndKeepRatio(aboutUsLogoSize.x, aboutUsLogoSize.y, 150, 75);

                    $scope.sizeCustomLogoAboutUs = {
                        'width': correctSizeAbousUsLogo.x + 'px',
                        'height': correctSizeAbousUsLogo.y + 'px'
                    }

                    var newmargintitleaboutus = correctSizeAbousUsLogo.x + 10 + 'px';

                    $scope.logoTitleAboutUs = {
                        'margin-left': newmargintitleaboutus,
                        'max-width': 'calc(100% - ' + newmargintitleaboutus + ')'
                    }

                    $timeout(function () {
                        $(window).resize();
                        resizeBlueprints();
                    }, 5);


                };
                img.src = url;
            }

            function getAndSetIconWidth(url) {
                $scope.hasCustomIcon = true;

                var img = new Image();
                img.onload = function () {

                    var correctSizeIconLogo = limitSizeAndKeepRatio(this.width, this.height, 150, 57);

                    $scope.sizeCustomLogo = {
                        'width': correctSizeIconLogo.x + 'px',
                        'height': correctSizeIconLogo.y + 'px'
                    }

                    var newmarginbuttons = correctSizeIconLogo.x + 75 + 'px';
                    titleMarginCustom = correctSizeIconLogo.x + 90 + 'px';
                    $scope.leftCustomStyleMenu = {
                        'margin-left': newmarginbuttons,
                        'width': 'calc(100% - ' + newmarginbuttons + ')'
                    }
					
					if (window.innerWidth <= 800 || (window.innerHeight <= 550 && window.innerWidth <= 800)) {
						titleMarginCustom = '28px';
					}
					
                    $scope.leftCustomStyleTitle = {
                        left: titleMarginCustom,
                        bottom: bottomMarginTitle
                    }

                    $timeout(function () {
                        $(window).resize();
                        resizeBlueprints();
                    }, 5);


                };
                if (!$scope.hideAboutUsButton)
                    img.src = url;
            }

            function getAndSetIconAboutUsMobile(url) {
                $scope.iconAboutUsMobile = url;

                var img = new Image();
                img.onload = function () {

                    var correctSizeIconLogo = limitSizeAndKeepRatio(this.width, this.height, 48, 32);

                    $scope.iconAboutUsMobileSize = {
                        'width': correctSizeIconLogo.x + 'px',
                        'height': correctSizeIconLogo.y + 'px'
                    }

                    $timeout(function () {
                        $(window).resize();
                        resizeBlueprints();
                    }, 5);

                };
                img.src = url;
            }

            if (jsonData.customization) {
                if (jsonData.customization.custom_project_logo && jsonData.uid != 167 && jsonData.uid != 218) {
                    $scope.incona = jsonData.customization.custom_project_logo;
                    $scope.inconb = jsonData.customization.custom_project_logo;

                    getAndSetIconWidth($scope.incona);
                }
				
				if(jsonData.customization.chat_link)
					$scope.hasChat = true;

            }
            userUid = jsonData.uid;

            projectNID = jsonData.nid
            $scope.customGui = false;
            if (jsonData.uid == 167) { // CUSTOM DOMINICANA     
                colorHighlight = "#6ACFF6";
                colorTitles = "#6ACFF6";
                $scope.customColorStyle = {
                    color: colorHighlight
                }
                $scope.customBorderColorStyle = {
                    'border-color': colorHighlight
                }
                $scope.incona = "img/dominicana/Logo_blanco.png";
                $scope.inconb = "img/dominicana/Logo_color.png";
                getAndSetIconWidth($scope.incona);


                $scope.customGui = true;
            }
            if (jsonData.uid == 218) { // CUSTOM PACAL
                if (jsonData.nid == 1947) { // CUSTOM PACAL - CUMBRES DE MIRAMAR
                    colorHighlight = "#26ACE2";
                    colorTitles = "#26ACE2";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/1947_project_logo.png";
                    $scope.inconb = "img/pacal/1947_project_logo.png";
                } else if (jsonData.nid == 1671) { // CUSTOM PACAL - Nueva Vida
                    colorHighlight = "#A9CE54";
                    colorTitles = "#A9CE54";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/1671_project_logo.png";
                    $scope.inconb = "img/pacal/1671_project_logo.png";
                } else if (jsonData.nid == 1673) { // CUSTOM PACAL - Entre Valles
                    colorHighlight = "#84C441";
                    colorTitles = "#84C441";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/1673_project_logo.png";
                    $scope.inconb = "img/pacal/1673_project_logo.png";
                } else if (jsonData.nid == 2196) { // CUSTOM PACAL - Altos de San Francisco II
                    colorHighlight = "#963336";
                    colorTitles = "#963336";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/2196_project_logo.png";
                    $scope.inconb = "img/pacal/2196_project_logo.png";
                } else if (jsonData.nid == 2208) { // CUSTOM PACAL - Quinta Merced
                    colorHighlight = "#A55A44";
                    colorTitles = "#A55A44";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/2208_project_logo.png";
                    $scope.inconb = "img/pacal/2208_project_logo.png";
                } else if (jsonData.nid == 2220) { // CUSTOM PACAL - Parque Surire
                    colorHighlight = "#22B7EA";
                    colorTitles = "#22B7EA";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/2220_project_logo.png";
                    $scope.inconb = "img/pacal/2220_project_logo.png";
                } else if (jsonData.nid == 2222) { // CUSTOM PACAL - Portal del Sol
                    colorHighlight = "#55AADC";
                    colorTitles = "#55AADC";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/2222_project_logo.png";
                    $scope.inconb = "img/pacal/2222_project_logo.png";
                } else if (jsonData.nid == 2346) { // CUSTOM PACAL - Parque Rio Cruces
                    colorHighlight = "#CCE079";
                    colorTitles = "#CCE079";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/2346_project_logo.png";
                    $scope.inconb = "img/pacal/2346_project_logo.png";
                } else if (jsonData.nid == 2554) { // CUSTOM PACAL - Bosques de la Palma
                    colorHighlight = "#32C5F3";
                    colorTitles = "#32C5F3";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/2554_project_logo.png";
                    $scope.inconb = "img/pacal/2554_project_logo.png";
                } else if (jsonData.nid == 2645) { // CUSTOM PACAL - Aires de Colchagua
                    colorHighlight = "#82C17B";
                    colorTitles = "#82C17B";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/2645_project_logo.png";
                    $scope.inconb = "img/pacal/2645_project_logo.png";
                } else {
                    colorHighlight = "#008acd";
                    colorTitles = "#008acd";
                    $scope.customColorStyle = {
                        color: colorHighlight
                    }
                    $scope.customBorderColorStyle = {
                        'border-color': colorHighlight
                    }
                    $scope.incona = "img/pacal/project_logo.png";
                    $scope.inconb = "img/pacal/project_logo.png";
                }
                getAndSetIconWidth($scope.incona);

                $scope.leftCustomStyleTitle = {
                    left: '203px',
                    bottom: bottomMarginTitle
                }
                $scope.customGui = true;
            }

            $scope.customColor = {
                color: colorTitles
            }
            if (jsonData.customization && jsonData.uid != 167 && jsonData.uid != 218) {
				$scope.aboutUsTitle = "";
				$scope.aboutUsSubTitle = "";
				$scope.aboutUsSpan = [];
				$scope.aboutUsWeb = "";
				$scope.aboutUsEmail = "";

                if (jsonData.customization.about_us_title) {
                    $scope.aboutUsTitle = jsonData.customization.about_us_title;
                }
                if (jsonData.customization.about_us_subtitle) {
                    $scope.aboutUsSubTitle = jsonData.customization.about_us_subtitle;
                }
                if (jsonData.customization.about_us_span) {
                    $scope.aboutUsSpan = jsonData.customization.about_us_span;
                }
                if (jsonData.customization.about_us_web) {
                    $scope.aboutUsWeb = jsonData.customization.about_us_web;
                }
                if (jsonData.customization.about_us_email) {
                    $scope.aboutUsEmail = "email: " + jsonData.customization.about_us_email;
                }
                if (jsonData.customization.about_us_title_icon) {
                    $scope.aboutUsLogo = jsonData.customization.about_us_title_icon;
                    getAndSetIconTitleAboutUs($scope.aboutUsLogo);
                }
                if (jsonData.customization.about_us_mobile_icon) {
                    getAndSetIconAboutUsMobile(jsonData.customization.about_us_mobile_icon);
                }
            }
            if (jsonData.uid == 167) { // CUSTOM AB-GADGETS
                $scope.aboutUsTitle = "AB Gadgets";
                $scope.aboutUsSubTitle = "";
                $scope.aboutUsSpan = [
                    "Este servicio de AB Gadgets con colaboración de la prestigiosa empresa",
                    "de producciones audiovisual y eventos en general, CLAMP RD, consiste en",
                    "la creación de tours virtuales para agencias de bienes raíces, tiendas,",
                    "dealers, hoteles y restaurantes. Promociona tus proyectos en el",
                    "innovador formato de realidad virtual. El visitante puede sumergirse en",
                    "dicha experiencia para apreciar los espacios que se quieren mostrar.",
                    "Contáctenos al 809-967-6965",
                ];

                $scope.aboutUsWeb = "http://abgadgets.net/";
                $scope.aboutUsEmail = "email: " + "info@abgadgets.net";

                $scope.aboutUsLogo = "img/dominicana/Logo_blanco.png";
                getAndSetIconTitleAboutUs($scope.aboutUsLogo);
                getAndSetIconAboutUsMobile("img/dominicana/logo-icon-mobile.png");
            }
            if (jsonData.uid == 218) { // CUSTOM PACAL
                $scope.aboutUsTitle = "";
                $scope.aboutUsSubTitle = "Grupo Inmobiliario";
                $scope.aboutUsSpan = [];
                $scope.aboutUsWeb = "http://www.pacal.cl/";
                $scope.aboutUsEmail = "";

                $scope.aboutUsLogo = "img/pacal/about_us.png";
                getAndSetIconTitleAboutUs($scope.aboutUsLogo);
                getAndSetIconAboutUsMobile("img/pacal/about_us-mobile.png");

            }


            $scope.mapActive = true;

            $scope.noLocation = false;
            if (!$scope.street && !$scope.street_number && !$scope.district && !$scope.postalcode && !$scope.city && !$scope.country) {
                $scope.noLocation = true;
            }

            if (jsonData.info.lat && jsonData.info.long) {
                $scope.mapActive = true;
            } else {
                if (!$scope.noLocation && $scope.street && $scope.street_number && $scope.city && $scope.country) {
                    $scope.mapActive = false;
                    var address = "";
                    var streetnumber = jsonData.info.street_number ? (" " + jsonData.info.street_number + ", ") : ", ";
                    address += jsonData.info.street ? (jsonData.info.street + streetnumber) : "";
                    //                    address += jsonData.info.district ? (jsonData.info.district + ", ") : "";
                    address += jsonData.info.country ? (jsonData.info.country + ", ") : "";
                    address += jsonData.info.city ? (jsonData.info.city) : "";

                    geolocate.geolocate(address).then(function (result) {
                        $scope.mapActive = true;
                        jsonData.info.lat = result.lat();
                        jsonData.info.long = result.lng();


                    }, function (error) {
                        $scope.mapActive = false;
                    });
                } else {
                    $scope.mapActive = false;
                }
            }

            $scope.ambients = jsonData.ambients;

            $scope.widthGalleryImg = 150;
            $scope.heightGalleryImg = 75;

            var firstImg = true;

            function getMetaImg(url) {
                var img = new Image();
                img.onload = function () {

                    if (this.width < $scope.widthGalleryImg || firstImg) {
                        firstImg = false;
                        if (this.width < 150) {
                            $scope.widthGalleryImg = this.width;
                            $scope.heightGalleryImg = this.height;
                        } else {
                            var ratioImg = this.width / this.height;
                            $scope.heightGalleryImg = 150 / ratioImg;
                        }

                        $scope.imgGalleryStyle = {
                            "width": $scope.widthGalleryImg + "px",
                            "height": $scope.heightGalleryImg + "px"
                        };
                        $scope.spanGalleryStyle = {
                            "width": $scope.widthGalleryImg + "px",
                        };

                    }
                };
                img.src = url;
            }



            for (var i = 0; i < $scope.ambients.length; i++) {
                if ($scope.ambients[i].imgMiniatureUrl) {
                    getMetaImg($scope.ambients[i].imgMiniatureUrl);
                }
            }

            $scope.noContactInfo = false;
            if (!$scope.contact_name && !$scope.contact_lastname && !$scope.contact_cel && !$scope.contact_tel && !$scope.contact_email && !$scope.contact_website && !$scope.contact_company && !$scope.contact_time) {
                $scope.noContactInfo = true;
            }

            $scope.noInfoScreen = false;
            if ($scope.noLocation && $scope.noContactInfo && !$scope.description)
                $scope.noInfoScreen = true;
        }

        if (infoService.dataIsSet) {
            var jsonData = infoService.getDataJson();
            setInfo(jsonData)
        } else {
            infoService.addFunctionOnDataReady(setInfo);
        }

        var setDataAmbient = function (data) {
            if ($scope.buttonClicked == 'ambient' && !data.description) {
                $scope.buttonClicked = "";
            }
            $scope.ambientName = data.name;
            $scope.descriptionAmbient = data.description;
            
           
            
            if ($scope.blueprints && data.blueprint)
            {
                if(data.blueprint.length <2 || !$scope.currentBlueprint)
                {
                    $scope.currentBlueprint = getBlueprint(data.blueprint[0]);
                }
                else{
                    if($scope.currentBlueprint.id == data.blueprint[0])
                    {
                        $scope.currentBlueprint = getBlueprint(data.blueprint[1]);
                    }
                    else{
                        $scope.currentBlueprint = getBlueprint(data.blueprint[0]);
                    }
                }
            }
            else $scope.currentBlueprint = "";
            
            $scope.ambientId = data.id;
            
            $scope.loadingImageForBlueprint = true; 
            
            bottomMarginTitle = "64px";
            if ($scope.noMenuButtons && !$scope.currentBlueprint)
                bottomMarginTitle = "20px";
            
            $scope.leftCustomStyleTitle = {
                left: titleMarginCustom,
                bottom: bottomMarginTitle
            }

        }

        function getBlueprint(id) {
            for (var i = 0; i < $scope.blueprints.length; i++) {
                if ($scope.blueprints[i].id == id)
                    return $scope.blueprints[i];
            }
            return "";
        }

        infoService.addFunctionOnChangeAmbient(setDataAmbient);

        $scope.showToolTip = function (event, text) {
            if ($scope.toolTipText == text) {
                return;
            }
            currentTextWaitingToolTip = text;

            var thisElement = event.target;
            //        var rightPos = ($window.innerWidth - event.clientX) + "px";
            //        var botPos = ($window.innerHeight - event.clientY) + "px";

            timerTooltip = $timeout(function () {
                if (thisElement.offsetWidth < thisElement.scrollWidth) {
                    var rightPos = ($window.innerWidth - mousePosition.x) + "px";
                    var botPos = ($window.innerHeight - mousePosition.y) + "px";
                    $scope.styleToolTip = {
                        "right": rightPos,
                        //                                "right": 0,
                        "bottom": botPos
                    };
                    $scope.toolTipText = text;
                }
            }, 2000);
        }

        $scope.hideToolTip = function (text) {
            if (currentTextWaitingToolTip == text) {
                $timeout.cancel(timerTooltip);
            }
            if ($scope.toolTipText == text) {
                $scope.toolTipText = '';
            }
        }

        $scope.mouseMovePosition = function (event) {
            mousePosition.x = event.clientX;
            mousePosition.y = event.clientY;
        }

        function onMouseWheel(event) {
            targetScroll.scrollLeft += event.deltaY / 4;
            event.preventDefault();
        }

        $scope.focusGallery = function (ev) {
            if (!focusGallery) {
                focusGallery = true;
                targetScroll.addEventListener('mousewheel', onMouseWheel, false);
            }
        }

        $scope.lostFocusGallery = function (ev) {
            focusGallery = false;
            targetScroll.removeEventListener('mousewheel', onMouseWheel);
        }

        $scope.clickAmbientMini = function (ambientClicked) {
            ambientClicked.targetImageType = (ambientClicked.cubemap && ambientClicked.cubemap.negy) ? 1 : 0;
            if(ambientClicked.panoramic == 1)
                ambientClicked.targetImageType = 2;
            changeToAmbientService.ChangeToAmbient(ambientClicked);
        }

        $scope.changeViewMode = function (activate) {

            if (!activate)
                activate = !$scope.activeDeviceOrientation;

            $scope.isGyroscopeActivated = activate;
            if ($scope.isGyroscopeActivated) {
                analyticsService.sendGyroscopeClickEvent("gyroscope"); // Analytics
            } else {
                //				analyticsService.sendGyroscopeTiming(); // Analytics
            }
            $scope.activeDeviceOrientation = !$scope.activeDeviceOrientation;
            changeViewService.ChangeView(activate);
        }

        var onCurrentSetAmbient = function (id) {
            $scope.currentAmbient = id;
        }

        changeToAmbientService.addfunctionToCallOnSetCurrentAmbient(onCurrentSetAmbient);

        var setInputFlag = function (flag) {
            $scope.noInputGUI = flag;
        }

        handleInputGUI.SetFunctionToHandleInput(setInputFlag);

        var closeButonsGUI = function () {
            $scope.buttonClicked = "";
        }

        handleInputGUI.SetFunctionToCloseButons(closeButonsGUI);

        $scope.shareClicked = function (socialNetworkName) {

            analyticsService.socialAction(socialNetworkName, $scope.urlToShare);
        }


        // gallery scroll ------------- ///////////													   
        // -------------------------------------- ///////////	
        //gallery scroll
        var galleryScroll = document.getElementById('gallery-scroll');



        function setWidthGalleryElements() {
            if (galleryScroll.clientWidth != 0) {
                var nDivitionsGallery = Math.floor(galleryScroll.clientWidth / ($scope.widthGalleryImg + 5));

                $scope.widthGallery = {
                    width: 'calc(99.9%/' + nDivitionsGallery + ')',
                    height: $scope.heightGalleryImg + 34 + "px"
                }
            }
            $timeout(function () {
                if (galleryScroll.clientWidth != 0) {
                    var nDivitionsGallery = Math.floor(galleryScroll.clientWidth / ($scope.widthGalleryImg + 5));

                    $scope.widthGallery = {
                        width: 'calc(99.9%/' + nDivitionsGallery + ')',
                        height: $scope.heightGalleryImg + 34 + "px"

                    }
                    var marginToSet = (galleryScroll.clientWidth / nDivitionsGallery - $scope.widthGalleryImg) / 2;
                    if (window.innerWidth <= 1000) {
                        marginToSet += 15;
                        if (window.innerWidth > 970) {
                            marginToSet -= (window.innerWidth - 970) / 2;
                        }

                    }
                    if (marginToSet > 50)
                        marginToSet = 50;
                    if (window.innerWidth < 800) {
                        $scope.galleryTitleSpanStyle = {
                            'max-width': 'calc(100% - ' + (60 + marginToSet) + 'px )'
                        }
                    } else {
                        $scope.galleryTitleSpanStyle = {
                            'max-width': 'calc(100% - 25px)'
                        }
                    }


                    $scope.galleryTitleStyle = {
                        'margin-left': marginToSet + "px"
                    }
                    $scope.$apply();
                }
            }, 1);
        }

        $scope.fadeLicense = false;
        window.onresize = function () {            
            if (window.innerHeight < 800) {
                $scope.fadeLicense = true;
            } else {
                $scope.fadeLicense = false;
            }
            setWidthGalleryElements()

            if (window.innerWidth <= 800 || window.innerHeight <= 550) {
                $scope.leftCustomStyleTitle = {
                    left: '28px'
                }
            } else {
                if ($scope.hasCustomIcon) {
                    bottomMarginTitle = "64px";
                    if ($scope.noMenuButtons && !$scope.currentBlueprint)
                        bottomMarginTitle = "20px";
                    $scope.leftCustomStyleTitle = {
                        left: titleMarginCustom,
                        bottom: bottomMarginTitle
                    }
                }
            }
            if (aboutUsLogoSize) {
                if (window.innerHeight <= 550 || window.innerWidth <= 400) {
                    var correctSizeAbousUsLogo = limitSizeAndKeepRatio(aboutUsLogoSize.x, aboutUsLogoSize.y, 150, 50);

                    $scope.sizeCustomLogoAboutUs = {
                        'width': correctSizeAbousUsLogo.x + 'px',
                        'height': correctSizeAbousUsLogo.y + 'px'
                    }
                    var newmargintitleaboutus = correctSizeAbousUsLogo.x + 10;
                    var newWidthTitle = (newmargintitleaboutus + 80);

                    $scope.logoTitleAboutUs = {
                        'margin-left': newmargintitleaboutus + 'px',
                        'max-width': 'calc(100% - ' + newWidthTitle + 'px)'
                    }
                } else {
                    var correctSizeAbousUsLogo = limitSizeAndKeepRatio(aboutUsLogoSize.x, aboutUsLogoSize.y, 150, 75);

                    $scope.sizeCustomLogoAboutUs = {
                        'width': correctSizeAbousUsLogo.x + 'px',
                        'height': correctSizeAbousUsLogo.y + 'px'
                    }
                    var newmargintitleaboutus = correctSizeAbousUsLogo.x + 10;
                    var newWidthTitle = (newmargintitleaboutus + 70);
                    if (window.innerWidth > 800) {
                        newWidthTitle = (newmargintitleaboutus + 20);
                    }

                    $scope.logoTitleAboutUs = {
                        'margin-left': newmargintitleaboutus + 'px',
                        'max-width': 'calc(100% - ' + newWidthTitle + 'px)'
                    }
                }
            } else {
                if (window.innerHeight <= 550 || window.innerWidth <= 400) {
                    $scope.logoTitleAboutUs = {
                        'margin-left': "60px",
                        'max-width': 'calc(100% - 140px)'
                    }
                } else {
                    $scope.logoTitleAboutUs = {
                        'margin-left': "80px",
                        'max-width': 'calc(100% - 160px)'
                    }
                }
            }
            
            resizeBlueprints();
			definestyleLimitsPopUp();
			defineLimitsPopUp();
			definePositionMenuPoint();
        };
                                                               
        $scope.onImgBlueprintLoaded = function(){
            resizeBlueprints();
        }
                                                               
        function resizeBlueprints(){
            if ($scope.blueprints ) { //si hay blueprints
                //blueprint map
                
                if(imageMapBlueprint.naturalHeight != 0 && imageMapBlueprint.naturalWidth != 0)
                {
                    if (window.innerHeight > 550 && window.innerWidth > 800) { // modo web

                        if($scope.buttonClicked == "blueprintMobile"){
                            $scope.buttonClicked = "";     
                        }

                        var widthScreenForScale = window.innerWidth;
                        var heightScreenForScale = window.innerHeight;



                        if(!$scope.isFullscreen && widthScreenForScale > 1280)
                            widthScreenForScale = 1280;    
                        
                        if(!$scope.isFullscreen && heightScreenForScale > 720)
                            heightScreenForScale = 720;
                            
                        $scope.styleImgMap = "";

                        if( imageMapBlueprint.width >= imageMapBlueprint.height){// si la imagen es mas ancha que alta

                            var widthBlueprint = (widthScreenForScale *.5) - 22;
                            if(imageMapBlueprint.naturalWidth < widthBlueprint)
                                widthBlueprint = imageMapBlueprint.naturalWidth;
                            
                            var newCalculatedHeight = imageMapBlueprint.naturalHeight / (imageMapBlueprint.naturalWidth / widthBlueprint);

                            if( newCalculatedHeight >  heightScreenForScale/2 - 30)
                            {
                                var percentajeDiferecialHeight = (newCalculatedHeight - (heightScreenForScale/2 - 30)) * 100 / newCalculatedHeight;
                                widthBlueprint-= widthBlueprint*(percentajeDiferecialHeight/100); 
                            }
                            
                            $scope.styleImgMap = {
                                "width": widthBlueprint + "px",
                                "height": 'auto'
                            };

                            $timeout(function(){
                                $scope.blueprintScaleHeight = $scope.blueprintScaleWidth = $scope.blueprintSize.x / widthBlueprint;
                                $scope.blueprintFixedY = ($scope.blueprintSize.y / $scope.blueprintScaleHeight) - imageMapBlueprint.height;
                                $scope.blueprintFixedX =0;
                                setBlueprintListStyle();
                            })

                        }
                        else{//si la imagen es mas alta que ancha
                            
                            var heightBlueprint = (heightScreenForScale *.5) - 22;
                            if(imageMapBlueprint.naturalHeight < heightBlueprint)
                                heightBlueprint = imageMapBlueprint.naturalHeight;
                            
                            var newCalculatedWidth = imageMapBlueprint.naturalWidth / (imageMapBlueprint.naturalHeight / heightBlueprint);

                            if( newCalculatedWidth >  widthScreenForScale/2 - 22)
                            {
                                var percentajeDiferecialWidth = (newCalculatedWidth - (widthScreenForScale/2 -22)) * 100 / newCalculatedWidth;
                                heightBlueprint-= heightBlueprint*(percentajeDiferecialWidth/100); 
                            }
                            

                            $scope.styleImgMap = {
                                "width": 'auto',
                                "height": heightBlueprint + "px"
                            };

                            $timeout(function(){
                                $scope.blueprintScaleHeight = $scope.blueprintScaleWidth = $scope.blueprintSize.y / heightBlueprint;
                                $scope.blueprintFixedX = ($scope.blueprintSize.x / $scope.blueprintScaleHeight) - imageMapBlueprint.width;
                                $scope.blueprintFixedY =0;
                                setBlueprintListStyle();
                            })

                        }
                    }
                    else{//modo mobile

                        
                        
                        var widthScreenForScale = window.innerWidth;
                        var heightScreenForScale = window.innerHeight;
                        
                        $scope.styleImgMap = "";
                        
                        if(heightScreenForScale >= widthScreenForScale) //portrait
                        { 
                            if( imageMapBlueprint.width >= imageMapBlueprint.height){// si la imagen es mas ancha que alta

                                var widthBlueprint = widthScreenForScale  - 44;
                                if(imageMapBlueprint.naturalWidth < widthBlueprint)
                                    widthBlueprint = imageMapBlueprint.naturalWidth;    
                                
                                var newCalculatedHeight = imageMapBlueprint.naturalHeight / (imageMapBlueprint.naturalWidth / widthBlueprint);
                                
                                if( newCalculatedHeight >  heightScreenForScale/2 - 64)
                                {
                                    var percentajeDiferecialHeight = (newCalculatedHeight - (heightScreenForScale/2 - 64)) * 100 / newCalculatedHeight;
                                    widthBlueprint-= widthBlueprint*(percentajeDiferecialHeight/100); 
                                }

                                $scope.styleImgMap = {
                                    "width": widthBlueprint + "px",
                                    "height": 'auto'
                                };

                                $timeout(function(){
                                    $scope.blueprintScaleHeight = $scope.blueprintScaleWidth = $scope.blueprintSize.x / widthBlueprint;
                                    $scope.blueprintFixedY = ($scope.blueprintSize.y / $scope.blueprintScaleHeight) - imageMapBlueprint.height;
                                    $scope.blueprintFixedX =0;
                                    setBlueprintListStyle();
                                })

                            }
                            else{//si la imagen es mas alta que ancha

                                var heightBlueprint = (heightScreenForScale *.5) - 64;
                                if(imageMapBlueprint.naturalHeight < heightBlueprint)
                                    heightBlueprint = imageMapBlueprint.naturalHeight;
                                
//                                console.log(imageMapBlueprint.naturalWidth / (imageMapBlueprint.naturalHeight / heightBlueprint) );
                                
                                var newCalculatedWidth = imageMapBlueprint.naturalWidth / (imageMapBlueprint.naturalHeight / heightBlueprint);
                                
                                if( newCalculatedWidth >  widthScreenForScale - 44)
                                {
                                    var percentajeDiferecialWidth = (newCalculatedWidth - (widthScreenForScale - 44)) * 100 / newCalculatedWidth;
                                    heightBlueprint-= heightBlueprint*(percentajeDiferecialWidth/100); 
                                }
                                
                                $scope.styleImgMap = {
                                    "width": 'auto',
                                    "height": heightBlueprint + "px"
                                };

                                $timeout(function(){
                                    $scope.blueprintScaleHeight = $scope.blueprintScaleWidth = $scope.blueprintSize.y / heightBlueprint;
                                    $scope.blueprintFixedX = ($scope.blueprintSize.x / $scope.blueprintScaleHeight) - imageMapBlueprint.width;
                                    $scope.blueprintFixedY =0;
                                    setBlueprintListStyle();
                                })

                            }
                        }
                        else{ //landscape
                            
                            if( imageMapBlueprint.width >= imageMapBlueprint.height){// si la imagen es mas ancha que alta

                                if(!$scope.isFullscreen && widthScreenForScale > 1280)
                                    widthScreenForScale = 1280;    
                                
                                var widthBlueprint = widthScreenForScale/2  - 22;
                                if(imageMapBlueprint.naturalWidth < widthBlueprint)
                                    widthBlueprint = imageMapBlueprint.naturalWidth;    

                                var newCalculatedHeight = imageMapBlueprint.naturalHeight / (imageMapBlueprint.naturalWidth / widthBlueprint);

                                if( newCalculatedHeight >  heightScreenForScale*.7 - 100)
                                {
                                    var percentajeDiferecialHeight = (newCalculatedHeight - (heightScreenForScale*.7 - 100)) * 100 / newCalculatedHeight;
                                    widthBlueprint-= widthBlueprint*(percentajeDiferecialHeight/100); 
                                }

                                $scope.styleImgMap = {
                                    "width": widthBlueprint + "px",
                                    "height": 'auto'
                                };

                                $timeout(function(){
                                    $scope.blueprintScaleHeight = $scope.blueprintScaleWidth = $scope.blueprintSize.x / widthBlueprint;
                                    $scope.blueprintFixedY = ($scope.blueprintSize.y / $scope.blueprintScaleHeight) - imageMapBlueprint.height;
                                    $scope.blueprintFixedX =0;
                                    setBlueprintListStyle();
                                })

                            }
                            else{//si la imagen es mas alta que ancha

                                var heightBlueprint = heightScreenForScale*0.7  - 100;
                                if(imageMapBlueprint.naturalHeight < heightBlueprint)
                                    heightBlueprint = imageMapBlueprint.naturalHeight;

                                //                                console.log(imageMapBlueprint.naturalWidth / (imageMapBlueprint.naturalHeight / heightBlueprint) );

                                var newCalculatedWidth = imageMapBlueprint.naturalWidth / (imageMapBlueprint.naturalHeight / heightBlueprint);

                                if( newCalculatedWidth >  widthScreenForScale - 44)
                                {
                                    var percentajeDiferecialWidth = (newCalculatedWidth - (widthScreenForScale - 44)) * 100 / newCalculatedWidth;
                                    heightBlueprint-= heightBlueprint*(percentajeDiferecialWidth/100); 
                                }

                                $scope.styleImgMap = {
                                    "width": 'auto',
                                    "height": heightBlueprint + "px"
                                };

                                $timeout(function(){
                                    $scope.blueprintScaleHeight = $scope.blueprintScaleWidth = $scope.blueprintSize.y / heightBlueprint;
                                    $scope.blueprintFixedX = ($scope.blueprintSize.x / $scope.blueprintScaleHeight) - imageMapBlueprint.width;
                                    $scope.blueprintFixedY =0;
                                    setBlueprintListStyle();
                                })

                            }
                            
                            
                        }

//                        if($scope.buttonClicked == ""){
//                            if($scope.fadeInMap && $scope.currentBlueprint)
//                            {
//                                $scope.buttonClicked = "blueprintMobile";     
//                            }
//                            else{
//                                if( !$scope.currentBlueprint && $scope.buttonClicked == "blueprintMobile")
//                                    $scope.buttonClicked = "";
//                            }
//                        }
//                        else{
//                            if($scope.buttonClicked != "blueprintMobile")
//                                $scope.fadeInMap = false;
//                        }
//
//                        var widthScreenForScale = window.innerWidth;
//                        var heightScreenForScale = window.innerHeight;                       
//
//                        if( imageMapBlueprint.width >= imageMapBlueprint.height){ // si la imagen es mas ancha que alta
//
//                            if(window.innerWidth <= window.innerHeight) // si la pantalla es menos ancha que alta
//                            {
//                                $scope.styleImgMap = {
//                                    "width": widthScreenForScale - 70 + "px",
//                                    "height": 'auto'
//                                };
//                                $timeout(function(){
//                                    $scope.blueprintScaleWidth = (widthScreenForScale - 70) / $scope.blueprintSize.x;
//                                    $scope.blueprintScaleHeight = imageMapBlueprint.height / $scope.blueprintSize.y;
//                                    setBlueprintListStyle();
//                                })
//                            }
//                            else{
//                                $scope.styleImgMap = {
//                                    "width": (heightScreenForScale - 70) + "px",
//                                    "height": 'auto'
//                                };
//                                $timeout(function(){
//                                    $scope.blueprintScaleWidth = (heightScreenForScale - 70) / $scope.blueprintSize.x;
//                                    $scope.blueprintScaleHeight = imageMapBlueprint.height / $scope.blueprintSize.y;
//                                    setBlueprintListStyle();
//                                })
//                            }
//
//
//
//                        }
//                        else{//si la imagen es mas alta que ancha
//
//                            if(window.innerWidth <= window.innerHeight)//si la pantalla es menos ancha que alta
//                            {
//                                $scope.styleImgMap = {
//                                    "width": 'auto',
//                                    "height": widthScreenForScale - 70 + "px"
//                                };
//                                $timeout(function(){
//                                    $scope.blueprintScaleWidth = imageMapBlueprint.width / $scope.blueprintSize.x;
//                                    $scope.blueprintScaleHeight =  (widthScreenForScale - 70) / $scope.blueprintSize.y;
//                                    setBlueprintListStyle();
//                                })
//
//                            }
//                            else{
//                                $scope.styleImgMap = {
//                                    "width": 'auto',
//                                    "height": heightScreenForScale - 90 + "px"
//                                };
//                                $timeout(function(){
//                                    $scope.blueprintScaleWidth = imageMapBlueprint.width / $scope.blueprintSize.x;
//                                    $scope.blueprintScaleHeight =  (heightScreenForScale - 90) / $scope.blueprintSize.y;
//                                    setBlueprintListStyle();
//                                })
//                            }
//
//
//
//                        }     

                    }
                }
                
                
            }
            
            function setBlueprintListStyle(){
                //blueprint list
                var newHeightBlueprintList = imageMapBlueprint.height + 40;
                var leftBlueprintList = 22;
                var widthBlueprintListContainer_ = 'calc(100%-22px)';

                if(!$scope.currentBlueprint)
                    newHeightBlueprintList = 100;
                
                var heightScreenForBlueprintList = window.innerHeight;
                if(!$scope.isFullscreen && heightScreenForBlueprintList > 720)
                    heightScreenForBlueprintList = 720;
                
                var heightFixerForBlueprintListStyle = 120;
                
                if (window.innerHeight <= 550 || window.innerWidth <= 800) {
//                    if(window.innerHeight >= window.innerWidth)
//                    {
//                         newHeightBlueprintList+=30;
//                    }
//                    else
//                    {
//                        newHeightBlueprintList = 64;
//                        leftBlueprintList = imageMapBlueprint.width + 32;
//                        widthBlueprintListContainer_ = 'calc(100% - ' + leftBlueprintList + 'px)';
//                    }
                    
                    newHeightBlueprintList+=30;
                    
                    heightFixerForBlueprintListStyle = 75;
                }
                                
                $scope.blueprintListStyle = {
                    'top': newHeightBlueprintList+'px',
//                    'max-height': heightScreenForBlueprintList - newHeightBlueprintList - 100 + 'px',
                    'left': leftBlueprintList +'px',
                    'width': widthBlueprintListContainer_

                }
                
                $scope.blueprintListStyleElements = {
                    'max-height': heightScreenForBlueprintList - newHeightBlueprintList - heightFixerForBlueprintListStyle + 'px'
                }
                
                $scope.loadingImageForBlueprint = false;
            }
        }   
        
        $scope.openedBlueprintList = false;
        $scope.toggleOpenListBlueprints = function(){
            $scope.openedBlueprintList = !$scope.openedBlueprintList;
        }                                                       
                                                               
                                                               
        $scope.closeBlueprint = function(){
            $scope.fadeInMap = false;
        }    
        
        $scope.openBlueprintMobile = function(){
            $scope.fadeInMap = true;
        }
        
        $scope.changeBlueprintById = function(idBlueprint){
            $scope.currentBlueprint = getBlueprint(idBlueprint);
            $scope.loadingImageForBlueprint = true; 

        }
        
        $scope.showBlueprintListMobile = false;
        $scope.openBlueprintListMobile = function(){
            $scope.showBlueprintListMobile = true;
        }
        
        $scope.closeBlueprintListMobile = function(){
            $scope.showBlueprintListMobile = false;
        }
        
        var startedLoading = function(){
            $scope.isLoading = true;
        }
    
        var finishedLoading = function(){
            $scope.isLoading = false;                                                       
        } 
                                                               
        statusLoadingScreen.addFunctionToCallOnStartLoading(startedLoading);        
        statusLoadingScreen.addfunctionToCallOnFinishLoading(finishedLoading);                                                                                                         
//                                                               statusLoadingScreen   
				
		var timeoutPromiseMsg;													   
 		function onMouseWheel(event){
			
			if(event.ctrlKey == false && $scope.buttonClicked == "")
			{
				if(timeoutPromiseMsg)
					$timeout.cancel(timeoutPromiseMsg)
				$scope.showZoomPopUp = true;
				$timeout(function () {
					$scope.$apply();
				});
				timeoutPromiseMsg = $timeout(function () {
					$scope.showZoomPopUp = false;

				}, 1500);
			}
		}								   
		document.addEventListener('mousewheel', onMouseWheel, false);
		document.addEventListener('DOMMouseScroll', onMouseWheel, false);

															   
        // FULLSCREEN FUNCTIONALITY ------------- ///////////													   
        // -------------------------------------- ///////////	

        // Fullscreen hadling 														   
        function onFSChagneHandler() {
            $scope.isFullscreen = !$scope.isFullscreen;
            if ($scope.isFullscreen) {
                analyticsService.sendFullscreenButtonClickEvent("fullscreen"); // Analytics
            } else {
                //				analyticsService.sendFullscreenTiming(); // Analytics
            }
            $timeout(function () {
                $(window).resize();
                resizeBlueprints();
            }, 500);
        }

        $scope.fullScreenToggle = function () {
            BigScreen.onChange = onFSChagneHandler();
            if (BigScreen.enabled) {
                BigScreen.toggle();
            }
        };

        var checkForFullscreen = function () {
            if ((window.fullScreen) ||
                (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
                $scope.isFullscreen = true;
                $timeout(function () {
                    $(window).resize();
                    resizeBlueprints();
                }, 250);
            } else {
                $scope.isFullscreen = false;
                $timeout(function () {
                    $(window).resize();
                    resizeBlueprints();
                }, 50);
            }
        }

        window.addEventListener("resize", checkForFullscreen);

        // VR FUNCTIONALITY --------------------- ///////////													   
        // -------------------------------------- ///////////													   

        // VR Fullscreen hadling 														   
        function onVRFSChagneHandler() {
            isVRFullscreen = !isVRFullscreen;
            $timeout(function () {
                $(window).resize();
                resizeBlueprints();
            }, 500);
        }
        $scope.VRToggle = function (isExit) {
            $scope.isVRActivated = !$scope.isVRActivated;
            threeService.activateStereoEffect($scope.isVRActivated);
            labelsService.switchLabelsVisualizationMode($scope.isVRActivated);
            BigScreen.onChange = onVRFSChagneHandler();
            if (BigScreen.enabled) {
                if (!isExit) {
                    if (BigScreen.element == null)
                        BigScreen.toggle();
                } else {
                    if (BigScreen.element != null)
                        BigScreen.toggle();
                }
            }

            threeService.resize();
            if (($scope.isVRActivated && !$scope.isGyroscopeActivated)) {
                $scope.changeViewMode(true);
            }
            if ((!$scope.isVRActivated && $scope.isGyroscopeActivated)) {
                $scope.changeViewMode(false);
            }
            if ($scope.isVRActivated) {
                analyticsService.sendCardboardClickEvent();
            }
        };

        $scope.zoomIn = function () {

        }
        $scope.zoomOut = function () {

        }
		
		var firstClickDate = 0;
		var secondClickDate = 0;
		var fistTouch = true;
        var singleTouch = false;	
		var positionTouch;													   
		function OnTouchStart(event) {
			if(event.touches.length > 1){
				firstClickDate = 0;
				singleTouch = false;
			}
			else{
				singleTouch = true;
				if(fistTouch)
				{
					var d = new Date();
					firstClickDate = d.getTime();
				}
				else{
					var d = new Date();
					secondClickDate = d.getTime();
				}
				
			}
			
			positionTouch = new THREE.Vector2(event.touches[0].clientX,event.touches[0].clientY);

		}			
															   
		function OnTouchEnd(event) {
			var positionEndTouch = new THREE.Vector2(event.changedTouches[0].clientX,event.changedTouches[0].clientY);
			if(singleTouch && positionTouch.distanceTo(positionEndTouch) < 5){
				var d = new Date();
				var n = d.getTime();
				
				var tocompare = firstClickDate;
				if(fistTouch)
					tocompare = secondClickDate;
				
				fistTouch = !fistTouch;

				if(n - tocompare < 350)
				{
					$scope.fullScreenToggle();
					firstClickDate = 0;
					secondClickDate = 0;
				}

			}
		}
        
		document.getElementById("DisplayCanvas").addEventListener('touchend', OnTouchEnd, false);
		document.getElementById("DisplayCanvas").addEventListener('touchstart', OnTouchStart, false);


        // Mail --------------------- ///////////													   
        // -------------------------------------- ///////////	

        $scope.mailTo = function () {
            var mailtosend = "";
            var subjectmail = "360 Magictour";
            var messagemail = $scope.urlToShare;
            window.location.href = "mailto:" + mailtosend + "?subject=" + subjectmail + "&body=" + messagemail;
        }
        

        $scope.BackgroundPattern = function () {
            if (urlBackgroundWindowImage) {
                if (!$scope.isInIframe) {
                    return {
                        'background-color': '#f4f5f9',
                        'background-image': 'url("' + urlBackgroundWindowImage + '")',
                        'background-repeat': 'repeat'
                    }
                }
            } else {
                return {
                    'background-color': '#f4f5f9',
                }
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
					
		//Menupoint
		$scope.OnMenuPoint = function(menupoint){

			var menupointToSend = {
				infoTitle: menupoint.name,
				infoImage: menupoint.image,
				infoInfo: menupoint.info,
				infoLink: menupoint.link
			}
			if(menupoint.link)
				onIframePointClicked(menupointToSend);
			else
				onInfopointClick(menupointToSend);
		}													   

		var menuPoint = document.getElementById('tab-menu-options');
		var menuButtonPoint = document.getElementById('infoMenuButton');
		function definePositionMenuPoint(){

			
			var toDisplace = 0;
			if(!$scope.isFullscreen && window.innerWidth > 1280)
				toDisplace =( window.innerWidth - 1280)/2;
			
			var positionToSet = menuButtonPoint.getBoundingClientRect().left - toDisplace;
			
			if(positionToSet + menuPoint.offsetWidth > window.innerWidth)
				positionToSet = window.innerWidth - menuPoint.offsetWidth - toDisplace;

			
			
			$scope.positioningMenuPoints = {
				"left":positionToSet+'px',
				"bottom":'55px'
			};
			firstClickOuside = true;
			
		}
		$(window).click(function() {
			if($scope.buttonClicked == 'menupoints')
			{
				$scope.buttonClicked = '';
				$scope.$apply();
			}
		});

		$('#tab-menu-options').click(function(event){
			event.stopPropagation();
		});
	
		// IframePoint
		var onIframePointClicked = function(iframePoint){
			$scope.buttonClicked = "iframe";
			$scope.urlIframePoint = $sce.trustAsResourceUrl(iframePoint.infoLink);
			$timeout(function(){
				$scope.$apply;
			});
		}    

		$scope.CleanIframe = function(closeAll){
			$scope.urlIframePoint = $sce.trustAsResourceUrl("about:blank");
			$timeout(function(){
				if(closeAll)
					$scope.SetClicked("");
				$scope.$apply;
			});

		}

		callOnIframePoint.addFunctionToCallOnIframePoint(onIframePointClicked);   

	
		// PopupPoint
															   
		$scope.ClosePopUp = function(){
			$scope.buttonClicked = "";
		}													   
															   
 		$scope.popUpMode = '';
		$scope.popUpActivated = false;
		function onInfopointClick(infopoint){
			var sameImg = false;
			if(infopoint.infoImage && $scope.popupImg == infopoint.infoImage)
				sameImg = true;

			$scope.popupImg = infopoint.infoImage;
			$scope.popupTitle = infopoint.infoTitle;
			$scope.popupInfo = infopoint.infoInfo;
			$scope.popupLink = infopoint.infoLink;
			
			if($scope.popupImg)
			{
				if(!$scope.popupTitle && !$scope.popupInfo && !$scope.popupLink)
				{
					$scope.popUpMode = 'image';
				}
				else{
					$scope.popUpMode = 'imageANDtext';
				}
			}
			else{
				if(!$scope.popupTitle && !$scope.popupInfo && !$scope.popupLink)
					return;//no tiene nada
				$scope.popUpMode = 'txt';
			}
			
			console.log($scope.popUpMode)
			
			$scope.buttonClicked = "popUp";
			
			$timeout(function(){
				$scope.$apply();
			});

		}
															   
		var paddingPopup = 50;
		var closeMargin = 28;
		function definestyleLimitsPopUp()
		{
			var maxWidth;
			var maxHeight;
			if(window.innerHeight > 420)
				maxHeight = 420 - closeMargin;
			else maxHeight = window.innerHeight - closeMargin;

			if(window.innerWidth > 970)
				maxWidth = 970 - closeMargin;
			else maxWidth = window.innerWidth - closeMargin;
			

			$scope.styleLimitsPopUp = {
				"max-height":maxHeight + "px",
				"max-width":maxWidth + "px"
			}
						
			
			$scope.styleLimitsInsidePopUp = {
				"max-height":(maxHeight - (paddingPopup * 2)) + "px",
				"max-width":maxWidth
			}

			
		}
															   		
															   
		var txtPopUp = document.getElementById('popup-txt-container');	
		var imgPopUp = document.getElementById('img-popup');													   

		$scope.displayPopupMode = "wide";	
															   
															   
		function defineLimitsPopUp()
		{
			var maxWidth;
			var maxHeight;

			if($scope.displayPopupMode == "wide")
			{
				if(window.innerHeight > 420)
					maxHeight = 360 - closeMargin + "px";
				else maxHeight = window.innerHeight- closeMargin - (paddingPopup*2) + "px";

				if(window.innerWidth > 970)
					maxWidth = 445 - closeMargin +"px";
				else maxWidth =( window.innerWidth - closeMargin - 20 - (paddingPopup*2))/2 + "px";


				$scope.imgPopup = {
					"max-width":maxWidth,
					"max-height":maxHeight
				}

				$scope.txtPopup = {
					"max-width":maxWidth,
					"max-height":maxHeight

				}

				$timeout(function(){
					var popupHeight = imgPopUp.height + (paddingPopup*2);
					if(popupHeight < txtPopUp.offsetHeight + (paddingPopup*2))
						popupHeight = txtPopUp.offsetHeight + (paddingPopup*2);

					var popupWidth = txtPopUp.offsetWidth + 20 + (paddingPopup*2) + imgPopUp.width;

					$scope.$apply();

					$scope.styleLimitsPopUpContainer = {
						"width": popupWidth + "px",
						"height": popupHeight + "px"
					}

					if(popupWidth + (paddingPopup*2) >= window.innerWidth)
					{
						if(window.innerHeight > window.innerWidth)
						{
							$scope.displayPopupMode = "tall";
							defineLimitsPopUp();
						}
						else{
							if( window.innerHeight > 565)
							{
								$scope.displayPopupMode = "tall";	
								defineLimitsPopUp();
							}
						}

					}
				});
			}
			else{
				
				if(window.innerWidth >= 610)
					maxWidth = 550 - closeMargin +"px";
				else maxWidth = window.innerWidth - closeMargin - (paddingPopup*2) + "px";


				if(window.innerHeight > 786)
					maxHeight = 363 - closeMargin + "px";
				else maxHeight = (window.innerHeight - closeMargin - (paddingPopup*2)) /2 + "px";

				$scope.imgPopup = {
					"max-width":maxWidth,
					"max-height":maxHeight,
					"position":'absolute',
					"transform": 'translateX(-50%)'
				}

				$scope.txtPopup = {
					"max-width":maxWidth,
					"max-height":maxHeight,
					"display":"block",
					"margin-top": imgPopUp.height + "px"

				}

			
				$timeout(function(){
					popupWidth = imgPopUp.width;
					if(popupWidth < txtPopUp.offsetWidth)
						popupWidth = txtPopUp.offsetWidth;

					$scope.styleLimitsPopUpContainer = {
						"width": popupWidth + (paddingPopup*2) + "px",
						"height": imgPopUp.height + txtPopUp.offsetHeight + (paddingPopup*2) + "px"
					}
					$scope.$apply();
					
					if(window.innerHeight < 565)
					{
						if(window.innerHeight < window.innerWidth)
						{
							$scope.displayPopupMode = "wide";	
							defineLimitsPopUp();
						}
					}
					else{	
						
						var maxWidthForCheck;
						var widthToUseImg;
						var widthToUseTxt;
						if(window.innerWidth > 970)
							maxWidthForCheck = 445;
						else maxWidthForCheck =( window.innerWidth - 20 - (paddingPopup*2))/2;
						
						if(maxWidthForCheck > imgPopUp.naturalWidth)
							widthToUseImg = imgPopUp.naturalWidth;
						else widthToUseImg = maxWidthForCheck;
						
						if(maxWidthForCheck > txtPopUp.offsetWidth)
							widthToUseTxt = txtPopUp.offsetWidth;
						else widthToUseTxt = maxWidthForCheck;
												

						if( widthToUseImg + widthToUseTxt + (paddingPopup*2/3) + (paddingPopup*4) < window.innerWidth)
						{
							$scope.displayPopupMode = "wide";	
							defineLimitsPopUp();
						}
					}
					
				});
				
				
			}
		

		}	
		$scope.$watch(
			function () {
				return [txtPopUp.offsetWidth, txtPopUp.offsetHeight].join('x');
			},
			function (value) {
				defineLimitsPopUp()
			}
		)
															   
		$scope.onOnlyImgLoad = function(){
			$(window).resize();
		}													   
	

		callOnPopupPoint.addFunctionToCallOnPopupPoint(onInfopointClick);   		
	

}]);