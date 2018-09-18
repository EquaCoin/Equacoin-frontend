angular.module('routerApp.equaadmin', ['toaster']).
  controller('equazoneadminCtrl', function ($scope, ContactService, $state, $rootScope, $window, $modal, $log, toaster) {
    var storedNames = JSON.parse(sessionStorage.getItem("names"));
    if (storedNames) {
      var storeddata = storedNames.loginInfo;
    }
    $scope.adminproplist = [];
    $scope.callpagination = function (list) {
      $scope.datalists = list;
      transactionlList = list;
      $scope.itemsPerPage = 10;
      $scope.currentPage = 0;
      $scope.range = function () {
        var rangeSize = transactionlList.length >= 30 ? 4 : 1;
        if (transactionlList.length > 30)
          rangeSize = 4;
        else if (transactionlList.length <= 10)
          rangeSize = 1;
        else
          rangeSize = Math.ceil(transactionlList.length / 10);

        var ps = [];
        var start;

        start = $scope.currentPage;
        if (start > $scope.pageCount() - rangeSize) {
          start = $scope.pageCount() - rangeSize + 1;
        }

        for (var i = start; i < start + rangeSize; i++) {
          ps.push(i);
        }
        return ps;
      };

      $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        }
      };

      $scope.DisablePrevPage = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
      };

      $scope.pageCount = function () {

        return Math.ceil($scope.datalists.length / $scope.itemsPerPage) - 1;
      };

      $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
          $scope.currentPage++;
        }
      };

      $scope.DisableNextPage = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
      };

      $scope.setPage = function (n) {
        $scope.currentPage = n;
      };


    }
    if (storedNames != undefined && storedNames != null) {
      ContactService.getadminpropList(storeddata, function (list) {
        if (list.data.status == 'success') {
          $scope.adminproplist = list.data.crowdSaleProposalLists;

          $scope.callpagination($scope.adminproplist);
        } else if (list.data.status == 'failure') {

          toaster.error(list.data.message);

          if (list.data.message == "Session expired!") {
            $state.go("login");

          }

        }

      });
    } else {
      $state.go('login');

    }




    $scope.viewproposal = function (details) {
      var modalInstance = $modal.open({
        templateUrl: 'root/views/model/viewproposal.html',
        controller: viewCtrl,
        resolve: {
          itemvalue: function () {
            return {
              viewdata: details

            };
          }

        }
      });

    }

    $scope.acceptprop = function (data) {

      var info = {
        "proposalNumber": data.proposalId,
        "accepted": true,
        "sessionId": storeddata.id

      }
      ContactService.acceptproposal(info, function (res) {
        if (res.data.status == 'success') {
          toaster.success(res.data.message);
          setTimeout(function () {
            $window.location.reload();
          }, 3000);
        } else if (res.data.status == 'failure') {

          toaster.error(res.data.message);

          if (res.data.message == "Session expired!") {
            $state.go("login");

          }

        }


      })


    }
    $scope.regectproposal = function (data) {

      var info = {
        "proposalNumber": data.proposalId,
        "accepted": false,
        "sessionId": storeddata.id

      }
      ContactService.acceptproposal(info, function (res) {
        if (res.data.status == 'success') {
          toaster.success(res.data.message);
          setTimeout(function () {
            $window.location.reload();
          }, 3000);
        } else if (res.data.status == 'failure') {
          setTimeout(function () {
            $window.location.reload();
          }, 3000);
          toaster.success(res.data.message);

          if (res.data.message == "Session expired!") {
            $state.go("login");

          }

        }
      })


    }
    $scope.logout = function () {

      var modalInstance = $modal.open({
        templateUrl: 'root/views/model/delete.html',
        controller: logoutCtrl

      });
      modalInstance.result.then(function (itemvalue) {

        ContactService.deletesession(storedNames, function (res) {


          var response = res.data;

          if (response == null) {
            $state.go('login');
          }
          else if (response.status == 'success') {

            toaster.success(response.message);
            $state.go('login');

          } else if (res.status == 'failure') {
            toaster.error(response.message);

            $state.go('login');
          }

        });
      });
    }

  })
var viewCtrl = function ($scope, $window, $rootScope, $modalInstance, itemvalue, toaster, ContactService) {

  $scope.proposal = itemvalue.viewdata;

  $scope.proposal.startDate = new Date(itemvalue.viewdata.startDate);
  $scope.proposal.endDate = new Date(itemvalue.viewdata.endDate);

  $scope.cancel = function () {
    $modalInstance.close();
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