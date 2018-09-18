angular.module('routerApp.lancontroller', ['toaster']).
  controller('lanCtrl', function ($scope, ContactService, $state, $rootScope, $window, $modal, $log, toaster) {
    var storedNames = JSON.parse(sessionStorage.getItem("names"));
    var successToast = false;
    $scope.rangevalue = '';
    $scope.coindata = {};
    $scope.name = $rootScope.loginInfo;
    $scope.pop = {}
    $scope.testpop = true;
    $scope.recentTransactions = [];
    var storedNames = JSON.parse(sessionStorage.getItem("names"));
    if (storedNames) {
      var storeddata = storedNames.loginInfo;
    }

    if (storedNames) {
      var email = storedNames.loginInfo.userName;
      $scope.name = email.substring(0, email.lastIndexOf("@"));

    }
  
    $scope.reload = function () {
      /* var data = {
        walletAddress: storedNames.loginInfo.walletAddress,
        sessionId: storedNames.loginInfo.id
    } */
      ContactService.getusertransaction(storedNames, function (user) {

        var usertransaction = user.data;
        if (usertransaction) {

          $scope.listToken = usertransaction.listToken;
          var list = $scope.listToken.map((utransaction, key) => {            
              if($scope.recentTransactions.length <6){
                $scope.recentTransactions.push(utransaction);
              }
             
              
                return $scope.recentTransactions
          })

          sessionStorage.setItem('transactionlist', JSON.stringify($scope.listToken));

        }
      });

    }

    if (storedNames != undefined && storedNames != null) {
      ContactService.balancewallet(storeddata, function (walldata) {
        toaster.clear($scope.toastError);
        if (walldata.data) {
          if (walldata.data.tokenBalanceInfo) {
            var walletamount = walldata.data;
            sessionStorage.setItem('walletbal', JSON.stringify(walldata.data));
            
            $scope.walletBalance = walletamount.tokenBalanceInfo.mainBalance;
          } else if (walldata.data.status == 'failure') {

            $scope.toastError = toaster.error(walldata.data.message);
            $state.go("login");

          }

        }


      });
    } else {
      $state.go('login');

    }

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

    if (storedNames) {
      $scope.walletAddress = storedNames.loginInfo.walletAddress;
      $scope.walletBalance = storedNames.loginInfo.walletBalance;
    }


    if (storedNames != undefined && storedNames != null) {

      ContactService.tokenbalance(storeddata, function (walldata) {
        if (walldata.data) {
          if (walldata.data.tokenBalanceInfo) {
            sessionStorage.setItem('tokenbal', JSON.stringify(walldata.data));
            $scope.tokenbalance = walldata.data.tokenBalanceInfo.tokenBalance;
            $scope.reload();
          }


        }


      });


    } else {
      $state.go('login');
    }



    $scope.purchase = function (valid, item, pattern, balance) {
      toaster.clear($scope.regToaster);
      var message = "Are You Sure ?";
      $scope.valnew = Math.round(item / 0.00144);
      var minEthbalance = 0.1;
      if (valid && item >= 50) {
        if (balance > minEthbalance) {
          var modalInstance = $modal.open({
            templateUrl: 'root/views/model/tokenpop.html',
            controller: ModalInstanceCtrl,
            resolve: {
              itemvalue: function () {
                return {
                  amount: $scope.coindata.amount,
                  testpop: $scope.testpop,
                  storedNames: storedNames
                };
              }

            }
          });

          
        }
        else {
          toaster.error('Invalid Ether Amount Minimum Value Should be 0.12 ETH');
        }

      } else {
        if (pattern) {
          $scope.regToaster = toaster.error('Please Enter Valid EQC Value');
        } else {
          $scope.regToaster = toaster.error('Please Enter minimum 50 EQC');

        }
        $scope.submitted = true;
      }



    };




  });

var ModalInstanceCtrl = function ($scope,$state, $window, $rootScope, $modalInstance, itemvalue, toaster, ContactService) {
  var total = itemvalue.amount;
  var totalval = total * 0.00144;
  var finalval = totalval.toFixed(5);
  $scope.value = itemvalue.amount;
  $scope.finalval = finalval;
  toaster.clear($scope.successTost);
  $scope.ok = function (valid, wall) {
    toaster.clear($scope.successTost);
    
    itemvalue.walletPassword = wall;
    if (valid) {
      $scope.tokenErrormessage = '';

      // $modalInstance.close(itemvalue);
      ContactService.tokenTransfer(itemvalue, itemvalue.storedNames.loginInfo, function (res) {
        if (res.data.status == 'success') {
          toaster.success(res.data.message);
          var tokenamount = res.data;
          // if (tokenamount) {
          //   $scope.mainBalance = tokenamount.tokenBalanceInfo.mainBalance;

          // }
          $modalInstance.close(itemvalue)
          $scope.testing = "true";
         
         
          setTimeout(function () { $window.location.reload(true); }, 3000);
          // $window.location.reload(true);
          // reload: true
        } else if (res.data.status == "failure") {
          toaster.error(res.data.message);
          if (res.data.message == "Session expired!") {
            toaster.error(res.data.message);
            $state.go("login");

          } 
          // else {

          //   if (res.data.status == "failure") {
          //     if (res.data.message == "Session expired!") {
          //       $scope.tokenErrormessage = '';
          //     } else {
          //       $scope.tokenErrormessage = res.data.message;
          //     }

          //     $scope.testpop = false;
          //     // toaster.error(res.data.message);
          //   }

          // }

        }
      });

    } else {
      toaster.clear($scope.successTost);
      $scope.successTost = toaster.error('Please Enter Wallet Password');


      $scope.submitted = true;
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

