function Header () {}

Header.prototype.renderLogin = function () {
    return '<a type="button" class="btn btn-default navbar-btn btn-sm btn-primary navbar-right js-facebook-login">Login / Sign Up</a>';
};

Header.prototype.renderUser = function (user) {
    return [
        '<ul class="nav navbar-nav pull-right">'
            , '<li class="dropdown">'
                , '<a href="#" class="dropdown-toggle" data-toggle="dropdown">'
                    , '<img alt="..." class="img-circle" height="20px" src="http://graph.facebook.com/' + user.id + '/picture?width=20&amp;height=20" width="20px"> &nbsp;'
                    , '<strong>'
                        , user.name
                        , '<strong class="caret"></strong>'
                    ,'</strong>'
                ,'</a>'
                , '<ul class="dropdown-menu">'
                    , '<li><a href="/callout">Create a callout</a></li>'
                    , '<!--li><a class=".glyphicon .glyphicon-off" href="#">My call outs</a></li-->'
                    , '<li><a href="#" class="js-facebook-logout">Logout</a></li>'
                , '</ul>'
            , '</li>'
        , '</ul>'
    ].join('\n');
};

define(function () {
    return new Header();
});
