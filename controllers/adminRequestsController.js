const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const ServiceRequest = require("../models/ServiceRequest");

const ADMIN_BASE = () => `/${process.env.ADMIN_URL}`;

// =========================================
// SHOW ALL REQUESTS
// =========================================

exports.showRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      hiddenFromRequests: { $ne: true },
    })
      .populate("customerId")
      .sort({ createdAt: -1 });

    return res.render("admin/requests/index", {
      title: "Customer Requests | Admin",
      requests,
      layout: "layouts/admin-boilerplate",
    });
  } catch (error) {
    console.error("Requests page error:", error);

    req.flash("error", "Unable to load requests.");
    return res.redirect(`${ADMIN_BASE()}/dashboard`);
  }
};

// =========================================
// UPDATE REQUEST STATUS
// =========================================

exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "CONTACTED", "APPROVED", "REJECTED"];

    if (!mongoose.isValidObjectId(requestId)) {
      req.flash("error", "Invalid request.");
      return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
    }

    if (!allowedStatuses.includes(status)) {
      req.flash("error", "Invalid request status.");
      return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
    }

    const request = await ServiceRequest.findByIdAndUpdate(
      requestId,
      { $set: { status } },
      { new: true, runValidators: true },
    );

    if (!request) {
      req.flash("error", "Request not found.");
      return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
    }

    req.flash("success", "Request status updated successfully.");
    return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
  } catch (error) {
    console.error("Update request status error:", error);

    req.flash("error", "Unable to update request status.");
    return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
  }
};

// =========================================
// DELETE REQUEST
// =========================================

exports.deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!mongoose.isValidObjectId(requestId)) {
      req.flash("error", "Invalid request.");
      return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
    }

    const request = await ServiceRequest.findById(requestId);

    if (!request) {
      req.flash("error", "Request not found.");
      return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
    }

    request.hiddenFromRequests = true;
    await request.save();

    req.flash("success", "Request removed from the list successfully.");
    return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
  } catch (error) {
    console.error("Hide request error:", error);

    req.flash("error", "Unable to remove request from the list.");
    return res.redirect(`${ADMIN_BASE()}/dashboard/requests`);
  }
};
