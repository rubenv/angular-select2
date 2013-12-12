angular.module('testapp', ['rt.select2'])
    .controller('TestController', function ($scope) {
        $scope.singleOptions = {
            "1": "One",
            "2": "Two"
        };

        $scope.values = {
            single: "1"
        };
    });
