
var app = angular.module('routerApp', ['ui.router','angular-page-loader',
    'myApp.services',
    'routerApp.logincontroller',
    'routerApp.newcontroller',
    'routerApp.equazonecontroller',
    'routerApp.controllers',
    'routerApp.dashboardadmin',
    'routerApp.lancontroller',
    'routerApp.tranlist','routerApp.admintranlist','treasure-overlay-spinner','ngAnimate','routerApp.equaadmin'
]);


app.run(["$rootScope", "$location", 'Auth', '$window', '$state','$timeout', function ($rootScope, $location, Auth, $window, $state,$timeout) {
    var data = Auth.getUserInfo();
    if(data == null || data == undefined){
        // $window.location.href = '#/login';
       $location.path("/login");
    } 
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        var data = Auth.getUserInfo();
        
        if (data == null || data == undefined) {
            // $state.transitionTo("login");
            $location.path("/login");
        }
    
		if(window.event.clientX < 40 && window.event.clientY < 0)
        {
             alert("Browser back button is clicked...");
        }
        else
        {
             alert("Browser refresh button is clicked...");
        }
       
    })
	/* $rootScope.isLoading = true;
	$timeout(function() { // simulate long page loading 
        $rootScope.isLoading = false; // turn "off" the flag 
    }, 500) */
	
	 
   
    $rootScope.spinner = {
        active: false,
        on: function () {
            this.active = true;
        },
        off: function () {
            this.active = false;
        }
    };

    $rootScope.$on("$stateChangeStart", function (event, current, previous, x) {
        $rootScope.spinner.on();
        
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      
        
        $rootScope.spinner.active = false;
    });
	/* 
      $rootScope.spinner = {
        active: false,
        on: function () {
          this.active = true;
        },
        off: function () {
          this.active = false;
        }
      }; */
	/*   $rootScope.isLoading = true;

  // simulate long page loading
  $timeout(function() {

    // turn "off" the flag
    $rootScope.isLoading = false;

  }, 3000) */

}])
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================

        .state('login', {
            url: '/login',
            templateUrl: 'root/views/Login/login.html',
            controller: 'loginCtrl'
        })

        .state('signup', {
            url: '/signup',
            templateUrl: 'root/views/Login/register.html',
            controller: 'loginCtrl'
        })
        .state('landing', {
            url: '/landing',
            templateUrl: 'root/views/Login/userdashboard.html',
            controller: 'lanCtrl'

        })
        .state('equazone', {
            url: '/equazone',
            templateUrl: 'root/views/Login/equazone.html',
            controller: 'equazoneCtrl'

        })

        .state('support', {
            url: '/support',
            templateUrl: 'root/views/Login/support.html',
            controller: 'newCtrl'

        })
        .state('send', {
            url: '/send',
            templateUrl: 'root/views/Login/sendether.html',
            controller: 'newCtrl'

        })
       


        .state('mytransaction', {
            url: '/mytransaction',
            templateUrl: 'root/views/Login/mytransactionlist.html',
            controller: 'transactionListCtrl'
            // controller:  function($scope){
            //     console.log("coi");
            //     $scope.data ='name';
            //   }    
        })   
        .state('admin', {
            url: '/admin/dashboard',
            templateUrl: 'root/views/admin/admin.html',
            controller: 'landingadminCtrl'

        })
        .state('admintransaction', {
            url: '/admin/transactionlist',
            templateUrl: 'root/views/admin/adminTransactions.html',
            controller: 'adminListCtrl'

        })
        .state('mint', {
            url: '/admin/mintList',
            templateUrl: 'root/views/admin/mintList.html',
            controller: 'adminListCtrl'

        })
        .state('adminequazone', {
            url: '/admin/adminequazone',
            templateUrl: 'root/views/admin/adminequazone.html',
            controller: 'equazoneadminCtrl'
            // controller:  function($scope){
            //     console.log("coi");
            //     $scope.data ='name';
            //   }    
        })   
        ;

}).factory('httpInterceptor', function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return $q.reject(response);
        }
    };
}).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]).directive("filesInput", function() {
  return {
    require: "ngModel",
    link: function postLink(scope,elem,attrs,ngModel) {
      elem.on("change", function(e) {
        var files = elem[0].files;
        ngModel.$setViewValue(files);
      })
    }
  }
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}).config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            request: function (config) {
                $rootScope.spinner.on();
                return config
            },
            response: function (response) {
                $rootScope.spinner.off();
                return response
            },
            responseError: function (response) {
                $rootScope.spinner.off();
                return response
            },
            requestError: function (response) {
                $rootScope.spinner.off();
                return response
            }
        }
    })
})
