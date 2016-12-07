(function (angular) {
    'use strict';

    angular
        .module('BonitaConfigModule', ['ngBonita'])
        .config(BonitaConfig);

    BonitaConfig.$inject = ["bonitaConfigProvider"];

    function BonitaConfig(bonitaConfigProvider) {
        bonitaConfigProvider.setBonitaUrl("http://localhost:8080/bonita");
    }

})(angular);