var teammoldeApp = angular.module(
	"teammoldeApp",
	[
		'ngAnimate', 'ui.router'
	]
);
mangroveServerApp
.config(
[
'$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider)
{
	$urlRouterProvider
		.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			views: {
				"main": {
					templateUrl: '/partials/home.html'
				}
			}
		})

		.state('priser', {
			abstract: true,
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
			abstract: true,
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
			abstract: true,
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

		.state('manedensbestatt', {
			abstract: true,
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
.controller('ContactCtrl',
[
'$scope',
function($scope) {
	$scope.id = '';

	$scope.change = function( name ) {
		if ( $scope.id === name ) {
			$scope.id = '';
		} else {
			$scope.id = name;
		}
	};

	$scope.isDeselected = function ( name ) {
		return $scope.id !== name && $scope.id != '';
	};

	$scope.isSelected = function ( name ) {
		return $scope.id === name;
	};
}
]
);
