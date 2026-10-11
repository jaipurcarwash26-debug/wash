const express = require("express");
const path = require("path");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo;
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// VIEW ENGINE
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// EJS LAYOUT
// ===============================

app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// SESSION
// ===============================

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// ===============================
// FLASH MESSAGES
// ===============================

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isCustomer = req.session && req.session.isCustomer === true;

  next();
});

// ===============================
// ROUTES
// ===============================

const publicRoutes = require("./routes/publicRoutes");
const trialRoutes = require("./routes/trialRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminRequestsRoutes = require("./routes/adminRequestsRoutes");

// Public website
app.use("/", publicRoutes);

// Customer request forms
app.use("/trial", trialRoutes);
app.use("/subscription", subscriptionRoutes);

// Admin login and dashboard
app.use(`/${process.env.ADMIN_URL}`, adminRoutes);

// Admin trial and subscription requests
app.use(`/${process.env.ADMIN_URL}/dashboard/requests`, adminRequestsRoutes);

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Jaipur Car Wash running on http://localhost:${PORT}`);
});
