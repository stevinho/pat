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
 * @name: CookieConfModule
 * @description: allow cookies to be set on CORS request.
 * @dependency: AngularJS ngCookies
 *
 * @author: Steven Bartels
 */

(function (angular) {
    'use strict';

    angular
        .module('CookieConfModule', ['ngCookies'])
        .config(Cookie);

    Cookie.$inject = ["$httpProvider"];

    /*
     You need to set withCredentials = true in the $http config to allow cookies to be set on CORS requests.
     https://quickleft.com/blog/cookies-with-my-cors/
     */
    function Cookie($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }
})(angular);