// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('customerFirst', ['ionic', 'customerFirst.controllers', 'customerFirst.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); //top or bottom

    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl',
        controllerAs: 'appCtr'
    })

  .state('app.home', {
      url: '/home',
      views: {
          'menuContent': {
              templateUrl: 'templates/home.html',
              controller: 'HomeController',
              controllerAs: 'home'
          }
      }
  })

  .state('app.manufact', {
      url: '/manufacts/:id',
      views: {
          'menuContent': {
              templateUrl : 'templates/manufact.html',
              controller  : 'ManufactController',
              controllerAs: 'manufact'
        }
      }
  })

  .state('app.product', {
      url: '/manufacts/:manufactId/products/:id',
      views: {
          'menuContent': {
              templateUrl : 'templates/product.html',
              controller  : 'ProductController',
	            controllerAs: 'product'
         }
      }
  })

  .state('app.myproducts', {
      url: '/myproducts/:id',
      views: {
          'menuContent': {
              templateUrl : 'templates/myproducts.html',
              controller  : 'MyProductController',
              controllerAs: 'myproducts'
          }
      }
  })

  .state('app.myproduct', {
      url: '/myproducts/:id/products/:prodId',
      views: {
          'menuContent': {
              templateUrl : 'templates/myproduct.html',
              controller  : 'MyProductDetailController',
              controllerAs: 'myproduct'
         }
      }
      //, params: {'tab' : 'details'}
  })

  // route for the aboutus page
  .state('app.aboutus', {
      url:'/aboutus',
      views: {
          'menuContent': {
              templateUrl : 'templates/aboutus.html'
              //,
              //controller  : 'AboutController',
              //controllerAs: 'about'                  
          }
      }
  })

  // // route for the contactus page
  // .state('app.contactus', {
  //     url:'contactus',
  //     views: {
  //         'menuContent': {
  //             templateUrl : 'app/views/contactus.html',
  //             controller  : 'ContactController',
  //             controllerAs: 'contact'                  
  //         }
  //     }
  // })

  // // route for the tech support page
  // .state('app.support', {
  //     url:'support',
  //     views: {
  //         'menuContent': {
  //             templateUrl : 'app/views/support.html',
  //             controller  : 'SupportController',
  //             controllerAs: 'support'                  
  //         }
  //     }
  // })


  // setup an abstract state for the tabs directive
  // .state('app.prodtab', {
  //   url: "/prodtab",
  //   abstract: true,
  //   templateUrl: 'templates/prodtabs.html'
  // })

  // Each tab has its own nav history stack:
  // .state('app.prod-details', {
  //   url: '/product/details',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/prod-details.html'
  //       // ,
  //       // controller: 'ProductController',
  //       // controllerAs: 'product'
  //     }
  //   }
  // })

  // .state('app.prod-alerts', {
  //   url: '/product/alerts',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/prod-alerts.html'
  //       // ,
  //       // controller: 'ProductController',
  //       // controllerAs: 'product'
  //     }
  //   }
  // })

  // .state('app.prod-reviews', {
  //   url: '/product/reviews',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/prod-reviews.html'
  //       // ,
  //       // controller: 'ProductController',
  //       // controllerAs: 'product'
  //     }
  //   }
  // })

   // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
