angular.module('de.voan.todo', [
    'templates-app',
    'templates-common',
    'ngRoute',
    'de.voan.todo.services'
])
    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            controller: 'de.voan.todo.index',
            templateUrl: 'de/voan/todo/todo-index.html'
        });
    })

    .controller('de.voan.todo.index', function ($scope, Hoodie, Todo) {
        $scope.todos = [];
        $scope.todosCount = 0;

        var query = function () {
            Todo.findAll().done(function (todos) {
                $scope.todos = todos;
                $scope.todosCount = Object.keys(todos).length;
            });
        };

        query();

        Todo.register(function (event, obj) {
            query();
            $scope.$digest();
        });

        $scope.add = function () {
            Todo.add({title: $scope.newTodo});
            $scope.newTodo = '';
        };

        $scope.check = function (item) {
            item.done = true;
            Todo.update(item);
        };

        $scope.remove = function (item) {
            Todo.remove(item);
        };
    });
