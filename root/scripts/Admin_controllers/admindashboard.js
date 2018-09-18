
// angular.module('routerApp.dashboardadmin', ['ui.bootstrap', 'toaster']).
// controller('landingadminCtrl', function ($scope, ContactService,$state, toaster, $interval, $modal, $window) {


angular.module('routerApp.dashboardadmin', ['ui.bootstrap', 'toaster']).
  controller('landingadminCtrl', function ($scope, ContactService, $state, toaster, $interval, $modal, $window) {


    var storedNames = JSON.parse(sessionStorage.getItem("names"));
   
    if (storedNames != null && storedNames != undefined) {
    toaster.clear($scope.toast);
    ContactService.usercount(storedNames, function (res) {
      
      toaster.clear($scope.toast);
      if (res.data.status == 'success') {
        $scope.usercountdata = res.data.tokenBalanceInfo.totalUserCount;

        localStorage.setItem("names", JSON.stringify(res.data));
        // $state.go('admin');
      } else if (res.data.status == 'failure') {
        if (res.data.message == 'Session expired!') {
         
          sessionStorage.removeItem('names');
          $scope.toast = toaster.error(res.data.message);
          $state.go('login');

        }

      }
    });

    ContactService.etherbalance(storedNames, function (response) {



      if (response.data.status == 'success') {
        $scope.adminmainbalance = response.data.mainAccountInfo.mainBalance;
        localStorage.setItem("names", JSON.stringify(response.data));
        // $state.go('admin');
      } else if (response.data.status == 'failure') {
        if (response.data.message == 'Session expired!') {
         
          sessionStorage.removeItem('names');
          $state.go('login');

        }

      }

    });

    ContactService.admintokenbalance(storedNames, function (tokenres) {
       // console.log("adminbalance",tokenres);
      if (tokenres.data.status == 'success') {
        
        $scope.totaltokenbalance = tokenres.data.tokenBalanceInfo.TotaltokenBalance;
        $scope.soldtokens = tokenres.data.tokenBalanceInfo.soldTokens;
        $scope.mintTokens = tokenres.data.tokenBalanceInfo.mintedAmount;
        $scope.burnTokens = tokenres.data.tokenBalanceInfo.deleteTokens;
        

        localStorage.setItem("names", JSON.stringify(tokenres.data));
        // $state.go('admin');
      } else if (tokenres.data.status == 'failure') {
        if (tokenres.data.message == 'Session expired!') {
          
          sessionStorage.removeItem('names');
          // toaster.error(res.data.message);
          $state.go('login');

        }

      }
    });


    $scope.logout = function () {

      var modalInstance = $modal.open({
        templateUrl: 'root/views/model/delete.html',
        controller: logoutCtrl

      });
      modalInstance.result.then(function (itemvalue) {

        ContactService.deletesession(storedNames, function (res) {

          var response = res.data;
          if (response.status == 'success') {

            toaster.success(response.message);
            $state.go('login');

          } else if (response.status == 'failure') {

            $scope.sessionToast = toaster.error(response.message);

            $state.go('login');
          }

        });
      });
    }

    $scope.delete = function () {
      var modalInstance = $modal.open({
        templateUrl: 'root/views/model/pop.html',
        controller: DeleCtrl

      });

      modalInstance.result.then(function (itemvalue) {
        ContactService.deleteToken(itemvalue, storedNames, function (res) {

          var response = res.data;
          if (response.status == 'success') {
            toaster.success(response.message);
             setTimeout(function(){  $window.location.reload(true); }, 3000);
            // $state.go('admin');
            // $window.location.reload(true);
          } else if (response.status == 'failure') {
            toaster.error(response.message);
            $state.go('admin');
          }

        });
      });
    }

    $scope.tokentransfer = function (valid, patten) {
      toaster.clear($scope.tokentost);
      if (valid) {
        ContactService.admintokenTransfer($scope.tokendata, storedNames, function (res) {
          var response = res.data;
          if (response.status == 'success') {
            toaster.success(response.message);
            // $state.go('dashboard');
            setTimeout(function(){  $window.location.reload(true); }, 3000);
            
            // $window.location.reload(true);
          } else if (response.status == "failure") {
            if (response.message == "Session expired!") {
              
              sessionStorage.removeItem('names');
              $scope.tokentost = toaster.error(response.message);
              $state.go('login');
            } else if (response.status == "failure") {
              $scope.tokentost = toaster.error(response.message);

            }

          }
        });
      }
      else {
        if (patten) {
          $scope.tokentost = toaster.error("Please Enter Valid Amount");
        }
        $scope.submitted = true;
      }
    }


    $scope.mint = function () {
      var modalInstance = $modal.open({
        templateUrl: 'root/views/model/mintpop.html',
        controller: mintCtrl

      });

      modalInstance.result.then(function (itemvalue) {
        ContactService.mintToken(itemvalue, storedNames, function (res) {
         
          var response = res.data;
          if (response.status == 'success') {
            toaster.success(response.message);
            setTimeout(function(){  $window.location.reload(true); }, 3000);
            // $state.go('admin');
            // $window.location.reload(true);
          } else if (response.status == 'failure') {
            toaster.error(response.message);
            $state.go('admin');
          }

        });
      });
    }


    } else {
      $state.go("login");
    }

  });

  var DeleCtrl = function ($scope, $rootScope, $modalInstance, toaster) {
      $scope.ok = function (valid, val) {
        toaster.clear($scope.tokentost);
        if (valid) {
          $modalInstance.close(val);
    
        } else {
          toaster.error("Please Enter Token Count");
        }
    
      };
    
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };
    
    var mintCtrl = function ($scope, $rootScope, $modalInstance, toaster) {
      
      
        $scope.ok = function (valid, val) {
          toaster.clear($scope.tokentost);
          if (valid) {
            $modalInstance.close(val);
      
          } else {
            toaster.error("Please Enter Token Balance");
          }
      
        };
      
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };
var logoutCtrl = function ($scope, $rootScope, $modalInstance, toaster) {


  $scope.ok = function () {

    $modalInstance.close();

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
