angular.module('routerApp.admintranlist', ['toaster']).
    controller('adminListCtrl', function ($scope, ContactService, $state, toaster, $interval, $window, $modal) {

        var storedNames = JSON.parse(sessionStorage.getItem("names"));
        if (storedNames != null && storedNames != undefined) {
                /* var data = {
                    walletAddress: "0x680b926Dd2D75eD1F9fB196116Ad0660AdA10Ff9",
                    sessionId: storedNames.loginInfo.id
                } */
        
            ContactService.getusertransaction(storedNames, function (user) {
                var usertransaction = user.data;
                if (user.status == 200) {
                    var transactionlList = usertransaction.listToken;
                    $scope.itemsPerPage = 10;
                    $scope.currentPage = 0;
                    $scope.transactionlLists = transactionlList;
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

                        return Math.ceil($scope.transactionlLists.length / $scope.itemsPerPage) - 1;
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

                } else if (usertransaction.status == 'failure') {
                    toaster.error(usertransaction.message);
                    $state.go("login");
                }
            });

        } else {
            $state.go("login");
        }
        //mint List
        if (storedNames != null && storedNames != undefined) {
            ContactService.mintTokenList(storedNames, function (response) {
                var mintList = response.data;
                if (response.status == 200) {
                    var minttransactionlList = mintList.mintToken;
                    $scope.itemsPerPage = 10;
                    $scope.currentPage = 0;
                    $scope.datalists = minttransactionlList;
                    $scope.range = function () {
                        var rangeSize = minttransactionlList.length >= 30 ? 4 : 1;
                        if (minttransactionlList.length > 30)
                            rangeSize = 4;
                        else if (minttransactionlList.length <= 10)
                            rangeSize = 1;
                        else
                            rangeSize = Math.ceil(minttransactionlList.length / 10);

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

                } else if (mintList.status == 'failure') {
                    toaster.error(mintList.message);
                    $state.go("login");
                }
            });

        } else {
            $state.go("login");
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
var logoutCtrl = function ($scope, $rootScope, $modalInstance, toaster) {


    $scope.ok = function () {

        $modalInstance.close();

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};