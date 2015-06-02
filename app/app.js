
var App = angular.module('App', ['ngRoute', 'ngTable', 'ngTableExport','ui.bootstrap', 'ui-rangeSlider']);

//var linq = angular.module('linq', []);
//App.factory("linq", linq)
//var module = angular.module("App");
//module.factory("github", github);

App.directive('tpvFilter', function () {
    return {
        restrict: 'E',
        scope: { table: '=' },
        controller: function ($scope, gridService) {
            //$scope.filters1 = {}
            $scope.selectedPartCol;
            $scope.mainQuery = {};


            $scope.deletefilter = function (filterName) {

                console.log("deletefilter filter1: ", $scope.$parent.filters1)
                //$scope.$parent.filters1[filterName] = null;

                delete $scope.$parent.filters1[filterName];

                //var ele = angular.element(document.getElementByAttribute('name1','part_product'));
                var ele = angular.element(document.querySelectorAll("*[name1='"+ filterName +"']"));


                ele.remove();
                console.log("deletefilter filter1: ", $scope.$parent.filters1)


            }

            var onTPVError = function (reason) {
                $scope.error = "could not fetch the user";
            };

            var onQueryComplete = function (responseData) {
                $scope.$parent.onDataQueryComplete(responseData);
            }

            var onsaveFilterQueryComplete = function (responseData) {
                console.log("saved query postback", responseData)
            }


            var onGetSavedFiltersComplete = function (responseData) {
                console.log("onGetFiltersComplete: ", responseData)
                $scope.$parent.queries = responseData;
            }

            var onGetColumnMinMaxComplete = function (responseData) {
                var name = Object.keys(responseData)[0];

                $scope.$parent.filters1[name] = responseData[name];
                //$scope.$parent.filters1[name] = { 'min': 2, 'max': 9, 'modelmin': 2, 'modelmax': 9 };
                console.log("onGetColumnMinMaxComplete", responseData);
            }

            var onGetColumnValuesComplete = function (responseData) {
                if ($scope.selectedPartCol["type"] == "categorical") {
                    $scope.roles = []
                    var checked = []
                    $scope[$scope.selectedPartCol["text"]] = []
                    for (var i = 0; i < responseData.List.length; i++) {
                        if (responseData.List[i]) {
                            var s = responseData.List[i];
                            var dict1 = { "text": s };
                            ($scope[$scope.selectedPartCol["text"]]).push(dict1);
                        }
                    };
                    //$scope.filters1[$scope.selectedPartCol["text"]] = [];
                } else {
                    var temp_name = $scope.table + "_" + $scope.selectedPartCol["text"];

                    //this weere you set the data from the database
                    //$scope.$parent.filters1[temp_name] = { 'min': 2, 'max': 9, '$gte': 2, '$lte': 9 };
                    gridService.GetColumnMinMax($scope.table, $scope.selectedPartCol["text"]).then(onGetColumnMinMaxComplete, onTPVError);

                }
            };

            var onGetColumnNamesComplete = function (responseData) {
                console.log("filters: ", responseData)
                $scope.filters = responseData[$scope.table]
                $scope.filters = responseData;
                console.log("filters: ", $scope.filters)
            };

            $scope.$parent.getFilteredData = function () {
                console.log("getFilteredData", $scope)
                if (Object.keys($scope.$parent.filters1).length == 0) {
                    alert("empty")
                } else {
                    var dataToSend = angular.toJson($scope.$parent.filters1)
                    console.log("query", dataToSend)
                    gridService.getQueryData(dataToSend).then(onQueryComplete, onTPVError);
                }
            };



            $scope.$parent.runSavedQuery = function () {
                console.log("runSavedQuery", $scope)
                if (Object.keys($scope.$parent.filters1).length == 0) {

                    //$scope.$parent.filters1 = $scope.$parent.currentQuery.query;

                    //var dataToSend = angular.toJson($scope.$parent.filters1)
                    var dataToSend = $scope.$parent.currentQuery.query;
                    console.log("query", dataToSend)
                    gridService.getQueryPartData(dataToSend).then(onQueryComplete, onTPVError);
                } else {
                    var dataToSend = $scope.$parent.currentQuery.query;
                    console.log("query", dataToSend)
                    gridService.getQueryPartData(dataToSend).then(onQueryComplete, onTPVError);

                }
            };


            $scope.$parent.getFilteredPartData = function () {
                console.log($scope)
                if (Object.keys($scope.$parent.filters1).length == 0) {
                    alert("empty")
                } else {
                    console.log("query $scope.$parent.filters1", $scope.$parent.filters1)

                    var dataToSend = angular.toJson($scope.$parent.filters1)
                    console.log("query", dataToSend)
                    gridService.getQueryPartData(dataToSend).then(onQueryComplete, onTPVError);
                }
            };

            $scope.$parent.saveFilterQuery = function () {
                console.log($scope)
                if (Object.keys($scope.$parent.filters1).length == 0) {
                    alert("empty")
                } else {
                    console.log("query $scope.$parent.filters1", $scope.$parent.filters1)

                    var dataToSend = angular.toJson($scope.$parent.filters1)
                    console.log("query to be saved", dataToSend)
                    gridService.saveFilterQuery(dataToSend).then(onsaveFilterQueryComplete, onTPVError);
                }
            };

            $scope.onClickAddFilter = function () {
                $scope.selectedtable_col = $scope.table + "_" + $scope.selectedPartCol["text"];
                gridService.GetColumnValues($scope.selectedPartCol["text"], $scope.table).then(onGetColumnValuesComplete, onTPVError);
            };

            gridService.GetColumnNames($scope.table).then(onGetColumnNamesComplete, onTPVError);
            gridService.GetSavedFilters($scope.table).then(onGetSavedFiltersComplete, onTPVError);

        },
        templateUrl: 'app/shared/templates/filter/filter.html'
    }
});

App.directive("addfilter", function ($compile) {
    return function (scope, element, attrs) {
        scope: false,
        element.bind("click", function () {
            console.log("addfilter scope", scope);
            var str2 = scope.selectedtable_col
            var str1 = scope.selectedPartCol["text"];
            if (scope.selectedPartCol["type"] == "categorical") {
                angular.element(document.getElementById('testme')).append($compile("<div name1=" + str2 +"><div id=gBody categoricalbasedfilter name1=" + str2 + " customer= " + str1 + " roles=filters1['" + str1 + "']" + "></div><button ng-click=deletefilter('" + str2 +"')>deleteme</button></div>")(scope));
            } else {
                //http://wpad.intel.com/wpad.dat
                angular.element(document.getElementById('testme')).append($compile("<div id=gBody columnname=" + str2 + " rangebasedfilter $min=$parent.filters1." + str2 + ".$min  $max=$parent.filters1." + str2 + ".$max gte=$parent.filters1." + str2 + ".gte lte=$parent.filters1." + str2 + ".lte ></div>")(scope));
            }
        });
    };
});

App.directive('rangebasedfilter', function () {

    getTemplate = function () {
        var template2 = "<div  range-slider name={{columnname}} on-handle-up=handleUp(columnname,gte,lte,$min,$max)  min= $min  max=$max    model-min=gte  model-max=lte  step=1></div></div>"
        return template2
    }

    return {
        scope: {
            $min: "=",
            $max: "=",
            gte: "=",
            lte: "=",
            columnname: "@"
        },
        controller: function ($scope) {


            $scope.addTask = function () {
            };
            $scope.handleUp = function (name, modelmin, modelmax, min, max) {
                //$scope.$parent.$parent.filters1[name].min = min;
                //$scope.$parent.$parent.filters1[name].max = max;
                console.log("rangebasefilter", name);
                console.log("inside rangefilter",$scope.$parent.$parent.filters1)
                if (min <= modelmin) {

                    $scope.$parent.$parent.filters1[name]["gte"] = modelmin;

                }
                if (max >= modelmax) {
                    $scope.$parent.$parent.filters1[name]["lte"] = modelmax;

                }
            }
        },
        template: getTemplate()
    };
});

App.directive('categoricalbasedfilter', function () {

    getTemplate = function () {
        var template1 = '<div id="window"><div id="box" ng-repeat="cust in customer"><input name={{name1}} type="checkbox" ng-click="updateSelection($event, cust,table)">{{cust.text}}</div></div>'
        return template1
    }
    return {
        scope: {
            'customer': '=', //Two-way data binding
            'roles': '=',
            'name1': '@'
        },
        controller: function ($scope) {
            console.log("categoricalbasedfilterscope", $scope)

            $scope.selected = []
            $scope.$parent.$parent.filters1[$scope.name1] = $scope.selected;
            $scope.addTask = function () {
            };



            $scope.checkme = function () {
                alert("checked");
            }

            $scope.updateSelection = function ($event, id, table) {
                console.log("id checkebox", id);
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, id);
            };

            var updateSelected = function (action, id) {
                if (action === 'add') {
                    if (!$scope.$parent.$parent.filters1[$scope.name1]) {
                        $scope.$parent.$parent.filters1[$scope.name1] = $scope.selected;
                    }
                    $scope.selected.push(id["text"]);
                    console.log("checkedlist: ", $scope.selected);
                }
                if (action === 'remove') {
                    var index = $scope.selected.indexOf(id["text"]);
                    $scope.selected.splice(index, 1);
                    if ($scope.selected.length == 0) {
                        alert("0");
                        delete $scope.$parent.$parent.filters1[$scope.name1]
                    }
                    console.log("checkedlist: ", $scope.selected);
                }
            };
        },
        template: getTemplate()
    };
});

App.config(function ($routeProvider) {
  $routeProvider
    .when('/main', {
        templateUrl: 'app/components/main/main.html',
        controller: 'MainController'
    }).when('/part', {
        templateUrl: 'app/components/part/part.html',
        controller: 'PartController'
    }).otherwise({
      redirectTo: '/main'
    });
});

//https://github.com/esvit/ng-table/commit/cb4f8a6999add60e347b9baec6fb9f740cfb4c0f