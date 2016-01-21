/*
 * JBoss, Home of Professional Open Source.
 * Copyright 2014 Red Hat, Inc., and individual contributors
 * as indicated by the @author tags.
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
'use strict';

describe('Controller: TodoController', function () {

  // load the controller's module
  beforeEach(module('root.todo'));

  var ctrl,
      scope,
      mockUserInput;

  mockUserInput = [
    {
      label: 'Wash the car'
    },
    {
      label: 'Clean the dishes'
    },
    {
      label: 'Deploy orbital weapons platform'
    }
  ];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('TodoController', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  describe('method hasTodos', function () {
    it('should return false when the todo list is empty', function () {
      expect(ctrl.hasTodos()).toBe(false);
    });

    it('should return true when the todo list contains todos', function () {
      ctrl.todoList.push(mockUserInput[0]);
      expect(ctrl.hasTodos()).toBe(true);
    });
  });

  describe('method addTodo', function() {
    it('should add a todo to the todo list', function () {
      ctrl.addTodo(mockUserInput[0]);
      expect(ctrl.todoList.length).toEqual(1);
    })
  })

});
