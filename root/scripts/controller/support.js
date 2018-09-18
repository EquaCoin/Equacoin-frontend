var app = angular.module('routerApp.newcontroller', ['toaster']);
app.controller('newCtrl', function ($scope, ContactService, $state, $rootScope, $window, toaster, $modal) {
  $scope.message = {};
  var storedNames = JSON.parse(sessionStorage.getItem("names"));
  if (storedNames) {
    var storeddata = storedNames.loginInfo;
  }
  var walletbalanceinfo = JSON.parse(sessionStorage.getItem("walletbal"));
 
  if(walletbalanceinfo !=''){
    $scope.walletbalanceTotal =  walletbalanceinfo.tokenBalanceInfo.mainBalance;
  }
  var tokenbalanceinfo = JSON.parse(sessionStorage.getItem("tokenbal"));
  if(tokenbalanceinfo !=''){
    $scope.tokenbalanceTotal =  tokenbalanceinfo .tokenBalanceInfo.tokenBalance;
  }
 
  $scope.puschaseCoin = {};
  $scope.transation = [
    {
      "id": "0",
      "value": "ETHER",
    }, {
      "id": "1",
      "value": "EQC"
    }];
  $scope.puschaseCoin.transType = $scope.transation[0];

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
  $scope.submitcontent = function (valid, message) {

    if (valid) {
      var data = {
        sessionId: storeddata.id,
        subject: message.subject,
        content: message.content
      }
      ContactService.supportapi(data, function (res) {
        if (res.data.status == "success") {
          toaster.success(res.data.message);
          setTimeout(function () { $window.location.reload(); }, 3000);

        } else if (res.data.status == "failure") {
          toaster.error(res.data.message);

          if (res.data.message == "Session expired!") {
            $state.go("login");

          }
        }
      });
    }


  }

 
  $scope.submitether = function (valid, val) {

    if (valid) {
      if (val.transType.id == 0) {
        var data = {
          sessionId: storeddata.id,
          toAddress: val.toAddress,
          amount: val.amount,
          walletPassword: val.wallPassword,
          transactionId: val.transType.id

        }
      } else if (val.transType.id == 1) {

        var data = {
          sessionId: storeddata.id,
          toAddress: val.toAddress,
          requestToken: val.amount,
          walletPassword: val.wallPassword,
          transactionId: val.transType.id


        }
      }

      ContactService.ethersubmit(data, val.transType.id, function (res) {
        if (res.data.status == "success") {
          toaster.success(res.data.message);
          setTimeout(function () { $window.location.reload(); }, 3000);

        } else if (res.data.status == "failure") {
          toaster.error(res.data.message);

          if (res.data.message == "Session expired!") {
            $state.go("login");

          }
        }
      });



    }


  }



});


var logoutCtrl = function ($scope, $rootScope, $modalInstance, toaster) {


  $scope.ok = function () {

    $modalInstance.close();

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
