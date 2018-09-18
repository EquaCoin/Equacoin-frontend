angular.module('routerApp.equazonecontroller', ['toaster']).
  controller('equazoneCtrl', function ($scope, ContactService, $state, $rootScope, $state, $window, $modal, $log, toaster) {
    var storedNames = JSON.parse(sessionStorage.getItem("names"));

    var walletbalanceinfo = JSON.parse(sessionStorage.getItem("walletbal"));
    if(walletbalanceinfo !=''){
      $scope.walletbalanceTotal =  walletbalanceinfo.tokenBalanceInfo.mainBalance;
    }
    var tokenbalanceinfo = JSON.parse(sessionStorage.getItem("tokenbal"));
    if(tokenbalanceinfo !=''){
      $scope.tokenbalanceTotal =  tokenbalanceinfo .tokenBalanceInfo.tokenBalance;
    }

    if (storedNames) {
      var storeddata = storedNames.loginInfo;
    }
    
    
     
    $scope.ownlist = true;
    $scope.showall = false;
    $scope.selectedItem = { name: 'Select Category ', id: 0 };
    $scope.items = [
      { name: 'Select Category ', id: 0 },
    ]

    //second filter
    $scope.secondfilter = { name: 'Select Proposal ', id: 0 };
    $scope.secondfilteritems = [
      { name: 'Select Proposal ', id: 0 },
      { name: 'All', id: 1 },
      { name: 'Proposal By Me', id: 2 },
      { name: 'Proposal By Others', id: 3 }
    ]


    $scope.thirdFilter = { name: 'Select Status ', id: 0 };
    $scope.thirdFilteritems = [
      { name: 'Select Status ', id: 0 },
      { name: 'Won ', id: 1 },
      { name: 'Fail', id: 2 }

    ]
    //array list

    $scope.ownproposalList = [];
    $scope.allList = [];
    $scope.otherpropList = [];
    if (storedNames != undefined && storedNames != null) {

      $scope.createproposal = function () {
        var modalInstance = $modal.open({
          templateUrl: 'root/views/model/delete.html',
          controller: createpropCtrl

        });
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

      $scope.createproposal = function () {
        var modalInstance = $modal.open({
          templateUrl: 'root/views/model/createproposal.html',
          controller: createproposalCtrl

        });

      }

    } else {
      $state.go('login');

    }

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
      ContactService.ownlistproposal(storeddata, function (list) {
        if (list.data.status == 'success') {
          $scope.ownproposalList = list.data.crowdSaleProposalLists;
          var dataobj = { name: '', id: '' };
          if ($scope.ownproposalList.length > 0) {
            var list = $scope.ownproposalList.map((catlist, key) => {
              if (catlist.ProposalCategory) {
                dataobj = { name: catlist.ProposalCategory, id: $scope.items.length + 0 };
                $scope.items.push(dataobj);


              }
              return $scope.items
            })
          }




          $scope.callpagination($scope.ownproposalList);
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


    $scope.fun = function (val) {

      if (storedNames != undefined && storedNames != null) {

        if (val.id == 0) {
          $window.location.reload();

        } else {
          $scope.showall = true;
          $scope.ownlist = false;
          var sessiondata = {
            sessionId: storeddata.id,
            type: val.name
          }
          ContactService.categoryproposal(sessiondata, function (list) {
            $scope.allList = list.data.crowdSaleProposalLists;
            $scope.callpagination($scope.allList);
          })
        }
      } else {
        $state.go('login');

      }

    }

    $scope.funproposal = function (info) {
      if (storedNames != undefined && storedNames != null) {

        if (info.id == 3) {
          $scope.showall = false;
          $scope.ownlist = true;

          var sessiondata = {
            sessionId: storeddata.id,
            walletaddress: storeddata.walletAddress
          }
          ContactService.getOtherproplist(sessiondata, function (list) {
            if (list.data.status == 'success') {
              $scope.ownproposalList = list.data.crowdSaleProposalLists;
              $scope.callpagination($scope.ownproposalList);
            } else if (list.data.status == 'failure') {
              if (list.data.message == "Session expired!") {
                $state.go("login");

              }

            }

          });

        } else if (info.id == 1) {
          $scope.ownlist = false;
          $scope.showall = true;
          ContactService.allproposallist(storeddata, function (list) {
            if (list.data.status == 'success') {
              $scope.allList = list.data.crowdSaleProposalLists;
              $scope.callpagination($scope.allList);
            } else if (list.data.status == 'failure') {
              if (list.data.message == "Session expired!") {
                $state.go("login");

              }

            }

          });

        } else if (info.id == 2) {
          $scope.showall = false;
          $scope.ownlist = true;

          ContactService.ownlistproposal(storeddata, function (list) {
            if (list.data.status == 'success') {
              $scope.ownproposalList = list.data.crowdSaleProposalLists;
              var dataobj = { name: '', id: '' };
              if ($scope.ownproposalList.length > 0) {
                var list = $scope.ownproposalList.map((catlist, key) => {
                  if (catlist.ProposalCategory) {
                    dataobj = { name: catlist.ProposalCategory, id: $scope.items.length + 0 };
                    $scope.items.push(dataobj);

                  }
                  return $scope.items
                })
              }

              $scope.callpagination($scope.ownproposalList);
            } else if (list.data.status == 'failure') {

              toaster.error(list.data.message);

              if (list.data.message == "Session expired!") {
                $state.go("login");

              }

            }

          });


        }
      } else {
        $state.go('login');

      }

    }

    $scope.funwon = function (wontype) {

      if (storedNames != undefined && storedNames != null) {
        if (wontype.id == 1) {
          $scope.showall = true;
          $scope.ownlist = false;
          ContactService.wonlistproposal(storeddata, function (wonres) {
            if (wonres.data.status == 'success') {
              $scope.allList = wonres.data.crowdSaleProposalLists;
              $scope.callpagination($scope.allList);
            } else if (wonres.data.status == 'failure') {
              if (wonres.data.message == "Session expired!") {
                $state.go("login");

              }

            }

          })

        } else if (wontype.id == 2) {
          ContactService.faillistproposal(storeddata, function (failres) {
            if (failres.data.status == 'success') {
              $scope.allList = failres.data.crowdSaleProposalLists;
              $scope.callpagination($scope.allList);
            } else if (failres.data.status == 'failure') {
              if (failres.data.message == "Session expired!") {
                $state.go("login");

              }

            }

          })

        }

      } else {
        $state.go('login');

      }


    }

    $scope.likebutton = function (val) {

      var infodata = {
        "proposalNumber": val.proposalId,
        "voted": true,
        "sessionId": storeddata.id

      }

      
      ContactService.likeproposal(infodata, function (res) {
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

    $scope.dislikebutton = function (val) {

      var infodata = {
        "proposalNumber": val.proposalId,
        "voted": false,
        "sessionId": storeddata.id

      }

      
      ContactService.likeproposal(infodata, function (res) {

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

    $scope.proposalview = function (details) {
     
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

  });

var logoutCtrl = function ($scope, $rootScope, $modalInstance, toaster) {

  $scope.ok = function () {

    $modalInstance.close();

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var createproposalCtrl = function ($scope, $rootScope, $modalInstance, $window, toaster, $state, ContactService, $filter) {
  var storedNames = JSON.parse(sessionStorage.getItem("names"));

  $scope.proposal = {};
  $scope.proposal.proposalCreatedBy = storedNames.loginInfo.walletAddress;
  $scope.transation = [
    {
      "id": "0",
      "value": "ETH",
    }, {
      "id": "1",
      "value": "EQUA"
    }];
  $scope.proposal.transType = $scope.transation[0];
  $scope.proposal.startDate = new Date();
  $scope.selsectfile = function(files){
   
    $scope.selectedFile = files[0].name;
  }
$scope.currentdate = $filter('date')(new Date(), 'yyyy-MM-dd');
  $scope.ok = function (valid, proposal, fileArray) {
   
    


    var date =  new Date();
    toaster.clear();
    var session = storedNames.loginInfo.id;
    if (valid) {
      var start = $filter('date')(proposal.startDate, 'dd/MM/yyyy');
      var end = $filter('date')(proposal.endDate, 'dd/MM/yyyy');
      var currentdate = $filter('date')(date, 'dd/MM/yyyy');

      if(start == currentdate){
       
      }else if(start > currentdate){
       
        
      }else{
       
        
      }

      

      var proposalInfo = {
        "proposalTitle": proposal.proposalTitle,
        "proposalCategory": proposal.proposalCategory,
        "proposalAmount": proposal.proposalAmount,
        "proposalCreatedBy": storedNames.loginInfo.walletAddress,
        "proposalDetails": proposal.proposalDetails,
		 "proposalDetailsLink":proposal.proposalDetailsLink,
        "sessionId": session,
        "approve": 0,
        "reject": 0,
        "paymentMode": proposal.transType.value,
        "startDates": start,
        "endDates": end
      };

       if((start == currentdate) || (start > currentdate)){
      if(new Date(proposal.endDate) > new Date(proposal.startDate)){
      ContactService.createproposal(proposalInfo, fileArray[0], function (res) {
        if (res.data.status == "success") {
          toaster.success(res.data.message);
          setTimeout(function () { $window.location.reload(true); }, 3000);
          $modalInstance.close();

        } else if (res.data.status == "failure") {
          toaster.error(res.data.message);
          if (res.data.message == "Session expired!") {
            toaster.error(res.data.message);
            $state.go("login");

          }
        }

      });

      }else{
        toaster.error("End Date should be greater than start date");

      }
    }else{
      toaster.error("Start Date should not be lesser than today date");

    }
    }

    // $modalInstance.close();

  };
  $scope.cancel = function () {
    // $modalInstance.dismiss('cancel');
    $modalInstance.close();
  };
};


var viewCtrl = function ($scope, $window, $rootScope, $modalInstance, itemvalue, toaster, ContactService) {
 
  $scope.proposal = itemvalue.viewdata;
 
  // $scope.proposal.startDates = new Date(itemvalue.viewdata.startDate);
  // $scope.proposal.endDates = new Date(itemvalue.viewdata.endDate);

  $scope.cancel = function () {
  
    $modalInstance.close();
  };

};

angular.module('routerApp.equazonecontroller').filter('pagination', function () {
  return function (input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});