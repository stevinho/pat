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
 * @name: pat
 * @description: module, which gets all the seperated/capsuled components injected and administrates them
 * @dependency: ngAnimate, ngRoute, ngBonita, ngResource, ngCookies, ngStorage (see github-repository for references), ProcessDataOpModule
 *              CookieConfModule, ReviewRequestControllerModule, ReviewRequest2ControllerModule, SubmitRequestControllerModule,
 *              SubmitRequest2ControllerModule, SubmitRequest3ControllerModule, SubmitRequest4ControllerModule, SubmitRequest5ControllerModule
 *              SubmitRequest6ControllerModule
 *
 * @author: Steven Bartels
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
