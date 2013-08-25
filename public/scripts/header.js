function Header () {}

Header.prototype.renderLogin = function () {
    return '<a type="button" class="btn btn-default navbar-btn btn-sm btn-primary navbar-right js-facebook-login">Login / Sign Up</a>';
};

Header.prototype.renderUser = function (user) {
    return [
        '<ul class="nav navbar-nav pull-right">'
            , '<li class="dropdown">'
                , '<a data-toggle="dropdown" href="#">'
                    , '<img alt="..." class="img-circle" height="20px" src="http://graph.facebook.com/' + user.id + '/picture?width=20&amp;height=20" width="20px"> &nbsp;'
                    , '<strong>'
                        , user.name
                        , '<strong class="caret"></strong>'
                    ,'</strong>'
                ,'</a>'
                , '<ul class="dropdown-menu">'
                    , '<li><strong><a href="#">Create a callout</a></strong></li>'
                    , '<li><strong><a class=".glyphicon .glyphicon-off" href="#">My call outs</a></strong></li>'
                    , '<li><strong><a href="#">Logout</a></strong></li>'
                , '</ul>'
            , '</li>'
        , '</ul>'
    ].join('\n');
};

define(function () {
    return new Header();
});