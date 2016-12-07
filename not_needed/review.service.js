/*
 * Factory - review.service.js
 * Purpose: Provide capsuled methods (get, post) to retrieve and send the "process id" from Bonita BPM
 * Reason: The "process id" is needed to instantiate a process, which has been deployed on the Bonita BPM-Server
 * Author: Steven Bartels
 * Date: 2016-11-25
 */

(function () {
    'use strict';

    angular
        .module('review.service', [])
        .factory('DisplayInputData', DisplayInputData);

    DisplayInputData.$inject = ['$http'];

    function DisplayInputData($http) {

        var URL_BONITA       = 'http://localhost:8080/bonita';
        var DisplayInputData = {}; //empty object

        DisplayInputData.getProcessId = function () {
            return $http.get(URL_BONITA + '/API/bpm/process?p=0&c=10');
        };

        // http://localhost:8080/bonita/API/bpm/process/7707393623416567897/
        DisplayInputData.getUserInput = function (processId) {
            return $http.get(URL_BONITA + '/API/bpm/process/' + processId + '/instantiation');
        };

        // Q1: http://localhost:8080/bonita/API/bdm/businessData/com.company.model.TravelRequest?q=findByPersistenceId&p=0&c=10&f=persistenceId=116
        // Q2: http://localhost:8080/bonita/API/bdm/businessData/com.company.model.TravelRequest?q=findByUserId&p=0&c=100&f=userId=4
        // Q3: http://localhost:8080/bonita/API/bdm/businessDataReference?f=caseId=5011&p=0&c=10
        // Q4: http://localhost:8080/bonita/API/bdm/businessDataReference/5011/TravelRequest
        // Q5: http://localhost:8080/bonita/API/bdm/businessData/com.company.model.TravelRequest/115

        /*        DisplayInputData.setProcessId = function (processId, requestPayload) {
         return $http.post(URL_BONITA + '/API/bpm/process/' + processId + '/instantiation', requestPayload);
         };*/

        // muss in einen neuen controller rein
        /*        DisplayInputData.getUserInputData = function () {
         return $http.get('http://localhost:8080/bonita/API/bpm/userTask/5011/context');
         };*/

        return DisplayInputData;
    }

})(angular);