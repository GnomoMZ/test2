angular.module('threejsModule').service("labelsService", ["threeService", function (threeService) {

	// SERVICE PRIVATES --------------------------------------------------------- ////
	// -------------------------------------------------------------------------- ////
	
	var AllLabels = [];
	var currentSection = null;
	var ref = this;
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
	var rootContent = document.getElementById("root-content");
	var is3DMode = false;
    var labelColor = "rgba(255, 255, 255, 1.0)";
    
	function ShowCurrentLabels() {
		$(window).resize();

		if (currentSection == null) {
			var ii = 0;
			while (ii < AllLabels.length) {
				AllLabels[ii].disableLabels();
				ii++;
			}
		} else {
			var ii = 0;
			while (ii < AllLabels.length) {
				if (currentSection == AllLabels[ii].name) {
					AllLabels[ii].enableLabels();
					AllLabels[ii].switchLabelsVisualizationMode(threeService.stereoActivated);
					labelHotspot.target_fill.material.opacity = 1;
				} else {
					AllLabels[ii].disableLabels();
				}
				ii++;
			}
		}
	};

	function addLabelToSection(label, nameSection) {
		var ii = 0;
		while (ii < AllLabels.length) {
			if (nameSection == AllLabels[ii].name) {
				AllLabels[ii].addLabel(label);
			}
			ii++;
		}
	}

	function addNewSection(nameSection) {
		AllLabels.push(new labelSection(nameSection));
	};

	function sectionExist(nameSection) {
		var ii = 0;
		while (ii < AllLabels.length) {
			if (nameSection == AllLabels[ii].name) {
				return true;
			}
			ii++;
		}

		return false;
	};

	var initialZoom = detectZoom.device();

	function toScreenPosition(obj, camera, renderer) {
		var vector = new THREE.Vector3();
		var widthToUse = renderer.context.canvas.width;
		var heightToUse = renderer.context.canvas.height;
		//		var widthToUse = threeService.container.width();
		//		var heightToUse = threeService.container.height();
		if (!isMobile) {
			var currentZoom = detectZoom.device();
			if (initialZoom != currentZoom) {
				var percentage = currentZoom * 100 / initialZoom;

				widthToUse = percentage * (widthToUse / 100);
				heightToUse = percentage * (heightToUse / 100);
			}
		}

		var widthHalf = 0.5 * widthToUse;
		var heightHalf = 0.5 * heightToUse;

		obj.updateMatrixWorld();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(camera);

		vector.x = (vector.x * widthHalf) + widthHalf;
		vector.y = -(vector.y * heightHalf) + heightHalf;

		vector.x = (vector.x / window.devicePixelRatio);
		vector.y = (vector.y / window.devicePixelRatio);

		return {
			x: vector.x,
			y: vector.y
		};

	};
	
	function isCollide(target, viewpoint) {
		threeService.camera.updateMatrixWorld();
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(target.matrixWorld);
		return (
			(vector.y + (target.scale.y/2)) >= (viewpoint.position.y - (viewpoint.scale.y/2)) && 
			(vector.y - (target.scale.y/2)) <= (viewpoint.position.y + (viewpoint.scale.y/2)) &&
            (vector.z + (target.scale.x/2)) >= (viewpoint.position.z - (viewpoint.scale.x/2)) && 
            (vector.z - (target.scale.x/2)) <= (viewpoint.position.z + (viewpoint.scale.x/2)) &&
			(vector.x + (target.scale.x/2)) >= (viewpoint.position.x - (viewpoint.scale.x/2)) &&
			(vector.x - (target.scale.x/2)) <= (viewpoint.position.x + (viewpoint.scale.x/2))
		);
	}
	
	// SERVICE API -------------------------------------------------------------- ////
	// -------------------------------------------------------------------------- ////

	this.updateLabels = function (delta) {
		if (currentSection == null)
			return;

		var ii = 0;
		while (ii < AllLabels.length) {
			if (currentSection == AllLabels[ii].name) {
				AllLabels[ii].updateLabels(delta);
			}
			ii++;
		}
	};

	this.changeSection = function (name) {
		labelHotspot.currentTargeredViewpoint = null;
		currentSection = name;
		ShowCurrentLabels();
	};

	this.addNewLabel = function (urlImg, nameSection, posx, posy, posz, onClickFunction, sectionTarget, imageTarget, imageTargetLowRes, rotx, roty, hotspotName, target_id, imageTargetMobile, targetImageType, targetPanoramic, targetPanoramic_Ratio, infopoint_data) {
		if (!sectionExist(nameSection)) {
			addNewSection(nameSection);
		}
		
		var newLabelHots = new labelHotspot(urlImg, new THREE.Vector3(posx, posy, posz), onClickFunction, sectionTarget, imageTarget, imageTargetLowRes, rotx, roty, hotspotName, target_id, imageTargetMobile, targetImageType, targetPanoramic, targetPanoramic_Ratio, infopoint_data.title, infopoint_data.image, infopoint_data.info, infopoint_data.link);
		addLabelToSection(newLabelHots, nameSection);
		newLabelHots.update();
	}

	this.checkForColitionInActive = function (ev) {
		if (currentSection == null){
			return;
		}		
		for(var i = 0; i < AllLabels.length; i++){
			if (currentSection == AllLabels[i].name) {
				AllLabels[i].checkColitioninLables(ev);
			}
		}
	}
	
	this.checkForHover = function (ev) {
		if (currentSection == null){
			return false;
		}		
		for(var i = 0; i < AllLabels.length; i++){
			if (currentSection == AllLabels[i].name) {
				return AllLabels[i].checkHoverLabels(ev);
			}
		}
	}
		
	this.switchLabelsVisualizationMode = function(to3DMode){
		if (currentSection == null)
			return;

		for (var i = 0; i < AllLabels.length; i++){
			if(currentSection == AllLabels[i].name){
				AllLabels[i].switchLabelsVisualizationMode(to3DMode);
				break;
			}
		}
	};
    
    this.setLabelColor = function(newLabelColor){
        labelColor = newLabelColor;
    }

	// HOTSPOT PROTOTYPE -------------------------------------------------------- ////
	// -------------------------------------------------------------------------- ////
	
	function labelHotspot(urlImg, position3d, onClickFunction, sectionTarget, imageTarget, imageTargetLowRes, rotx, roty, name, target_id, imageTargetMobile, targetImageType, targetPanoramic, targetPanoramic_Ratio, infoTitle, infoImage, infoInfo, infoLink) {
		this.urlImg = urlImg;
		this.position3d = position3d;
		this.spriteHots = new THREE.Sprite();
		this.anchorObject = new THREE.Object3D();
		this.current2dposition;
		this.rpx;
		this.rpy;
		this.isClicked = false;
		this.sectionTarget = sectionTarget;
		this.imageTarget = imageTarget
		this.imageTargetMobile = imageTargetMobile;
		this.imageTargetLowRes = imageTargetLowRes;
		this.onClickFunction = onClickFunction;
		this.rotx = rotx;
		this.roty = roty;
		this.textLbl;
		this.textWidth;
		this.name = name;
		this.target_id = target_id;
		this.targetImageType = targetImageType;
		this.alphaspeed = 1;
		this.vrChangeSpeed = 1.5;
		this.is3DMode = false;
        this.panoramic = targetPanoramic;
        this.panoramic_ratio = targetPanoramic_Ratio;
		this.heightImg = 64;
		
		//info label
		this.infoTitle = infoTitle;
		this.infoImage = infoImage;
		this.infoInfo = infoInfo;
		this.infoLink = infoLink;
		
		var refHotspot = this;
		var thisSprite = this.spriteHots;
		var ref = this;
		var textureLoader = new THREE.TextureLoader();

		textureLoader.load(this.urlImg, function (texture) {
			ref.heightImg = texture.image.height;
			var sizeIMG = new THREE.Vector2(texture.image.width / 2, texture.image.height / 2);
			ref.textureSize = {
				width: (texture.image.width / 2),
				height: (texture.image.height / 2)
			}
			thisSprite.scale.set(ref.textureSize.width, ref.textureSize.height, 1);

			var material = new THREE.SpriteMaterial({
				map: texture,
				color: 0xffffff
			});
			ref.spriteHots.material = material;
			threeService.orthoscene.add(ref.spriteHots);
			ref.spriteHots.visible = false;
		});


		this.anchorObject.position.set(position3d.x, position3d.y, position3d.z);

		var spritey = makeTextSprite(this.name, {
			fontsize: 32
		});
		threeService.orthoscene.add(spritey);

		this.textLbl = spritey;
		if(typeof (name) != "undefined"){
			this.textLbl.visible = true;
		}
		else{
			this.textLbl.visible = false;
		}

		function makeTextSprite(message, parameters) {
			if(parameters === undefined){
				parameters = {};
			}

			var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;

			var canvas = document.createElement('canvas');
			canvas.width = 1024;
			canvas.style.width = "1024px";
			canvas.height = 256;
			canvas.style.height = "256px";
			var context = canvas.getContext('2d');
			context.font = "Bold " + fontsize + "px sans-serif";

			// get size data (height depends only on font size)
			var metrics = context.measureText(message);
			var textWidth = metrics.width;

			refHotspot.textWidth = textWidth;
			if (refHotspot.textWidth > 1024)
				refHotspot.textWidth = 1024;
			// 1.4 is extra height factor for text below baseline: g,j,p,q.

			// text color
			context.fillStyle = labelColor;
//			context.strokeStyle = 'black';

			context.fillText(message, 0, fontsize);
//			context.strokeText(message, 0, fontsize);
			// canvas contents will be used for a texture
			var texture = new THREE.Texture(canvas)
			texture.needsUpdate = true;

			var spriteMaterial = new THREE.SpriteMaterial({
				map: texture,
				color: 0xffffff
			});
			var sprite = new THREE.Sprite(spriteMaterial);
			sprite.scale.set(512, 128, 1.0);
			return sprite;
		}
		this.spriteHots.material.depthWrite = false;
		this.spriteHots.material.depthTest = false;
		this.textLbl.material.depthWrite = false;
		this.textLbl.material.depthTest = false;
	};

	labelHotspot.prototype.update = function(delta){
		this.checkIfBehindCamera();
		this.alphaCheck(delta);
		if(!this.is3DMode){
			this.moveToScreenPosition();
		}
		else{
			this.checkVRTargetCollition(delta);
		}
	};
	
	labelHotspot.target_fill = threeService.target_fill;
	labelHotspot.currentTargeredViewpoint = null;
	labelHotspot.startVRChangingCountDown = 0;
	
	labelHotspot.prototype.checkVRTargetCollition = function(delta){
		if(this.spriteHots.visible){
			if(isCollide(threeService.target, this.spriteHots) && (!labelHotspot.currentTargeredViewpoint || labelHotspot.currentTargeredViewpoint == this)){
				labelHotspot.currentTargeredViewpoint = this;
//				if(labelHotspot.startVRChangingCountDown < 1){// wait few seconds to start changin ambient count down.
//					labelHotspot.startVRChangingCountDown += delta;
//				}
//				else{
					if(labelHotspot.target_fill.scale.x < 4){
						labelHotspot.target_fill.scale.x += this.vrChangeSpeed * delta;
						labelHotspot.target_fill.scale.y += this.vrChangeSpeed * delta;
					}
					else{
						this.onClickFunction(this); // make ambient change.
						labelHotspot.target_fill.scale.x = 0;
						labelHotspot.target_fill.scale.y = 0;
						labelHotspot.startVRChangingCountDown = 0;
						labelHotspot.target_fill.material.opacity = 0;
					}
//				}
			}
			else{
				if(labelHotspot.currentTargeredViewpoint == this){
					labelHotspot.target_fill.scale.x = 0;
					labelHotspot.target_fill.scale.y = 0;
					labelHotspot.startVRChangingCountDown = 0;
					labelHotspot.currentTargeredViewpoint = null;
				}
			}
		}
	};
	
	labelHotspot.prototype.checkPointerMouse = function(event){
		var boundingRectRoot = rootContent.getBoundingClientRect();
		var widthRange = this.spriteHots.material.map.image.width / 4;
		var heightRange = this.spriteHots.material.map.image.height / 4;

		if (Math.abs(this.current2dposition.x - (event.clientX - boundingRectRoot.left)) < widthRange && Math.abs(this.current2dposition.y - (event.clientY - boundingRectRoot.top)) < heightRange) {
			$('html,body').css('cursor', 'pointer');
			return true;
		}
		else{
			$('html,body').css('cursor', 'default');
			return false;
		}
	};
	
	labelHotspot.prototype.moveToScreenPosition = function(){
		var widthToUse = threeService.container.width();
		var heightToUse = threeService.container.height();
		var widthHalf = 0.5 * widthToUse;
		var heightHalf = 0.5 * heightToUse;
		this.current2dposition = toScreenPosition(this.anchorObject, threeService.camera, threeService.renderer);
		this.rpx = -(widthHalf - this.current2dposition.x);
		this.rpy = (heightHalf - this.current2dposition.y);
		this.spriteHots.position.set(this.rpx, this.rpy, 0);
		var toLowerText = 84;
		if(this.heightImg > 75)
			toLowerText = 92;
		this.textLbl.position.set(this.rpx + 256 - this.textWidth / 4, this.rpy - toLowerText, 0);
	}

	labelHotspot.prototype.checkIfBehindCamera = function(){
		var cameraFoward = threeService.camera.getWorldDirection();
		var vectorToHotspot = new THREE.Vector3();
		vectorToHotspot.subVectors(this.anchorObject.position, threeService.camera.position);
		if(cameraFoward.dot(vectorToHotspot) < 0){
			this.spriteHots.visible = false;
			this.textLbl.visible = false;
		} 
		else{
			this.spriteHots.visible = true;
			this.textLbl.visible = true;
		}
	}

	labelHotspot.prototype.alphaCheck = function(delta){
		if (this.spriteHots.visible) {
			if (this.spriteHots.material.opacity < 1) {	
				this.spriteHots.material.opacity += this.alphaspeed * delta;
				this.textLbl.material.opacity += this.alphaspeed * delta;
				if (this.spriteHots.material.opacity > 1) {
					this.spriteHots.material.opacity = 1;
					this.textLbl.material.opacity = 1;
				}
			}
		}
	}

	labelHotspot.prototype.setActive = function(flag){
		this.spriteHots.visible = flag;
		this.textLbl.visible = flag;
		if(flag){
			this.spriteHots.material.opacity = 0;
			this.textLbl.material.opacity = 0;
		}
	};

	
	labelHotspot.prototype.checkColition = function(event){
		if(!this.is3DMode){
			var cameraFoward = threeService.camera.getWorldDirection();
			var vectorToHotspot = new THREE.Vector3();
			vectorToHotspot.subVectors(this.anchorObject.position, threeService.camera.position);
			if (cameraFoward.dot(vectorToHotspot) < 0) {
				return;
			}
			var widthRange = this.spriteHots.material.map.image.width / 4;
			var heightRange = this.spriteHots.material.map.image.height / 4;
			var boundingRectRoot = rootContent.getBoundingClientRect();

			if(!this.isClicked && event.type == "mousedown"){
				if (Math.abs(this.current2dposition.x - (event.clientX - boundingRectRoot.left)) < widthRange && Math.abs(this.current2dposition.y - (event.clientY - boundingRectRoot.top)) < heightRange) {
					this.spriteHots.material.color.setHex(0xbebebe);
					this.textLbl.material.color.setHex(0xbebebe);
					this.isClicked = true;
				}
			}
			if(!this.isClicked && event.type == "touchstart"){
				if (Math.abs(this.current2dposition.x - (event.touches[0].clientX - boundingRectRoot.left)) < widthRange && Math.abs(this.current2dposition.y - (event.touches[0].clientY - boundingRectRoot.top)) < heightRange) {
					this.spriteHots.material.color.setHex(0xbebebe);
					this.textLbl.material.color.setHex(0xbebebe);
					this.isClicked = true;
				}
			}
			if (this.isClicked && event.type == "mouseup") {
				this.isClicked = false;
				this.spriteHots.material.color.setHex(0xffffff);
				this.textLbl.material.color.setHex(0xffffff);

				if (Math.abs(this.current2dposition.x - (event.clientX - boundingRectRoot.left)) < widthRange && Math.abs(this.current2dposition.y - (event.clientY - boundingRectRoot.top)) < heightRange) {
					if (typeof this.onClickFunction !== 'undefined')
						this.onClickFunction(this);
				}
			}
			if (this.isClicked && event.type == "touchend") {
				this.isClicked = false;
				this.spriteHots.material.color.setHex(0xffffff);
				this.textLbl.material.color.setHex(0xffffff);

				if (Math.abs(this.current2dposition.x - (event.changedTouches[0].clientX - boundingRectRoot.left)) < widthRange && Math.abs(this.current2dposition.y - (event.changedTouches[0].clientY - boundingRectRoot.top)) < heightRange) {
					if (typeof this.onClickFunction !== 'undefined'){
						this.onClickFunction(this);
					}
				}
			}
		}
	};
	
	labelHotspot.prototype.dispose = function(spriteHots){
		spriteHots.material.map.dispose();
		spriteHots.material.dispose();
	};
	
	labelHotspot.prototype.switchVisualization = function(is3D){
		this.is3DMode = is3D;
		this.spriteHots.material.depthWrite = false;
		this.spriteHots.material.depthTest = false;
		this.textLbl.material.depthWrite = false;
		this.textLbl.material.depthTest = false;
		
		labelHotspot.target_fill.scale.x = 0;
		labelHotspot.target_fill.scale.y = 0;
		if(is3D){
			threeService.orthoscene.remove(this.spriteHots);
			threeService.orthoscene.remove(this.textLbl);	
			
			this.spriteHots.position.set(this.anchorObject.position.x, this.anchorObject.position.y, this.anchorObject.position.z);
			this.textLbl.position.set(this.anchorObject.position.x, this.anchorObject.position.y, this.anchorObject.position.z);
			
			this.spriteHots.scale.set(1.3, 1.3, 0.3);
			this.textLbl.scale.set(1.3, 0.525, 1);
			
			threeService.scene.add(this.spriteHots);
			threeService.scene.add(this.textLbl);
		}
		else{
			threeService.scene.remove(this.spriteHots);
			threeService.scene.remove(this.textLbl);
			threeService.orthoscene.add(this.spriteHots);
			threeService.orthoscene.add(this.textLbl);	

			this.spriteHots.scale.set(this.textureSize.width, this.textureSize.height, 1);
			this.textLbl.scale.set(512, 128, 1.0);
		}
	};

	// LABEL SECTION PROTOTYPE -------------------------------------------------- ////
	// -------------------------------------------------------------------------- ////
	
	function labelSection(name) {
		this.name = name;
		this.labels = [];
	}

	function cloneLabel(obj) {
		return new labelHotspot(obj.urlImg, obj.position3d, obj.onClickFunction);
	}

	labelSection.prototype.addLabel = function (label) {
		if (this.labels.length == 0) {
			var clone = cloneLabel(label, this.name);
			label.setActive(false);
			this.labels.push(label);
		}
		this.labels.push(label);
	};

	labelSection.prototype.updateLabels = function (delta) {
		var ii = 0;
		while (ii < this.labels.length) {
			this.labels[ii].update(delta);
			ii++;
		}
	};

	labelSection.prototype.enableLabels = function () {
		var ii = 0;
		while (ii < this.labels.length) {
			this.labels[ii].setActive(true);
			ii++;
		}
	};

	labelSection.prototype.disableLabels = function () {
		var ii = 0;
		while (ii < this.labels.length) {
			this.labels[ii].setActive(false);
			ii++;

		}
	};

	labelSection.prototype.checkColitioninLables = function (event) {
		var ii = 0;
		while (ii < this.labels.length) {
			this.labels[ii].checkColition(event);
			ii++;
		}
	};
	
	labelSection.prototype.checkHoverLabels = function (event) {
		var ii = 0;
		while (ii < this.labels.length) {
			if(this.labels[ii].checkPointerMouse(event))
				return true;
			ii++;
		}
		return false;
	};
	
	
	labelSection.prototype.switchLabelsVisualizationMode = function(to3DMode){
		for(var i = 0; i < this.labels.length; i++) {
			this.labels[i].switchVisualization(to3DMode);
		}
	};
}]);