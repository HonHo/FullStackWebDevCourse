(function() {

  'use strict';

  angular.module('customerFirst.services', ['ngResource'])
  //.constant("baseURL", "https://192.168.1.108:5443/")
  .constant("baseURL", "https://localhost:4443/")
  .factory('manufactFactory', manufactFactory)
  .factory('productFactory', productFactory)  
  .factory('reviewFactory', reviewFactory)
  .factory('alertFactory', alertFactory)
  .factory('myproductFactory', myproductFactory) 
  .factory('myproductDetailFactory', myproductDetailFactory)
  .factory('$localStorage', localStorage)
  .factory('AuthFactory', AuthFactory);

  function manufactFactory($resource, baseURL) {
    return $resource(baseURL + "manufacts/:_id", null, {
        'update': {
            method: 'PUT'
        }
    });

    // For Dev - Begins
      // var fac = {};
      // var manufacts = [
      //   {
      //       name: "Apple",
      //       image: 'images/apple.png',
      //       designation: "Chief Epicurious Officer",
      //       abbr: "CEO",
      //       description: "Apple description..."
      //   },
      //   {
      //       name: "Google",
      //       image: 'images/google.png',
      //       designation: "Executive Chef",
      //       abbr: "EC",
      //       description: "Google description..."
      //   }
      // ];

      // fac.getManufacts = function() {
      //     return manufacts;
      // }

      // return fac;
    // For Dev - Ends
  }

  function productFactory($resource, baseURL) {
    return $resource(baseURL + "products/:_id", null, {
        'update': {
            method: 'PUT'
        } //, 'query':  {method:'GET', isArray:false}
    });
  }

  function myproductFactory($resource, baseURL) {
    return $resource(baseURL + "myproducts/:_id", null, {
        'update': {
            method: 'PUT'
        }
    });
  }

  function myproductDetailFactory($resource, baseURL) {
    return $resource(baseURL + "myproducts/:_id/products/:_prodId", { _id: '@_id', _prodId: '@_prodId' }, {
        'update': {
            method: 'PUT'
          }
          //, 'query':  {method:'GET', isArray:false}
    });
  }

  function reviewFactory($resource, baseURL) {
    return $resource(baseURL + "products/:_id/reviews/:_reviewId", { _id: '@_id', _reviewId: '@_reviewId' }, {
        'update': {
            method: 'PUT'
        }
    });
  }

  function alertFactory($resource, baseURL) {
    return $resource(baseURL + "products/:_id/alerts/:_alertId", { _id: '@_id', _alertId: '@_alertId' }, {
        'update': {
            method: 'PUT'
        }
    });
  }

  function localStorage ($window) {
    return {
      store: function (key, value) {
          $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
      },
      remove: function (key) {
          $window.localStorage.removeItem(key);
      },
      storeObject: function (key, value) {
          //$window.localStorage[key] = JSON.stringify(value);
          $window.localStorage[key] = angular.toJson(value);
      },
      getObject: function (key, defaultValue) {
          //return JSON.parse($window.localStorage[key] || defaultValue);
          return angular.fromJson($window.localStorage[key] || defaultValue);
      }
    }
  }

  function AuthFactory($resource, $http, $localStorage, $rootScope, baseURL, $ionicPopup) {
      
      var authFac = {};
      var TOKEN_KEY = 'Token';
      var isAuthenticated = false;
      var username = '';
      var authToken = undefined;
      
    function loadUserCredentials() {
      var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
      if (credentials.username != undefined) {
        useCredentials(credentials);
      }
    }
   
    function storeUserCredentials(credentials) {
      $localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
    }
   
    function useCredentials(credentials) {
      isAuthenticated = true;
      username = credentials.username;
      authToken = credentials.token;
   
      // Set the token as header for your requests!
      $http.defaults.headers.common['x-access-token'] = authToken;
    }
   
    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      $localStorage.remove(TOKEN_KEY);
    }
       
    authFac.login = function(loginData) {
        
        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;
            
              var message = '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';
            
               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Login Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Login Failed!');
                });
           }
        
        );
    };
    
    authFac.logout = function() {
        //$resource(baseURL + "users/logout").get(function(response){});
        $resource(baseURL + "users/logout").get(function(){});
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseURL + "users/register")
        .save(registerData,
           //function(response) {
            function() {
              authFac.login({username:registerData.username, password:registerData.password});
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';
            
               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Registration Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Registration Failed!');
                });
           }
        
        );
    };
      
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };
    
    authFac.facebook = function() {
        
    };
    
    // Called when app is initialized
    // It restores credentials even you restart the browser and
    // without logout from server.
    loadUserCredentials();
    
    return authFac; 
  }
})();