angular.module('rt.select2', [])
    .value('select2Config', {})
    .directive('select2', function ($rootScope, $timeout, select2Config) {
    var options = {};

    if (select2Config) {
        angular.extend(options, select2Config);
    }

    return {
        require: 'ngModel',
        priority: 1,
        link: function (scope, element, attrs, controller) {
            var opts = angular.extend({}, options, scope.$eval(attrs.select2));
            var isMultiple = angular.isDefined(attrs.multiple) || opts.multiple;

            controller.$render = function () {
                if (isMultiple) {
                    //element.select2('data', controller.$viewValue);
                } else {
                    element.select2('val', controller.$viewValue);
                }
            };

            $timeout(function () {
                element.select2(opts);
                element.on('change', function (e) {
                    controller.$setViewValue(e.val);
                });
            });
        }
    };
});
