/**
 * angular-permission
 * Route permission and access control as simple as it can get
 * @version v0.1.6 - 2014-12-01
 * @link http://www.rafaelvidaurre.com
 * @author Rafael Vidaurre <narzerus@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function () {
  'use strict';

  angular.module('permission', ['ui.router'])
    .run(['$rootScope', 'Permission', '$state', function ($rootScope, Permission, $state) {
      $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        // If there are permissions set then prevent default and attempt to authorize
        var permissions;
        if (toState.data && toState.data.permissions) {
          permissions = toState.data.permissions;
        } else if (toState.permissions) {
          /**
          * This way of defining permissions will be depracated in v1. Should use
          * `data` key instead
          */
          console.log('Deprecation Warning: permissions should be set inside the `data` key ');
          console.log('Setting permissions for a state outside `data` will be depracated in' +
            ' version 1');
          permissions = toState.permissions;
        }

        if (permissions) {
          event.preventDefault();

          Permission.authorize(permissions, toParams).then(function () {
            // If authorized, use call state.go without triggering the event.
            // Then trigger $stateChangeSuccess manually to resume the rest of the process
            // Note: This is a pseudo-hacky fix which should be fixed in future ui-router versions
            if (!$rootScope.$broadcast('$stateChangeStart', toState.name, toParams, fromState.name, fromParams).defaultPrevented) {
              $rootScope.$broadcast('$stateChangePermissionAccepted', toState, toParams);

              $state.go(toState.name, toParams, {notify: false}).then(function() {
                $rootScope
                  .$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
              });
            }
          }, function () {
            if (!$rootScope.$broadcast('$stateChangeStart', toState.name, toParams, fromState.name, fromParams).defaultPrevented) {
              $rootScope.$broadcast('$stateChangePermissionDenied', toState, toParams);

              // If not authorized, redirect to wherever the route has defined, if defined at all
              var redirectTo = permissions.redirectTo;
              if (redirectTo) {
                $state.go(redirectTo, toParams, {notify: false}).then(function() {
                  $rootScope
                    .$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
                });
              }
            }
          });
        }
      });
    }]);
}());

(function () {
  'use strict';

  angular.module('permission')
    .provider('Permission', function () {
      var roleValidationConfig = {};
      var validateRoleDefinitionParams = function (roleName, validationFunction) {
        if (!angular.isString(roleName)) {
          throw new Error('Role name must be a string');
        }
        if (!angular.isFunction(validationFunction)) {
          throw new Error('Validation function not provided correctly');
        }
      };

      this.defineRole = function (roleName, validationFunction) {
        /**
          This method is only available in config-time, and cannot access services, as they are
          not yet injected anywere which makes this kinda useless.
          Should remove if we cannot find a use for it.
        **/
        validateRoleDefinitionParams(roleName, validationFunction);
        roleValidationConfig[roleName] = validationFunction;

        return this;
      };

      this.$get = ['$q', function ($q) {
        var Permission = {
          _promiseify: function (value) {
            /**
              Converts a value into a promise, if the value is truthy it resolves it, otherwise
              it rejects it
            **/
            if (value && angular.isFunction(value.then)) {
              return value;
            }

            var deferred = $q.defer();
            if (value) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
            return deferred.promise;
          },
          _validateRoleMap: function (roleMap) {
            if (typeof(roleMap) !== 'object' || roleMap instanceof Array) {
              throw new Error('Role map has to be an object');
            }
            if (roleMap.only === undefined && roleMap.except === undefined) {
              throw new Error('Either "only" or "except" keys must me defined');
            }
            if (roleMap.only) {
              if (!(roleMap.only instanceof Array)) {
                throw new Error('Array of roles expected');
              }
            } else if (roleMap.except) {
              if (!(roleMap.except instanceof Array)) {
                throw new Error('Array of roles expected');
              }
            }
          },
          _findMatchingRole: function (rolesArray, toParams) {
            var roles = angular.copy(rolesArray);
            var deferred = $q.defer();
            var currentRole = roles.shift();

            // If no roles left to validate reject promise
            if (!currentRole) {
              deferred.reject();
              return deferred.promise;
            }
            // Validate role definition exists
            if (!angular.isFunction(Permission.roleValidations[currentRole])) {
              throw new Error('undefined role or invalid role validation');
            }

            var validatingRole = Permission.roleValidations[currentRole](toParams);
            validatingRole = Permission._promiseify(validatingRole);

            validatingRole.then(function () {
              deferred.resolve();
            }, function () {
              Permission._findMatchingRole(roles, toParams).then(function () {
                deferred.resolve();
              }, function () {
                deferred.reject();
              });
            });

            return deferred.promise;
          },
          defineRole: function (roleName, validationFunction) {
            /**
              Service-available version of defineRole, the callback passed here lives in the
              scope where it is defined and therefore can interact with other modules
            **/
            validateRoleDefinitionParams(roleName, validationFunction);
            roleValidationConfig[roleName] = validationFunction;

            return Permission;
          },
          resolveIfMatch: function (rolesArray, toParams) {
            var roles = angular.copy(rolesArray);
            var deferred = $q.defer();
            Permission._findMatchingRole(roles, toParams).then(function () {
              // Found role match
              deferred.resolve();
            }, function () {
              // No match
              deferred.reject();
            });
            return deferred.promise;
          },
          rejectIfMatch: function (roles, toParams) {
            var deferred = $q.defer();
            Permission._findMatchingRole(roles, toParams).then(function () {
              // Role found
              deferred.reject();
            }, function () {
              // Role not found
              deferred.resolve();
            });
            return deferred.promise;
          },
          roleValidations: roleValidationConfig,
          authorize: function (roleMap, toParams) {
            // Validate input
            Permission._validateRoleMap(roleMap);

            var authorizing;

            if (roleMap.only) {
              authorizing = Permission.resolveIfMatch(roleMap.only, toParams);
            } else {
              authorizing = Permission.rejectIfMatch(roleMap.except, toParams);
            }

            return authorizing;
          }
        };

        return Permission;
      }];
    });

}());
