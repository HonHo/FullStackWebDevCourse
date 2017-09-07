(function() {

	'use strict';

	angular.module('customerFirst')
	.controller('HomeController', HomeController)
	.controller('ManufactController', ManufactController)
	// .controller('ContactController', ContactController)
	.controller('ProductController', ProductController)
	.controller('MyProductController', MyProductController)
	.controller('MyProductDetailController', MyProductDetailController)
	.controller('AboutController', AboutController)
	.controller('ContactController', ContactController)
	.controller('SupportController', SupportController)
	.controller('HeaderController', HeaderController)
	.controller('LoginController', LoginController)
	.controller('RegisterController', RegisterController)
	;

	function HomeController(manufactFactory) {
		var vm = this;

		vm.showManufacts = false;
		vm.message = "Loading...";

		manufactFactory.query()		
			.$promise.then(	    
				function (response) {
					vm.manufacts = response;
					vm.showManufacts = true;
				},
				function (response) {
					vm.message = "Error: " + response.status + " " + response.statusText;
				}
			);

		// May need the below code for searching
		// vm.results = [];
		// vm.findValue = function(enteredValue) {     
		//     angular.forEach(vm.manufacts, function(key) {
		//         if (key.name === enteredValue) {
		//             vm.results.push({Name: key.name, Info: key});
		//         }
		//     });
		// };

		vm.findManufact = function(filterManufact) {
			return function(manufact) {
				//$log.info('filterManufact: ->' + filterManufact + "<-");
				if (angular.isUndefined(filterManufact)
					|| filterManufact === '') {
					return true;
				}
				return (manufact.name.toLowerCase().indexOf(filterManufact.toLowerCase()) !== -1);
			}
		}
	}

	function ManufactController($stateParams, productFactory, myproductDetailFactory, $log) {
		var vm = this;

		vm.showProds = false;
		vm.message = "Loading...";

		// manufactFactory.get({
		// 		_id : $stateParams.id
		// 	})
		// 	.$promise.then(	    
		// 		function (response) {
		// 			vm.manufact = response;
		// 			$log.info('Manufacturer name: ' + vm.manufact.name);
					
		// 			productFactory.query({
		// 					producedBy : $stateParams.id
		// 				})
		// 				.$promise.then(	    
		// 					function (response) {
		// 						vm.products = response;
		// 						//$log.info('Product name: ' + vm.products[0].name);
		// 						vm.showProds = true;
		// 					},
		// 					function (response) {
		// 						vm.message = "Error: " + response.status + " " + response.statusText;
		// 					}
		// 				);
		// 		},
		// 		function (response) {
		// 			vm.message = "Error: " + response.status + " " + response.statusText;
		// 		}
		// 	);
				
		productFactory.query({
				producedBy : $stateParams.id
			})
			.$promise.then(   
				function (response) {
					vm.products = response;
					//$log.info('Product name: ' + vm.products[0].name);
					vm.showProds = true;
				},
				function (response) {
					vm.message = "Error: " + response.status + " " + response.statusText;
				}
			);

		vm.findProduct = function(searchProd) {
			return function(product) {
				if (angular.isUndefined(searchProd)
					|| searchProd === '') {
					return true;
				}
				return (product.name.toLowerCase().indexOf(searchProd.toLowerCase()) !== -1);
			}
		}

		vm.addToMyProducts = function(myprodId, prodId) {
			$log.info("Prod to be added: " + prodId);
			//myproductDetailFactory.save({_prodId: prodId});
			myproductDetailFactory.update({_id: myprodId, _prodId: prodId});
		}
	}

	function ProductController($state, $stateParams, productFactory, reviewFactory, alertFactory, myproductDetailFactory, $log) {
		var vm = this;

		vm.showProd = false;
		vm.msgProd = "Loading product...";

		vm.showReviews = false;
		vm.msgReviews = "Loading reviews...";

		vm.showAlerts = false;
		vm.msgAlerts = "Loading alerts...";

		productFactory.get({
				_id : $stateParams.id
			})
			.$promise.then(	    
				function (response) {
					vm.product = response;
					$log.info('Prod name: ' + vm.product.name);
					vm.showProd = true;
				},
				function (response) {
					vm.msgProd = "Error: " + response.status + " " + response.statusText;
				}
			);

		// reviewFactory.query({
		// 		product : $stateParams.id
		// 	})
		// 	.$promise.then(	    
		// 		function (response) {
		// 			vm.reviews = response;
		// 			//$log.info('Review: ' + vm.reviews[0].review);
		// 			vm.showReviews = true;
		// 		},
		// 		function (response) {
		// 			vm.msgReviews = "Error: " + response.status + " " + response.statusText;
		// 		}
		// 	);

		// alertFactory.query({
		// 		product : $stateParams.id
		// 	})
		// 	.$promise.then(	    
		// 		function (response) {
		// 			vm.alerts = response;
		// 			//$log.info('Alert: ' + vm.alerts[0].alert);
		// 			vm.showAlerts = true;
		// 		},
		// 		function (response) {
		// 			vm.msgAlerts = "Error: " + response.status + " " + response.statusText;
		// 		}
		// 	);

		vm.addToMyProducts = function(myprodId, prodId) {
			$log.info("Prod to be added: " + prodId);
			//myproductDetailFactory.save({_prodId: prodId});
			myproductDetailFactory.update({_id: myprodId, _prodId: prodId});
		}
	}

	function MyProductController($state, $stateParams, myproductFactory, myproductDetailFactory, reviewFactory, alertFactory, $log) {
		var vm = this;
		var indexedManufacts = [];

		vm.myproducts = {};
		vm.products = [];
		vm.showProds = false;
		vm.msgProds = "Loading product...";

		myproductFactory.query({
				_id: $stateParams.id
			})
			.$promise.then(	    
				function (response) {
					if (response.length > 0) {
						vm.myproducts = response[0];
						$log.info('My prod name: ' + vm.myproducts.products[0].name);
						//$log.info('Manufact name: ' + vm.products[0].producedBy.name);
					}
					vm.showProds = true;
				},
				function (response) {
					if (response.status == '401'
						|| response.status == '403') {
						vm.msgProds = "Please login to manage your products.";
					} else {
						vm.msgProds = "Error: " + response.status + " " + response.statusText;
					}
				}
			);

		// this will reset the list of indexed manufacts each time the list is rendered again
		vm.productsToFilter = function() {
			indexedManufacts = [];
			vm.products = vm.myproducts.products;
			return vm.products;
		}

		vm.filterManufacts = function(product) {
			var isManufactNew = indexedManufacts.indexOf(product.producedBy._id) == -1;
			if (isManufactNew) {
				indexedManufacts.push(product.producedBy._id);
			}
			return isManufactNew;
		}

		vm.productsToShow = function(searchProd) {
			return function(product) {
				if (angular.isUndefined(searchProd)
					|| searchProd === '') {
					return true;
				}
				return (product.name.toLowerCase().indexOf(searchProd.toLowerCase()) !== -1);
			}
		}

		vm.removeFromMyProducts = function(myprodId, prodId) {
			$log.info("Prod to be removed: " + prodId);
			myproductDetailFactory.delete(
				{_id: myprodId, _prodId: prodId}, 
				function() {
					$state.go($state.current, {}, {reload: true});
				}
			);
		}

			////////////////
			// vm.players = [{name: 'Gene', team: 'team alpha'},
			// 				{name: 'George', team: 'team beta'},
			// 				{name: 'Steve', team: 'team gamma'},
			// 				{name: 'Paula', team: 'team beta'},
			// 				{name: 'Scruath of the 5th sector', team: 'team gamma'}];

			// var indexedTeams = [];

			// // this will reset the list of indexed teams each time the list is rendered again
			// vm.playersToFilter = function() {
			// 	indexedTeams = [];
			// 	return vm.players;
			// }

			// vm.filterTeams = function(player) {
			// 	var teamIsNew = indexedTeams.indexOf(player.team) == -1;
			// 	if (teamIsNew) {
			// 		indexedTeams.push(player.team);
			// 	}
			// 	return teamIsNew;
			// }
			////////////////
	}

	function MyProductDetailController($state, $stateParams, myproductDetailFactory, reviewFactory, alertFactory, $log) {
		var vm = this;
		// var indexedManufacts = [];

		vm.tab = $stateParams.tab;
		//$log.log("Tab: " + vm.tab + ", tabb: " + $stateParams.tab);
		vm.myproducts = {};
		//vm.products = [];
		vm.product = null;
		vm.showProd = false;
		vm.msgProd = "Loading product...";

		// vm.showReviews = false;
		// vm.msgReviews = "Loading reviews...";

		// vm.showAlerts = false;
		// vm.msgAlerts = "Loading alerts...";

		myproductDetailFactory.query({
				_id: $stateParams.id,
				_prodId : $stateParams.prodId
			})
			.$promise.then(	    
				function (response) {
					if (response != null && response.length > 0) {
						vm.myproducts = response[0];
						if (vm.myproducts.products.length > 0) {
							vm.product = vm.myproducts.products[0];

							//$log.info('Product: ' + vm.product);
							vm.showProd = true;
						} else {
							vm.msgProd = '';
							vm.msgReviews = '';
							vm.msgAlerts = '';
						}
					} else {
						vm.msgProd = '';
						vm.msgReviews = '';
						vm.msgAlerts = '';
					}
				},
				function (response) {
					if (response.status == '401'
						|| response.status == '403') {
						vm.msgProd = "Please login to manage your products.";
					} else {
						vm.msgProd = "Error: " + response.status + " " + response.statusText;
					}
				}
			);

		vm.removeFromMyProducts = function(myprodId, prodId) {
			$log.info("Prod to be removed: " + prodId);
			myproductDetailFactory.delete(
				{_id: myprodId, _prodId: prodId}, 
				function() {
					$state.go($state.current, {}, {reload: true});
				}
			);
		}

		vm.form = {};
		vm.myreview = {
			headline: "",
			rating: 5,
			review : ""
		};

		vm.submitReview = function () {
			reviewFactory.save({_id: $stateParams.prodId}, vm.myreview);
			$state.go($state.current, {'tab': 'reviews'}, {reload: true});

			vm.form = {};

			vm.myreview = {
				headline: "",
				rating: 5,
				review : ""
			};
		}

		vm.select = function (setTab) {
			vm.tab = setTab;
		};

		vm.isSelected = function (checkTab) {
			return (vm.tab === checkTab);
		};

		// vm.submitReviewTest = function () {
		// 	vm.tab = "reviews";
		// 	// $log.log("submitReviewTest() called.");
		// }
	}

	function AboutController() {
		//var vm = this;
	}

	function ContactController() {
		//var vm = this;
	}

	function SupportController() {
		//var vm = this;
	}

	function HeaderController($state, $rootScope, ngDialog, AuthFactory) {
		var vm = this;

		vm.loggedIn = false;
		vm.username = '';

		if(AuthFactory.isAuthenticated()) {
			vm.loggedIn = true;
			vm.username = AuthFactory.getUsername();
		}

		vm.openLogin = function () {
			ngDialog.open({ template: 'views/login.html', className: 'ngdialog-theme-default', 
				controller: 'LoginController', controllerAs: 'login' });
		};

		vm.logOut = function() {
			AuthFactory.logout();
			vm.loggedIn = false;
			vm.username = '';
			$state.go('app', {}, {reload: true});
		};

		$rootScope.$on('$destroy', $rootScope.$on('login:Successful', function () {
			vm.loggedIn = AuthFactory.isAuthenticated();
			vm.username = AuthFactory.getUsername();
		}));
 
		$rootScope.$on('$destroy', $rootScope.$on('registration:Successful', function () {
			vm.loggedIn = AuthFactory.isAuthenticated();
			vm.username = AuthFactory.getUsername();
		}));

		vm.stateis = function(curstate) {
			return $state.is(curstate);  
		}; 
	}

	function LoginController($state, ngDialog, $localStorage, AuthFactory) {
		var vm = this;

		vm.loginData = $localStorage.getObject('userinfo','{}');

		vm.doLogin = function() {
			if(vm.rememberMe)
				$localStorage.storeObject('userinfo',vm.loginData);

			AuthFactory.login(vm.loginData);
			ngDialog.close();
			//console.log("logged in...");
			$state.go('app', {}, {reload: true});
		};

		vm.openRegister = function () {
			ngDialog.open({ template: 'views/register.html',
			className: 'ngdialog-theme-default', controller:'RegisterController', controllerAs:'register'});
		};
	}

	function RegisterController(ngDialog, $localStorage, AuthFactory, $log) {
		var vm = this;

		vm.register={};
		vm.loginData={};

		vm.doRegister = function() {
			$log.log('Doing registration', vm.registration);
			AuthFactory.register(vm.registration);
			ngDialog.close();
		};
	}
})();
