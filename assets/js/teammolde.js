var teammoldeApp = angular.module(
	"teammoldeApp",
	[
		'ngAnimate', 'ui.router'
	]
);

teammoldeApp
.config(
[
'$stateProvider', '$urlRouterProvider', '$sceProvider',
function ($stateProvider, $urlRouterProvider, $sceProvider)
{
	$sceProvider.enabled(false);

	$urlRouterProvider
		.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			views: {
				"main": {
					templateUrl: '/partials/home.html'
				},
				"header": {
					templateUrl: '/partials/header.html'
				}
			}
		})

		.state('priser', {
			url: '/priser',
			views: {
				"main": {
					templateUrl: '/partials/priser.html'
				},
				"header": {
					templateUrl: '/partials/header.html'
				}
			}
		})

		.state('larere', {
			url: '/larere',
			views: {
				"main": {
					templateUrl: '/partials/larere.html'
				},
				"header": {
					templateUrl: '/partials/header.html'
				}
			}
		})

		.state('bestill', {
			url: '/bestill',
			views: {
				"main": {
					templateUrl: '/partials/bestill.html'
				},
				"header": {
					templateUrl: '/partials/header.html'
				}
			}
		})

		.state('elevside', {
			url: '/elevside',
			views: {
				"main": {
					templateUrl: '/partials/elevside.html'
				},
				"header": {
					templateUrl: '/partials/header.html'
				}
			}
		})

		.state('manedensbestatt', {
			url: '/manedensbestatt',
			views: {
				"main": {
					templateUrl: '/partials/manedensbestatt.html'
				},
				"header": {
					templateUrl: '/partials/header.html'
				}
			}
		})

		.state('kontakt', {
			abstract: true,
			url: '/kontakt',
			views: {
				"main": {
					templateUrl: '/partials/kontakt.html'
				},
				"header": {
					templateUrl: '/partials/header.html'
				}
			}
		})
	;

}
]
);

teammoldeApp
.filter('bstableizer',
function () {
	return function ( markup ) {
		return markup.replace('<table>', '<table class="table table-hover">');
	};
}
);

teammoldeApp
.controller('homeCtrl',
[
'$scope', 'bgSVG',
function($scope, bgSVG) {
	bgSVG.init().then(function(){
		bgSVG.go();
	});
}
]
);

teammoldeApp
.controller('PriserCtrl',
[
'$scope', 'wpData', 'bgSVG',
function($scope, wpData, bgSVG) {
	$scope.pricelist = '';

	wpData.getPage('priser')
		.then(function(html) {
			$scope.pricelist = html;
		});

	//bgSVG.blur(true);
}
]
);

teammoldeApp
.service('wpData',
[
'$q', '$http',
function ( $q, $http )
{
	this.getPage = function( url ) {
		var deferred = $q.defer();

		$http.get('wordpress/' + url + '/?json=1', {cache: true})
			.success(function(result) {
				deferred.resolve(result.page.content);
			})
			.error(function(){
				deferred.reject();
			});

		return deferred.promise;
	};
}
]
);

teammoldeApp
.service('bgSVG',
[
'$q',
function ( $q )
{
	var s;

	this.init = function() {
		var deferred = $q.defer();

		s = Snap("#background");

		Snap.load("assets/svg/background.svg", function (f) {
			s.append(f);

			deferred.resolve();
		});

		return deferred.promise;
	};

	this.go = function() {
		var cloud_left = Snap(s).select('#cloud-left'),
			cloud_right = Snap(s).select('#cloud-right');

		cloud_left.animate({transform: 'translate(1000,0)'},20000, mina.easeinout);

		cloud_right.animate({transform: 'translate(-1000,0)'},20000, mina.easeinout);
	};

	this.blur = function( blur ) {
		s.attr({
			filter: blur ? f : null
		});
	};
}
]
);
