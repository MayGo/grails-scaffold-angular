App.directive("ngZabutocalendar", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            //BEGIN CALENDAR
            $("#my-calendar").zabuto_calendar({
                language: "en"
            });
            //END CALENDAR
        }
    };
});