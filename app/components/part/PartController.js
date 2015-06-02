(function () {

    var app = angular.module("App");


    var PartController = function ($scope, $filter, linq, gridService, ngTableParams, $rootScope, $window, $location) {

        var columns = [];
        $scope.columns1 = [];
        $scope.filter_dict = { RecordId: "" };
        $scope.groupby = '-';
        $scope.filters1 = {}

        var data = [];


        $scope.onDataQueryComplete = function (responseData) {
            data = []
            console.log("onDataQueryComplete scope:", $scope)
            console.log("onDataQueryComplete responsedata:", responseData);
            if ($scope.tableParams) {
                data = responseData.data;
                $scope.tableParams.reload();
            }


        };
        
        var onDataComplete = function (responseData) {

            console.log("mydata", responseData);
            console.log(responseData.RecordValue);
            $scope.records = responseData;
            data = responseData;

            var d = [];
            var data1 = linq.Enumerable.From(responseData);
            console.log(data1)

            data1.ForEach(function (entry) {
                var keys = Object.keys(entry);
                columns = columns.merge(keys);
            });

            for (var i = 0; i < columns.length; i++) {
                if (columns[i] == '_id') {
                    $scope.columns1.push({ title: columns[i], visible: false, hidden1: true });

                } else if (columns[i] == 'RecordId') {
                    $scope.columns1.push({ title: columns[i], visible: false, hidden1: true });

                } else {
                    if (columns[i] == "PartID" || columns[i] == "Product" || columns[i] == "Stepping" || columns[i] == "QDF" || columns[i] == "Notes") {
                        $scope.columns1.push({ title: columns[i], visible: true, hidden1: false });

                    } else {
                        $scope.columns1.push({ title: columns[i], visible: false, hidden1: false });

                    }

                }

            }

            //if adding this in the body, next and previous won't work
            //also filter : { name: "M"} has not effect
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 5,           // count per page
                filter: {
                    name: 'M'       // initial filter
                }
            }, {
                total: data.length, // length of data
                groupBy: $scope.groupby,
                getData: function ($defer, params) {
                    //console.log(params.sorting());
                    var filteredData = $scope.filter_dict ? $filter('filter')(data, $scope.filter_dict) : data;
                    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                }
            });



        };



       var onTPVError = function (reason) {
           $scope.error = "could not fetch the user";
       };

       var onsaveRowComplete = function (responseData) {

       }


        $scope.$watch("filter_dict", function () {
            if ($scope.filter_dict && $scope.tableParams) {
                $scope.tableParams.reload();
            }
        }, true);


        $scope.$watch('groupby', function (value) {
            if (value) {
                $scope.tableParams.settings().groupBy = value.title;
            } else {
                $scope.tableParams.settings().groupBy = "-";
            }
            $scope.tableParams.reload();
        }, true);

        Array.prototype.merge = function (/* variable number of arrays */) {
            for (var i = 0; i < arguments.length; i++) {
                var array = arguments[i];
                for (var j = 0; j < array.length; j++) {
                    if (this.indexOf(array[j]) === -1) {
                        this.push(array[j]);
                    }
                }
            }
            return this;
        };

        var onError = function (reason) {
            $scope.error = "could not fetch the user";
        };

        //** save a row -- user **//
        $scope.saveRow = function(user){
            gridService.saveRow(user).then(onsaveRowComplete, onTPVError);
            /*
            delete row["$$hashKey"]
            delete row["$edit"]
            delete row["_id"]

            console.log(typeof (row))

            console.log("Adding Row: ", row);
            $.ajax({
                type: "POST",
                data: JSON.stringify({ 'RecordValue': row }),
                url: "http://localhost:26368/api/PowerInformation/saveRow",
                contentType: "application/json"
            });*/

        }


        var oldRow = {}

        $scope.takeRowSnapshot = function (row) {

            oldRow[row._id] = {};
            for (key in row) {
                console.log(key)
                if (key.substring(0, 1) != '$') {
                    oldRow[row._id][key] = row[key];
                }
            }
            console.log("old row: ", oldRow[row._id]);
        }

        $scope.recoverRow = function (row) {
            for (var i = 0; i < data.length; i++) {
                if (data[i]._id == row._id) {
                    console.log("Found: ", row._id, oldRow);
                    console.log("New Row: ", data[i])
                    for (key in oldRow[row._id]) {
                        console.log(data[i][key], "--", oldRow[row._id][key]);
                        data[i][key] = oldRow[row._id][key];
                    }
                    oldRow[row._id] = {}
                }
            }
        }

        //** datetimepicker settings **//

        $scope.toggleMinFrom = function () {
            $scope.minDateFrom = $scope.minDateFrom ? null : new Date();
        };
        $scope.toggleMinFrom();

        $scope.openFrom = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedFrom = true;
        };

        $scope.dateOptionsFrom = {
            formatYear: 'yy',
            startingDay: 1
        };
        //** datetimepicker settings **//


        gridService.getData1().then(onDataComplete, onError);
    }

    app.controller("PartController", PartController);




} ());


//http://www.codeproject.com/Articles/808257/Part-Data-Binding-In-AngularJS
//nice one
//http://plnkr.co/edit/MPgabxFgegKegPYjYGm1?p=preview
//http://plnkr.co/edit/EXVkjabwfjCreNZAY1c2?p=preview
//http://plnkr.co/edit/7rBDSU?p=preview

//grouping
//http://plnkr.co/edit/c9B2qL?p=info