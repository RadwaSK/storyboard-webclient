/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 * Copyright (c) 2016 Codethink Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * The StoryBoard administration module.
 */
angular.module('sb.admin', [ 'sb.services', 'sb.templates', 'sb.util',
    'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, PermissionResolver) {
        'use strict';

        // Routing Defaults.
        $urlRouterProvider.when('/admin', '/admin/user');

        // Declare the states for this module.
        $stateProvider
            .state('sb.admin', {
                abstract: true,
                views: {
                    'submenu@': {
                        templateUrl: 'app/admin/template/admin_submenu.html'
                    },
                    '@': {
                        template: '<div ui-view></div>'
                    }
                },
                url: '/admin',
                resolve: {
                    isSuperuser: PermissionResolver
                        .requirePermission('is_superuser', true)
                }
            })
            .state('sb.admin.user', {
                url: '/user',
                templateUrl: 'app/admin/template/user.html',
                controller: 'UserAdminController'
            })
            .state('sb.admin.user_edit', {
                url: '/user/:id',
                templateUrl: 'app/admin/template/user_edit.html',
                controller: 'UserEditController',
                resolve: {
                    user: function ($stateParams, User) {
                        return User.get({id: $stateParams.id}).$promise;
                    }
                }
            })
            .state('sb.admin.team', {
                url: '/team',
                templateUrl: 'app/admin/template/team.html',
                controller: 'TeamAdminController'
            })
            .state('sb.admin.team_edit', {
                url: '/team/:id',
                templateUrl: 'app/admin/template/team_edit.html',
                controller: 'TeamEditController',
                resolve: {
                    team: function ($stateParams, Team) {
                        return Team.get({team_id: $stateParams.id}).$promise;
                    },
                    members: function($stateParams, Team) {
                        return Team.UsersController.get({
                            team_id: $stateParams.id
                        }).$promise;
                    }
                }
            });
    });
