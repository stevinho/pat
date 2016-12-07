/*
 * Factory - processDataOp.service.js
 * Purpose: Provide capsuled methods (get, post) to retrieve and send data to/from Bonita BPM
 * Author: Steven Bartels
 * Date: 2016-11-25
 */

(function () {
    'use strict';

    angular
        .module('ProcessDataOpModule', []) //'ngCookies'
        .factory('ProcessDataOp', ProcessDataOp);

    ProcessDataOp.$inject = ['$http'];

    function ProcessDataOp($http) {

        var URL_BONITA          = 'http://localhost:8080/bonita';
        var BUSINESS_DATA_MODEL = 'TravelRequest';
        var ProcessDataOp       = {}; //initialise empty object

        // GET-Request um "processId" zu erhalten (liefert JSON-Objekt zurück)
        /* ProcessDataOp.getProcessId()
         * @description: Abfrage aller deployten Prozesse auf der Bonita BPM-Serverinstanz. Da Community-Edition nur ein Prozess installierbar.
         * @return: JSON-Objekt mit Informationen zum installierten Prozess. Liefert ID, die zur Initialisierung notwendig ist
         */
        ProcessDataOp.getProcessId = function () {
            return $http.get(URL_BONITA + '/API/bpm/process?p=0&c=10');
        };

        /* ProcessDataOp.setProcessIdInUrl(id, payload)
         * @description: jeweilige processId wird in URL gesetzt, um Prozess zu starten und Nutzereingaben zu übermitteln
         * @param: processId = ProzessId des deployten Prozesses aus Bonita BPM; payload = Nutzereingaben, die zu übermitteln sind
         * @return: die CaseId des gestarteten Prozesses
         */
        ProcessDataOp.setProcessIdInUrl = function (processId, requestPayload) {
            return $http.post(URL_BONITA + '/API/bpm/process/' + processId + '/instantiation', requestPayload)
        };

        /* ProcessDataOp.setCaseIdInUrl(caseId)
         * @description: übergebene caseId wird in URL gesetzt, um die storageId bzw. link auf
         *               Business Data Model mit jeweiligen Nutzereingaben zu erhalten, die in BonitaBPM Attributen zugewiesen wurden
         * @param: caseId = jeweilg erzeugte caseId
         * @return: JSON-Objekt mit Informationen zum Business Data Model (TravelRequest) und der zugehörigen storageId
         */
        ProcessDataOp.setCaseIdInUrl = function (caseId) {
            return $http.get(URL_BONITA + '/API/bdm/businessDataReference/' + caseId + '/' + BUSINESS_DATA_MODEL);
        };

        /* ProcessDataOp.setStorageIdInUrl(storageId)
         * @description: übergebene storageId wird in URL gesetzt, um die Prozessdaten mit jeweiligen Nutzereingaben zu erhalten,
         * die in BonitaBPM Attributen zugewiesen wurden
         * @param: storageId = jeweilg erzeugte storageId
         * @return: JSON-Objekt mit Informationen zum Business Data Model (TravelRequest) und Nutzereingaben
         */
        ProcessDataOp.setStorageIdInUrl = function (storageId) {
            return $http.get(URL_BONITA + '/API/bdm/businessData/com.company.model.' + BUSINESS_DATA_MODEL + '/' + storageId);
        };

        return ProcessDataOp;
    }
})(angular);


// speicher CaseId ab
// ProcessDataOp.saveCaseId = function (caseId) {
//     console.log("ProcessDataOp.saveCaseId(data.caseId): " + caseId);
//     return caseId;
// };

// // LocalStorage initialisation
// angular.element('[ng-controller=SubmitController]').scope().$storage = $localStorage.$default({
//     // has to be here
// });