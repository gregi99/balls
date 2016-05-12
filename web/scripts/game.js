'use strict';

var app = angular.module('gameApp', []);

app.controller('GameController', GameController);

GameController.$inject = ['$scope', '$http'];

function GameController($scope, $http) {
    var vm = $scope;

    vm.inputNumber = 0;
    vm.userNumbers = [];
    vm.appState    = 'choice';

    vm.addNumber = function (requestedNumber) {
        vm.userNumbers.push(requestedNumber);
    };

    vm.getNumbers = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/get-balls',
            data: {
                numbers: vm.userNumbers
            }
        }).then(function successCallback(response) {
            var baskets = JSON.parse(response.data);

            console.log(baskets);
        });
    }
    
}