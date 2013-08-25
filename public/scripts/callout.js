var $hiddenContainer
    , me
;

function activateFriendSelectButton (fb, $) {
    $('.js-facebook-friends').on('click', function (event) {
        event.preventDefault();
        fb.selectFriends({
            message: 'I’m calling you out.'
            , max_recipients: 1
        }, function (request) {
            if (!request) {
                return;
            }
            fb.api('/' + request.recipients[0], function (friend) {
                friend.request = request.id;
                displayFriend($, friend);
            });
        });
    });
}

function displayFriend ($, friend) {
    var friendHtml = [
        '<div class="text-center roundbox js-friend-reset" style="height:309px !important;">'
        , '<a href="#" class="pull-right"><span class="glyphicon glyphicon-trash"> </span></a>'
        , '<img width="200px" height="200px" class="img-thumbnail" src="//graph.facebook.com/' + friend.id + '/picture" alt="Profle picture for ' + friend.name + '" />'
        , '<br><br><h4>' + friend.name + '</h4>'
        , '<p><a href="#">Wrong friend? Select another friend</a></p>'
        , '</div>'
    ].join(' ');
    createHidden($, 'callout-fb-id', friend.id);
    createHidden($, 'callout-fb-name', friend.name);
    createHidden($, 'callout-fb-request', friend.request);

    $('.js-friend-reset').remove();
    $('.js-friend-hide')
        .hide()
        .after(friendHtml)
    ;
    $('.js-submit-callout').data('friend', friend.id);
}

function activateSubmitButton (fb, $) {
    var $form = $('.js-submit-callout');
    $form.on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/callout'
            , type: 'POST'
            , data: $form.serialize()
        }).then(function (response) {
            calloutCreated(fb, response);
        });
    });
}

function calloutCreated (fb, response) {
    var loc = window.location
        , redemptionUrl = loc.protocol + '//' + loc.host + '/redemption/' + response.calloutId + '/redeemer'
        , friend = $('.js-submit-callout').data('friend')
    ;
    function redirectToRedemption () {
        window.location = redemptionUrl;
    }

    if (!friend) {
        return redirectToRedemption();
    }
    fb.share({
        to: friend
        , link: redemptionUrl
        , name: me.name + ' has called you out!'
        , description: $('.js-grab-description').val()
        // , picture: ?
    }, redirectToRedemption);
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
            fb.api('/me', function (response) {
                me = response;
                createHidden($, 'callout-user-id', me.id);
                createHidden($, 'callout-user-name', me.name);
                activateFriendSelectButton(fb, $);
                activateSubmitButton(fb, $);
            });
        });
        fb.on('logout', function redirectToHome () {
            window.location = homeUrl;
        });
        fb.checkLogin();
    });
});
