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
'$scope', 'bgSVG', '$window',
function($scope, bgSVG, $window) {
	bgSVG.init().then(function(){
		bgSVG.go();
	});

	var resize = function() {
		var bg = angular.element('#background');

		if ( $window.innerWidth > 1400 ) {
			bg.attr('style', 'margin-left: 0' );
		} else if ( $window.innerWidth < 1400 && $window.innerWidth > 1250 ) {
			var dim = 1400 - $window.innerWidth;

			bg.attr(
				'style',
				'margin-left: -'
					+ dim + 'px;'
					+ ' width: ' + ($window.innerWidth+dim-16) + 'px' );
		} else {
			bg.attr(
				'style',
				'margin-left: -150px;'
					+ ' width: ' + ($window.innerWidth+134) + 'px' );
		}
	};

	angular.element($window).bind("resize", function() {
		resize();
	});

	resize();
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

			angular.forEach( angular.element('#pricelist tr'), function(el){
				var test = el;
			});
		});

	bgSVG.blur(true);
}
]
);

teammoldeApp
.controller('StdCtrl',
[
'bgSVG',
function(bgSVG) {
	bgSVG.blur(true);
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
		objects = {},
		self = this,
		blurred = false;

	this.init = function() {
		Tween.setRoot('#background');

		angular.element('#background img').remove();

		return Tween.load('assets/svg/background.svg');
	};

	this.go = function() {
		objects.cloud_left = Tween.get('#cloud-left')
			.animate({transform: 'translate(400,0)'}, 1000, mina.easeinout)
			.animate({transform: 'translate(600,0)'}, 10000, mina.easeinout)
			.animate({transform: 'translate(1000,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(1800,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(2200,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(2600,0)'}, 7500, mina.easeinout)
			.action(function(element){
				element.attr({transform: 'translate(0,0)'});
			})
			.hover()
		;

		objects.cloud_right = Tween.get('#cloud-right')
			.animate({transform: 'translate(-400,0)'}, 1000, mina.easeinout)
			.animate({transform: 'translate(-600,0)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(-1000,0)'}, 10000, mina.easeinout)
			.animate({transform: 'translate(-1500,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(-2200,0)'}, 10000, mina.easeinout)
			.animate({transform: 'translate(-2600,0)'}, 7500, mina.easeinout)
			.action(function(element){
				element.attr({transform: 'translate(0,0)'});
			})
			.hover()
		;

		objects.personbil_text = Tween.get('#personbil text')
				.animate({transform: 'translate(0,0)'}, 19400, mina.linear)
				.animate({transform: 'translate(190,0) scale(-1, 1)'}, 10, mina.linear)
				.animate({transform: 'translate(190,0) scale(-1, 1)'}, 14490, mina.linear)
				.animate({transform: 'translate(0,0) scale(1, 1)'}, 10, mina.linear)
				.animate({transform: 'translate(0,0) scale(1, 1)'}, 1190, mina.linear)
			;

		objects.personbil = Tween.get('#personbil')
			.sub(objects.personbil_text)
			.animate({transform: 'translate(700,0)'}, 3000, mina.easeinout)
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
			.animate({transform: 'translate(600,0) scale(-1, 1)'}, 1000, mina.easeinout)
			.animate({transform: 'translate(450,0) scale(1, 1)'}, 3000, mina.easeinout)
			.hover()
		;

		objects.lettlastebil_text = Tween.get('#lett-lastebil text')
			.animate({transform: 'translate(0,0)'}, 14000, mina.linear)
			.animate({transform: 'translate(2725,0) scale(-1, 1)'}, 10, mina.linear)
			.animate({transform: 'translate(2725,0) scale(-1, 1)'}, 13090, mina.linear)
			.animate({transform: 'translate(0,0) scale(1, 1)'}, 10, mina.linear)
			.animate({transform: 'translate(0,0) scale(1, 1)'}, 990, mina.linear)
		;

		objects.lettlastebil = Tween.get('#lett-lastebil')
			.sub(objects.lettlastebil_text)
			.animate({transform: 'translate(-200,0)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(-200,0)'}, 500, mina.linear)
			.animate({transform: 'translate(-400,0)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(-400,0)'}, 500, mina.linear)
			.animate({transform: 'translate(-800,0)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(2000,0) scale(-1, 1)'}, 2000, mina.easeinout)
			.animate({transform: 'translate(2000,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(2400,0) scale(-1, 1)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(2800,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(2800,0) scale(-1, 1)'}, 1000, mina.easeinout)
			.animate({transform: 'translate(200,0) scale(1, 1)'}, 1000, mina.easeinout)
			.hover()
		;

		objects.lastebil_text = Tween.get('#lastebil text')
			.animate({transform: 'translate(0,0)'}, 13100, mina.linear)
			.animate({transform: 'translate(1640,0) scale(-1, 1)'}, 10, mina.linear)
			.animate({transform: 'translate(1640,0) scale(-1, 1)'}, 14085, mina.linear)
			.animate({transform: 'translate(0,0) scale(1, 1)'}, 10, mina.linear)
			.animate({transform: 'translate(0,0) scale(1, 1)'}, 395, mina.linear)
		;

		objects.lastebil = Tween.get('#lastebil')
			.sub(objects.lastebil_text)
			.animate({transform: 'translate(-200,0)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(-200,0)'}, 100, mina.linear)
			.animate({transform: 'translate(-1400,0)'}, 9000, mina.easeinout)
			.animate({transform: 'translate(2000,0) scale(-1, 1)'}, 2000, mina.easeinout)
			.animate({transform: 'translate(2000,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(2400,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(2600,0) scale(-1, 1)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(3200,0) scale(-1, 1)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(0,0) scale(1, 1)'}, 1000, mina.easeinout)
			.hover()
		;

		objects.buss = Tween.get('#buss')
			.animate({transform: 'translate(0,0)'}, 2500, mina.linear)
			.animate({transform: 'translate(-200,0)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(-200,0)'}, 500, mina.linear)
			.animate({transform: 'translate(-400,0)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(-400,0)'}, 500, mina.linear)
			.animate({transform: 'matrix(0.8660254,0.5,-0.5,0.8660254,-24.308937,-698.29248)'}, 5000, mina.easeinout)
			.animate({transform: 'matrix(0.94967542,0.31323569,-0.31323569,0.94967542,-374.13056,-520.01597)'}, 5000, mina.linear)
			.animate({transform: 'matrix(0.98814356,0.15353273,-0.15353273,0.98814356,-656.74677,-340.16701)'}, 2500, mina.linear)
			.animate({transform: 'translate(-897,-131)'}, 2500, mina.linear)
			.action(function(element){
				element.attr({transform: 'translate(0,0)'});
			})
			.hover()
		;
	};

	this.blur = function( blur ) {
		angular.element('#background svg').remove();
		angular.element('#background').append('<img src="assets/img/blurredout_2.jpg" alt=""/>');
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
	var root;

	var tween = function( element ) {
		var queue = [],
			pointer = -1,
			self = this,
			run = false,
			sub = [];

		self.el = element;

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
				self.el.animate(
					step.ops, step.duration, step.easing, function(){self.next();}
				);
			} else {
				step.action(self.el);

				self.next();
			}
		};

		self.sub = function( el ) {
			sub.push(el);

			return self;
		};

		self.getAnims = function() {
			var animations = [];

			angular.forEach(self.el.anims, function(anim){
				animations.push(anim);
			});

			if ( sub.length ) {
				angular.forEach(sub, function(sub_el){
					angular.forEach(sub_el.el.anims, function(anim){
						animations.push(anim);
					});
				});
			}

			return animations;
		};

		self.hover = function()
		{
			self.el.hover(
				function() {
					var animations = self.getAnims();

					for (var k in animations) {
						if (animations.hasOwnProperty(k)) animations[k].pause();
					}
				},
				function() {
					var animations = self.getAnims();

					for (var k in animations) {
						if (animations.hasOwnProperty(k)) animations[k].resume();
					}
				}
			);

			return self;
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
		};
	};

	this.setRoot = function( newroot ) {
		root = Snap(newroot);
	};

	this.getRoot = function( newroot ) {
		return root;
	};

	this.load = function( path )
	{
		var deferred = $q.defer();

		Snap.load(path, function (f) {
			root.append(f);

			deferred.resolve();
		});

		return deferred.promise;
	};

	this.get = function( el ) {
		if ( typeof el === 'string' ) {
			el = root.select(el);
		}

		return new tween(el);
	};
}
]
);
