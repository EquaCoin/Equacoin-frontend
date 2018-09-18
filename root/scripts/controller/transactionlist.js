angular.module('routerApp.tranlist', ['toaster']).
  controller('transactionListCtrl', function ($scope, ContactService, $state, toaster, $interval, $window, $modal) {

    var storedNames = JSON.parse(sessionStorage.getItem("names"));
    if(storedNames != null && storedNames!=undefined){

      var walletbalanceinfo = JSON.parse(sessionStorage.getItem("walletbal"));
     
      if(walletbalanceinfo !=''){
        $scope.walletbalanceTotal =  walletbalanceinfo.tokenBalanceInfo.mainBalance;
      }
      var tokenbalanceinfo = JSON.parse(sessionStorage.getItem("tokenbal"));
      if(tokenbalanceinfo !=''){
        $scope.tokenbalanceTotal =  tokenbalanceinfo .tokenBalanceInfo.tokenBalance;
      }

      /* var data = {
        walletAddress: storedNames.loginInfo.walletAddress,
        sessionId: storedNames.loginInfo.id
    }
    console.log("data",data); */
   
       ContactService.getusertransaction(storedNames, function (user) {
              var usertransaction = user.data;
              if (user.status == 200) {
      
                var transactionlList = usertransaction.listToken;
                // sessionStorage.setItem('transactionlist', JSON.stringify($scope.listToken));
                // var transactionlList = JSON.parse(sessionStorage.getItem("transactionlist"));
                $scope.itemsPerPage = 10;
                $scope.currentPage = 0;
                $scope.datalists = transactionlList;
                $scope.range = function () {
                  var rangeSize = transactionlList.length >=30 ? 4 : 1;
                  // console.log('range size',rangeSize)
                  // if(rangeSize > 1 && rangeSize < 5)
                  // rangeSize = rangeSize != 0 && rangeSize > 0 ? rangeSize : 1 ;
                  if(transactionlList.length > 30)
                   rangeSize = 4;
                   else if(transactionlList.length <= 10)
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
      
              }else if(usertransaction.status == 'failure'){
                toaster.error(usertransaction.message);
                $state.go("login");
              }
            });
    // $scope.showData = function () {
      

    // }

  } else{
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
         
          if(response == null){
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
angular.module('routerApp.tranlist').filter('pagination', function () {
  return function (input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});