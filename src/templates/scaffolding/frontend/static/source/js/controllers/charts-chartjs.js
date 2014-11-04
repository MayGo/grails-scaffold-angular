App.controller('ChartsChartJsController', function ($scope, $routeParams){
    setTimeout(function(){
        var lineChartData = {
            labels : ["January","February","March","April","May","June","July"],
            datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data : [65,59,90,81,56,55,40]
                },
                {
                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,1)",
                    pointStrokeColor : "#fff",
                    data : [28,48,40,19,96,27,100]
                }
            ]
        };

        new Chart(document.getElementById("line-chart").getContext("2d")).Line(lineChartData);
        //END LINE CHART

        //BEGIN BAR CHART
        var barChartData = {
            labels : ["January","February","March","April","May","June","July"],
            datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    data : [65,59,90,81,56,55,40]
                },
                {
                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,1)",
                    data : [28,48,40,19,96,27,100]
                }
            ]

        };

        new Chart(document.getElementById("bar-chart").getContext("2d")).Bar(barChartData);
        //END BAR CHART

        //BEGIN RADAR CHART
        var radarChartData = {
            labels : ["Eating","Drinking","Sleeping","Designing","Coding","Partying","Running"],
            datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data : [65,59,90,81,56,55,40]
                },
                {
                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,1)",
                    pointStrokeColor : "#fff",
                    data : [28,48,40,19,96,27,100]
                }
            ]

        };

        new Chart(document.getElementById("radar-chart").getContext("2d")).Radar(radarChartData,{scaleShowLabels : false, pointLabelFontSize : 10});
        //END RADAR CHART

        //BEGIN POLAR AREA CHART
        var chartData = [
            {
                value : Math.random(),
                color: "#D97041"
            },
            {
                value : Math.random(),
                color: "#C7604C"
            },
            {
                value : Math.random(),
                color: "#21323D"
            },
            {
                value : Math.random(),
                color: "#9D9B7F"
            },
            {
                value : Math.random(),
                color: "#7D4F6D"
            },
            {
                value : Math.random(),
                color: "#584A5E"
            }
        ];

        new Chart(document.getElementById("polar-area-chart").getContext("2d")).PolarArea(chartData);
        //END POLAR AREA CHART

        //BEGIN PIE CHART
        var pieData = [
            {
                value: 30,
                color:"#F38630"
            },
            {
                value : 50,
                color : "#E0E4CC"
            },
            {
                value : 100,
                color : "#69D2E7"
            }

        ];

        new Chart(document.getElementById("pie-chart").getContext("2d")).Pie(pieData);
        //END PIE CHART

        //BEGIN DOUGHNUT CHART
        var doughnutData = [
            {
                value: 30,
                color:"#F7464A"
            },
            {
                value : 50,
                color : "#46BFBD"
            },
            {
                value : 100,
                color : "#FDB45C"
            },
            {
                value : 40,
                color : "#949FB1"
            },
            {
                value : 120,
                color : "#4D5360"
            }

        ];

        new Chart(document.getElementById("doughnut-chart").getContext("2d")).Doughnut(doughnutData);
    }, 50);

    //BEGIN PORTLET
    $(".portlet").each(function(index, element) {
        var me = $(this);
        $(">.portlet-header>.tools>i", me).click(function(e){
            if($(this).hasClass('fa-chevron-up')){
                $(">.portlet-body", me).slideUp('fast');
                $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }
            else if($(this).hasClass('fa-chevron-down')){
                $(">.portlet-body", me).slideDown('fast');
                $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
            }
            else if($(this).hasClass('fa-cog')){
                //Show modal
            }
            else if($(this).hasClass('fa-refresh')){
                //$(">.portlet-body", me).hide();
                $(">.portlet-body", me).addClass('wait');

                setTimeout(function(){
                    //$(">.portlet-body>div", me).show();
                    $(">.portlet-body", me).removeClass('wait');
                }, 1000);
            }
            else if($(this).hasClass('fa-times')){
                me.remove();
            }
        });
    });
    //END PORTLET
});