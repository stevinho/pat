/**
 * Copyright (C) 2016 Steven Bartels
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @name: SubmitRequest6ControllerModule
 * @description: controller for the view "submit travel request - reason" (2), displays data and communicates with Bonita BPM-Server
 * @dependency: ngBonita, ngStorage (see github-repository for references)
 *
 * @author: Steven Bartels
 */

(function (angular) {

    'use strict';

    angular
        .module('SubmitRequest6ControllerModule', ['ngBonita', 'ngStorage'])
        .controller('Submit6Controller', Submit6Function);

    Submit6Function.$inject = ["$scope", "bonitaAuthentication", '$localStorage', 'ProcessDataOp'];

    function Submit6Function($scope, bonitaAuthentication, $localStorage, ProcessDataOp) {

        var CASEID;
        var DEPDATE;
        var NUMBEROFNIGHTS;
        var HOTELNEEDED;
        var DESTINATION;
        var REASON;

        // LocalStorage initialisation
        $scope.$storage = $localStorage.$default({
            // has to be here
        });

        // Ensure we have a valid Bonita session & load resources
        bonitaAuthentication
            .login('walter.bates', 'bpm') //id:4
            .then(saveUserActions());


        //////////////
        function saveUserActions() {

            // Form submit handler (button)
            $scope.submit = function () {

                // if submit-button has been clicked
                $scope.submitted = true;

                // just to show what has been saved
                DEPDATE = $scope.$storage.DEPDATE;
                console.log("DEPDATE - controller6: " + DEPDATE);

                NUMBEROFNIGHTS = $scope.$storage.NUMBEROFNIGHTS;
                console.log("NUMBEROFNIGHTS - controller6: " + NUMBEROFNIGHTS);

                HOTELNEEDED = $scope.$storage.HOTELNEEDED;
                console.log("HOTELNEEDED - controller6: " + HOTELNEEDED);

                DESTINATION = $scope.$storage.DESTINATION;
                console.log("DESTINATION - controller6: " + DESTINATION);

                // save user input (ng-model: reason) into localStorage variable REASON -- will be used later
                $scope.$storage.REASON = $scope.reason;
                REASON                 = $scope.$storage.REASON;
                console.log("REASON - controller6: " + REASON);

                // Form Input -- get the saved data (localStorage - from the form) and update the request payload for the POST-request
                $scope.requestPayload = {
                    "travelRequestInput": {
                        "departureDate" : $scope.$storage.DEPDATE,
                        "numberOfNights": $scope.$storage.NUMBEROFNIGHTS,
                        "hotelNeeded"   : $scope.$storage.HOTELNEEDED, //$scope.hotelNeeded = { value : true }; --> returns true/false
                        "destination"   : $scope.$storage.DESTINATION,
                        "reason"        : $scope.$storage.REASON
                    }
                };

                // send the saved user input to bonita as a bulk
                ProcessDataOp.getProcessId()
                    .success(function successCallback(data) {

                        // processID
                        $scope.processId = data;
                        console.log("getProcessId -- ok: " + $scope.processId[0].id);

                        ProcessDataOp.setProcessIdInUrl($scope.processId[0].id, $scope.requestPayload)
                            .success(function (data) {
                                console.log("ProcessDataOp.setProcessId -- ok");

                                // save caseId from post response
                                CASEID = data.caseId;

                                // set caseId in url
                                // API: /bonita/API/bdm/businessDataReference/:caseId/TravelRequest
                                ProcessDataOp.setCaseIdInUrl(CASEID)

                                    // logout function
                                    .then(function () {
                                        bonitaAuthentication.logout();
                                    });

                                // save caseId in LocalStorage to make it accessible for the (next) reviewController
                                $scope.$storage.saveCaseIdToStorage = CASEID;
                                console.log("$storage - caseId: " + $scope.$storage.saveCaseIdToStorage);
                            })
                            .error(function (error) {
                                $scope.status = 'Unable to set process id: ' + error.message;
                            })
                    })
                    .error(function errorCallback(error) {
                        $scope.status = 'Unable to load data (getProccessId): ' + error.message;
                    });
            }; // end - submit.function
        } //end - saveUserActions.function
    } // end - SubmitFunction
})(angular);