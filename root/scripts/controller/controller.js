
angular.module('routerApp.controllers', ['toaster']).
    controller('myCtrl', function ($scope, ContactService, $state, toaster, $interval, $window) {
        
        var storedNames = JSON.parse(sessionStorage.getItem("names"));
            
        var user = {};
        var myInterval = function () {
            var tod = new Date();
            var date = new Date('December 1, 2017');
            var end_date = date.getDate();
            var today_date = tod.getDate();
            const t = Date.parse(date) - Date.parse(new Date());
            $scope.image_value = 'true';

            $scope.sec = Math.floor((t / 1000) % 60);
            $scope.minutes = Math.floor((t / 1000 / 60) % 60);
            $scope.hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            $scope.day = days;
            if(t < 0){
                $scope.timer = "true";

            }
        }

        $interval(myInterval, 1000);

        $scope.onBlur = function(psw,confirm) {
            
            if(psw != confirm){
                alert("Password and Confirm Should be Same")
                
            } 

        }

        
    })

    