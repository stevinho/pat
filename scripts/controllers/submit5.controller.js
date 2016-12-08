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
 * @name: SubmitRequest5ControllerModule
 * @description: controller for the view "submit travel request - destination" (2), displays data and communicates with Bonita BPM-Server
 * @dependency: ngBonita, ngStorage (see github-repository for references)
 *
 * @author: Steven Bartels
 */

(function (angular) {

    'use strict';

    angular
        .module('SubmitRequest5ControllerModule', ['ngBonita', 'ngStorage'])
        .controller('Submit5Controller', Submit5Function);

    Submit5Function.$inject = ["$scope", "bonitaAuthentication", '$localStorage'];

    function Submit5Function($scope, bonitaAuthentication, $localStorage) {

        var DEPDATE;
        var NUMBEROFNIGHTS;
        var HOTELNEEDED;
        var DESTINATION;

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

                // test output
                DEPDATE = $scope.$storage.DEPDATE;
                console.log("DEPDATE - controller5: " + DEPDATE);

                NUMBEROFNIGHTS = $scope.$storage.NUMBEROFNIGHTS;
                console.log("NUMBEROFNIGHTS - controller5: " + NUMBEROFNIGHTS);

                HOTELNEEDED = $scope.$storage.HOTELNEEDED;
                console.log("HOTELNEEDED - controller5: " + HOTELNEEDED);

                // save user input (ng-model: destination) into localStorage variable DESTINATION -- will be used later
                $scope.$storage.DESTINATION = $scope.destination;
                DESTINATION = $scope.$storage.DESTINATION;
                console.log("DESTINATION - controller5: " + DESTINATION);
            }; // end - submit.function
        } //end - saveUserActions.function
    } // end SubmitFunction
})(angular);