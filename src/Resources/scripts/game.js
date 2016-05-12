'use strict';

var app = angular.module('gameApp', [
    '720kb.tooltips'
]);

app.controller('GameController', GameController);

GameController.$inject = ['$scope', '$http'];

function GameController($scope, $http) {
    var basketObject = {
            balls: ['?'],
            allUserBalls: false,
            onlyOneBall: false
        };

    $scope.inputNumber  = 0;
    $scope.userNumbers  = [];
    $scope.appState     = 'dataGathering';
    $scope.innerBaskets = [];
    $scope.outerBaskets = [];
    $scope.choiceState  = {};
    $scope.numberError  = false;

    function initializeBaskets() {
        for (var i=0; i<15; i++) {
            $scope.innerBaskets.push(angular.copy(basketObject));
            $scope.outerBaskets.push(angular.copy(basketObject));
        }
    }

    $scope.addNumber = function (requestedNumber) {
        var number = parseInt(requestedNumber);

        if (number < 0 || number > 999 || -1 !== $scope.userNumbers.indexOf(number)) {
            $scope.numberError = true;
        } else {
            $scope.numberError = false;
            $scope.userNumbers.push(number);
        }
    };

    $scope.onBlur = function($event) {
        console.log($event);
    };
    
    $scope.getNumbers = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/get-balls',
            data: {
                numbers: $scope.userNumbers
            }
        }).then(function successCallback(response) {
            var baskets = JSON.parse(response.data);

            for (var i=0; i<15; i++) {
                $scope.innerBaskets[i] = baskets[i];
            }

            for (var k=15; k<30; k++) {
                $scope.outerBaskets[k - 15] = baskets[k];
            }
            
            $scope.appState = 'choice';
        });
    };

    $scope.setChoiceState = function (choiceState) {
        console.log(choiceState);

        if ($scope.appState == 'choice') {
            $scope.choiceState = choiceState;
        }
    };

    $scope.canHideBasketElement = function (basket) {
        return basket.allUserBalls == false && $scope.choiceState == 'allUserBalls' || basket.onlyOneBall == false && $scope.choiceState == 'onlyOneBall' ||  $scope.choiceState == 'hideAll';
    };

    $scope.endRound = function () {
        $scope.appState     = 'end';
        $scope.choiceState  = 'hideAll';
    };

    $scope.resetGame = function () {
        $scope.appState     = 'dataGathering';
        $scope.choiceState  = null;
        $scope.userNumbers  = [];
        $scope.innerBaskets = [];
        $scope.outerBaskets = [];
        
        initializeBaskets();
    };

    initializeBaskets();
    
}