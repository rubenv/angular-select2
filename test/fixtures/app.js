angular.module("testapp", ["rt.select2"]).controller("TestController", function ($scope) {
    $scope.singleOptions = {
        1: "One",
        2: "Two"
    };

    $scope.singleOptionsArray = [
        { key: "1", value: "One" },
        { key: "2", value: "Two" },
    ];

    $scope.singleIntOptionsArray = [
        { key: 1, value: "One" },
        { key: 2, value: "Two" },
    ];

    $scope.multipleOptions = {
        1: "One",
        2: "Two",
        3: "Three",
        4: "Four"
    };

    $scope.multipleOptionsArray = [
        { key: "1", value: "One" },
        { key: "2", value: "Two" },
        { key: "3", value: "Three" },
        { key: "4", value: "Four" },
    ];

    $scope.multipleIntOptionsArray = [
        { key: 1, value: "One" },
        { key: 2, value: "Two" },
        { key: 3, value: "Three" },
        { key: 4, value: "Four" },
    ];

    $scope.values = {
        single: "1",
        singleInt: 1,
        multiple: ["1", "3"],
        multipleInt: [1, 3],
        query: 1,
        init: 5
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

    $scope.queryOptions = {
        query: function (query) {
            if (query.term === "T") {
                query.callback({
                    results: [
                        { id: 3, text: "C" },
                        { id: 4, text: "D" }
                    ]
                });
            } else {
                query.callback({
                    results: [
                        { id: 1, text: "A" },
                        { id: 2, text: "B" }
                    ]
                });
            }
        }
    };

    $scope.initOptions = {
        query: function (query) {
            query.callback({
                results: [
                    { id: 1, text: "A" },
                    { id: 2, text: "B" }
                ]
            });
        },
        initSelection: function (element, callback) {
            callback({ id: 5, text: "INIT" });
        }
    };
});
