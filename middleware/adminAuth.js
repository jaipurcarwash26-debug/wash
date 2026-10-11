// =========================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =========================================

const requireAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }

  return res.redirect(`/${process.env.ADMIN_URL}/login`);
};

module.exports = requireAdmin;
