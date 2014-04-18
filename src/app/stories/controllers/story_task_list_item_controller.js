/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Controller for our story list.
 */
angular.module('sb.story').controller('StoryTaskListItemController',
    function ($scope, $state, $modal, Project, Session, Task) {
        'use strict';

        var projectId = $scope.task.project_id || null;

        if (!!projectId) {
            Project.get({id: projectId},
                function (project) {
                    $scope.project = project;
                }, function () {
                    $scope.project = null;
                });
        }

        /**
         * Updates this task's status
         */
        $scope.updateStatus = function (status) {
            $scope.task.status = status;
            $scope.task.$update();
        };

        /**
         * UI Toggle for when the edit form should be displayed.
         */
        $scope.showTaskEditForm = false;

        /**
         * Scope method to toggle said edit form.
         */
        $scope.toggleEditForm = function () {
            if (Session.isLoggedIn()) {
                $scope.showTaskEditForm = !$scope.showTaskEditForm;
            } else {
                $scope.showTaskEditForm = false;
            }
        };

        /**
         * Removes this task
         */
        $scope.removeTask = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/templates/story/delete_task.html',
                controller: 'StoryTaskDeleteController',
                resolve: {
                    task: function () {
                        return $scope.task;
                    }
                }
            });

            modalInstance.result.then(
                function () {
                    $scope.loadTasks();
                }
            );
        };

        /**
         * Cancel the edit form
         */
        $scope.cancelTask = function () {
            Task.read({id: $scope.task.id},
                function (task) {
                    $scope.task = task;
                });
            $scope.showTaskEditForm = false;
        };

        /**
         * Removes this task
         */
        $scope.updateTask = function () {
            $scope.task.$update(function () {
                $scope.loadTasks(); // Reload
                $scope.showTaskEditForm = false;
            });
        };
    });