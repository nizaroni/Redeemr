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

function activateSubmitButton (fb, $, Parallel) {
    var $form = $('.js-submit-callout');
    $form.on('submit', function (event) {
        var parallel = new Parallel(2, calloutCreated.bind({ fb: fb }));
        event.preventDefault();
        fb.api('/me', function (me) {
            parallel('me', me);
        });
        $.ajax({
            url: '/callout'
            , type: 'POST'
            , data: $form.serialize()
        }).then(function (response) {
            parallel('response', response);
        });
    });
}

function calloutCreated (results) {
    var loc = window.location
        , redemptionUrl = loc.protocol + '//' + loc.host + '/redemption/' + results.response.calloutId + '/redeemer'
    ;
    this.fb.share({
        to: $('.js-submit-callout').data('friend')
        , link: redemptionUrl
        , name: results.me.name + ' has called you out!'
        , description: $('.js-grab-description').val()
        // , picture: ?
    }, function () {
        window.location = redemptionUrl;
    });
}

function createHidden ($, name, value) {
    if (!$hiddenContainer) {
        $hiddenContainer = $('.js-insert-hidden');
    }
    $hiddenContainer.append('<input type="hidden" name="' + name + '" value="' + value + '" />');
}

define([ 'fb', 'jquery', 'mainify', 'parallel' ], function (fb, $, mainify, Parallel) {
    return mainify(function () {
        var loc = window.location
            , homeUrl = loc.protocol + '//' + loc.host
            , channelUrl = homeUrl + '/'
        ;
        fb.init('504481939631364', channelUrl);
        fb.on('login', function activateFacebookUi (e, userId) {
            createHidden($, 'callout-user-id', userId);
            activateFriendSelectButton(fb, $);
            activateSubmitButton(fb, $, Parallel);
        });
        fb.on('logout', function redirectToHome () {
            window.location = homeUrl;
        });
        fb.checkLogin();
    });
});
