var app = angular.module('routerApp.logincontroller', ['toaster']);
app.controller('loginCtrl', function ($scope, ContactService, $state, $rootScope, $window, toaster, $modal) {
    $scope.datauser = {};
     $scope.loading = true;
     var res = null;
    //  sessionStorage.setItem('names', JSON.stringify(res));
    //  var storedNames = JSON.parse(sessionStorage.getItem("names"));
    $scope.loginsubmit = function (valid, user) {
        $scope.val = 'true';
        if (valid) {
            toaster.clear($scope.tost);
            ContactService.signin(user, function (res) {
               
                if (res.data.status == 'success') {
                    $scope.checkError = false;
                   
                    sessionStorage.setItem('names', JSON.stringify(res.data));
					 $scope.loading = false;
                    $scope.val = 'false';
                    if(res.data.loginInfo.type == 0){
						 toaster.success(res.data.message)
                        $state.go("landing", { reload: true });

                    }else if(res.data.loginInfo.type == 1){
						 toaster.success(res.data.message)
                        $state.go("admin", { reload: true });
                    }

                    
                } else if (res.data.status == 'failure') {
                    $scope.tost = toaster.error(res.data.message);
                  
                    
                } else if(res.data.status == -1){
                    $scope.tost = toaster.error("Server is Down Please Try Again");
                }

            });
        } else {
            $scope.loginform.$submitted = true;
        }

    }

    $scope.myfun = function () {
        $scope.value = "true";
    }
    $scope.myfunction = function (mob) {
        if (mob) {
            $scope.phonevalue = "true";
        } else {
            $scope.phonevalue = "false";
        }

    }
    $scope.registerUser = function (valid, newuser, pattern) {
       
        toaster.clear($scope.regToast);
        if (valid) {
            
            if (newuser.password == newuser.confirmPassword) {

                newuser.isdCode = '+91';
              
                ContactService.register(newuser, function (res) {

                    if (res.data.status == 'success') { 
                        toaster.success(res.data.message);
                        $state.go("login");

                    } else if(res.data.status == 'failure'){
                        $scope.regToast = toaster.error(res.data.message);

                    }

                });

            } else {
                $scope.regToast = toaster.error("Password and Confirm Password Should be Same");
            }
        } else {

            if (pattern) {
                $scope.regToast = toaster.error("Please Enter a Valid Phone Number");
            }
            $scope.userSignUpForm.$submitted = true;
        }
    }

    $scope.forgot = function () {

        var modalInstance = $modal.open({
            templateUrl: 'root/views/model/forgot.html',
            controller: ForgetCtrl
  
          });
          modalInstance.result.then(function (value) {
  
            ContactService.forgotpassword(value, function (res) {
              var response = res.data;
              if (response.status == 'success') {
  
                toaster.success(response.message);
                $state.go('login');
  
              }else if(response.status == 'failure'){
                toaster.error(response.message);

              }
  
            });
          });
    }
});

var ForgetCtrl = function ($scope, $rootScope, $modalInstance, toaster) {
    
    
        $scope.ok = function (valid,values) {
          if(valid){
          $modalInstance.close(values);
          }else{
            $scope.submitted = true;
          }
        };
    
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };