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
  var m = angular.module('rt.select2', []);
  m.value('select2Config', {});
  m.directive('select2', [
    '$rootScope',
    '$timeout',
    '$parse',
    'select2Config',
    function ($rootScope, $timeout, $parse, select2Config) {
      'use strict';
      var defaultOptions = {};
      //0000111110000000000022220000000000000000000000333300000000000000444444444444444000000000555555555555555000000066666666666666600000000000000007777000000000000000000088888
      var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
      if (select2Config) {
        angular.extend(defaultOptions, select2Config);
      }
      return {
        require: 'ngModel',
        priority: 1,
        restrict: 'E',
        template: '<input type="hidden"></input>',
        replace: true,
        link: function (scope, element, attrs, controller) {
          var getOptions;
          var opts = angular.extend({}, defaultOptions, scope.$eval(attrs.options));
          var isMultiple = angular.isDefined(attrs.multiple) || opts.multiple;
          opts.multiple = isMultiple;
          if (attrs.placeholder) {
            opts.placeholder = attrs.placeholder;
          }
          var modelFn = $parse(attrs.ngModel);
          // All values returned from Select2 are strings. This is a problem
          // if you supply integer indexes: they'll become strings once
          // passing through this directive. We keep a mapping between string
          // keys and values the optionValues object, to be able to return
          // the correctly typed value.
          var optionValues = {};
          if (attrs.ngOptions) {
            var match;
            if (!(match = attrs.ngOptions.match(NG_OPTIONS_REGEXP))) {
              throw new Error('Invalid ngOptions encountered!');
            }
            var displayFn = $parse(match[2] || match[1]);
            var valuesFn = $parse(match[7]);
            var valueName = match[4] || match[6];
            var valueFn = $parse(match[2] ? match[1] : valueName);
            var keyName = match[5];
            getOptions = function (callback) {
              var values = valuesFn(scope);
              var keys = (keyName ? sortedKeys(values) : values) || [];
              var options = [];
              for (var i = 0; i < keys.length; i++) {
                var locals = {};
                var key = i;
                if (keyName) {
                  key = keys[i];
                  locals[keyName] = key;
                }
                locals[valueName] = values[key];
                var value = valueFn(scope, locals);
                var label = displayFn(scope, locals) || '';
                // Select2 returns strings, we use a dictionary to get
                // back to the original value.
                optionValues[value] = value;
                options.push({
                  id: value,
                  text: label,
                  obj: values[key]
                });
              }
              callback(options);
            };
            opts.query = function (query) {
              var values = valuesFn(scope);
              var keys = (keyName ? sortedKeys(values) : values) || [];
              var options = [];
              for (var i = 0; i < keys.length; i++) {
                var locals = {};
                var key = i;
                if (keyName) {
                  key = keys[i];
                  locals[keyName] = key;
                }
                locals[valueName] = values[key];
                var value = valueFn(scope, locals);
                var label = displayFn(scope, locals) || '';
                if (label.toLowerCase().indexOf(query.term.toLowerCase()) > -1) {
                  options.push({
                    id: value,
                    text: label,
                    obj: values[key]
                  });
                }
              }
              query.callback({ results: options });
            };
            // Make sure changes to the options get filled in
            scope.$watch(match[7], function () {
              controller.$render();
            });
          } else {
            if (!opts.query) {
              throw new Error('You need to supply a query function!');
            }
            getOptions = function (callback) {
              opts.query({
                term: '',
                callback: function (query) {
                  for (var i = 0; i < query.results.length; i++) {
                    var result = query.results[i];
                    optionValues[result.id] = result.id;
                  }
                  callback(query.results);
                }
              });
            };
          }
          function getSelection(callback) {
            getOptions(function (options) {
              var selection = [];
              for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (isMultiple) {
                  var viewValue = controller.$viewValue || [];
                  if (viewValue.indexOf(option.id) > -1) {
                    selection.push(option);
                  }
                } else {
                  if (optionValues[controller.$viewValue] === option.id) {
                    callback(option);
                    return;
                  }
                }
              }
              callback(selection);
            });
          }
          controller.$render = function () {
            getSelection(function (selection) {
              if (isMultiple) {
                element.select2('data', selection);
              } else {
                element.select2('val', selection.id);
              }
            });
          };
          opts.initSelection = function (element, callback) {
            getSelection(callback);
          };
          $timeout(function () {
            element.select2(opts);
            element.on('change', function (e) {
              scope.$apply(function () {
                if (isMultiple) {
                  var vals = [];
                  for (var i = 0; i < e.val.length; i++) {
                    vals[i] = optionValues[e.val[i]];
                  }
                  modelFn.assign(scope, vals);
                } else {
                  modelFn.assign(scope, optionValues[e.val]);
                }
              });
            });
            controller.$render();
          });
        }
      };
    }
  ]);
}());