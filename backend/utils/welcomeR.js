const welcomePage = (req, res, next) => {
    res.render("welcome");
}
const logoutPage = (req, res, next) => {
    req.logOut(function (err) {
        if (err) throw err;
        req.session.destroy(function (err) {
            if (err) throw err;
            res.redirect('/');
        })
    });
}
const homePage = async(req, res, next) => {
    res.render('home', {
        name: req.user.name.givenName,
        userID: req.user.id
    });
}
module.exports = {
    welcomePage: welcomePage,
    logoutPage: logoutPage,
    homePage: homePage
}; 