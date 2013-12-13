angular.module('testapp', ['rt.select2']).controller('TestController', function ($scope) {
    $scope.singleOptions = {
        "1": "One",
        "2": "Two"
    };

    $scope.singleOptionsArray = [
        { key: "1", value: "One" },
        { key: "2", value: "Two" },
    ];
    
    $scope.multipleOptions = {
        "1": "One",
        "2": "Two",
        "3": "Three",
        "4": "Four"
    };

    $scope.multipleOptionsArray = [
        { key: "1", value: "One" },
        { key: "2", value: "Two" },
        { key: "3", value: "Three" },
        { key: "4", value: "Four" },
    ];

    $scope.values = {
        single: "1",
        multiple: ["1", "3"]
    };

    $scope.selectOptions = {
        query: function (query) {
            query.callback({
                results: [
                    { id: "1", text: "A" },
                    { id: "2", text: "B" }
                ]
            });
        }
    };
});
