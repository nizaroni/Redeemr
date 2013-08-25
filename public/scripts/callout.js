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
                , '<a href="#" class="pull-right js-undo-selection"><span class="glyphicon glyphicon-trash"> </span></a>'
                , '<img width="200px" height="200px" class="img-thumbnail" src="//graph.facebook.com/' + friend.id + '/picture?width=200&amp;height=200" alt="Profle picture for ' + friend.name + '" />'
                , '<br><br><h4>' + friend.name + '</h4>'
                , '<p><a href="#" class="js-undo-selection">Wrong friend? Select another friend</a></p>'
            , '</div>'
        ].join(' ')
        , $friendHide = $('.js-friend-hide')
        , $friend
    ;
    createHidden($, 'callout-fb-id', friend.id);
    createHidden($, 'callout-fb-name', friend.name);
    createHidden($, 'callout-fb-request', friend.request);

    $('.js-friend-reset').remove();
    $friendHide
        .hide()
        .after(friendHtml)
    ;
    $('.js-undo-selection').on('click', function (event) {
        event.preventDefault();
        $('.js-friend-reset').remove();
        $hiddenContainer.find('[name^=callout-fb]').remove();
        $friendHide.show();
    });
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
        , redemptionUrl = loc.protocol + '//' + loc.host + '/redemption/' + response.calloutId
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
        , name: me.name.split(' ')[0] + ' has called you out on Redeemr!'
        , description: 'Go and redeem yourself by donating to a local non-profit organization.'
        , picture: loc.protocol + '//' + loc.host + '/images/256.jpg'
    }, redirectToRedemption);
}

function createHidden ($, name, value) {
    if (!$hiddenContainer) {
        $hiddenContainer = $('.js-insert-hidden');
    }
    $hiddenContainer.find('[name=' + name + ']').remove();
    $hiddenContainer.append('<input type="hidden" name="' + name + '" value="' + value + '" />');
}

define([ 'fb', 'header', 'jquery', 'mainify' ], function (fb, header, $, mainify) {
    return mainify(function () {
        var loc = window.location
            , homeUrl = loc.protocol + '//' + loc.host
            , channelUrl = homeUrl + '/'
            , $loginReact = $('.js-login-react')
        ;
        fb.init('504481939631364', channelUrl);
        fb.on('authenticated', function activateFacebookUi (e, userId) {
            fb.api('/me', function (response) {
                me = response;
                createHidden($, 'callout-user-id', me.id);
                createHidden($, 'callout-user-name', me.name);
                activateFriendSelectButton(fb, $);
                activateSubmitButton(fb, $);
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
        fb.on('logout', function redirectToHome () {
            window.location = homeUrl;
        });
        fb.checkLogin();
    });
});
