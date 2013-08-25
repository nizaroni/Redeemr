var $hiddenContainer;

function activateFriendSelectButton (fb, $) {
    $('.js-facebook-friends').on('click', function (event) {
        event.preventDefault();
        fb.selectFriends({
            message: 'I’m calling you out.'
            , max_recipients: 1
        }, function (request) {
            fb.api('/' + request.recipients[0], function (friend) {
                friend.request = request.id;
                displayFriend($, friend);
            });
        });
    });
}

function displayFriend ($, friend) {
    var friendHtml = [
        '<div class="roundbox js-friend-reset">'
        , '<img src="//graph.facebook.com/' + friend.id + '/picture" alt="Profle picture for ' + friend.name + '" />'
        , '<h4>' + friend.name + '</h4>'
        , '</div>'
    ].join('');
    createHidden($, 'callout-fb-id', friend.id);
    createHidden($, 'callout-fb-name', friend.name);
    createHidden($, 'callout-fb-request', friend.request);

    $('.js-friend-reset').remove();
    $('.js-friend-hide')
        .hide()
        .after(friendHtml)
    ;
}

function createHidden ($, name, value) {
    if (!$hiddenContainer) {
        $hiddenContainer = $('.js-insert-hidden');
    }
    $hiddenContainer.append('<input type="hidden" name="' + name + '" value="' + value + '" />');
}

define([ 'fb', 'jquery', 'mainify' ], function (fb, $, mainify) {
    return mainify(function () {
        var loc = window.location
            , homeUrl = loc.protocol + '//' + loc.host
            , channelUrl = homeUrl + '/'
        ;
        fb.init('504481939631364', channelUrl);
        fb.on('login', function activateFacebookUi (e, userId) {
            createHidden($, 'callout-user-id', userId);
            activateFriendSelectButton(fb, $);
        });
        fb.on('logout', function redirectToHome () {
            window.location = homeUrl;
        });
        fb.checkLogin();
    });
});
