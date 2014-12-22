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
            };

        hoodie.store.on('todo:change', notify);

        return {
            handlers: [],

            register: function (fn) {
                register(fn);
            },

            unregister: function (fn) {
                unregister(fn);
            },

            findAll: function () {
                return hoodie.store.findAll('todo');
            },

            add: function (todo) {
                return hoodie.store.add('todo', todo);
            },
            update: function (todo) {
                return hoodie.store.update('todo', todo.id, todo);
            },
            remove: function (todo) {
                return hoodie.store.remove('todo', todo.id);
            }
        };
    });
