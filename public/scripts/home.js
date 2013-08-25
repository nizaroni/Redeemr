define([ 'fb', 'jquery', 'mainify' ], function (fb, $, mainify) {
    return mainify(function () {
        var loc = window.location
            , channelUrl = loc.protocol + '//' + loc.host + '/channel'
        ;
        fb.init('504481939631364', channelUrl);
        fb.on('login', function redirectToNewCallout () {
            window.location = loc.protocol + '//' + loc.host + '/callout';
        });
        fb.on('logout', function activateLoginButton () {
            $('.js-facebook-login').on('click', function (event) {
                event.preventDefault();
                fb.login();
            });
        });
        fb.checkLogin();
    });
});
