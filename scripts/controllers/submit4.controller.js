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
 * @name: SubmitRequest4ControllerModule
 * @description: controller for the view "submit travel request - hotel needed" (2), displays data and communicates with Bonita BPM-Server
 * @dependency: ngBonita, ngStorage (see github-repository for references)
 *
 * @author: Steven Bartels
 */

(function (angular) {

    'use strict';

    angular
        .module('SubmitRequest4ControllerModule', ['ngBonita', 'ngStorage'])
        .controller('Submit4Controller', Submit4Function);

    Submit4Function.$inject = ["$scope", "bonitaAuthentication", '$localStorage'];

    function Submit4Function($scope, bonitaAuthentication, $localStorage) {

        var DEPDATE;
        var NUMBEROFNIGHTS;
        var HOTELNEEDED;

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

            // if not checked: false. if user checks: true.
            $scope.hotelNeeded = false;

            // Form submit handler (button)
            $scope.submit = function () {

                // if submit-button has been clicked
                $scope.submitted = true;

                // test output
                DEPDATE = $scope.$storage.DEPDATE;
                console.log("DEPDATE - controller4: " + DEPDATE);

                NUMBEROFNIGHTS = $scope.$storage.NUMBEROFNIGHTS;
                console.log("NUMBEROFNIGHTS - controller4: " + NUMBEROFNIGHTS);

                // save user input (ng-model: hotelNeeded) into localStorage variable HOTELNEEDED -- will be used later
                $scope.$storage.HOTELNEEDED = $scope.hotelNeeded;
                HOTELNEEDED = $scope.$storage.HOTELNEEDED;
                console.log("HOTELNEEDED - controller4: " + HOTELNEEDED);
            }; // end - submit.function
        } //end - saveUserActions.function
    } // end - SubmitFunction
})(angular);