angular.module('analyticsModule').service("analyticsService", function () {
	var ref = this;
	var userID = null;
	var project;
	var currentSceneNID = null;
	var currentSceneName = null;
	var currentAction = null;
	var sceneStartTime = null;
	
	/* 
		Custom Dimensions:
			- dimension1 = UserID
			- dimension2 = ProjectNID
			- dimension3 = SceneNID
			- dimension4 = ProjectName
			- dimension5 = SceneName
		 Custom Metrics:
			- metric1 = onSceneTime
			- metric2 = onProjectTime
	*/
	
	// LOCAL FUNCTIONS -------------
	function getSceneNIDByID(id){
		var targetNID = project.ambients.filter(function(scene){
			return scene.id == id;
		})[0].nid;
		return targetNID;
	}
	
	// SETUP -------------
	ref.setup = function(data){
		if(ga){
			project = data;
			userID = project.uid.toString();
			ga('set', 'userId', project.uid.toString()); // Establezca el ID de usuario mediante el user_id con el que haya iniciado sesión.
			ga('send', 'pageview', {
				'sessionControl': 'start'
			});
			ga('send', {
				'hitType': 'event',
				'eventCategory': 'Project',
				'eventAction': 'Enter',
				'eventLabel': project.info.name,
				'dimension1': userID.toString(),
				'dimension2': project.nid.toString()
			});
		}
	}
	
	// EVENTS -------------
	ref.sendViewpointClickEvent = function(targetSceneName, targetSceneID){
		if(ga){
			var targetSceneNID = getSceneNIDByID(targetSceneID);
			ref.sendSceneTime();
			ga('send', {
				'hitType': 'event',
				'eventCategory': 'Navegation',
				'eventAction': 'ViewpointClick',
				'eventLabel': targetSceneName,
				'dimension1': userID.toString(), // User ID
				'dimension2': project.nid.toString(), // Project NID
				'dimension3': targetSceneNID.toString(), // Scene NID
				'dimension4': project.info.name // Project Name
			});
			currentSceneNID = targetSceneNID;
			currentSceneName = targetSceneName;
			sceneStartTime = new Date().getTime() / 1000; // current time in seconds
		}
	}
	ref.sendThumbnailClickEvent = function(targetSceneName, targetSceneNID){
		if(ga){
			ref.sendSceneTime();
			ga('send', {
				'hitType': 'event',
				'eventCategory': 'Navegation',
				'eventAction': 'ThumbnailClick',
				'eventLabel': targetSceneName,
				'dimension1': userID.toString(), // User ID
				'dimension2': project.nid.toString(), // Project NID
				'dimension3': targetSceneNID.toString(), // Scene NID
				'dimension4': project.info.name // Project Name
			});
			currentSceneNID = targetSceneNID;
			currentSceneName = targetSceneName;
			sceneStartTime = new Date().getTime() / 1000; // current time in seconds
		}
	}
	ref.sendActionButtonClickEvent = function(action){
		if(ga){
			if(action && action != currentAction){
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'ActionButtons',
					'eventAction': action,
					'eventLabel': project.info.name,
					'dimension1': userID.toString(), // User ID
					'dimension2': project.nid.toString() // Project NID
				});
				currentAction = action;
			}
		}
	}
	ref.sendFullscreenButtonClickEvent = function(){
		if(ga){
			ga('send', {
				'hitType': 'event',
				'eventCategory': 'ActionButtons',
				'eventAction': "fullscreen",
				'eventLabel': project.info.name,
				'dimension1': userID.toString(), // User ID
				'dimension2': project.nid.toString() // Project NID
			});
		}
	}
	ref.sendGyroscopeClickEvent = function(){
		if(ga){
			ga('send', {
				'hitType': 'event',
				'eventCategory': 'ActionButtons',
				'eventAction': "gyroscope",
				'eventLabel': project.info.name,
				'dimension1': userID.toString(), // User ID
				'dimension2': project.nid.toString() // Project NID
			});
		}
	}
	ref.sendCardboardClickEvent = function(){
		if(ga){
			ga('send', {
				'hitType': 'event',
				'eventCategory': 'ActionButtons',
				'eventAction': "cardboard",
				'eventLabel': project.info.name,
				'dimension1': userID.toString(), // User ID
				'dimension2': project.nid.toString() // Project NID
			});
		}
	}
	
	// TIMING -------------
	ref.sendSceneTime = function(sceneName){
		if(ga && currentSceneNID){
			var timeNow = new Date().getTime() / 1000; // current time in seconds
			var lapseTime = timeNow - sceneStartTime;					
			ga('set', {
				'metric1': lapseTime.toString(),
				'dimension1': userID.toString(), // User ID
				'dimension2': project.nid.toString(), // Project NID
				'dimension3': currentSceneNID.toString(), // Scene NID
				'dimension4': project.info.name, // Project Name
				'dimension5': currentSceneName // Scene Name
			});
		}
	}
	
	// SOCIAL -------------
	ref.socialAction = function(socialNetworkName, url){
		if(ga){
			ga('send', 'social', {
				'socialNetwork': socialNetworkName,
				'socialAction': 'share',
				'socialTarget': url,
				'dimension1': userID.toString(), // User ID
				'dimension2': project.nid.toString(), // Project NID
				'dimension4': project.info.name // Project Name
			});
		}
	}
});