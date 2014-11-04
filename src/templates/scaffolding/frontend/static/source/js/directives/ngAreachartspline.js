App.directive("ngAreachartspline", function(){
    return {
        link: function($scope, element, attributes){
            //BEGIN AREA CHART SPLINE
            var d6_1 = [["Jan", 67],["Feb", 91],["Mar", 36],["Apr", 150],["May", 28],["Jun", 123],["Jul", 38]];
            var d6_2 = [["Jan", 59],["Feb", 49],["Mar", 45],["Apr", 94],["May", 76],["Jun", 22],["Jul", 31]];
            $.plot("#area-chart-spline", [{
                data: d6_1,
                label: "Upload",
                color: "#ffce54"
            },{
                data: d6_2,
                label: "Download",
                color: "#01b6ad"
            }], {
                series: {
                    lines: {
                        show: !1
                    },
                    splines: {
                        show: !0,
                        tension: 0.4,
                        lineWidth: 2,
                        fill: 0.8
                    },
                    points: {
                        show: !0,
                        radius: 4
                    }
                },
                grid: {
                    borderColor: "#fafafa",
                    borderWidth: 1,
                    hoverable: !0
                },
                tooltip: !0,
                tooltipOpts: {
                    content: "%x : %y",
                    defaultTheme: true
                },
                xaxis: {
                    tickColor: "#fafafa",
                    mode: "categories"
                },
                yaxis: {
                    tickColor: "#fafafa"
                },
                shadowSize: 0
            });
            //END AREA CHART SPLINE
        }
    };
});