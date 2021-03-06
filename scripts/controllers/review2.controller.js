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
 * @name: ReviewRequest2ControllerModule
 * @description: controller for the view "review travel request" (2), displays data and communicates with Bonita BPM-Server
 * @dependency: ngBonita, ngStorage (see github-repository for references)
 *
 * @author: Steven Bartels
 */

(function (angular) {

    'use strict';

    angular
        .module('ReviewRequest2ControllerModule', ['ngBonita', 'ngStorage'])
        .controller('Review2Controller', Review2Function);

    Review2Function.$inject = ["$scope", "bonitaAuthentication", "ProcessDataOp", '$localStorage'];

    function Review2Function($scope, bonitaAuthentication, ProcessDataOp, $localStorage) {

        var CASEID;
        var storageID;
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
            .login('helen.kelly', 'bpm') //id:4
            .then(function reviewUserActions() { // (session)

                // initially approve all request
                $scope.reviewDecision = "approved";

                CASEID = $scope.$storage.saveCaseIdToStorage;
                console.log("Review caseId: " + CASEID);

                DEPDATE        = $scope.$storage.DEPDATE;
                NUMBEROFNIGHTS = $scope.$storage.NUMBEROFNIGHTS;
                HOTELNEEDED    = $scope.$storage.HOTELNEEDED;
                DESTINATION    = $scope.$storage.DESTINATION;
                REASON         = $scope.$storage.REASON;

                ProcessDataOp.setCaseIdInUrl(CASEID)
                    .success(function (data) {
                        storageID = data.storageId; // Zugriff auf JSON-Attribute storageId
                        console.log("storageId: " + storageID);

                        ProcessDataOp.setStorageIdInUrl(storageID)
                            .success(function (response) {
                                $scope.departureDate  = response.departureDate;
                                $scope.numberOfNights = response.numberOfNights;
                                $scope.hotelNeeded    = response.hotelNeeded;
                                $scope.destination    = response.destination;
                                $scope.reason         = response.reason;
                            }); // end - setStorageIdInUrl
                    }); // end - setCaseIdInUrl

                ProcessDataOp.getActivityId()
                    .success(function successCallback(data) {
                        $scope.activityId = data;
                        console.log("getActivityId -- ok: " + $scope.activityId[0].id);

                        var activityState = {"state": "skipped"};

                        ProcessDataOp.setStateForActivity($scope.activityId[0].id, activityState)

                            // logout function
                            .then(function () {
                                bonitaAuthentication.logout();
                            });
                    }); //end - getActivityId
            }); //end - reviewUserActions.function
    } // end CopyFunction
})(angular);