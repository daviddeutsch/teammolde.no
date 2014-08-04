if (!Object.keys) {
	Object.keys = function (obj) {
		var keys = [],
			k;
		for (k in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, k)) {
				keys.push(k);
			}
		}
		return keys;
	};
}

var teammoldeApp = angular.module(
	"teammoldeApp",
	[
		'ngAnimate', 'ui.router', 'mgcrea.ngStrap'
	]
);

teammoldeApp
.run(
[
'$rootScope', '$state',
function ($rootScope, $state)
{
	$rootScope.$state = $state;

	$rootScope.$on(
		'$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){
			$rootScope.loading = true;
		});
}
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
			},
			onExit: ['$window',function($window){
				angular.element($window).unbind("resize");
			}]
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
			url: '/bestill/:id',
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
	return function ( markup, bestill ) {
		var modified = '';
		var split = markup.split('<h4>Budsjett</h4>');

		modified += split[0].replace(
			new RegExp('<table>', 'g'),
			'<table class="table table-hover'
				+ ((bestill != 'priser') ? ' table-x-responsive' : '')
				+'">'
		);

		if ( bestill != 'priser' ) {
			modified += '<div class="col-md-8 col-md-offset-4">';

			if ( typeof split[1] != 'undefined' ) {
				modified += '<h4>Budsjett</h4>'
					+ '<div class="table-wrap">'
						+ split[1].replace(
							new RegExp('<table>', 'g'),
							'<table class="table table-condensed">'
						)
					+ '</div>'
					;
			}

			bestill = bestill.replace('klasse-', '');

			modified += '<a ui-sref="'
				+ 'bestill({ id: \''+bestill+'\' })'
				+ '" class="btn btn-primary-black pull-right">Bestill Time</a>'
			+ '</div>';
		}

		return modified;
	};
}
);

teammoldeApp
.filter('backlinker',
function () {
	return function ( markup ) {
		return markup.replace(
			'<h1>',
			'<h1><span><a ui-sref="priser({ id: \'priser\' })"><i class="fa fa-chevron-left"></i></a></span>'
		);
	};
}
);

teammoldeApp
.filter('emailbreak',
function () {
	return function ( markup ) {
		return markup.replace(
			'@',
			' @ '
		);
	};
}
);

teammoldeApp
.filter('wplinker',
[
'$compile', '$rootScope',
function ($compile, $rootScope) {
	return function ( markup, type ) {
		angular.forEach( angular.element('td a', markup), function(el) {
			var search = el.outerHTML;

			var child_el = angular.element(el);

			child_el.attr('ui-sref', type+'({ id: "'+child_el.attr("href" ).substr(1)+'" })');

			child_el.removeAttr("href");

			markup = markup.replace(search, el.outerHTML);
		});

		return $compile(markup)($rootScope);
	};
}
]
);

teammoldeApp.filter('eurodate',
function () {
	return function ( d ) {
		return d.match(/.{2}|.{1,2}/g ).join('.');
	};
}
);

teammoldeApp.filter('removewhitespace',
function () {
	return function ( d ) {
		return d.replace(/ /g,'');
	};
}
);


teammoldeApp.directive('eitherThisOr',
function() {
	return {
		require: "ngModel",
		restrict: 'A',
		scope: {
			eitherThisOr: '=eitherThisOr'
		},
		link: function(scope, element, attrs, ctrl) {
			ctrl.$parsers.unshift(function(value) {
				var valid;

				if ( value !== '' ) {
					valid = true;
				} else {
					if ( scope.$parent.BestillForm[attrs.eitherThisOr].$viewValue == '' ) {
						valid = false;
					} else {
						valid = scope.$parent.BestillForm[attrs.eitherThisOr].$valid;
					}
				}

				ctrl.$setValidity('eitherthisor', valid);

				scope.$parent.BestillForm[attrs.eitherThisOr].$setValidity('eitherthisor', valid);

				return valid ? value : undefined;
			});

		}
	};
});


teammoldeApp
.controller('homeCtrl',
[
'$rootScope', '$scope', '$timeout', 'bgSVG', '$window',
function($rootScope, $scope, $timeout, bgSVG, $window) {
	$scope.bgtype = '';
	$scope.mobile = false;

	var centerbg = function() {
		if ( $window.innerWidth > 1620 ) {
			angular.element('#background svg').attr(
				'style', 'margin-left: -' + ((3500 - $window.innerWidth) / 2) + 'px;'
			);

			angular.element('#background svg #molde').attr(
				'transform', ''
			);
		} else if ( $window.innerWidth <= 1620 && $window.innerWidth > 1380 ) {
			angular.element('#background svg').attr(
				'style', 'margin-left: -' + ((3500 - $window.innerWidth) / 3) + 'px;'
			);

			angular.element('#background svg #molde').attr(
				'transform', 'scale(0.78, 0.78)'
			);
		} else if ( $window.innerWidth <= 1380 && $window.innerWidth > 1120 ) {
			angular.element('#background svg').attr(
				'style', 'margin-left: -' + ((3500 - $window.innerWidth) / 3.8) + 'px;'
			);

			angular.element('#background svg #molde').attr(
				'transform', 'scale(0.68, 0.68)'
			);
		} else if ( $window.innerWidth <= 1120 ) {
			angular.element('#background svg').attr(
				'style', 'margin-left: -' + ((3500 - $window.innerWidth) / 5) + 'px;'
			);

			angular.element('#background svg #molde').attr(
				'transform', 'scale(0.56, 0.56)'
			);
		}
	};

	var makeMobile = function( value ) {
		$scope.mobile = value;
	};

	var resize = function() {
		if ( $window.innerWidth <= 720 ) {
			$scope.bgtype = '';

			bgSVG.mobile();

			makeMobile(true);

			$rootScope.loading = false;
		} else {
			if ( $scope.bgtype == '' ) {
				bgSVG.init().then(function(){
					$rootScope.loading = false;

					bgSVG.go();

					$scope.bgtype = 'svg';

					centerbg();
				});
			} else {
				centerbg();

				$rootScope.loading = false;
			}

			makeMobile(false);
		}

	};

	angular.element($window).bind("resize", function() {
		$timeout(resize, 200);
	});

	resize();
}
]
);

teammoldeApp
.controller('PriserCtrl',
[
'$scope', '$rootScope', '$window', 'wpData', '$http', 'bgSVG', '$stateParams', 'backlinkerFilter', 'bstableizerFilter', 'wplinkerFilter',
function($scope, $rootScope, $window, wpData, $http, bgSVG, $stateParams, backlinkerFilter, bstableizerFilter, wplinkerFilter) {
	$scope.content = '';

	wpData.getPage($stateParams.id ? $stateParams.id : 'priser')
		.then(function(html) {
			$rootScope.loading = false;

			if ( $stateParams.id == 'priser' ) {
				$scope.content = wplinkerFilter(
					bstableizerFilter(html, $stateParams.id),
					'priser'
				);
			} else {
				$scope.content = wplinkerFilter(
					bstableizerFilter(backlinkerFilter(html), $stateParams.id),
					'priser'
				);
			}

			$window.scrollTo(0,0);
		});

	bgSVG.blur(true);
}
]
);

teammoldeApp
.controller('ManedensCtrl',
[
'$scope', '$rootScope', 'wpData', 'bgSVG',
function($scope, $rootScope, wpData, bgSVG) {
	$scope.content = '';

	wpData.getPage('manedens-bestatt')
		.then(function(html) {
			$rootScope.loading = false;

			$scope.content = html;
		});

	bgSVG.blur(true);
}
]
);

teammoldeApp
.controller('BestillCtrl',
[
'$scope', '$rootScope', '$q', '$state', '$stateParams', 'wpData', 'bgSVG',
function($scope, $rootScope, $q, $state, $stateParams, wpData, bgSVG) {
	$scope.content = '';

	$scope.focus = 'unset';
	$scope.viewloading = true;

	var itemhash = function(item) {
		if ( item.klasse !== '' ) {
			return item.klasse.toLowerCase().replace(/[^a-z0-9]/gi,'');
		} else {
			return item.title.toLowerCase().replace(/[^a-z0-9]/gi,'');
		}
	};

	$scope.set = function( id, item ) {
		var name = itemhash(item);

		if ( $scope.focus == id ) {
			$scope.focus = 'unset';
		} else {
			$scope.focus = id;
		}

		$state.go('^', {id: name});
	};

	$scope.list = [
		{title: 'Trafikalt grunnkurs TG', klasse: '', kurs: []},
		{title: 'Personbil m. henger <span class="small-text">(Opptil totalt 4250kg last)</span>', klasse: 'B96', kurs: []},
		{title: 'Personbil m. henger', klasse: 'BE', kurs: []},
		{title: 'Stor lastebil', klasse: 'C', kurs: []},
		{title: 'Liten lastebil', klasse: 'C1', kurs: []},
		{title: 'Buss', klasse: 'D', kurs: []},
		{title: 'Minibuss', klasse: 'D1', kurs: []},
		{title: 'Minibuss m. henger', klasse: 'D1E', kurs: []},
		{title: 'Buss m. henger', klasse: 'DE', kurs: []},
		{title: 'Traktor', klasse: 'T', kurs: []},
		{title: 'YSK etterutdanning godstransport', klasse: '', kurs: []},
		{title: 'YSK etterutdanning persontransport', klasse: '', kurs: []},
		{title: 'YSK Godstransport YDG', klasse: '', kurs: []}
	];

	var list_keys = Object.keys($scope.list);

	$scope.map = {};

	for ( var i = 0; i < list_keys.length; i++ ) {
		if ( $scope.list[i].klasse !== '' ) {
			$scope.map['Klasse '+$scope.list[i].klasse] = i;
		} else {
			$scope.map[$scope.list[i].title] = i;
		}
	}

	$scope.kurs = [];

	var convert = function(item) {
		var deferred = $q.defer();

		var keys = Object.keys(item.custom_fields);
		var len = keys.length - 1;

		for ( var i = 0; i < keys.length; i++ ) {
			if (item.custom_fields[keys[i]][0].indexOf('{') != -1 ) {
				item.custom_fields[keys[i]] = unserialize(item.custom_fields[keys[i]][0]);
			} else {
				item.custom_fields[keys[i]] = item.custom_fields[keys[i]][0];
			}

			if ( i === len ) {
				deferred.resolve(item);
			}
		}

		return deferred.promise;
	};

	var prepare = function(content) {
		var deferred = $q.defer();
		var promises = [];

		angular.forEach(content, function(item, key){
			var deferred = $q.defer();

			convert(item)
				.then(function(item){
					content[key] = item;

					deferred.resolve(content);
				});

			promises.push(deferred.promise);
		});

		$q.all(promises).then(function(item){
			deferred.resolve(content);
		});

		return deferred.promise;
	};

	var pushCourses = function(courses) {
		var deferred = $q.defer();
		var len = courses.length - 1;

		for ( var i = 0; i <= len; i++ ) {
			angular.forEach(courses[i].custom_fields.klasse, function(klasse){
				if ( typeof $scope.list[$scope.map[klasse]] != 'undefined' ) {
					$scope.list[$scope.map[klasse]].kurs.push(courses[i]);
				}
			});

			if ( i === len ) {
				deferred.resolve();
			}
		}

		return deferred.promise;
	};

	var enlist = function(list) {
		var deferred = $q.defer();

		prepare(list)
			.then(function(prepared){
				pushCourses(prepared)
					.then(function(){
						deferred.resolve();
					});
			});

		return deferred.promise;
	};

	$scope.toggle = function(id) {
		$scope.list[id].expanded = !$scope.list[id].expanded;
	};

	if ( $stateParams.id ) {
		angular.forEach($scope.list, function(item, key){
			if ( $stateParams.id == itemhash(item) ) {
				$scope.focus = key;
			}
		});
	}

	wpData.getPosts('kurs')
		.then(function(list) {
			$rootScope.loading = false;

			enlist(list)
				.then(function(){
					$scope.viewloading = false;
				});
		});

	bgSVG.blur(true);
}
]
);

teammoldeApp
.controller('LaerereCtrl',
[
'$scope', '$rootScope', '$timeout', 'bgSVG',
function($scope, $rootScope, $timeout, bgSVG) {
	bgSVG.blur(true);

	var keepalive;

	var id = 0;

	var list = [
		{
			name: 'Geir Magne Pettersen',
			email: 'geirmagne@teammolde.no',
			profile: 'profile_geirmagne.jpg',
			phone: '95 06 55 09'
		},
		{
			name: 'Iselin Larsen',
			email: 'iselin@teammolde.no',
			profile: 'profile_iselin.jpg',
			phone: '90 06 90 96'
		},
		{
			name: 'Jørn H Sorthe',
			email: 'jorn@teammolde.no',
			profile: 'profile_jorn.jpg',
			phone: '95 11 10 82'
		},
		{
			name: 'Kristian Vaagen',
			email: 'kristian@teammolde.no',
			profile: 'profile_kristian.jpg',
			phone: '48 15 07 75'
		},
		{
			name: 'Leidulf Inderhaug',
			email: 'leidulf@teammolde.no',
			profile: 'profile_leidulf.jpg',
			phone: '95 06 55 07'
		},
		{
			name: 'Lisa Eikrem',
			email: 'lisa@teammolde.no ',
			profile: 'profile_lisa.jpg',
			phone: '90 14 64 09'
		},
		{
			name: 'Thomas Døving Bronnes',
			email: 'thomas.bronnes@teammolde.no',
			profile: 'profile_thomas.bronnes.jpg',
			phone: '90 94 73 14'
		}
	];

	$scope.list = [];

	var tick = function () {
		$scope.list.push(list[id]);

		id++;

		if ( list.length > id ) {
			keepalive = $timeout(tick, 240);
		} else {
			$rootScope.loading = false;
		}
	};

	keepalive = $timeout(tick, 140);
}
]
);

teammoldeApp
.controller('NavCtrl',
[
'$scope',
function($scope) {
	$scope.toggle = function(id) {
		angular.element('#' + id ).toggleClass('collapse');
	};
}
]
);

teammoldeApp
.controller('StdCtrl',
[
'$rootScope', 'bgSVG',
function($rootScope, bgSVG) {
	bgSVG.blur(true);

	$rootScope.loading = false;
}
]
);

teammoldeApp
.controller('ContactCtrl',
[
'$scope', '$timeout', 'wpData',
function($scope, $timeout, wpData) {
	$scope.nonce = '';
	$scope.formstatus = '';

	wpData.getNonce()
		.then(function(nonce){
			$scope.nonce = nonce;
		});

	$scope.eraseForm = function() {
		$scope.name = '';
		$scope.epost = '';
		$scope.message = '';

		$scope.KontaktForm.$setPristine(true)
	};

	$scope.submit = function() {
		$scope.formstatus = 'sending';

		var data = {
			'_wpcf7': '157',
			'_wpcf7_version': '3.9',
			'_wpcf7_locale': 'en-US',
			'_wpcf7_unit_tag': 'wpcf7-f157-p161-o1',
			'_wpnonce': $scope.nonce,
			'_wpcf7_is_ajax_call': 1,
			name: this.name,
			email: this.epost,
			subject: 'Kontakt ' + "" + this.name,
			message: this.message
		};

		wpData.sendForm(data)
			.then(function(){
				$scope.formstatus = 'sent';

				$scope.eraseForm();

				$timeout(function() {
					$scope.formstatus = '';
				}, 3000);
			}, function() {
				$scope.formstatus = 'error';

				$timeout(function() {
					$scope.formstatus = '';
				}, 3000);
			});
	};
}
]
);

teammoldeApp
.controller('BestillModalCtrl',
[
'$scope', '$timeout', 'wpData',
function($scope, $timeout, wpData) {
	$scope.nonce = '';
	$scope.formstatus = '';

	wpData.getNonce()
		.then(function(nonce){
			$scope.nonce = nonce;
		});

	$scope.submit = function(item, kurs) {
		$scope.formstatus = 'sending';

		var data = {
			'_wpcf7': '157',
			'_wpcf7_version': '3.9',
			'_wpcf7_locale': 'en-US',
			'_wpcf7_unit_tag': 'wpcf7-f157-p161-o1',
			'_wpnonce': $scope.nonce,
			'_wpcf7_is_ajax_call': 1,
			name: this.fornavn + " " + this.etternavn,
			email: this.epost,
			subject: 'Bestill kurs',
			message: ''
				+ "" + this.fornavn + " " + this.etternavn
				+ "\n\n" + this.annet
		};

		wpData.sendForm(data)
			.then(function(){
				$scope.formstatus = 'sent';

				$timeout(function() {
					$scope.$hide();
				}, 3000);
			}, function() {
				$scope.formstatus = 'error';

				$timeout(function() {
					$scope.formstatus = '';
				}, 3000);
			});
	};
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

	this.getNonce = function( url ) {
		var deferred = $q.defer();

		$http.get('wordpress/kontakt/?json=1', {cache: false})
			.success(function(result) {
				var nonce = angular.element('input[name*=\'_wpnonce\']', result.page.content ).val();

				deferred.resolve(nonce);
			})
			.error(function(){
				deferred.reject();
			});

		return deferred.promise;
	};

	this.sendForm = function( data ) {
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: 'wordpress/kontakt/',
			data: jQuery.param(data),
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
			.success(function() {
				deferred.resolve();
			})
			.error(function(){
				deferred.reject();
			});

		return deferred.promise;
	};

	this.getPosts = function( type ) {
		var deferred = $q.defer();

		$http.get('wordpress/?json=get_recent_posts&post_type='+type+'&count=50', {cache: true})
		//$http.get('static.json', {cache: true})
			.success(function(result) {
				deferred.resolve(result.posts);
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

	this.mobile = function() {
		angular.element('#background svg').remove();

		angular.element('body').removeClass('bgblur');

		blurred = false;
	};

	this.init = function() {
		angular.element('body').removeClass('bgblur');

		blurred = false;

		Tween.setRoot('#background');

		angular.element('#background img').remove();

		angular.element('#imedias').addClass('hidden-xs');

		return Tween.load('assets/svg/background.svg');
	};

	this.go = function() {
		Tween.get('#cloud-left')
			.animate({transform: 'translate(400,0)', opacity: 1}, 1000, mina.easeinout)
			.animate({transform: 'translate(600,0)'}, 10000, mina.easeinout)
			.animate({transform: 'translate(1000,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(1800,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(2200,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(2600,0)'}, 7500, mina.easeinout)
			.action(function(element){
				element.attr({transform: 'translate(0,100)', opacity: 0});
			})
			.hover()
		;

		Tween.get('#cloud-right')
			.animate({transform: 'translate(-400,0)', opacity: 1}, 1000, mina.easeinout)
			.animate({transform: 'translate(-600,0)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(-1000,0)'}, 10000, mina.easeinout)
			.animate({transform: 'translate(-1500,0)'}, 7500, mina.easeinout)
			.animate({transform: 'translate(-2200,0)'}, 10000, mina.easeinout)
			.animate({transform: 'translate(-2600,0)'}, 7500, mina.easeinout)
			.action(function(element){
				element.attr({transform: 'translate(0,100)', opacity: 0});
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
				{transform: 'translate(3550,0) scale(-1, 1)'}, 1000, mina.easeinout,
				{transform: 'translate(1835,0) scale(-1, 1)'}
			)
			.animate({transform: 'translate(3300,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(3000,0) scale(-1, 1)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(2400,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(2300,0) scale(-1, 1)'}, 1000, mina.easeinout)
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
				{transform: 'translate(3500,0) scale(-1, 1)'}, 2000, mina.easeinout,
				{transform: 'translate(2725,0) scale(-1, 1)'}
			)
			.animate({transform: 'translate(3500,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(3700,0) scale(-1, 1)'}, 5000, mina.easeinout)
			.animate({transform: 'translate(4500,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(4500,0) scale(-1, 1)'}, 1000, mina.easeinout)
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
				{transform: 'translate(3750,0) scale(-1, 1)'}, 2000, mina.easeinout,
				{transform: 'translate(1640,0) scale(-1, 1)'}
			)
			.animate({transform: 'translate(3700,0) scale(-1, 1)'}, 2500, mina.linear)
			.animate({transform: 'translate(4100,0) scale(-1, 1)'}, 4000, mina.easeinout)
			.animate({transform: 'translate(4300,0) scale(-1, 1)'}, 3000, mina.easeinout)
			.animate({transform: 'translate(4900,0) scale(-1, 1)'}, 3000, mina.easeinout)
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
			.animate({transform: 'matrix(0.96700291,0.25476532,-0.25476532,0.96700291,-205.5497,-603.76466)'}, 5000, mina.easeinout)
			.animate({transform: 'matrix(0.9612598,0.27564399,-0.27564399,0.9612598,-344.24358,-709.85583)'}, 3000, mina.linear)
			.animate({transform: 'matrix(0.98220528,0.18781055,-0.18781055,0.98220528,-574.53991,-557.69096)'}, 2500, mina.linear)
			.animate({transform: 'matrix(0.99780921,0.06615729,-0.06615729,0.99780921,-757.3202,-294.54153)'}, 1500, mina.linear)
			.animate({transform: 'translate(-897,-152)'}, 2500, mina.linear)
			.animate({transform: 'translate(-897,-152)'}, 1500, mina.linear)
			.animate(
				{transform: 'translate(3750,-152) scale(-1, 1)'}, 500, mina.linear,
				{transform: 'translate(4715,0) scale(-1, 1)'}
			)
			.animate({transform: 'matrix(-0.99138551,-0.13097621,-0.13097621,0.99138551,3924.1281,165.74468)'}, 1500, mina.linear)
			.animate({transform: 'matrix(-0.96681011,-0.25549597,-0.25549597,0.96681011,4089.5422,504.11192)'}, 2500, mina.linear)
			.animate({transform: 'matrix(-0.93323558,-0.359265,-0.359265,0.93323558,4206.0996,814.53922)'}, 3000, mina.linear)
			.animate({transform: 'matrix(-0.99480413,-0.10180732,-0.10180732,0.99480413,4309.1536,223.59507)'}, 2000, mina.linear)
			.animate({transform: 'matrix(-1,0,0,1,4540.285,0)'}, 4000, mina.easeinout)
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
			angular.element('#imedias').removeClass('hidden-xs');

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
