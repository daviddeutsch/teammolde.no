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
					templateUrl: '/partials/laerere.html'
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
'$q', 'Tween',
function ( $q, Tween )
{
	var s,
		cloud_left,
		cloud_right,
		personbil,
		self = this;

	this.init = function() {
		var deferred = $q.defer();

		s = Snap("#background");

		Snap.load("assets/svg/background.svg", function (f) {
			s.append(f);

			cloud_left = Snap(s).select('#cloud-left');
			cloud_right = Snap(s).select('#cloud-right');

			cloud_left.attr({transform: 'translate(400,0)'});
			cloud_right.attr({transform: 'translate(-400,0)'});

			personbil = Snap(s).select('#personbil');

			deferred.resolve();
		});

		return deferred.promise;
	};

	this.cloudcycle = function() {
		Tween.get(cloud_left)
			.animate({transform: 'translate(600,0)'},10000, mina.easeinout)
			.animate({transform: 'translate(1000,0)'},7500, mina.easeinout)
			.animate({transform: 'translate(1800,0)'},7500, mina.easeinout)
			.animate({transform: 'translate(2200,0)'},7500, mina.easeinout)
			.animate({transform: 'translate(2600,0)'},7500, mina.easeinout)
			.action(function(){
				cloud_left.attr({transform: 'translate(0,0)'});
			});

		Tween.get(cloud_right)
			.animate({transform: 'translate(-600,0)'},5000, mina.easeinout)
			.animate({transform: 'translate(-1000,0)'},10000, mina.easeinout)
			.animate({transform: 'translate(-1500,0)'},7500, mina.easeinout)
			.animate({transform: 'translate(-2200,0)'},10000, mina.easeinout)
			.animate({transform: 'translate(-2600,0)'},7500, mina.easeinout)
			.action(function(){
				cloud_right.attr({transform: 'translate(0,0)'});
			});
	};

	// Range: 1700
	this.personbilcycle = function() {
		Tween.get(personbil)
			.animate({transform: 'translate(700,0)'}, 2000, mina.easeinout)
			.animate({transform: 'translate(700,0)'}, 500, mina.linear)
			.animate({transform: 'translate(900,0)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(900,0)'}, 500, mina.linear)
			.animate({transform: 'translate(1300,0)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(1300,0)'}, 500, mina.linear)
			.animate({transform: 'translate(1600,0)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(1850,0) scale(-1, 1)'}, 1000, mina.easeinout)
			.animate({transform: 'translate(1600,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(1300,0) scale(-1, 1)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(700,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(250,0) scale(-1, 1)'}, 1000, mina.easeinout)
			.animate({transform: 'translate(0,0) scale(1, 1)'}, 1000, mina.easeinout)
		;
	};

	this.go = function() {
		this.cloudcycle();
		this.personbilcycle();
	};

	this.blur = function( blur ) {
		s.attr({
			filter: blur ? f : null
		});
	};
}
]
);

teammoldeApp
.service('Tween',
[
'$q',
function ( $q )
{
	var tween = function( element ) {
		var el = element,
			queue = [],
			pointer = -1,
			self = this,
			run = false;

		self.start = function() {
			run = true;

			self.next();
		};

		self.next = function() {
			if ( pointer < queue.length-1 ) {
				pointer++;
			} else {
				pointer = 0;
			}

			var step = queue[pointer];

			if ( step.type == 'animation' ) {
				el.animate(
					step.ops,
					step.duration,
					step.easing,
					function() {
						self.next();
					}
				);
			} else {
				step.action();

				self.next();
			}
		};

		self.animate = function( ops, duration, easing ) {
			return self.enqueue(
				{
					type: 'animation',
					ops: ops,
					duration: duration,
					easing: easing
				}
			);
		};

		self.action = function( callback ) {
			return self.enqueue(
				{
					type: 'action',
					action: callback
				}
			);
		};

		self.enqueue = function( object )
		{
			queue.push(object);

			if ( run == false ) self.start();

			return self;
		}
	};

	this.get = function( el ) {
		return new tween(el);
	};
}
]
);
