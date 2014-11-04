App.controller('ExtraSignupController', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $("body>.default-page #signup-form").remove();

    $('input[type="checkbox"]').iCheck({
        checkboxClass: 'icheckbox_minimal-grey',
        increaseArea: '20%' // optional
    });
    $('input[type="radio"]').iCheck({
        radioClass: 'iradio_minimal-grey',
        increaseArea: '20%' // optional
    });

    $("#signup-form").validate({
        rules:{
            username:
            {
                required: true
            },
            email:
            {
                required: true,
                email: true
            },
            password:
            {
                required: true,
                minlength: 3,
                maxlength: 20
            },
            passwordConfirm:
            {
                required: true,
                minlength: 3,
                maxlength: 20,
                equalTo: '#password'
            },
            firstname:
            {
                required: true
            },
            lastname:
            {
                required: true
            },
            gender:
            {
                required: true
            }
        },

        // Messages for form validation
        messages:
        {
            login:
            {
                required: 'Please enter your login'
            },
            email:
            {
                required: 'Please enter your email address',
                email: 'Please enter a VALID email address'
            },
            password:
            {
                required: 'Please enter your password'
            },
            passwordConfirm:
            {
                required: 'Please enter your password one more time',
                equalTo: 'Please enter the same password as above'
            },
            firstname:
            {
                required: 'Please select your first name'
            },
            lastname:
            {
                required: 'Please select your last name'
            },
            gender:
            {
                required: 'Please select your gender'
            }
        },

        // Do not change code below
        errorPlacement: function(error, element)
        {
            error.insertAfter(element.parent());
        }
    });
});