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
 * @name: SubmitRequest3ControllerModule
 * @description: controller for the view "submit travel request - number of nights" (3), displays data and communicates with Bonita BPM-Server
 * @dependency: ngBonita, ngStorage (see github-repository for references)
 *
 * @author: Steven Bartels
 */

(function (angular) {

    'use strict';

    angular
        .module('SubmitRequest3ControllerModule', ['ngBonita', 'ngStorage']) //'ngCookies'
        .controller('Submit3Controller', Submit3Function);

    Submit3Function.$inject = ["$scope", "bonitaAuthentication", '$localStorage'];

    function Submit3Function($scope, bonitaAuthentication, $localStorage) {

        var DEPDATE;
        var NUMBEROFNIGHTS;

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

                // output just for testing
                DEPDATE = $scope.$storage.DEPDATE;
                console.log("DEPDATE - controller3: " + DEPDATE);

                // save user input (ng-model: numberOfNights) into localStorage variable NUMBEROFNIGHTS -- will be used later
                $scope.$storage.NUMBEROFNIGHTS = $scope.numberOfNights;
                NUMBEROFNIGHTS                 = $scope.$storage.NUMBEROFNIGHTS;
                console.log("NUMBEROFNIGHTS - controller3: " + NUMBEROFNIGHTS);
            }; // end - submit.function
        } //end - saveUserActions.function
    } // end - SubmitFunction
})(angular);