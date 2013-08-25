define([ 'fb', 'header', 'jquery', 'mainify' ], function (fb, header, $, mainify) {
    return mainify(function () {
        var loc = window.location
            , channelUrl = loc.protocol + '//' + loc.host + '/channel'
            , $loginReact = $('.js-login-react')
        ;
        fb.init('504481939631364', channelUrl);
        fb.on('authenticated', function activateCalloutButton () {
            fb.api('/me', function (me) {
                $loginReact
                    .empty()
                    .append(header.renderUser(me))
                ;
                $('.js-login-show').show();
                $('.js-facebook-logout').on('click', function (event) {
                    event.preventDefault();
                    fb.logout();
                });
            });
        });
        fb.on('logout', function activateLoginButton () {
            $loginReact
                .empty()
                .append(header.renderLogin())
                .find('.js-facebook-login')
                    .on('click', function (event) {
                        event.preventDefault();
                        fb.login();
                    })
            ;
            $('.js-login-show').hide();
        });
        fb.checkLogin();
    });
});
