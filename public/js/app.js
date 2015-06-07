'use strict';

/*
 * SYNOP DECODER & QUERY SYSTEM
 * angular app script
 * Phoenix Nemo <i@phoenixlzx.com>
 * */


angular.module('synop', [
    'flash'
])
    .controller('synopController', [
        '$scope',
        '$http',
        '$interval',
        '$timeout',
        function ($scope, $http, $interval, $timeout) {

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

            $scope.addReport = function() {
                $http({
                    method: 'POST',
                    url: '/add',
                    data: {
                        station: $scope.stationid,
                        time: $scope.reporttime,
                        report: $scope.report
                    },
                    header: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .success(function(data) {
                        $scope.addsuccess = true;
                        $timeout(function() {
                            $scope.addsuccess = false;
                        }, 3000);
                        // reset these to blank
                        $scope.stationid = $scope.reporttime = $scope.report = '';
                    })
                    .error(function(data) {
                        $scope.addfailed = true;
                        $scope.errdata = data;
                        $timeout(function() {
                            $scope.addfailed = false;
                        }, 3000);
                    })
            };

            $scope.queryReport = function() {
                $scope.querysuccess = $scope.querynores = $scope.queryfailed = false;
                $http.get('/q/' + $scope.querytime + '/' + $scope.queryid)
                    .success(function(data) {
                        if (data) {
                            $scope.querydata = data;
                            $scope.querysuccess = true;
                        } else {
                            $scope.querynores = true;
                        }
                    })
                    .error(function() {
                        $scope.queryfailed = true;
                    })
            };

            $scope.emptyReport = function() {
                $scope.querytime = $scope.queryid = '';
                $scope.querysuccess = false;
            }

        }]);
