'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment', 'ui.bootstrap'])

    // .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {
    //     console.log("we are here");
    //     $scope.ngCart = ngCart;
    // }])

    .directive('ngcartAddtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : ["$scope", "$modal", function($scope, $modal){
                $scope.open = function (id, name, price, data) {
                    var modalInstance = $modal.open({
                        templateUrl: 'myModalContent.html',
                        controller: ["$scope", "$modalInstance", "item",function($scope, $modalInstance, item){
                            $scope.qty = 1;
                            $scope.item = item;

                            $scope.ok = function (qty) {
                                $modalInstance.close(qty);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        }],
                        resolve: {
                            item: function () {
                                return data;
                            }
                        }
                    });

                    modalInstance.result.then(function (qty) {
                      ngCart.addItem(id, name, price, qty, data);
                      console.log("bought %s", qty);
                    });
                };
            }],
            scope: {
                id:'@',
                name:'@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: 'template/ngCart/addtocart.html',
            link:function(scope, element, attrs){
                scope.attrs = attrs;

                scope.inCart = function(){
                    return  ngCart.getItemById(attrs.id);
                };

                if (scope.inCart()){
                    scope.q = ngCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt =  [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('ngcartCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: 'template/ngCart/cart.html',
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSummary', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: 'template/ngCart/summary.html'
        };
    }])

    .directive('ngcartCheckout', [function(){
        return {
            restrict : 'E',
            controller : ('CartController', ['$scope', 'ngCart', 'fulfilmentProvider', function($scope, ngCart, fulfilmentProvider) {
                $scope.ngCart = ngCart;

                $scope.checkout = function () {
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    var promise = fulfilmentProvider.checkout();
                    console.log(promise);
                }
            }]),
            scope: {
                service:'@',
                settings:'='
            },
            transclude: true,
            templateUrl: 'template/ngCart/checkout.html'
        };
    }]);