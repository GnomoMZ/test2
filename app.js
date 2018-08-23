'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ["ngRoute",
						 "720kb.socialshare",
						 "angularSpinner",
						 "ngTouch",
						 "customizationModule",
						 "analyticsModule",
						 "threejsModule",
						 "mainModule",
						 "pascalprecht.translate"])
	.run(['$translate', function ($translate) {
		var userLang = navigator.language || navigator.userLanguage; 
		switch(userLang.substring(0,2)){
			case 'es':
				$translate.use('es');
				break;
			case 'pt':
				$translate.use('pt-BR');
				break;
			case 'de':
				$translate.use('de');
				break;
			default:
				$translate.use('en');
	   	}		 

	}]).config(['$routeProvider',
				'$translateProvider', function ($routeProvider,
												 $translateProvider) {
					//translate
					$translateProvider.useSanitizeValueStrategy('escape');    
					$translateProvider.useStaticFilesLoader({
						prefix: 'lang-',
						suffix: '.json'
					});
					$translateProvider.preferredLanguage('en');

				//$routeProvider.otherwise({redirectTo: '/mainView'});
				}]);