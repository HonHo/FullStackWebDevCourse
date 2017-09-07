(function() {

	'use strict';

	angular.module('customerFirst', ['ui.router','ngResource','ngDialog', 'nl2br-filter'])
	.config(stateRouter);

	function stateRouter($stateProvider, $urlRouterProvider) {
        $stateProvider
	
        // route for the home page
        .state('app', {
            url:'/',
            views: {
                'header': {
                    templateUrl : 'views/header.html',
                    controller  : 'HeaderController',
                    controllerAs: 'header'
                },
                'content': {
                    templateUrl : 'views/home.html',
                    controller  : 'HomeController',
                    controllerAs: 'home'
                },
                'footer': {
                    templateUrl : 'views/footer.html'
                }
            }

        })

        // route for the manufact's product list
        .state('app.manufact', {
            url: 'manufacts/:id',
            views: {
                'content@': {
                    templateUrl : 'views/manufact.html',
                    controller  : 'ManufactController',
                    controllerAs: 'manufact'
               }
            }
        })

        .state('app.product', {
            url: 'manufacts/:manufactId/products/:id',
            views: {
                'content@': {
                    templateUrl : 'views/product.html',
                    controller  : 'ProductController',
                    controllerAs: 'product'
               }
            }
        })

        // route for the myprods page
        .state('app.myproducts', {
            url: 'myproducts/:id',
            views: {
                'content@': {
                    templateUrl : 'views/myproducts.html',
                    controller  : 'MyProductController',
                    controllerAs: 'myproducts'
                }
            }
        })

        .state('app.myproduct', {
            url: 'myproducts/:id/products/:prodId',
            views: {
                'content@': {
                    templateUrl : 'views/myproduct.html',
                    controller  : 'MyProductDetailController',
                    controllerAs: 'myproduct'
               }
            },
            params: {'tab' : 'details'}
        })

        // route for the aboutus page
        .state('app.aboutus', {
            url:'aboutus',
            views: {
                'content@': {
                    templateUrl : 'views/aboutus.html',
                    controller  : 'AboutController',
                    controllerAs: 'about'                  
                }
            }
        })
    
        // route for the contactus page
        .state('app.contactus', {
            url:'contactus',
            views: {
                'content@': {
                    templateUrl : 'views/contactus.html',
                    controller  : 'ContactController',
                    controllerAs: 'contact'                  
                }
            }
        })

        // route for the tech support page
        .state('app.support', {
            url:'support',
            views: {
                'content@': {
                    templateUrl : 'views/support.html',
                    controller  : 'SupportController',
                    controllerAs: 'support'                  
                }
            }
        })

        $urlRouterProvider.otherwise('/');
    }
})();