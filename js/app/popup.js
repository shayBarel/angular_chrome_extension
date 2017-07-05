myApp.service('pageInfoService', function() {
    this.getInfo = function(callback) {
        var model = {};

        chrome.tabs.query({'active': true},
        function (tabs) {
            if (tabs.length > 0)
            {
                model.title = tabs[0].title;
                model.url = tabs[0].url;

                chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
                    model.pageInfos = response;
                    callback(model);
                });
            }

        });
    };
});



myApp.controller("PageController", function ($scope, $http,pageInfoService,$window) {
    $scope.message = "Hello from AngularJS";
    $scope.isConnected = true;

    // chrome.alarms.create("EbayConnection", Date.now());

    $http.get("http://frame.ebay.com/ws/eBayISAPI.dll?ShippingRateTable&flow=1&ej2child=true&ej2child=true")
        .then(function(response) {
            console.log(response);
            if (response.data.toUpperCase().indexOf( "SIGN IN OR REGISTER")>-1)
                $scope.isConnected = false
        });

    var wmd = null;
    jQuery.getJSON("js/app/countries.json", function( data ) {

    strCode = "";
    for (var key in data) {
        //console.log(key);
        if (data.hasOwnProperty(key)) {
            strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDStandard"]+"\""+").value="+"\""+ data[key]["Standard"]+"\"")+";";
            strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDStandardChange"]+"\""+").value="+"\""+ data[key]["StandardChange"]+"\"")+";";
            strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDExpedit"]+"\""+").value="+"\""+ data[key]["Expedited"]+"\"")+";";
            strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDExpeditChange"]+"\""+").value="+"\""+ data[key]["ExpeditedChange"]+"\"")+";";

            console.log(key + " -> " + data[key]["Country"]+data[key]["Standard"]);
             }
        }
    });


    $scope.operateAfter = function(){
        jQuery.getJSON("js/app/countries.json", function( data ) {
            // do whatever you want
            var strCode = "";

            for (var key in data) {
                //console.log(key);
                if (data.hasOwnProperty(key)) {
                    strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDStandard"]+"\""+").value="+"\""+ data[key]["Standard"]+"\"")+";";
                    strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDStandardChange"]+"\""+").value="+"\""+ data[key]["StandardChange"]+"\"")+";";
                    strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDExpedit"]+"\""+").value="+"\""+ data[key]["Expedited"]+"\"")+";";
                    strCode = strCode+ ("document.getElementById("+"\""+data[key]["IDExpeditChange"]+"\""+").value="+"\""+ data[key]["ExpeditedChange"]+"\"")+";";

                    console.log(strCode);
                    console.log(key + " -> " + data[key]["Country"]+data[key]["Standard"]);
                }
            }

            chrome.tabs.executeScript(null,{
                code: strCode
            });
        });
    };

    $scope.operate = function(){
        // wmd = window.open("http://frame.ebay.com/ws/eBayISAPI.dll?ShippingRateTable&flow=1&ej2child=true&ej2child=true");
        // // var html = $("#INTLPI_0_0_0").html();
        // // $(wmd.document.body).html(html);
        // wmd.onload = function(){
        //     console.log("im here");
        //     wmd.document.getElementById('INTLPI_0_0_0').value='shay';
        // }

        wmd = window.open("http://frame.ebay.com/ws/eBayISAPI.dll?ShippingRateTable&flow=1&ej2child=true&ej2child=true");
        wmd.onload = function(){
            chrome.alarms.create("EbayConnection", Date.now());

            alert("mother trucker");
                console.log("im here");
                wmd.document.getElementById('INTLPI_0_0_0').value='shay';
            }

        // wmd = $window.open("http://frame.ebay.com/ws/eBayISAPI.dll?ShippingRateTable&flow=1&ej2child=true&ej2child=true");
        // angular.element($window).bind('load', function() {
        //     alert("shay maniac");
        //     document.querySelector('#INTLPI_0_0_0').value='shay';
        //     //put you code
        //     wmd.document.getElementById('INTLPI_0_0_0').value='shay';
        // });
    };

    // wmd.onload = function(){
    //     newWindow.document.getElementById('INTLPI_0_0_0').value='shay2';
    // }
    // $scope.load = function () {
    //     alert("load event detected!");
    //     if (wmd){
    //         wmd.document.getElementById('INTLPI_0_0_0').value='shay';
    //     }
    // }




    pageInfoService.getInfo(function (info) {
        $scope.title = info.title;
        $scope.url = info.url;
        $scope.pageInfos = info.pageInfos;
        
        $scope.$apply();
    });
});



