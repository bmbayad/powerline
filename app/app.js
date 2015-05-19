
var App = angular.module('App', ['ngRoute', 'ngTable', 'ngTableExport','ui.bootstrap', 'ui-rangeSlider']);

//var linq = angular.module('linq', []);
//App.factory("linq", linq)
//var module = angular.module("App");
//module.factory("github", github);

App.directive('tpvFilter', function () {
    return {
        restrict: 'E',
        scope: { table: '='},
        controller: function ($scope, gridService) {
            $scope.filters1 = {}
            $scope.selectedPartCol;
            $scope.mainQuery = {};

            var onTPVError = function (reason) {
                $scope.error = "could not fetch the user";
            };

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
                    $scope.filters1[temp_name] = { 'min': 2, 'max': 9, 'modelmin': 2, 'modelmax': 9 };
                }
            };

            var onGetColumnNamesComplete = function (responseData) {
                $scope.filters = responseData[$scope.table]
            };

            $scope.onClickAddFilter = function () {
               
                $scope.selectedtable_col = $scope.table + "_" + $scope.selectedPartCol["text"];
                gridService.GetColumnValues($scope.selectedPartCol["text"], $scope.table).then(onGetColumnValuesComplete, onTPVError);
            };

            gridService.GetColumnNames($scope.table).then(onGetColumnNamesComplete, onTPVError);

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
                angular.element(document.getElementById('testme')).append($compile("<div id=gBody categoricalbasedfilter name1=" + str2 + " customer= " + str1 + " roles=filters1['" + str1 + "']" + "></div>")(scope));
            } else {
                //http://wpad.intel.com/wpad.dat
                angular.element(document.getElementById('testme')).append($compile("<div id=gBody columnname=" + str2 + " rangebasedfilter min=filters1." + str2 + ".min  max=filters1." + str2 + ".max modelmin=filters1." + str2 + ".modelmin modelmax=filters1." + str2 + ".modelmax ></div>")(scope));
            }
        });
    };
});

App.directive('rangebasedfilter', function () {

    getTemplate = function () {
        var template2 = "<div  range-slider name={{columnname}} on-handle-up=handleUp(columnname,modelmin,modelmax)  min= min  max=max    model-min=modelmin  model-max=modelmax  step=1></div></div>"
        return template2
    }

    return {
        scope: {
            min: "=",
            max: "=",
            modelmin: "=",
            modelmax: "=",
            columnname: "@",
        },
        controller: function ($scope) {


            $scope.addTask = function () {
            };
            $scope.handleUp = function (name, modelmin, modelmax) {
                $scope.$parent.filters1[name].modelmin = modelmin;
                $scope.$parent.filters1[name].modelmax = modelmax;
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
            $scope.$parent.filters1[$scope.name1] = $scope.selected;
            $scope.addTask = function () {
            };

            $scope.checkme = function () {
                alert("checked");
            }

            $scope.updateSelection = function ($event, id, table) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, id);
            };

            var updateSelected = function (action, id) {
                if (action === 'add') {
                    $scope.selected.push(id["text"]);
                    console.log("checkedlist: ", $scope.selected);
                }
                if (action === 'remove') {
                    $scope.selected.splice(id["text"], 1);
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