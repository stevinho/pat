/*
 * Module - app.js
 * Purpose:
 * Reason:
 * Author: Steven Bartels
 * Date: 2016-11-25
 * pat == process acceptance testing
 */

(function (angular) {
    'use strict';

    angular
        .module('pat',
            [
                // Angular
                'ngAnimate',
                'ngRoute',
                'ngResource',
                'ngCookies',

                //'ngAria',
                //'ngMessages',
                //'ngSanitize',
                //'ngTouch',

                // 3rd-Party
                'ngBonita',
                'ngStorage',

                // Config/Directive/Service
                'ProcessDataOpModule',
                'CookieConfModule',

                // Controller
                'ReviewRequestControllerModule',
                'ReviewRequest2ControllerModule',
                'SubmitRequestControllerModule',
                'SubmitRequest2ControllerModule',
                'SubmitRequest3ControllerModule',
                'SubmitRequest4ControllerModule',
                'SubmitRequest5ControllerModule',
                'SubmitRequest6ControllerModule'
            ]);
})(angular);
