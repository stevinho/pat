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