/*global define*/

define(function() {
    'use strict';

    function ctrl($scope, $stateParams, $rootScope, $modal, ListService) {
        $scope.toleranceChart = {};
        $scope.architectureChart = {};
        $scope.usesChart = {};
        $scope.functionsChart = {};
        $scope.timingsChart = {};

        function init() {
            if(ListService.selectedList && !$stateParams.list) {
                $scope.list = ListService.selectedList;
                $scope.makePlantCharts(ListService.selectedList.Plants);
            }else{
                console.log('Getting list');
                var listData = ListService.getList($stateParams.listId, $rootScope.token);
                listData.then(function(result) {
                    ListService.selectedList = result;
                    $scope.list = result;
                    // Make charts
                    $scope.makePlantCharts(result.Plants);
                });
            }
        }

        $scope.isUserOwner = function() {
           return $scope.list.User == $rootScope.user._id;
        }

        $scope.makePlantCharts = function(plants) {
            $scope.makeToleranceChart(plants);
            $scope.makeArchitectureChart(plants);
            $scope.makeUsesChart(plants);
            $scope.makeFunctionsChart(plants);
            $scope.makeTimingsChart(plants);
        }

        $scope.makeToleranceChart = function(plants) {
            var rows = [];
            angular.forEach(plants, function(plant) {
                var obj = {
                    c:[]
                };

                // Name
                if(plant.CommonName) {
                    obj.c.push({v: plant.CommonName});
                }else{
                    obj.c.push({v: plant.LatinName});
                }

                obj.c.push({v: plant.Hardyness});
                obj.c.push({v: plant.FrostTender});
                //obj.c.push({v: plant.Range});
                //obj.c.push({v: plant.Habitat});
                obj.c.push({v: plant.Shade});
                obj.c.push({v: plant.Moisture});
                obj.c.push({v: plant.Drought});
                obj.c.push({v: plant.Soil});
                obj.c.push({v: plant.WellDrained});
                obj.c.push({v: plant.PoorSoil});
                obj.c.push({v: plant.HeavyClay});
                obj.c.push({v: plant.PH});
                obj.c.push({v: plant.Acid});
                obj.c.push({v: plant.Alkaline});
                obj.c.push({v: plant.Saline});
                obj.c.push({v: plant.Pollution});
                obj.c.push({v: plant.Wind});


                rows.push(obj);
                
            });

            $scope.toleranceChart.data = {"cols": [
                {id: "name", label: "Name", type: "string"},
                {id: "hardiness", label: "Hardiness", type: "string"},
                {id: "FrostTender", label: "FrostTender", type: "string"},
                //{id: "Range", label: "Range", type: "string"},
                //{id: "Habitat", label: "Habitat", type: "string"},
                {id: "Shade", label: "Shade", type: "string"},
                {id: "Moisture", label: "Moisture", type: "string"},
                {id: "Drought", label: "Drought", type: "string"},
                {id: "Soil", label: "Soil", type: "string"},
                {id: "WellDrained", label: "WellDrained", type: "string"},
                {id: "PoorSoil", label: "PoorSoil", type: "string"},
                {id: "HeavyClay", label: "HeavyClay", type: "string"},
                {id: "PH", label: "PH", type: "string"},
                {id: "Acid", label: "Acid", type: "string"},
                {id: "Alkaline", label: "Alkaline", type: "string"},
                {id: "Saline", label: "Saline", type: "string"},
                {id: "Pollution", label: "Pollution", type: "string"},
                {id: "Wind", label: "Wind", type: "string"}
            ], "rows": rows };

            $scope.toleranceChart.type = "Table";
            $scope.toleranceChart.options = {
                'title': 'Tolerances'
            }
        }

        $scope.makeArchitectureChart = function(plants) {
            var rows = [];
            console.log('Making architectureChart');
            angular.forEach(plants, function(plant) {
                console.log(plants, plant);
                var obj = {
                    c:[]
                };

                // Name
                if(plant.CommonName) {
                    obj.c.push({v: plant.CommonName});
                }else{
                    obj.c.push({v: plant.LatinName});
                }

                obj.c.push({v: plant.Height});
                obj.c.push({v: plant.Width});
                obj.c.push({v: plant.Habit});
                obj.c.push({v: plant.DeciduousEvergreen});
                obj.c.push({v: plant.GrowthRate});
                obj.c.push({v: plant.FlowerType});
                obj.c.push({v: plant.SelfFertile});

                rows.push(obj);
                
            });

            $scope.architectureChart.data = {"cols": [
                {id: "name", label: "Name", type: "string"},
                {id: "Height", label: "Height", type: "string"},
                {id: "Width", label: "Width", type: "string"},
                {id: "Habit", label: "Habit", type: "string"},
                {id: "DeciduousEvergreen", label: "DeciduousEvergreen", type: "string"},
                {id: "GrowthRate", label: "GrowthRate", type: "string"},
                {id: "FlowerType", label: "FlowerType", type: "string"},
                {id: "SelfFertile", label: "SelfFertile", type: "string"}

            ], "rows": rows };

            $scope.architectureChart.type = "Table";
            $scope.architectureChart.options = {
                'title': 'Architecture'
            }
        }

        $scope.makeUsesChart = function(plants) {
            var rows = [];
            console.log('Making usesChart');
            angular.forEach(plants, function(plant) {
                var obj = {
                    c:[]
                };

                // Name
                if(plant.CommonName) {
                    obj.c.push({v: plant.CommonName});
                }else{
                    obj.c.push({v: plant.LatinName});
                }

                //obj.c.push({v: plant.OverallRating});
                obj.c.push({v: plant.MedicinalRating});
                obj.c.push({v: plant.Rating});
                obj.c.push({v: plant.PalatableRating});
                obj.c.push({v: plant.UseRating});
                //obj.c.push({v: plant.GrowRating});
                //obj.c.push({v: plant.Medicinal});
                //obj.c.push({v: plant.InCultivation});
                obj.c.push({v: plant.Scented});

                rows.push(obj);
                
            });

            $scope.usesChart.data = {"cols": [
                {id: "name", label: "Name", type: "string"},
                //{id: "OverallRating", label: "OverallRating", type: "string"},
                {id: "MedicinalRating", label: "MedicinalRating", type: "string"},
                {id: "Rating", label: "Rating", type: "string"},
                {id: "PalatableRating", label: "PalatableRating", type: "string"},
                {id: "UseRating", label: "UseRating", type: "string"},
                //{id: "GrowRating", label: "GrowRating", type: "string"},
                //{id: "Medicinal", label: "Medicinal", type: "string"},
                //{id: "InCultivation", label: "InCultivation", type: "string"},
                {id: "Scented", label: "Scented", type: "string"}
            ], "rows": rows };

            $scope.usesChart.type = "Table";
            $scope.usesChart.options = {
                'title': 'Uses'
            }
        }

        $scope.makeFunctionsChart = function(plants) {
            var rows = [];
            console.log('Making functionsChart');
            angular.forEach(plants, function(plant) {
                var obj = {
                    c:[]
                };

                // Name
                if(plant.CommonName) {
                    obj.c.push({v: plant.CommonName});
                }else{
                    obj.c.push({v: plant.LatinName});
                }

                obj.c.push({v: plant.NitrogenFixer});
                obj.c.push({v: plant.Pollinators});
                obj.c.push({v: plant.Wildlife});

                rows.push(obj);
                
            });

            $scope.functionsChart.data = {"cols": [
                {id: "name", label: "Name", type: "string"},
                {id: "NitrogenFixer", label: "NitrogenFixer", type: "string"},
                {id: "Pollinators", label: "Pollinators", type: "string"},
                {id: "Wildlife", label: "Wildlife", type: "string"}

            ], "rows": rows };

            $scope.functionsChart.type = "Table";
            $scope.functionsChart.options = {
                'title': 'Functions'
            }
        }

        $scope.makeTimingsChart = function(plants) {
            var rows = [];
            console.log('Making timingsChart');
            angular.forEach(plants, function(plant) {
                // Name
                var name = plant.LatinName;
                if(plant.CommonName) {
                    name = plant.CommonName;
                }

                if(plant.FloweringTimeStart) {
                    var obj = {
                        c:[
                            {v: name},
                            {v: 'Flowering'},
                            {v: new Date(2015, plant.FloweringTimeStart, 1)},
                            {v: new Date(2015, (parseInt(plant.FloweringTimeEnd)+1), 0)}
                        ]
                    };

                     rows.push(obj);
                }
                

               
                if(plant.InLeafStart) {
                    var obj = {
                        c:[
                            {v: name},
                            {v: 'In Leaf'},
                            {v: new Date(2015, plant.InLeafStart, 1)},
                            {v: new Date(2015, (parseInt(plant.InLeafEnd)+1), 0)}
                        ]
                    };

                    rows.push(obj);
                }

                if(plant.SeedRipensStart) {
                    var obj = {
                        c:[
                            {v: name},
                            {v: 'Seed Ripening'},
                            {v: new Date(2015, plant.SeedRipensStart, 1)},
                            {v: new Date(2015, (parseInt(plant.SeedRipensEnd)+1), 0)}
                        ]
                    };

                    rows.push(obj);
                }
                
            });

            console.log(rows);

            $scope.timingsChart.data = {"cols": [
                {id: "name", label: "Name", type: "string"},
                {id: "Event", label: "Event", type: "string"},
                {id: "Start", label: "Start", type: "date"},
                {id: "End", label: "End", type: "date"},

            ], "rows": rows };

            $scope.timingsChart.type = "Timeline";
            $scope.timingsChart.options = {
                'title': 'Timings'
            }
        }

        init();

    }

    ctrl.$inject = ['$scope', '$stateParams', '$rootScope', '$modal', 'ListService'];
    return ctrl;

});
