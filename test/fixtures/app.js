angular.module('testapp', ['rt.select2'])
    .controller('TestController', function ($scope) {
        $scope.singleOptions = {
            "1": "One",
            "2": "Two"
        };
        
        $scope.multipleOptions = {
            "1": "One",
            "2": "Two",
            "3": "Three",
            "4": "Four"
        };

        $scope.values = {
            single: "1",
            multiple: ["1", "3"]
        };
    });
