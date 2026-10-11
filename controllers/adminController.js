const ADMIN_BASE = () => `/${process.env.ADMIN_URL}`;

// =========================================
// SHOW ADMIN LOGIN
// =========================================

exports.showLogin = (req, res) => {
  if (req.session?.isAdmin === true) {
    return res.redirect(`${ADMIN_BASE()}/dashboard`);
  }

  return res.render("admin/login", {
    title: "Admin Login | Jaipur Car Clean",
  });
};

// =========================================
// ADMIN LOGIN
// =========================================

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    req.flash("error", "Please enter your email and password.");
    return res.redirect(`${ADMIN_BASE()}/login`);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("Admin credentials are not configured.");
    req.flash("error", "Admin login is temporarily unavailable.");
    return res.redirect(`${ADMIN_BASE()}/login`);
  }

  if (
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
    password === adminPassword
  ) {
    req.session.isAdmin = true;
    req.session.adminEmail = adminEmail;

    req.flash("success", "Welcome to the admin dashboard.");

    return res.redirect(`${ADMIN_BASE()}/dashboard`);
  }

  req.flash("error", "Invalid admin email or password.");
  return res.redirect(`${ADMIN_BASE()}/login`);
};

// =========================================
// ADMIN LOGOUT
// =========================================

exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Admin logout error:", error);
      return res.redirect(`${ADMIN_BASE()}/dashboard`);
    }

    res.clearCookie("connect.sid");
    return res.redirect(`${ADMIN_BASE()}/login`);
  });
};

// =========================================
// ADMIN DASHBOARD
// =========================================

exports.dashboard = (req, res) => {
  return res.render("admin/dashboard", {
    title: "Admin Dashboard | Jaipur Car Clean",
    layout: "layouts/admin-boilerplate",
  });
};
