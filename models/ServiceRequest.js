const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    requestType: {
      type: String,
      enum: ["TRIAL", "SUBSCRIPTION"],
      required: true,
    },

    planName: {
      type: String,
      trim: true,
      default: "",
    },

    planPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONTACTED", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    hiddenFromRequests: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
