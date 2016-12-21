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
 * @name: SubmitRequestControllerModule
 * @description: controller for the view "submit travel request" (1), displays data and communicates with Bonita BPM-Server
 * @dependency: ngBonita, ngStorage (see github-repository for references)
 *
 * @author: Steven Bartels
 */

(function (angular) {

    'use strict';

    angular
        .module('SubmitRequestControllerModule', ['ngBonita', 'ngStorage'])
        .controller('SubmitController', SubmitFunction);

    SubmitFunction.$inject = ["$scope", "bonitaAuthentication", "ProcessDataOp", '$localStorage'];

    function SubmitFunction($scope, bonitaAuthentication, ProcessDataOp, $localStorage) {

        // LocalStorage initialisation
        $scope.$storage = $localStorage.$default({
            // has to be here
        });

        // Ensure we have a valid Bonita session & load resources
        bonitaAuthentication
            .login('walter.bates', 'bpm')
            .then(submitUserActions());


        //////////////
        function submitUserActions() {

            //if not checked, false. If user checks, then true.
            $scope.hotelNeeded = false;

            // Form submit handler (button)
            $scope.submit = function () {

                // if submit-button has been clicked
                $scope.submitted = true;

                // Form Input -- get the data from the form and update the request payload for the POST-request
                $scope.requestPayload = {
                    "travelRequestInput": {
                        "departureDate" : $scope.departureDate,
                        "numberOfNights": $scope.numberOfNights,
                        "hotelNeeded"   : $scope.hotelNeeded,
                        "destination"   : $scope.destination,
                        "reason"        : $scope.reason
                    }
                };

                /**
                 * Step 1
                 * ProcessDataOp.getProcessId() (factory, processDataOp.service.js)
                 * @api: /bonita/API/bpm/process
                 * @description: get processId to instantiate process in step 2 with user input as payload
                 * .success = call method ProcessDataOp.setProcessIdInUrl
                 * .error   = return error.message
                 * @return: returns processId from instanced process
                 */
                ProcessDataOp.getProcessId()
                    .success(function successCallback(data) {

                        // processID
                        $scope.processId = data[0].id;
                        console.log("getProcessId -- ok: " + $scope.processId);

                        /**
                         * Step 2
                         * ProcessDataOp.setProcessIdInUrl(id, payload) (factory, processDataOp.service.js)
                         * @api: /bonita/API/bpm/process/:id/instantiation
                         * @description: set retrieved processId in URL to instantiate process with user input as payload
                         * @params id: processId[0].id
                         * @param payload: user input, assigned to attributes into the bonita business data model (bdm)
                         * @return: returns caseId from created case
                         */
                        ProcessDataOp.setProcessIdInUrl($scope.processId, $scope.requestPayload)
                            .success(function (data) {
                                console.log("ProcessDataOp.setProcessId -- ok");

                                // save caseId in LocalStorage to make it accessible for the (next) reviewController
                                $scope.$storage.saveCaseIdToStorage = data.caseId;
                                console.log("$storage - caseId: " + $scope.$storage.saveCaseIdToStorage);

                                bonitaAuthentication.logout()
                            })
                            .error(function (error) {
                                $scope.status = 'Unable to set process id: ' + error.message;
                            })
                    })
                    .error(function errorCallback(error) {
                        $scope.status = 'Unable to load data (getProccessId): ' + error.message;
                    });
            }; // end - submit.function
        } //end - submitUserActions.function
    } // end - SubmitFunction
})(angular);