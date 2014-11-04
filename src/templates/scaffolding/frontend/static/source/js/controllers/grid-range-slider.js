App.controller('GridRangeSliderController', function ($scope, $routeParams){
    $('#grid-range-slider').jplist({
        itemsBox: '.list',
        itemPath: '.list-item',
        panelPath: '.jplist-panel',
        controlTypes: {
            //likes range slider
            'range-slider-likes': {
                className: 'RangeSlider',
                options: {
                    //jquery ui range slider
                    ui_slider: function($slider, $prev, $next){
                        $slider.slider({
                            min: 0,
                            max: 350,
                            range: true,
                            values: [0, 350],
                            slide: function(event, ui){
                                $prev.text(ui.values[0] + ' likes');
                                $next.text(ui.values[1] + ' likes');
                            }
                        });
                    },
                    set_values: function($slider, $prev, $next){
                        $prev.text($slider.slider('values', 0) + ' likes');
                        $next.text($slider.slider('values', 1) + ' likes');
                    }
                }
            },

            //prices range slider
            'range-slider-prices': {
                className: 'RangeSlider',
                options:{
                    //jquery ui range slider
                    ui_slider: function($slider, $prev, $next){
                        $slider.slider({
                            min: 0,
                            max: 100,
                            range: true,
                            values: [0, 100],
                            slide: function(event, ui){
                                $prev.text('$' + ui.values[0]);
                                $next.text('$' + ui.values[1]);
                            }
                        });
                    },
                    set_values: function($slider, $prev, $next){
                        $prev.text('$' + $slider.slider('values', 0));
                        $next.text('$' + $slider.slider('values', 1));
                    }
                }
            },

            //views range slider
            'range-slider-views':{
                className: 'RangeSlider',
                options: {
                    //jquery ui range slider
                    ui_slider: function($slider, $prev, $next){
                        $slider.slider({
                            min: 0,
                            max: 4000,
                            range: true,
                            values: [0, 4000],
                            slide: function(event, ui){
                                $prev.text(ui.values[0] + ' views');
                                $next.text(ui.values[1] + ' views');
                            }
                        });
                    },
                    set_values: function($slider, $prev, $next){
                        $prev.text($slider.slider('values', 0) + ' views');
                        $next.text($slider.slider('values', 1) + ' views');
                    }
                }
            }
        }
    });
});