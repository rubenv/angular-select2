angular.module("rt.select2", [])
    .value("select2Config", {})
    .factory("select2Stack", function () {
        var stack = [];

        return {
            $register: function (callbackElem) {
                stack.push(callbackElem);
            },
            $unregister: function (callbackElem) {
                var idx = stack.indexOf(callbackElem);
                if (idx !== -1) {
                    stack.splice(idx, 1);
                }
            },
            closeAll: function () {
                stack.forEach(function (elem) {
                    elem.close();
                });
            }
        };
    })
    .directive("select2", function ($rootScope, $timeout, $parse, $filter, select2Config, select2Stack) {
        "use strict";

        var defaultOptions = {};

        if (select2Config) {
            angular.extend(defaultOptions, select2Config);
        }

        return {
            require: "ngModel",
            scope: {
                ngModel: "=",
                options: "="
            },
            priority: 1,
            restrict: "E",
            transclude: true, // transclusion instructs angular to embed the original content from the DOM into the resultant output
            template: "<select ng-transclude></select>",
            replace: true,
            link: function (scope, element, attrs, controller) {
                var opts = angular.extend({}, defaultOptions, scope.options);
                var isMultiple = angular.isDefined(attrs.multiple) || opts.multiple;

                opts.multiple = isMultiple;

                if (attrs.placeholder) {
                    opts.placeholder = attrs.placeholder;
                }

                // register with the select2stack
                var controlObj = {
                    close: function () {
                        element.select2("close");
                    }
                };
                select2Stack.$register(controlObj);
                scope.$on("destroy", function () {
                    select2Stack.$unregister(controlObj);
                });

                // initiate select2
                $timeout(function () {
                    element.select2(opts);

                    element.on("select2-blur", function () {
                        if (controller.$touched) {
                            return;
                        }
                        controller.$setTouched();
                    });

                });

                // make sure that changes to the value is reflected in the select2 input
                scope.$watch("ngModel", function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    $timeout(function () {
                        element.trigger("change");
                    });
                });

            }
        };
    });
