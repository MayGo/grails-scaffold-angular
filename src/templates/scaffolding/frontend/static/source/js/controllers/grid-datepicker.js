App.controller('GridDatepickerController', function ($scope, $routeParams){
    $('#grid-datepicker').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel',
        //save plugin state
        storage: 'localstorage', //'', 'cookies', 'localstorage'
        storageName: 'date-picker-range-filter',
        controlTypes: {
            'date-picker-range-filter': {
                className: 'DatePickerRangeFilter',
                options: {
                    datepicker: function(input, options){
                        //set options
                        options.dateFormat = 'mm/dd/yy';
                        input.datepicker(options);
                    }
                }
            }
        }
    });
});