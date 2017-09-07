(function() {

    angular.module('customerFirst.controllers', [])
    .controller('AppCtrl', AppController)
    .controller('HomeController', HomeController)
    .controller('ManufactController', ManufactController)
    .controller('ProductController', ProductController)
    .controller('MyProductController', MyProductController)
    .controller('MyProductDetailController', MyProductDetailController)
    ;


    function AppController($scope, $state, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, AuthFactory) {

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
            $state.go($state.current, {}, {reload: true});
        };
          
        $rootScope.$on('login:Successful', function () {
            console.log('Login Successful');
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $state.go($state.current, {}, {reload: true});
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

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.registerform = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeRegister = function () {
            $scope.registerform.hide();
        };

        // Open the login modal
        $scope.register = function () {
            $scope.registerform.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doRegister = function () {
            console.log('Doing registration', $scope.registration);
            $scope.loginData.username = $scope.registration.username;
            $scope.loginData.password = $scope.registration.password;

            AuthFactory.register($scope.registration);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeRegister();
            }, 1000);
        };
           
        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $localStorage.storeObject('userinfo',$scope.loginData);
        });
     
    }

    function HomeController(manufactFactory, baseURL) {

        console.log('Enter HomeController...');
        var vm = this;

        vm.baseURL = baseURL;
        vm.showManufacts = false;
        vm.message = "Loading...";
        vm.filterManufact = '';

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

        vm.clearSearch = function() {
            vm.filterManufact = '';
        };

        console.log('Exit HomeController...');
    }

    function ManufactController($stateParams, productFactory, myproductDetailFactory, baseURL, $log) {

        console.log('Enter ManufactController...');
        var vm = this;

        vm.baseURL = baseURL;
        vm.showProds = false;
        vm.message = "Loading...";
        vm.filterProduct = '';

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

        vm.clearSearch = function() {
            vm.filterProduct = '';
        };

        vm.addToMyProducts = function(myprodId, prodId) {
            $log.info("Prod to be added (1): " + prodId);
            //myproductDetailFactory.save({_prodId: prodId});
            myproductDetailFactory.update({_id: myprodId, _prodId: prodId});
        }

        console.log('Exit ManufactController...');
    } 

    function ProductController($scope, $state, $stateParams, $ionicPopover, $ionicListDelegate, productFactory, reviewFactory, alertFactory, myproductDetailFactory, baseURL, $log) {
        
        console.log('Enter ProductController...');
        var vm = this;

        vm.baseURL = baseURL;
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

    function MyProductController($state, $stateParams, $ionicPopup, myproductFactory, myproductDetailFactory, reviewFactory, alertFactory, baseURL, $log) {
        
        console.log('Enter MyProductController...');
        var vm = this;
        var indexedManufacts = [];

        vm.baseURL = baseURL;
        vm.myproducts = {};
        vm.products = [];
        vm.showProds = false;
        vm.msgProds = "Loading product...";
        vm.shouldShowRemove = false;
        vm.searchProduct = '';

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

        vm.clearSearch = function() {
            vm.searchProduct = '';
        };

        vm.productsToShow = function(searchProd) {
            return function(product) {
                if (angular.isUndefined(searchProd)
                    || searchProd === '') {
                    return true;
                }
                return (product.name.toLowerCase().indexOf(searchProd.toLowerCase()) !== -1);
            }
        }

        vm.toggleRemove = function () {
            vm.shouldShowRemove = !vm.shouldShowRemove;
            console.log(vm.shouldShowRemove);
        }
        vm.removeFromMyProducts = function(myprodId, prodId) {
            // $log.info("Prod to be removed: " + prodId);
            // myproductDetailFactory.delete(
            //     {_id: myprodId, _prodId: prodId}, 
            //     function() {
            //         $state.go($state.current, {}, {reload: true});
            //     }
            // );
            // $scope.popover.hide();

            var confirmPopup = $ionicPopup.confirm({
                title: '<h3>Confirm Remove</h3>',
                template: '<p>Are you sure you want to remove this product?</p>'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Ok to remove');

                    // favoriteFactory.delete({id: dishid});
                    // $state.go($state.current, {}, {reload: true});
                    // // $window.location.reload();

                    myproductDetailFactory.delete(
                        {_id: myprodId, _prodId: prodId}, 
                        function() {
                            $state.go($state.current, {}, {reload: true});
                            //$state.go('app.myproducts', null, {location: 'replace'});
                            //$state.transitionTo('app.myproducts', null, { reload: true, inherit: false, notify: true });
                        }
                    );
                } else {
                    console.log('Canceled remove');
                }
            });
            vm.shouldShowDelete = false;
        }

        console.log('Exit MyProductController...');
    }

    function MyProductDetailController($scope, $state, $stateParams, $ionicPopover, $ionicModal, $ionicListDelegate, $ionicPopup, 
        myproductDetailFactory, reviewFactory, alertFactory, $log) {
        var vm = this;
        // var indexedManufacts = [];
        //vm.tab = $stateParams.tab;
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

                            $log.info('Product: ' + vm.product.name);
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
                    vm.msgProd = "Error: " + response.status + " " + response.statusText;
                }
            );

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/myprod-detail-popover.html', {
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
            // $ionicHistory.clearCache();
            // $ionicHistory.clearHistory();
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });

        vm.removeFromMyProducts = function(myprodId, prodId) {
            // $log.info("Prod to be removed: " + prodId);
            // myproductDetailFactory.delete(
            //     {_id: myprodId, _prodId: prodId}, 
            //     function() {
            //         //$state.go($state.current, {}, {reload: true});
            //         $state.go('app.myproducts', null, {location: 'replace'});
            //         //$state.transitionTo('app.myproducts', null, { reload: true, inherit: false, notify: true });
            //     }
            // );
            // $scope.popover.hide();

/////////////////
            //$scope.popover.hide();

            var confirmPopup = $ionicPopup.confirm({
                title: '<h3>Confirm Remove</h3>',
                template: '<p>Are you sure you want to remove this product?</p>'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Ok to remove');

                    // favoriteFactory.delete({id: dishid});
                    // $state.go($state.current, {}, {reload: true});
                    // // $window.location.reload();

                    myproductDetailFactory.delete(
                        {_id: myprodId, _prodId: prodId}, 
                        function() {
                            //$state.go($state.current, {}, {reload: true});
                            $state.go('app.myproducts', null, {location: 'replace'});
                            //$state.transitionTo('app.myproducts', null, { reload: true, inherit: false, notify: true });
                        }
                    );
                } else {
                    console.log('Canceled remove');
                }
            });
            // $scope.shouldShowDelete = false;
/////////////////
        }

        //vm.form = {};
        vm.myreview = {
            headline: "",
            rating: 5,
            review : ""
        };

        // ??????????????????????????????????
        vm.submitReview = function () {
            console.log("submist review 0");
            reviewFactory.save({_id: $stateParams.prodId}, vm.myreview);

            console.log("submist review 1");

            //vm.form.reviewForm.$setPristine();
            vm.closeReviewForm();

            vm.myreview = {
                headline: "",
                rating: 5,
                review : ""
            };

            console.log("submist review 2");
            //$ionicHistory.clearCache();
            $state.go($state.current, {}, {reload: true});
            //$state.go('app.myproduct', {}, {reload: true});
            //$ionicHistory.clearCache().then(function(){ $state.go('app.myproduct').then(function() { $ionicHistory.clearCache() } )});
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
            vm.reviewForm = modal;
        });

        // Triggered in the login modal to close it
        vm.closeReviewForm = function () {
            console.log("here closeReviewForm?");
            vm.reviewForm.hide();
            $scope.popover.hide();
        };

        // Open the login modal
        vm.showReviewForm = function () {
            console.log("here showReviewForm?");
            vm.reviewForm.show();
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
