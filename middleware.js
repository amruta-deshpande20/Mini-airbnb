module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirecturl save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to add new listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirecturl = req.session.redirectUrl;
  }
  next();
};
