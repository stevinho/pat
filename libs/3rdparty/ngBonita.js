'use strict';
/**
 * Copyright (C) 2014 BonitaSoft S.A.
 * BonitaSoft, 32 rue Gustave Eiffel - 38000 Grenoble
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
 * This module provides easy access to Bonita BPM REST APIs
 *
 * @author Philippe Ozil
 * @author Rodrigue Le Gall
 */
angular
	.module('ngBonita', [ 'ngResource' ]);

'use strict';

/**********************************************************************************************************************
 * Factory that manages Bonita authentication
 */
angular
    .module('ngBonita')
    .factory('bonitaAuthentication', function ($log, $http, $q, BonitaSession, bonitaConfig, bonitaUtils) {

        var bonitaAuthentication = {};

        /**
         * Performs a Bonita login
         *
         * @param username
         * @param password
         */
        bonitaAuthentication.login = function (username, password) {
            var deferred = $q.defer();

            bonitaAuthentication.isLogged = false;                      // not logged in yet -> false
            /**
             * url: http://localhost:8080/bonita + /loginservice
             * POST Method to use login service
             */
            $http({
                method  : 'POST',
                url     :  bonitaConfig.getBonitaUrl() + '/loginservice',
                data    :  bonitaUtils.serializeData({
                    username : username,
                    password : password,
                    redirect : false
                }),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .success(function () {
                $log
                    .log('ngBonita.js -- bonitaAuthentication.login success');


                // Retrieve current session to get user id
                BonitaSession
                    .getCurrent()
                    .$promise
                    .then(function (session) {
                        if (typeof session.user_id === 'undefined') {
                            deferred.reject('ngBonita.js -- No active session found');
                        } else {
                            // Save basic session data
                            bonitaConfig.setUsername(session.user_name);        // no active session - setUsername(session.user_name)
                            bonitaConfig.setUserId(session.user_id);            // no acitve session - setUserId(session.user_id)
                            bonitaAuthentication.isLogged = true;
                            deferred.resolve(session);
                        }
                });
            })
                .error(function (data, status, headers, config) {
                    $log.log('ngBonita.js -- BonitaAuthentication.login failure response ' + status);
                    $log.log('ngBonita.js -- Bonita URL: ' + bonitaConfig.getBonitaUrl());
                    bonitaAuthentication.isLogged = false;
                    deferred.reject({
                        data    :   data,
                        status  :   status,
                        headers :   headers,
                        config  :   config
                    });
            });

            return deferred.promise;
        };

        /**
         * Checks whether a session is available and updates isLogged accordingly
         */
        bonitaAuthentication.checkForActiveSession = function () {
            var deferred = $q.defer();

            // Check if a session was created earlier
            BonitaSession.getCurrent().$promise.then(function (session) {
                if (typeof session.user_id === 'undefined') {
                    bonitaAuthentication.isLogged = false;
                }
                else {
                    // Save basic session data
                    bonitaConfig.setUsername(session.user_name);
                    bonitaConfig.setUserId(session.user_id);
                    bonitaAuthentication.isLogged = true;
                }
                deferred.resolve(session);
            });

            return deferred.promise;
        };

        /**
         * Performs a Bonita logout
         */
        bonitaAuthentication.logout = function () {
            var deferred = $q.defer();

            $http({
                method  : 'GET',
                url     : bonitaConfig.getBonitaUrl() + '/logoutservice',
                data    : bonitaUtils.serializeData({
                    redirect : false
                }),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .success(function () {
                    $log.log('ngBonita.js -- BonitaAuthentication.logout success');
                    bonitaConfig.setUsername(null);
                    bonitaConfig.setUserId(null);
                    bonitaAuthentication.isLogged = false;
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    $log.log('ngBonita.js -- BonitaAuthentication.logout failure response ' + status);
                    bonitaAuthentication.isLogged = false;
                    deferred.reject({
                        data    : data,
                        status  : status,
                        headers : headers,
                        config  : config
                    });
            });

            return deferred.promise;
        };

        return bonitaAuthentication;
    }); // END - FACTORY bonitaAuthentication


/**********************************************************************************************************************
 * PROVIDER bonitaConfig
 *
 * bonitaConfig:    User-Daten erhalten/manipulieren (url, userId, userName, defaultPager)
 */
'use strict';

angular
    .module('ngBonita')
    .provider('bonitaConfig', function () {
        var bonitaUrl = 'http://localhost:8080/bonita';
        var defaultPager = {
            p : 0,
            c : 10
        };

        var bonitaUserId    = null;
        var bonitaUsername  = null;

        /**
         * Configure the Bonita application URL (must include application name
         * without trailing slash)
         * @param url
         */
        this.setBonitaUrl = function (url) {
            bonitaUrl = url;
        };

        this.overrideDefaultPagerValues = function (overrideDefaultPagerProperties) {
            angular.extend(defaultPager, overrideDefaultPagerProperties);
        };

        this.$get = function () {
            var api = {};

            /**
             * Gets the Bonita application URL
             * @return Bonita url
             */
            api.getBonitaUrl = function () {
                return bonitaUrl;
            };

            /**
             * Retrieves the currently logged Bonita user id
             * @return logged Bonita user id
             */
            api.getUserId = function () {
                return bonitaUserId;
            };

            /**
             * Set the currently logged Bonita user id
             * @param newBonitaUserId
             */
            api.setUserId = function (newBonitaUserId) {
                bonitaUserId = newBonitaUserId;
            };

            /**
             * Retrieves the currently logged Bonita user name
             * @return logged Bonita user name
             */
            api.getUsername = function () {
                return bonitaUsername;
            };

            /**
             * Set the currently logged Bonita user name
             * @param newBonitaUsername
             */
            api.setUsername = function (newBonitaUsername) {
                bonitaUsername = newBonitaUsername;
            };

            /**
             * Retrieves the default pager information
             * @return default pager
             */
            api.getDefaultPager = function () {
                return defaultPager;
            };

            return api;
	    };
    }); // END - PROVIDER bonitaConfig


/**********************************************************************************************************************
 * PROVIDER bonitaUtils
 *
 * bonitaUtils:
 */
'use strict';

angular
    .module('ngBonita')
    .factory('bonitaUtils', function ($http,bonitaConfig) {

        var api = {};

        /**
         * Configure the Bonita application URL
         * (must include application name without trailing slash)
         * @param url
         */
        var paginateResponse = function (data, headersGetter) {

            // Parse pagination header
            var strContentRange = headersGetter()['content-range'];
            var arrayContentRange = strContentRange ? strContentRange.split('/') :[ bonitaConfig.getDefaultPager().p + '-' + bonitaConfig.getDefaultPager().c];
            var arrayIndexNumPerPage = arrayContentRange[0].split('-');

            // Assemble response data with pagination
            return {
                items       : angular.fromJson(data),
                pageIndex   : Number(arrayIndexNumPerPage[0]),
                pageSize    : Number(arrayIndexNumPerPage[1]),
                totalCount  : Number(arrayContentRange[1])
            };
        };

        api.transformPaginateResponse = function () {
            return [ paginateResponse ].concat($http.defaults.transformResponse);
        };

        /**
         * Serializes data into an URI format (credit: Sudhir from stackoverflow)
         * TODO: Was für "data" wird hier verarbeitet?
         */
        api.serializeData = function (data) {

            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) {
                return (data === null) ? '' : data.toString();
            }

            var buffer = [];

            // Serialize each key in the object.
            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }

                var value = data[name];

                buffer.push(
                    encodeURIComponent(name) + '=' + encodeURIComponent((value === null) ? '' : value)
                );
            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join('&').replace(/%20/g, '+');
            return (source);
        };

        return api;
    }); // END - PROVIDER bonitaUtils


/**********************************************************************************************************************
 * FACTORY ArchivedCaseDocument
 *
 * ArchivedCaseDocument: Zugriff auf "erledigte/archivierte" Prozessdokumente aus dem Bonita-Workflow
 */
'use strict';

/**
 * Resource used to access Bonita achived process documents
 * Available from Bonita 6.4 onward
 */
angular
    .module('ngBonita')
    .factory('ArchivedCaseDocument', function ($resource, bonitaConfig, bonitaUtils) {

        var data = angular.extend({
                id : '@id'
            },
            bonitaConfig.getDefaultPager());

        return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedCaseDocument/:id', data, {
            getUploadedByCurrentUser : {
                method : 'GET',
                params : {
                    f  : function () {
                            return [ 'submittedBy=' + bonitaConfig.getUserId() ];
                        }
                },
                transformResponse : bonitaUtils.transformPaginateResponse()
            },
            search : {
                method : 'GET',
                transformResponse : bonitaUtils.transformPaginateResponse()
            }
        });
    }); // END - FACTORY ArchivedCaseDocument


/**********************************************************************************************************************
 * FACTORY ArchivedHumanTask
 *
 * ArchivedHumanTask: Zugriff auf "erledigte" Human Task Instanzen (HIT)
 */
'use strict';

/**
 * Resource used to access Bonita archived human tasks instances
 */
angular
    .module('ngBonita')
    .factory('ArchivedHumanTask', function ($resource, bonitaConfig, bonitaUtils) {

        var data = angular.extend({
            id : '@id',
            o : 'reached_state_date ASC'
        }, bonitaConfig.getDefaultPager());

        return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedHumanTask/:id', data, {
            getCompletedByCurrentUser : {
                method : 'GET',
                params : {
                    f  : function () {
                            return [ 'assigned_id=' + bonitaConfig.getUserId() ];
                    }
                },
                transformResponse : bonitaUtils.transformPaginateResponse()
            }
        });
    }); // END - FACTORY ArchivedHumanTask


/**********************************************************************************************************************
 * FACTORY ArchivedProcessInstance
 *
 * ArchivedProcessInstance: Zugriff auf "erledigte/archivierte" Fälle (Aufgaben)
 */
'use strict';

/**
 * Resource used to access Bonita archived process instances (cases)
 */
angular
    .module('ngBonita')
    .factory('ArchivedProcessInstance', function ($resource, bonitaConfig, bonitaUtils) {

        var data = angular.extend({
            id : '@id'
            }, bonitaConfig.getDefaultPager()
        );

        return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedCase/:id', data, {
            getStartedByCurrentUser : {
                method : 'GET',
                params : {
                    f  : function () {
                        return [ 'started_by=' + bonitaConfig.getUserId() ];
                    }
                },
                transformResponse : bonitaUtils.transformPaginateResponse()
            }
        });
    }); // END - FACTORY ArchivedProcessInstance


/**********************************************************************************************************************
 * FACTORY BonitaSession
 *
 * BonitaSession: Zugriff auf Informationen der Bonita-Session
 */
'use strict';

/**
 * Resource used to access Bonita session information
 * When using getCurrent, be careful to check for session properties (if no session exists an object without properties is returned)
 */
angular
    .module('ngBonita')
    .factory('BonitaSession', function ($resource, bonitaConfig) {
        return $resource(bonitaConfig.getBonitaUrl() + '/API/system/session/unused', {}, {
            getCurrent : {
                method : 'GET'
            }
        });
    }); // END - FACTORY BonitaSession


/**********************************************************************************************************************
 * FACTORY BusinessData
 *
 * BusinessData: Zugriff auf Informationen der Bonita-Session
 */
'use strict';

angular
	.module('ngBonita')
	.factory('BusinessData', function ($resource, bonitaConfig, bonitaUtils) {

        var data = angular.extend({
			businessDataType : '@businessDataType',
			q                : '@queryName',
			f                : '@fields',
			persistanceId    : '@persistenceId'

		    }, bonitaConfig.getDefaultPager()
        );
		
		//$resource(url,[paramDefaults],[actions],options);		
		return $resource(
			bonitaConfig.getBonitaUrl() + '/API/bdm/businessData/:businessDataType/:persistenceId', // url
			data, //paramDefaults
			{
				getDataQuery: {
					method: 'GET',
					params: {
						q: function () {
							return data.q;      //@queryName
						},
						f: function () {
							return data.f;      //@fields
						}
					},
					transformResponse: bonitaUtils.transformPaginateResponse()
				},// actions
				getBusinessData: {
					method: 'GET'					
				}
			});
	}); // END - FACTORY BusinessData


/**********************************************************************************************************************
 * FACTORY CaseDocument
 *
 * CaseDocument: Zugriff auf Prozessdokumente von Bonita
 */
'use strict';

/**
 * Resource used to access Bonita process documents
 * Available from Bonita 6.4 onward
 */
angular
    .module('ngBonita')
    .factory('CaseDocument', function ($resource, bonitaConfig, bonitaUtils) {

        var data = angular.extend({
            id : '@id'
            }, bonitaConfig.getDefaultPager()
        );

        return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/caseDocument/:id', data, {
            getUploadedByCurrentUser : {
                method : 'GET',
                params : {
                    f  : function () {
                        return [ 'submittedBy=' + bonitaConfig.getUserId() ];
                    }
                },
                transformResponse : bonitaUtils.transformPaginateResponse()
            },
            search : {
                method : 'GET',
                transformResponse : bonitaUtils.transformPaginateResponse()
            }
        });
    }); // END - FACTORY CaseDocument


/**********************************************************************************************************************
 * FACTORY HumanTask
 *
 * HumanTask: Zugriff auf HumanTasks von Bonita
 */
'use strict';

/**
 * Resource used to access Bonita human tasks instances
 */
angular
    .module('ngBonita')
    .factory('HumanTask', function ($resource, bonitaConfig, bonitaUtils) {
        var data = angular.extend({
                id  : '@id',
                o   : 'priority ASC'
            }, bonitaConfig.getDefaultPager()
        );

        return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/humanTask/:id', data, {
            getFromCurrentUser : {
                method : 'GET',
                params : {
                    f  : function () {
                            return [ 'state=ready', 'user_id=' + bonitaConfig.getUserId() ];
                    }
                },
                transformResponse : bonitaUtils.transformPaginateResponse()
            }
        });
    }); // END - FACTORY HumanTask


/**********************************************************************************************************************
 * FACTORY ProcessDefinition
 *
 * ProcessDefinition: Zugriff auf Prozessdefinitionen (Apps)
 */
'use strict';

/**
 * Resource used to access Bonita process definition (apps)
 */
angular
    .module('ngBonita')
    .factory('ProcessDefinition', function ($resource, bonitaConfig, bonitaUtils) {

        var data = angular.extend({
                id  : '@id',
                o   : 'displayName ASC'
            }, bonitaConfig.getDefaultPager()
        );

        return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/process/:id', data, {
            getStartableByCurrentUser : {
                method : 'GET',
                params : {
                    f  : function () {
                            return [ 'user_id=' + bonitaConfig.getUserId() ];
                    }
                },
                transformResponse : bonitaUtils.transformPaginateResponse()
            }
        });
    }); // END - FACTORY ProcessDefinition


/**********************************************************************************************************************
 * FACTORY ProcessInstance
 *
 * ProcessInstance: Zugriff auf Prozess-Instanzen (Cases)
 */
'use strict';

/**
 * Resource used to access Bonita process instances (cases)
 */
angular
    .module('ngBonita')
    .factory('ProcessInstance', function ($resource, bonitaConfig, bonitaUtils) {

        var data = angular.extend({
                id : '@id'
            }, bonitaConfig.getDefaultPager()
        );

        return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/case/:id', data, {
            getStartedByCurrentUser : {
                method : 'GET',
                params : {
                    f  : function () {
                        return [ 'started_by=' + bonitaConfig.getUserId() ];
                    }
                },
                transformResponse : bonitaUtils.transformPaginateResponse()
            }
        });
    }); // END - FACTORY ProcessInstance


/**********************************************************************************************************************
 * FACTORY User
 *
 * User: Zugriff auf den User
 */

/**
 * Resource used to access Bonita users
 * Methode, mit deren Hilfe Zugriff auf einen URL-Parameter (hier: (user)id) möglich ist.
 * .login -> .then{} -> User.get({id:2}) // Beispielhaft
 */
angular
    .module('ngBonita')
    .factory('User', function ($resource, bonitaConfig) {

        return $resource(bonitaConfig.getBonitaUrl() + '/API/identity/user/:id', {
            id : '@id'
        });
    }); // END - FACTORY User
