const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Plan = require("../models/Plan");
const ServiceRequest = require("../models/ServiceRequest");

// =========================================
// SHOW SUBSCRIPTION FORM
// =========================================

exports.showSubscriptionForm = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({
      price: 1,
    });

    return res.render("subscription/book-subscription", {
      title: "Book Subscription | Jaipur Car Clean",
      plans,
    });
  } catch (error) {
    console.error("Subscription page error:", error);

    req.flash("error", "Unable to load subscription plans.");
    return res.redirect("/");
  }
};

// =========================================
// CREATE SUBSCRIPTION REQUEST
// =========================================

exports.createSubscriptionRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      name,
      email,
      phone,
      address,
      carLocation,
      mapLocationUrl,
      carNumber,
      carName,
      planId,
    } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !carLocation?.trim() ||
      !carNumber?.trim() ||
      !carName?.trim() ||
      !planId
    ) {
      req.flash("error", "Please fill all required fields.");
      return res.redirect("/subscription/book");
    }

    if (!mongoose.isValidObjectId(planId)) {
      req.flash("error", "Please select a valid subscription plan.");
      return res.redirect("/subscription/book");
    }

    const normalizedCarNumber = carNumber.replace(/\s+/g, "").toUpperCase();

    const normalizedPhone = phone.trim();
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedAddress = typeof address === "string" ? address.trim() : "";
    const normalizedMapUrl =
      typeof mapLocationUrl === "string" ? mapLocationUrl.trim() : "";

    const plan = await Plan.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      req.flash("error", "Selected subscription plan is not available.");
      return res.redirect("/subscription/book");
    }

    await session.withTransaction(async () => {
      let customer = await Customer.findOne({
        carNumber: normalizedCarNumber,
      }).session(session);

      const customerData = {
        name: name.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        address: normalizedAddress,
        carNumber: normalizedCarNumber,
        carName: carName.trim().toUpperCase(),
        carLocation: carLocation.trim(),
        mapLocationUrl: normalizedMapUrl,
      };

      if (customer) {
        Object.assign(customer, customerData);
        await customer.save({ session });
      } else {
        [customer] = await Customer.create([customerData], { session });
      }

      await ServiceRequest.create(
        [
          {
            customerId: customer._id,
            requestType: "SUBSCRIPTION",
            planName: plan.name,
            planPrice: plan.price,
            status: "PENDING",
          },
        ],
        { session },
      );
    });

    req.flash(
      "success",
      "Your subscription request has been submitted successfully. Our team will contact you shortly.",
    );

    return res.redirect("/subscription/book");
  } catch (error) {
    console.error("Subscription request error:", error);

    if (error.code === 11000) {
      req.flash(
        "error",
        "This car number is already registered. Please try again.",
      );
    } else {
      req.flash("error", "Something went wrong. Please try again.");
    }

    return res.redirect("/subscription/book");
  } finally {
    await session.endSession();
  }
};
