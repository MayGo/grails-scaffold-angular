function color_change(self)
{
    if (!self.hasClass('active')) {
        self.siblings().removeClass('active');

        var skin = self.closest('.skin'),
            color = self.attr('class') ? '-' + self.attr('class') : '',
            checkbox = skin.data('icheckbox'),
            radio = skin.data('iradio'),
            checkbox_default = 'icheckbox_minimal',
            radio_default = 'iradio_minimal';

        if (skin.hasClass('skin-square')) {
            checkbox_default = 'icheckbox_square', radio_default = 'iradio_square';
            checkbox == undefined && (checkbox = 'icheckbox_square-green', radio = 'iradio_square-green');
        };

        if (skin.hasClass('skin-flat')) {
            checkbox_default = 'icheckbox_flat', radio_default = 'iradio_flat';
            checkbox == undefined && (checkbox = 'icheckbox_flat-red', radio = 'iradio_flat-red');
        };

        if (skin.hasClass('skin-line')) {
            checkbox_default = 'icheckbox_line', radio_default = 'iradio_line';
            checkbox == undefined && (checkbox = 'icheckbox_line-blue', radio = 'iradio_line-blue');
        };

        checkbox == undefined && (checkbox = checkbox_default, radio = radio_default);

        skin.find('input, .skin-states .state').each(function() {
            var element = $(this).hasClass('state') ? $(this) : $(this).parent(),
                element_class = element.attr('class').replace(checkbox, checkbox_default + color).replace(radio, radio_default + color);

            element.attr('class', element_class);
        });

        skin.data('icheckbox', checkbox_default + color);
        skin.data('iradio', radio_default + color);
        self.addClass('active');
    };
}
