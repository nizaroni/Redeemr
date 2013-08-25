function startApp ($) {
    var action = $('body').data('action').trim();
    require([ action ], function (pageModule) {
        if (pageModule) {
            pageModule.start();
        }
    });
}

require.config({
    baseUrl: '/scripts'
    , shim: {
        'facebook': { export: 'FB' }
        , 'bootstrap': [ 'jquery' ]
    }
    , paths: {
        'bootstrap': 'bootstrap.min'
        , 'facebook': '//connect.facebook.net/en_US/all'
        , 'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min'
    }
});

require([ 'jquery', 'bootstrap' ], function ($) {
    $(document).ready(startApp($));
});
