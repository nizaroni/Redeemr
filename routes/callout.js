/*
 * GET callout page
 */

module.exports = function (req, res) {
    res.render('callout', { title: 'Callout your friends?' });
};