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
 * @name: ProcessDatOpModule
 * @description: angularJS factory for HTTP-Methods
 *
 * @author: Steven Bartels
 */

(function () {
    'use strict';

    angular
        .module('ProcessDataOpModule', [])
        .factory('ProcessDataOp', ProcessDataOp);

    ProcessDataOp.$inject = ['$http'];

    function ProcessDataOp($http) {

        var URL_BONITA          = 'http://localhost:8080/bonita';
        var BUSINESS_DATA_MODEL = 'TravelRequest';
        var ProcessDataOp       = {}; //initialise empty object

        /**
         * ProcessDataOp.getProcessId()
         * @description: Abfrage aller deployten Prozesse auf der Bonita BPM-Serverinstanz. Da Community-Edition nur ein Prozess installierbar.
         * @return: JSON-Objekt mit Informationen zum installierten Prozess. Liefert ID, die zur Initialisierung notwendig ist
         */
        ProcessDataOp.getProcessId = function () {
            return $http.get(URL_BONITA + '/API/bpm/process?p=0&c=10');
        };

        /**
         * ProcessDataOp.setProcessIdInUrl(id, payload)
         * @description: jeweilige processId wird in URL gesetzt, um Prozess zu starten und Nutzereingaben zu übermitteln
         * @param processId: ProzessId des deployten Prozesses aus Bonita BPM;
         * @param requestPayload: Nutzereingaben, die zu übermitteln sind
         * @return: die CaseId des gestarteten Prozesses
         */
        ProcessDataOp.setProcessIdInUrl = function (processId, requestPayload) {
            return $http.post(URL_BONITA + '/API/bpm/process/' + processId + '/instantiation', requestPayload)
        };

        /**
         * ProcessDataOp.setCaseIdInUrl(caseId)
         * @description: übergebene caseId wird in URL gesetzt, um die storageId bzw. Link auf
         *               Business Data Model mit jeweiligen Nutzereingaben zu erhalten, die in BonitaBPM Attributen zugewiesen wurden
         * @param caseId: jeweilig erzeugte caseId
         * @return: JSON-Objekt mit Informationen zum Business Data Model (TravelRequest) und der zugehörigen storageId
         */
        ProcessDataOp.setCaseIdInUrl = function (caseId) {
            return $http.get(URL_BONITA + '/API/bdm/businessDataReference/' + caseId + '/' + BUSINESS_DATA_MODEL);
        };

        /**
         * ProcessDataOp.setStorageIdInUrl(storageId)
         * @description: übergebene storageId wird in URL gesetzt, um die Prozessdaten mit jeweiligen Nutzereingaben zu erhalten,
         * die in BonitaBPM Attributen zugewiesen wurden
         * @param storageId: jeweilg erzeugte storageId
         * @return: JSON-Objekt mit Informationen zum Business Data Model (TravelRequest) und Nutzereingaben
         */
        ProcessDataOp.setStorageIdInUrl = function (storageId) {
            return $http.get(URL_BONITA + '/API/bdm/businessData/com.company.model.' + BUSINESS_DATA_MODEL + '/' + storageId);
        };

        /**
         * ProcessDataOp.getActivityId()
         * @description: Liste aller offenen HumanTasks von/in Bonita (Human Task == Activity)
         * @returns: JSON-Objekt mit vers. Informationen zum jeweiligen Human Task, relevant ist die humanTask.id (activityId)
         */
        ProcessDataOp.getActivityId = function () {
            return $http.get(URL_BONITA + '/API/bpm/activity?p=0&c=10')
        };

        /**
         * ProcessDataOp.setStateForActivity(activityId, payload)
         * @description: setzt die zuvor erhaltene activityId in API-Link, um den jeweiligen Status zu verändern
         * @param activityId: humanTask-Id (Manager-Review)
         * @param payload: Wert des Status (value of state)
         * @returns: HTTP-Code 200, wenn update erfolgreich
         */
        ProcessDataOp.setStateForActivity = function (activityId, payload) {
            console.log("setStateForActiv -- ok");
            return $http.put(URL_BONITA + '/API/bpm/humanTask/' + activityId, payload);
        };

        return ProcessDataOp;
    }
})(angular);