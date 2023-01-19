const registerGoogle = (req, res, next) => {
    res.redirect('/auth/google');
}

module.exports = {
    registerGoogle: registerGoogle
}; 