const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");
const requireAdmin = require("../middleware/adminAuth");

// =========================================
// ADMIN LOGIN
// =========================================

router.get("/login", adminController.showLogin);

router.post("/login", adminController.login);

// =========================================
// ADMIN DASHBOARD
// =========================================

router.get("/dashboard", requireAdmin, adminController.dashboard);

// =========================================
// CUSTOMER REQUESTS PAGE
// =========================================

const adminRequestsController = require("../controllers/adminRequestsController");

router.get(
  "/dashboard/requests",
  requireAdmin,
  adminRequestsController.showRequests,
);

router.post(
  "/dashboard/requests/:requestId/status",
  requireAdmin,
  adminRequestsController.updateRequestStatus,
);

router.post(
  "/dashboard/requests/:requestId/delete",
  requireAdmin,
  adminRequestsController.deleteRequest,
);

// =========================================
// ADMIN LOGOUT
// =========================================

router.post("/logout", requireAdmin, adminController.logout);

module.exports = router;
