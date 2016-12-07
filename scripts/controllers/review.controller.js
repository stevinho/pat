/*
 * Controller - review.controller.js
 * Author: Steven Bartels
 * Date: 2016-11-25
 */

(function (angular) {

    'use strict';

    angular
        .module('ReviewRequestControllerModule', ['ngBonita', 'ngStorage'])
        .controller('ReviewController', ReviewFunction);

    ReviewFunction.$inject = ["$scope", "bonitaAuthentication", "ProcessDataOp", '$localStorage'];

    function ReviewFunction($scope, bonitaAuthentication, ProcessDataOp, $localStorage) {

        var CASEID;
        var storageID;

        // LocalStorage initialisation
        $scope.$storage = $localStorage.$default({
            // has to be here
        });

        // Ensure we have a valid Bonita session & load resources
        bonitaAuthentication
            .login('helen.kelly', 'bpm') //id:4
            .then(function reviewUserActions() { // (session)

            // initially approve all request
            $scope.reviewDecision = "approved";

            CASEID = $scope.$storage.saveCaseIdToStorage;
            console.log("Review caseId: " + CASEID);

            ProcessDataOp.setCaseIdInUrl(CASEID)
                .success(function (data) {
                    storageID = data.storageId; // Zugriff auf JSON-Attribute storageId
                    console.log("storageId: " + storageID);

                    ProcessDataOp.setStorageIdInUrl(storageID)
                        .success(function (response) {
                            //$scope.departureDate =  response.departureDate * 1000;
                            $scope.departureDate  = response.departureDate;
                            $scope.numberOfNights = response.numberOfNights;
                            $scope.hotelNeeded    = response.hotelNeeded;
                            $scope.destination    = response.destination;
                            $scope.reason         = response.reason;
                        }); // end - setStorageIdInUrl

                    // TODO: POST-Request mit status:approved senden, um Case zu beenden
                    // required: taskId

                }); // end - setCaseIdInUrl
        }); //end - reviewUserActions.function
    } // end CopyFunction
})(angular);


/*
 $scope.submit = function () {

 //$scope.msg = 'Data sent: '+ JSON.stringify(requestPayload);
 $scope.msg = 'Data sent: ' + JSON.stringify($scope.requestPayload);

 DisplayInputData.getProcessId()
 .success(function (id) {

 // ProcessID
 $scope.processId = id;
 console.log("GET Input: " + $scope.processId[0].id);

 DisplayInputData.getUserInput($scope.processId[0].id);
 console.log("USER: " + DisplayInputData.getUserInput($scope.processId[0].id));
 });
 */



/*
 /!*
 * Controller - review.controller.js
 * Purpose:
 * Reason:
 * Author: Steven Bartels
 * Date: 2016-11-25
 *!/

 (function (angular) {

 'use strict';

 angular
 .module('review.controller', ['ngBonita', 'ngCookies', 'LocalStorageModule', 'pat.storage'])
 .controller('ReviewController', ReviewFunction);

 ReviewFunction.$inject = ["$scope", "$rootScope", "$log", "$location", "$http", "bonitaAuthentication",
 "ProcessDefinition", "BonitaSession", "bonitaConfig", "User",
 "HumanTask", "ArchivedProcessInstance", "ProcessDataOp", "$cookieStore", "localStorageService", "StorageCaseId"];

 /!*    function SubmitFunction($scope, $location, $log, $http,
 bonitaAuthentication, bonitaConfig, ProcessDefinition,
 BonitaSession, User, HumanTask, ArchivedProcessInstance, ProcessDataOp) {*!/


 function ReviewFunction($scope, $location, $log, $http,
 bonitaAuthentication, bonitaConfig, ProcessDefinition,
 BonitaSession, User, HumanTask, ArchivedProcessInstance, ProcessDataOp, $cookieStore, localStorageService, StorageCaseId) {

 // Ensure we have a valid Bonita session & load resources
 bonitaAuthentication
 //.login('walter.bates', 'bpm') //id:4
 .login('helen.kelly', 'bpm') //id:4, Helen Kelly is Manager of Walter Bates, which
 .then(function (session) { // (session)

 /!* müssen die Variablen hier deklariert werden?
 $scope.departureDate;
 $scope.numberOfNights;
 $scope.hotelNeeded;
 $scope.destination;
 $scope.reason;
 $scope.status;
 $scope.processId;
 *!/


 StorageCaseId.getLocalStorage('localId');


 $scope.reviewDecision="approved";

 $scope.submit = function () {

 //$scope.msg = 'Data sent: '+ JSON.stringify(requestPayload);
 $scope.msg = 'Data sent: ' + JSON.stringify($scope.requestPayload);

 DisplayInputData.getProcessId()
 .success(function (id) {

 // ProcessID
 $scope.processId = id;
 console.log("GET Input: " + $scope.processId[0].id);

 DisplayInputData.getUserInput($scope.processId[0].id);
 console.log("USER: " + DisplayInputData.getUserInput($scope.processId[0].id));
 });

 }; // end - submit.function

 // muss vorher instantiiert werden, weil sonst $scope-Error kommt
 }); //end - then.function
 } // end CopyFunction
 })(angular);

 */
