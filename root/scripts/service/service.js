angular.module('myApp.services', [])
    .service('ContactService', function ($http) {

        var storedNames = JSON.parse(sessionStorage.getItem("names"));
        //local url
       // var port = "http://192.168.2.73:8090";
        //var port = "http://equacoin.colan.in:8080/Equocoin-0.0.1-SNAPSHOT"
        //live url
        //var port = "https://www.equacoin.io:8443/Equocoin-0.0.1-SNAPSHOT"
		var port = "https://www.equacoin.io:8443/Equocoin-0.0.1-SNAPSHOT"
        //  var port = "http://equacoin.colan.in:8080/Equocoin-0.0.1-SNAPSHOT";
        this.signin = function (data, callback) {

            $http({
                method: "POST",
                url: port + "/equocoin/api/equocoinuser/login",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                callback(response);
            }, function myError(err) {
                callback(err);
            });
        };

        this.register = function (data, callback) {
            $http({
                method: "POST",
                url: port + "/equocoin/api/equocoinuser/register",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.createcoin = function (coindata, callback) {

            $http({
                method: "POST",
                url: port + "/equocoin/api/token/create",
                data: coindata,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };
        this.tokenTransfer = function (coindata, session, callback) {
            var total = coindata.amount;
            var totalval = total * 0.00144;
            var finalval = totalval.toFixed(8);
            var data = {
                requestToken: coindata.amount,
                transferAmount: finalval,
                walletPassword: coindata.walletPassword,
                sessionId: session.id
            }
            $http({
                method: "POST",
                url: port + "/equocoin/api/purchase/token",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };


        this.allTransactions = function (callback) {

            $http({
                method: "GET",
                url: port + "/equocoin/api/token/list"

            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };



        this.balancemain = function (callback) {

            $http({
                method: "GET",
                url: port + "/equocoin/api/get/mainbalance"

            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };
        this.tokenbalance = function (session, callback) {

            var data = {
                sessionId: session.id
            }

            $http({
                method: "POST",
                url: port + "/equocoin/api/token/balance",
                // url:"http://equacoin.colan.in:8080/Equocoin-0.0.1-SNAPSHOT/equocoin/api/token/balance",
                data: data

            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {
                callback(err);
            });
        };
        this.balancewallet = function (session, callback) {

            var data = {
                sessionId: session.id
            }

            $http({
                method: "POST",
                url: port + "/equocoin/api/wallet/balance",
                data: data,
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.getusertransaction = function (session, callback) {
			
             var data = {
                walletAddress: session.loginInfo.walletAddress,
                sessionId: session.loginInfo.id
            } 
            
            $http({
                method: "POST",
                url: port + "/equocoin/api/user/transaction/history",
                data: data,
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };



        this.deletesession = function (session, callback) {

            var data = {
                emailId: session.loginInfo.userName,
                sessionId: session.loginInfo.id
            }

            $http({
                method: "POST",
                url: port + "/equocoin/api/equocoinuser/logout",
                data: data,
            }).then(function mySuccess(response) {
                var res = null;
                sessionStorage.setItem('names', JSON.stringify(res));



                callback(response);
            }, function myError(err) {
                callback(err);
            });
        };
        this.forgotpassword = function (data, callback) {

            $http({
                method: "POST",
                url: port + "/equocoin/api/user/forgot/password",
                data: data,
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        //admin services

        this.usercount = function (data, callback) {

            var data = {
                sessionId: data.loginInfo.id,
            }

            $http({
                method: "POST",
                url: port + '/equocoin/api/admin/user/count',

                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };
        this.etherbalance = function (data, callback) {

            var data = {
                sessionId: data.loginInfo.id,
            }

            $http({
                method: "POST",

                url: port + '/equocoin/api/admin//wallet/balance',


                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.admintokenbalance = function (data, callback) {


            var data = {
                sessionId: data.loginInfo.id,
            }

            $http({
                method: "POST",
                url: port + '/equocoin/api/admin/coin/balance',

                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.deleteToken = function (val, session, callback) {

            var data = {
                tokenBalance: val,
                sessionId: session.loginInfo.id
            }

            $http({
                method: "POST",
                url: port + '/equocoin/api/token/cancel',


                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.admintokenTransfer = function (value, storedNames, callback) {

            value.sessionId = storedNames.loginInfo.id,


                $http({
                    method: "POST",
                    url: port + '/equocoin/api/token/transfer',


                    data: value,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function mySuccess(response) {

                    callback(response);
                }, function myError(err) {

                    callback(err);
                });
        };

        this.mintToken = function (val, session, callback) {

            var data = {
                mintedAmount: val,
                sessionId: session.loginInfo.id
            }

            $http({
                method: "POST",
                url: port + '/equocoin/api/admin/mint/token',


                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };
        this.mintTokenList = function (session, callback) {

            var data = {
                sessionId: session.loginInfo.id
            }

            $http({
                method: "POST",
                url: port + '/equocoin/api/admin/mint/history',


                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.supportapi = function (data, callback) {

            $http({
                method: "POST",
                url: port + '/equocoin/api/user/support',
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.ethersubmit = function (data, id, callback) {
           

            if (id == 0) {
                var apiUrl = port + '/equocoin/api/user/send/ether';


            } else if (id == 1) {
                var apiUrl = port + '/equocoin/api/user/send/equacoin';

            }

            $http({
                method: "POST",
                url: apiUrl,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };



        /** Create Proposal start here **/
        this.createproposal = function (proposaldata, fileData, callback) {
           
            var fd = new FormData();
           
            fd.append("proposalInfo", JSON.stringify(proposaldata));
            fd.append("proposalDoc", fileData);
            $http({
                method: "POST",
                url: port + "/dac/api/proposal/create",
                data: fd,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity,
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });
        };

        this.ownlistproposal = function (proposaldata, callback) {

            $http({
                url: port + "/dac/api/own/proposal/" + proposaldata.id + '/' + proposaldata.walletAddress,
                method: "GET",
                headers: { 'Accept': 'application/json' }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };


        this.allproposallist = function (proposaldata, callback) {

            $http({
                url: port + "/dac/api/proposal/list/" + proposaldata.id,
                method: "GET",
                headers: { 'Accept': 'application/json' }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };
        this.categoryproposal = function (propdata,callback) {
            var category = "test";
            
            $http({
                url: port + "/dac/api/proposal/category/" + propdata.sessionId + '/' + propdata.type,
                method: "GET",
                headers: { 'Accept': 'application/json' }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };  
        this.getOtherproplist = function (data,callback) {
            $http({
                url: port + "/dac/api/proposal/otheruser/" + data.sessionId + '/' + data.walletaddress,
                method: "GET",
                headers: { 'Accept': 'application/json' }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        }; 
        this.wonlistproposal = function (data,callback) {
            $http({
                url: port + "/dac/api/proposal/won/" + data.id,
                method: "GET",
                headers: { 'Accept': 'application/json' }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };
        this.faillistproposal = function (data,callback) {
            $http({
                url: port + "/dac/api/proposal/failed/" + data.id,
                method: "GET",
                headers: { 'Accept': 'application/json' }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };  
        this.getadminpropList = function (data,callback) {
            $http({
                url: port + "/dac/api/admin/proposal/list/" + data.id,
                method: "GET",
                headers: { 'Accept': 'application/json' }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        }; 

        this.acceptproposal = function (data,callback) {
            $http({
                method: "POST",
                url:  port + "/dac/api/approve/proposal",
                data: data,
               
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };   
        this.likeproposal = function (data,callback) {
           
            $http({
                method: "POST",
                url:  port + "/dac/api/proposal/voting",
                data: data,
               
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };  

        this.viewInfo = function (data,callback) {
            $http({
                method: "POST",
                url:  port + "/dac/api/admin/view/proposal",
                data: data,
               
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };

    });

angular.module('myApp.services').service('Auth', function () {

    this.getUserInfo = function () {
        var userInfo = JSON.parse(sessionStorage.getItem("names"));
        return userInfo;
    }

})