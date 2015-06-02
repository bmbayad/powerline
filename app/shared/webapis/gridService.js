


(function () {

    var gridService = function ($http) {

        var getData = function () {

            //return $http.get("http://cmvsvr01.amr.corp.intel.com:8081/BI1/api/PartInformation/Search/{RecordId = '8000'}}").then(function (response) {
            return $http.get("http://localhost:26368/api/PartInformation/Search/{RecordId =  { $in = ['7184','7183']}}").then(function (response) {
                console.log(response);
                return response.data;
            });
        };

        var getData1 = function () {
            return $http.get("http://localhost:26368/api/PartInformation1").then(function (response) {
                return response.data;
            });
        };

        var getPartDataByProduct = function (product) {
            return $http.get("http://localhost:26368/api/PartInformation1/Product/"+product).then(function (response) {
                return response.data;
            });
        };

        var getDataBoardInformation = function () {
            return $http.get("http://localhost:26368/api/BoardInformation").then(function (response) {
                return response.data;
            });
        };

        var getDataBoardInformationHistory = function (board) {
            console.log("Inisde gridservice: ", board);
            return $http.get("http://localhost:26368/api/BoardInformation/History/"+ board).then(function (response) {
                return response.data;
            });
        };

        var getAttributes = function (attribute, type) {
            if (type == "part") {
                    return $http.get("http://localhost:26368/api/PowerInformation/Part/Filter/" + attribute).then(function (response) {
                        return response.data;
                    });
            }
        }


        var getPowerFilters = function () {
            //console.log("Inisde gridservice: ", board);
            return $http.get("http://localhost:26368/api/PowerInformation/Filters").then(function (response) {
                return response.data;
            });
        };
        
        var getDataExperimentInformation = function () {
            return $http.get("http://localhost:26368/api/ExperimentInformation").then(function (response) {
                return response.data;
            });
        };


        var getPowerDataInformation = function () {
            return $http.get("http://localhost:26368/api/PowerInformation/").then(function (response) {
                return response.data;
            });
        };


        var getPowerDataInformationbyId = function (id) {
            return $http.get("http://localhost:26368/api/PowerInformation/" + id).then(function (response) {
                return response.data;
            });
        };

        var getProducts = function () {
            return $http.get("http://localhost:26368/api/PartInformation/Products").then(function (response) {
                return response.data;
            });
        };

        var getSteppings = function () {
            return $http.get("http://localhost:26368/api/PartInformation/Steppings").then(function (response) {
                return response.data;
            });
        };

        var getMaxRecordId = function () {
            return $http.get("http://localhost:26368/api/PartInformation/MaxRecordId").then(function (response) {
                return response.data;
            });
        };

        var GetColumnValues = function(col,table){
                return $http.get("http://localhost:26368/api/PowerInformation/ColumnValues/" + table + "/" +  col ).then(function (response) {
                    return response.data;
                });
        };
        
        var GetColumnNames = function(table){
                return $http.get("http://localhost:26368/api/PowerInformation/ColumnsNames/" + table).then(function (response) {
                    return response.data;
                });
        };

        var getQueryData = function (query) {
            var req = {
                method: 'POST',
                url: "http://localhost:26368/api/PowerInformation/query",
                headers: {
                    'Content-Type': "application/json",
                    'dataType': "json"
                },
                data: query
            }
        return $http(req).success(function (response) { return response.data });
        };

        
        var getQueryPartData = function (query) {
            var req = {
                method: 'POST',
                url: "http://localhost:26368/api/PowerInformation/partquery",
                headers: {
                    'Content-Type': "application/json",
                    'dataType': "json"
                },
                data: query
            }
        return $http(req).success(function (response) { return response.data });
        };

        var saveFilterQuery = function (query) {
            var req = {
                method: 'POST',
                url: "http://localhost:26368/api/PowerInformation/partsavequery",
                headers: {
                    'Content-Type': "application/json",
                    'dataType': "json"
                },
                data: query
            }
        return $http(req).success(function (response) { return response.data });
        };


        var GetColumnMinMax = function(table,column){
                return $http.get("http://localhost:26368/api/PowerInformation/GetColumnMinMax/" + table + "/" + column).then(function (response) {
                    return response.data;
                });
        };
        
        var GetSavedFilters = function(){
                return $http.get("http://localhost:26368/api/PowerInformation/GetSavedFilters").then(function (response) {
                    return response.data;
                });
        };

        var saveRow = function (row) {
            var req = {
                method: 'POST',
                url: "http://localhost:26368/api/PowerInformation/partsaverow",
                headers: {
                    'Content-Type': "application/json",
                    'dataType': "json"
                },
                data: row
            }
          return $http(req).success(function (response) { return response.data });
        };
        

        return {
            getData: getData,
            getProducts: getProducts,
            getSteppings: getSteppings,
            getMaxRecordId: getMaxRecordId,
            getData1: getData1,
            getDataBoardInformation: getDataBoardInformation,
            getDataBoardInformationHistory: getDataBoardInformationHistory,
            getDataExperimentInformation: getDataExperimentInformation,
            getPartDataByProduct: getPartDataByProduct,
            getPowerFilters: getPowerFilters,
            getAttributes: getAttributes,
            getPowerDataInformation: getPowerDataInformation,
            getPowerDataInformationbyId: getPowerDataInformationbyId,
            GetColumnValues: GetColumnValues,
            GetColumnNames: GetColumnNames ,
            getQueryData: getQueryData,
            getQueryPartData: getQueryPartData,
            GetColumnMinMax: GetColumnMinMax,
            saveFilterQuery: saveFilterQuery,
            GetSavedFilters: GetSavedFilters,
            saveRow : saveRow
          
        };
    };




    var module = angular.module("App");
    module.factory("gridService", gridService);


}());