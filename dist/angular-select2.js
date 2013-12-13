(function () {
  'use strict';
  function sortedKeys(obj) {
    'use strict';
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys.sort();
  }
  angular.module('rt.select2', []).value('select2Config', {}).directive('select2', [
    '$rootScope',
    '$timeout',
    '$parse',
    'select2Config',
    function ($rootScope, $timeout, $parse, select2Config) {
      'use strict';
      var options = {};
      var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
      if (select2Config) {
        angular.extend(options, select2Config);
      }
      return {
        require: 'ngModel',
        priority: 1,
        link: function (scope, element, attrs, controller) {
          var opts = angular.extend({}, options, scope.$eval(attrs.select2));
          var isMultiple = angular.isDefined(attrs.multiple) || opts.multiple;
          var match;
          if (!(match = attrs.ngOptions.match(NG_OPTIONS_REGEXP))) {
            throw new Error('Invalid ngOptions encountered!');
          }
          var displayFn = $parse(match[2] || match[1]);
          var valuesFn = $parse(match[7]);
          var valueName = match[4] || match[6];
          var valueFn = $parse(match[2] ? match[1] : valueName);
          var keyName = match[5];
          controller.$render = function () {
            var values = valuesFn(scope);
            var keys = keyName ? sortedKeys(values) : values;
            var selection = [];
            for (var i = 0; i < keys.length; i++) {
              var locals = {};
              var key = i;
              if (keyName) {
                key = keys[i];
                locals[keyName] = key;
              }
              locals[valueName] = values[key];
              var value = valueFn(scope, locals);
              if (isMultiple) {
                if (controller.$viewValue && controller.$viewValue.indexOf(value) > -1) {
                  selection.push({
                    id: value,
                    text: displayFn(scope, locals)
                  });
                }
              } else {
                if (controller.$viewValue === value) {
                  element.select2('val', key);
                }
              }
            }
            if (isMultiple) {
              element.select2('data', selection);
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
    }
  ]);
}());