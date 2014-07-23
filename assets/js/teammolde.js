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
			url: '/priser/:id',
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
		return markup.replace(new RegExp('<table>', 'g'), '<table class="table table-hover">');
	};
}
);

teammoldeApp
.filter('priserlinker',
[
'$compile', '$rootScope',
function ($compile, $rootScope) {
	return function ( markup ) {
		angular.forEach( angular.element('td a', markup), function(el) {
			var search = el.outerHTML;

			var child_el = angular.element(el);

			child_el.attr('ui-sref', 'priser({ id: "'+child_el.attr("href" ).substr(1)+'" })');

			child_el.removeAttr("href");

			markup = markup.replace(search, el.outerHTML);
		});

		return $compile(markup)($rootScope);
	};
}
]
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
'$scope', '$window', 'wpData', '$http', 'bgSVG', '$stateParams', 'bstableizerFilter', 'priserlinkerFilter',
function($scope, $window, wpData, $http, bgSVG, $stateParams, bstableizerFilter, priserlinkerFilter) {
	$scope.content = '';

	wpData.getPage($stateParams.id ? $stateParams.id : 'priser')
	//$http.get('partials/priser-static.html')
		.then(function(html) {
		//.success(function(html) {
			$scope.content = priserlinkerFilter(
				bstableizerFilter(
					html
				)
			);

			$window.scrollTo(0,0);
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
		self = this,
		blurred = false;

	this.init = function() {
		angular.element('body').removeClass('bgblur');

		blurred = false;

		Tween.setRoot('#background');

		angular.element('#background img').remove();

		return Tween.load('assets/svg/background.svg');
	};

	this.go = function() {
		Tween.get('#cloud-left')
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

		Tween.get('#cloud-right')
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

		Tween.get('#personbil')
			.addClass('hoverable')
			.sub('#personbil text')
			.animate({transform: 'translate(700,0)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(700,0)'}, 500, mina.linear)
			.animate({transform: 'translate(900,0)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(900,0)'}, 500, mina.linear)
			.animate({transform: 'translate(1300,0)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(1300,0)'}, 500, mina.linear)
			.animate({transform: 'translate(1600,0)'}, 5000, mina.easeinout)
			.animate(
				{transform: 'translate(1850,0) scale(-1, 1)'}, 1000, mina.easeinout,
				{transform: 'translate(190,0) scale(-1, 1)'}
			)
			.animate({transform: 'translate(1600,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(1300,0) scale(-1, 1)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(700,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(600,0) scale(-1, 1)'}, 1000, mina.easeinout)
			.animate(
				{transform: 'translate(450,0) scale(1, 1)'}, 3000, mina.easeinout,
				{transform: 'translate(0,0) scale(1, 1)'}
			)
			.hover()
			.click('priser', {id:'klasse-b'})
		;

		Tween.get('#lett-lastebil')
			.addClass('hoverable')
			.sub('#lett-lastebil text')
			.animate({transform: 'translate(-200,0)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(-200,0)'}, 500, mina.linear)
			.animate({transform: 'translate(-400,0)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(-400,0)'}, 500, mina.linear)
			.animate({transform: 'translate(-800,0)'}, 5000, mina.easeinout)
			.animate(
				{transform: 'translate(2000,0) scale(-1, 1)'}, 2000, mina.easeinout,
				{transform: 'translate(2725,0) scale(-1, 1)'}
			)
			.animate({transform: 'translate(2000,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(2400,0) scale(-1, 1)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(2800,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(2800,0) scale(-1, 1)'}, 1000, mina.easeinout)
			.animate(
				{transform: 'translate(200,0) scale(1, 1)'}, 2000, mina.easeinout,
				{transform: 'translate(0,0) scale(1, 1)'}
			)
			.hover()
			.click('priser', {id:'klasse-c'})
		;

		Tween.get('#lastebil')
			.addClass('hoverable')
			.sub('#lastebil text')
			.animate({transform: 'translate(-200,0)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(-200,0)'}, 100, mina.linear)
			.animate({transform: 'translate(-1400,0)'}, 9000, mina.easeinout)
			.animate(
				{transform: 'translate(2000,0) scale(-1, 1)'}, 2000, mina.easeinout,
				{transform: 'translate(1640,0) scale(-1, 1)'}
			)
			.animate({transform: 'translate(2000,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(2400,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(2600,0) scale(-1, 1)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(3200,0) scale(-1, 1)'}, 3000, mina.easeinout)
			.animate(
				{transform: 'translate(0,0) scale(1, 1)'}, 1000, mina.easeinout,
				{transform: 'translate(0,0) scale(1, 1)'}
			)
			.hover()
			.click('priser', {id:'klasse-c1'})
		;

		Tween.get('#buss')
			.addClass('hoverable')
			.sub('#buss text')
			.animate({transform: 'translate(0,0)'}, 2500, mina.linear)
			.animate({transform: 'translate(-280,0)'}, 4000, mina.easeinout)
			.animate({transform: 'matrix(0.98554261,0.16942777,-0.16942777,0.98554261,-252.53082,-261.69727)'}, 5000, mina.easeinout)
			.animate({transform: 'matrix(0.93870831,0.34471252,-0.34471252,0.93870831,-213.82664,-547.30635)'}, 3000, mina.linear)
			.animate({transform: 'matrix(0.98020369,0.19799176,-0.19799176,0.98020369,-540.75624,-415.44484)'}, 2500, mina.linear)
			.animate({transform: 'matrix(0.99794493,0.06407749,-0.06407749,0.99794493,-761.67881,-248.31587)'}, 1500, mina.linear)
			.animate({transform: 'translate(-897,-152)'}, 2500, mina.linear)
			.animate({transform: 'translate(-897,-152)'}, 1500, mina.linear)
			.animate(
				{transform: 'translate(2097,-152) scale(-1, 1)'}, 500, mina.linear,
				{transform: 'translate(3070,0) scale(-1, 1)'}
			)
			.animate({transform: 'matrix(-0.98905174,-0.14756914,-0.14756914,0.98905174,2310.6042,89.791862)'}, 1500, mina.linear)
			.animate({transform: 'matrix(-0.9666291,-0.25617997,-0.25617997,0.9666291,2488.4436,298.8061)'}, 2500, mina.linear)
			.animate({transform: 'matrix(-0.94359213,-0.33111008,-0.33111008,0.94359213,2575.3005,471.84637)'}, 3000, mina.linear)
			.animate({transform: 'matrix(-0.99386723,-0.11057993,-0.11057993,0.99386723,2675.8798,155.36451)'}, 2000, mina.linear)
			.animate({transform: 'matrix(-1,0,0,1,2872.1032,0)'}, 4000, mina.easeinout)
			.animate(
				{transform: 'translate(0,0) scale(1, 1)'}, 1000, mina.linear,
				{transform: 'translate(0,0) scale(1, 1)'}
			)
			.hover()
			.click('priser', {id:'klasse-d'})
		;
	};

	this.blur = function( blur ) {
		if ( !blurred ) {
			angular.element('#background svg').remove();
			angular.element('body').addClass('bgblur');

			blurred = true;
		}
	};
}
]
);

teammoldeApp
.service('Tween',
[
'$q', '$state',
function ( $q, $state )
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

			angular.forEach(sub, function(sub_el) {
				sub_el.clear();
			});

			var step = queue[pointer];

			if ( typeof step == "undefined" ) return;

			if ( step.type == 'animation' ) {
				if ( sub.length ) {
					if ( typeof step.piggyback !== "undefined" ) {
						angular.forEach(sub, function(sub_el) {
							sub_el.animate(step.piggyback, step.duration, step.easing
							);
						});
					}
				}

				self.el.animate(
					step.ops, step.duration, step.easing, function(){self.next();}
				);
			} else {
				step.action(self.el);

				self.next();
			}
		};

		self.sub = function( el ) {
			sub.push( new tween(root.select(el)) );

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

		self.hover = function() {
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

		self.addClass = function(name) {
			self.el.addClass(name);

			return self;
		};

		self.click = function(to, params) {
			self.el.click(function(){
				$state.go(to, params)
			});

			return self;
		};

		self.animate = function( ops, duration, easing, piggyback ) {
			return self.enqueue(
				{
					type: 'animation',
					ops: ops,
					duration: duration,
					easing: easing,
					piggyback: piggyback
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

		self.enqueue = function( object ) {
			queue.push(object);

			if ( run == false ) self.start();

			return self;
		};

		self.clear = function() {
			queue = [];
			run = false;
		}
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
