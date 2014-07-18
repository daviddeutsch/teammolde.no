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
.controller('PriserCtrl',
[
'$scope', 'wpData',
function($scope, wpData) {
	$scope.pricelist = '';

	wpData.getPage('priser')
		.then(function(html) {
			$scope.pricelist = html;
		});
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

		$http.get('wordpress/' + url + '/&json=1', {cache: true})
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
