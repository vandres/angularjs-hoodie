angular.module('de.voan.todo.services', [])
    .factory('Hoodie', function () {
        var hoodie = new Hoodie();
        hoodie.account.signIn('dachcom', 'wayne');

        return {
            get: function () {
                return hoodie;
            }
        };
    })
    .factory('Todo', function (Hoodie) {
        var hoodie = Hoodie.get(),
            handlers = [],
            register = function (fn) {
                handlers.push(fn);
            },
            unregister = function (fn) {
                handlers = handlers.filter(
                    function (item) {
                        if (item !== fn) {
                            return item;
                        }
                    }
                );
            },
            notify = function (o, thisObj) {
                var obj = thisObj || window;
                handlers.forEach(function (item) {
                    item(o, obj);
                });
            },
            generateUUID = function () {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },
            findInternally = function () {
                var deferred = $.Deferred();

                hoodie.store.findOrAdd('todos', 'todos', {items: {}}).done(function (todos) {
                    deferred.resolve(todos);
                });

                return deferred.promise();
            };

        hoodie.store.on('change:todos', function (event, obj) {
            notify(event, obj);
        });

        return {
            handlers: [],

            register: function (fn) {
                register(fn);
            },

            unregister: function (fn) {
                unregister(fn);
            },

            find: function () {
                return this.findAll();
            },

            findAll: function () {
                var deferred = $.Deferred();

                findInternally().then(function (todos) {
                    deferred.resolve(todos.items);
                });

                return deferred.promise();
            },

            add: function (todo) {
                todo.uuid = generateUUID();
                findInternally().then(function (todos) {
                    todos.items[todo.uuid] = todo;
                    hoodie.store.update('todos', todos.id, todos);
                });
            },

            update: function (todo) {
                findInternally().then(function (todos) {
                    todos.items[todo.uuid] = todo;
                    hoodie.store.update('todos', todos.id, todos);
                });
            },

            remove: function (todo) {
                findInternally().then(function (todos) {
                    delete todos.items[todo.uuid];
                    hoodie.store.update('todos', todos.id, todos);
                });
            }
        };
    });
