const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const ServiceRequest = require("../models/ServiceRequest");

// =========================================
// SHOW TRIAL FORM
// =========================================

exports.showTrialForm = (req, res) => {
  return res.render("trial/book-trial", {
    title: "Book a Trial | Jaipur Car Wash",
  });
};

// =========================================
// CREATE TRIAL REQUEST
// =========================================

exports.createTrialRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      name,
      phone,
      email,
      address,
      carLocation,
      mapLocationUrl,
      carNumber,
      carName,
    } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !carLocation?.trim() ||
      !carNumber?.trim() ||
      !carName?.trim()
    ) {
      req.flash("error", "Please fill all required fields.");
      return res.redirect("/trial/book");
    }

    const normalizedCarNumber = carNumber.replace(/\s+/g, "").toUpperCase();

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const normalizedAddress = typeof address === "string" ? address.trim() : "";

    const normalizedMapUrl =
      typeof mapLocationUrl === "string" ? mapLocationUrl.trim() : "";

    await session.withTransaction(async () => {
      // =========================================
      // 1. CHECK EXISTING CUSTOMER
      // =========================================

      const customer = await Customer.findOne({
        carNumber: normalizedCarNumber,
      }).session(session);

      // =========================================
      // 2. CHECK EXISTING TRIAL OR SUBSCRIPTION
      // =========================================

      if (customer) {
        const existingRequest = await ServiceRequest.findOne({
          customerId: customer._id,
          requestType: { $in: ["TRIAL", "SUBSCRIPTION"] },
        }).session(session);

        if (existingRequest) {
          const error = new Error(
            existingRequest.requestType === "TRIAL"
              ? "You have already taken or requested a trial for this car."
              : "This car already has a subscription request.",
          );

          error.code = "TRIAL_NOT_ALLOWED";
          throw error;
        }
      }

      // =========================================
      // 3. CREATE OR UPDATE CUSTOMER
      // =========================================

      const customerData = {
        name: name.trim(),
        phone: phone.trim(),
        email: normalizedEmail,
        address: normalizedAddress,
        carNumber: normalizedCarNumber,
        carName: carName.trim().toUpperCase(),
        carLocation: carLocation.trim(),
        mapLocationUrl: normalizedMapUrl,
      };

      let savedCustomer;

      if (customer) {
        Object.assign(customer, customerData);
        savedCustomer = await customer.save({ session });
      } else {
        [savedCustomer] = await Customer.create([customerData], { session });
      }

      // =========================================
      // 4. CREATE TRIAL REQUEST
      // =========================================

      await ServiceRequest.create(
        [
          {
            customerId: savedCustomer._id,
            requestType: "TRIAL",
            status: "PENDING",
          },
        ],
        { session },
      );
    });

    req.flash(
      "success",
      "Your trial request has been submitted successfully. Our team will contact you shortly.",
    );

    return res.redirect("/trial/book");
  } catch (error) {
    console.error("Trial request error:", error);

    if (error.code === "TRIAL_NOT_ALLOWED") {
      req.flash("error", error.message);
    } else if (error.code === 11000) {
      req.flash(
        "error",
        "This car number is already registered. Please try again.",
      );
    } else {
      req.flash("error", "Something went wrong. Please try again.");
    }

    return res.redirect("/trial/book");
  } finally {
    await session.endSession();
  }
};
