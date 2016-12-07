/*
 * Controller - submit.controller.js
 * Description:
 * Depedencies: 'ngStore': https://github.com/gsklee/ngStorage
 * Author: Steven Bartels
 * Date: 2016-11-25
 */

(function (angular) {

    'use strict';

    angular
        .module('SubmitRequestControllerModule', ['ngBonita', 'ngStorage']) //'ngCookies'
        .controller('SubmitController', SubmitFunction);

    SubmitFunction.$inject = ["$scope", "bonitaAuthentication", "ProcessDataOp", '$localStorage'];

    function SubmitFunction($scope, bonitaAuthentication, ProcessDataOp, $localStorage) {

        var CASEID;

        // LocalStorage initialisation
        $scope.$storage = $localStorage.$default({
            // has to be here
        });

        // Ensure we have a valid Bonita session & load resources
        bonitaAuthentication
            .login('walter.bates', 'bpm') //id:4
            .then(submitUserActions());

        ProcessDataOp.SAVEDATE("EFIEMFIEMFI");

        //////////////
        function submitUserActions() { // (session)

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
                        "hotelNeeded"   : $scope.hotelNeeded, //$scope.hotelNeeded = { value : true }; --> returns true/false
                        "destination"   : $scope.destination,
                        "reason"        : $scope.reason
                    }
                };

                //$scope.msg = 'Data sent: '+ JSON.stringify(requestPayload);
                $scope.msg = 'Data sent: ' + JSON.stringify($scope.requestPayload);

                /* Step 1
                 * ProcessDataOp.getProcessId() (factory, processDataOp.service.js)
                 * @api: /bonita/API/bpm/process
                 * @description: fragt/ruft Bonita BPM nach installierten Prozessen auf und speichert die "processId" ab (/API/bpm/..)
                 * .success = bei Erfolg Aufruf der (POST-)Methode ProcessDataOp.setProcessIdInUrl
                 * .error   = bei Misserfolg Ausgabe des Fehlercodes
                 * @return: HTTP-GET-Response mit einem JSON-Objekt des deployten Business Process, das ProcessId enthält
                 * TODO: .success und .error umändern in .then!
                 * https://docs.angularjs.org/api/ng/service/$http#deprecation-notice
                 * http://stackoverflow.com/questions/16385278/angular-httppromise-difference-between-success-error-methods-and-thens-a
                 */
                ProcessDataOp.getProcessId()
                    .success(function successCallback(data) {

                        // processID
                        $scope.processId = data;
                        console.log("getProcessId -- ok: " + $scope.processId[0].id);

                        /* Step 2
                         * ProcessDataOp.setProcessIdInUrl(id, payload) (factory, processDataOp.service.js)
                         * @api: /bonita/API/bpm/process/:id/instantiation
                         * @description: POST-Request an Bonita BPM mit der spezifischen ProcessId sowie dem notwendigen Request-Payload
                         * @params: id = processId; payload = Eingabedaten des User, die Attributen des Bonta Business Data Model zugewiesen werden
                         * @return: gibt Id des erstellten Case innerhalb der BonitaBPM aus (CaseId)
                         */
                        ProcessDataOp.setProcessIdInUrl($scope.processId[0].id, $scope.requestPayload)
                            .success(function (data) {
                                console.log("ProcessDataOp.setProcessId -- ok");

                                // speichert die CaseId aus des POST-Response (Antwort)
                                CASEID = data.caseId;

                                // caseId in URL einsetzen
                                // API: /bonita/API/bdm/businessDataReference/:caseId/TravelRequest
                                ProcessDataOp.setCaseIdInUrl(CASEID);

                                // speichert die caseId im LocalStorage, damit sie für Controller "ReviewController" zugänglich ist
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
        } //end - handleUserAction.function
    } // end SubmitFunction
})(angular);


// Save Form Input to LocalStorage
//$scope.saveUserInputToDisplay = function () {
//     $scope.$storage.DepDate      = $scope.departureDate;
//     $scope.$storage.NumberOfNigh = $scope.numberOfNights;
//     $scope.$storage.HotelNeeded  = $scope.hotelNeeded;
//     $scope.$storage.Destination  = $scope.destination;
//     $scope.$storage.Reason       = $scope.reason;
// };


// var CASEID = 7;
// angular.element('[ng-controller=SubmitController]').scope().write = function () {
//     angular.element('[ng-controller=SubmitController]').scope().$storage.x = CASEID;
//     console.log("$scope.write()" + angular.element('[ng-controller=SubmitController]').scope().$storage.x);
// };