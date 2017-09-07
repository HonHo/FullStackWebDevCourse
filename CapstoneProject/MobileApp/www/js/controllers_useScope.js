(function() {

    angular.module('customerFirst.controllers', [])
    .controller('AppCtrl', AppController)
    .controller('HomeController', HomeController)
    .controller('ManufactController', ManufactController)
    .controller('ProductController', ProductController)
    .controller('MyProductController', MyProductController)
    .controller('MyProductDetailController', MyProductDetailController)
    ;


    function AppController($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, AuthFactory) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = $localStorage.getObject('userinfo','{}');
        $scope.reservation = {};
        $scope.registration = {};
        $scope.loggedIn = false;
        
        if(AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }
        
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);
            $localStorage.storeObject('userinfo',$scope.loginData);

            AuthFactory.login($scope.loginData);

            $scope.closeLogin();
        };
        
        $scope.logOut = function() {
            console.log('Doing logout')
           AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
        };
          
        $rootScope.$on('login:Successful', function () {
            console.log('Login Successful');
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });
        
        // // Create the login modal that we will use later
        // $ionicModal.fromTemplateUrl('templates/reserve.html', {
        //     scope: $scope
        // }).then(function (modal) {
        //     $scope.reserveform = modal;
        // });

        // // Triggered in the login modal to close it
        // $scope.closeReserve = function () {
        //     $scope.reserveform.hide();
        // };

        // // Open the login modal
        // $scope.reserve = function () {
        //     $scope.reserveform.show();
        // };

        // // Perform the login action when the user submits the login form
        // $scope.doReserve = function () {
        //     console.log('Doing reservation', $scope.reservation);

        //     // Simulate a login delay. Remove this and replace with your login
        //     // code if using a login system
        //     $timeout(function () {
        //         $scope.closeReserve();
        //     }, 1000);
        // };

        // // Create the login modal that we will use later
        // $ionicModal.fromTemplateUrl('templates/register.html', {
        //     scope: $scope
        // }).then(function (modal) {
        //     $scope.registerform = modal;
        // });

        // // Triggered in the login modal to close it
        // $scope.closeRegister = function () {
        //     $scope.registerform.hide();
        // };

        // // Open the login modal
        // $scope.register = function () {
        //     $scope.registerform.show();
        // };

        // // Perform the login action when the user submits the login form
        // $scope.doRegister = function () {
        //     console.log('Doing registration', $scope.registration);
        //     $scope.loginData.username = $scope.registration.username;
        //     $scope.loginData.password = $scope.registration.password;

        //     AuthFactory.register($scope.registration);
        //     // Simulate a login delay. Remove this and replace with your login
        //     // code if using a login system
        //     $timeout(function () {
        //         $scope.closeRegister();
        //     }, 1000);
        // };
           
        // $rootScope.$on('registration:Successful', function () {
        //     $scope.loggedIn = AuthFactory.isAuthenticated();
        //     $scope.username = AuthFactory.getUsername();
        //     $localStorage.storeObject('userinfo',$scope.loginData);
        // });
     
    }

    function HomeController(manufactFactory) {

        console.log('Enter HomeController...');
        var vm = this;

        vm.showManufacts = false;
        vm.message = "Loading...";

        manufactFactory.query()   
          .$promise.then(     
            function (response) {
              vm.manufacts = response;
              vm.showManufacts = true;
              //console.log('manufacts ' + vm.manufacts[0].name);
            },
            function (response) {
              vm.message = "Error: " + response.status + " " + response.statusText;
            }
          );

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

        console.log('Exit HomeController...');
    }

    function ManufactController($stateParams, productFactory, myproductDetailFactory, $log) {

        console.log('Enter ManufactController...');
        var vm = this;

        vm.showProds = false;
        vm.message = "Loading...";

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
            $log.info("Prod to be added (1): " + prodId);
            //myproductDetailFactory.save({_prodId: prodId});
            myproductDetailFactory.update({_id: myprodId, _prodId: prodId});
        }

        console.log('Exit ManufactController...');
    } 

    function ProductController($scope, $state, $stateParams, $ionicPopover, $ionicListDelegate, productFactory, reviewFactory, alertFactory, myproductDetailFactory, $log) {
        
        console.log('Enter ProductController...');
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

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/prod-detail-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        vm.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        vm.closePopover = function () {
            $scope.popover.hide();
        };
        // Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });

        vm.addToMyProducts = function(myprodId, prodId) {
            $log.info("Prod to be added (2): " + prodId);
            //myproductDetailFactory.save({_prodId: prodId});
            myproductDetailFactory.update({_id: myprodId, _prodId: prodId});
            $scope.popover.hide();
        }

        console.log('Exit ProductController...');
    }

    function MyProductController($state, $stateParams, myproductFactory, myproductDetailFactory, reviewFactory, alertFactory, $log) {
        
        console.log('Enter MyProductController...');
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
                        //$log.info('My prod name: ' + vm.products[0].name);
                        //$log.info('Manufact name: ' + vm.products[0].producedBy.name);
                    }
                    vm.showProds = true;
                },
                function (response) {
                    vm.msgProds = "Error: " + response.status + " " + response.statusText;
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
            $scope.popover.hide();
        }

        console.log('Exit MyProductController...');
    }

    function MyProductDetailController($scope, $state, $stateParams, $ionicPopover, $ionicModal, $ionicListDelegate, myproductDetailFactory, reviewFactory, alertFactory, $log) {
        //var vm = this;
        // var indexedManufacts = [];
        //vm.tab = $stateParams.tab;
        //$log.log("Tab: " + vm.tab + ", tabb: " + $stateParams.tab);
        $scope.myproducts = {};
        //vm.products = [];
        $scope.product = null;
        $scope.showProd = false;
        $scope.msgProd = "Loading product...";

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
                        $scope.myproducts = response[0];
                        if ($scope.myproducts.products.length > 0) {
                            $scope.product = $scope.myproducts.products[0];

                            $log.info('Product: ' + $scope.product.name);
                            $scope.showProd = true;
                        } else {
                            $scope.msgProd = '';
                            $scope.msgReviews = '';
                            $scope.msgAlerts = '';
                        }
                    } else {
                        $scope.msgProd = '';
                        $scope.msgReviews = '';
                        $scope.msgAlerts = '';
                    }
                },
                function (response) {
                    $scope.msgProd = "Error: " + response.status + " " + response.statusText;
                }
            );

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/myprod-detail-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };
        // Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });

        $scope.removeFromMyProducts = function(myprodId, prodId) {
            $log.info("Prod to be removed: " + prodId);
            myproductDetailFactory.delete(
                {_id: myprodId, _prodId: prodId}, 
                function() {
                    $state.go($state.current, {}, {reload: true});
                }
            );
            $scope.popover.hide();
        }

        //vm.form = {};
        $scope.myreview = {
            headline: " ",
            rating: 5,
            review : ""
        };

        // ??????????????????????????????????
        $scope.submitReview = function () {
            console.log("submist review 0");
            reviewFactory.save({_id: $stateParams.prodId}, $scope.myreview);

            console.log("submist review 1");

            //$scope.form.reviewForm.$setPristine();
            $scope.closeReviewForm();

            $scope.myreview = {
                headline: " ",
                rating: 5,
                review : ""
            };

            console.log("submist review 2");
            $state.go($state.current, null, {reload: true});
            console.log("submist review 3");
        }

        /////////////////////////////

        // $scope.submitComment = function () {

        //     commentFactory.save({id: $stateParams.id}, $scope.mycomment);

        //     $scope.closeCommentForm();

            
        //     $scope.mycomment = {
        //         rating: 5,
        //         comment: ""
        //     };
            
        //     $state.go($state.current, null, {reload: true});
        // }

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/myprod-review.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.reviewForm = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeReviewForm = function () {
            console.log("here closeReviewForm?");
            $scope.reviewForm.hide();
        };

        // Open the login modal
        $scope.showReviewForm = function () {
            console.log("here showReviewForm?");
            $scope.reviewForm.show();
            $scope.popover.hide();
        };
        /////////////////////////////

        // vm.select = function (setTab) {
        //     vm.tab = setTab;
        // };

        // vm.isSelected = function (checkTab) {
        //     return (vm.tab === checkTab);
        // };


    }

})();
