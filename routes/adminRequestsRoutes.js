const express = require("express");

const router = express.Router();

const adminRequestsController = require("../controllers/adminRequestsController");
const requireAdmin = require("../middleware/adminAuth");

// =========================================
// SHOW ALL CUSTOMER REQUESTS
// =========================================

router.get("/", requireAdmin, adminRequestsController.showRequests);

// =========================================
// UPDATE REQUEST STATUS
// =========================================

router.post(
  "/:requestId/status",
  requireAdmin,
  adminRequestsController.updateRequestStatus,
);

// =========================================
// DELETE REQUEST AND UNUSED CUSTOMER
// =========================================

router.post(
  "/:requestId/delete",
  requireAdmin,
  adminRequestsController.deleteRequest,
);

module.exports = router;
