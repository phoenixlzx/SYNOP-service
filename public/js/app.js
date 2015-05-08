'use strict';

/*
 * SYNOP DECODER & QUERY SYSTEM
 * angular app script
 * Phoenix Nemo <i@phoenixlzx.com>
 * */


angular.module('synop', [])
    .controller('synopController', [
        '$scope',
        '$http',
        '$interval',
        function ($scope, $http, $interval) {

            var getRecent = function () {
                $http.get('/recent')
                    .success(function (data) {
                        if (data[0]) {
                            $scope.recentReports = data;
                        } else {
                            $scope.recentReports = [{
                                time: '暂无数据',
                                station: '暂无数据',
                                report: '暂无数据'
                            }];
                        }
                    })
                    .error(function () {
                        $scope.recentReports = [{
                            time: '数据异常',
                            station: '数据异常',
                            report: '数据异常'
                        }];
                    });
            };
            $interval(getRecent, 5000);

        }]);
