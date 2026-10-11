const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    durationInDays: {
      type: Number,
      required: true,
      default: 30,
    },

    description: {
      type: String,
      trim: true,
    },

    services: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Plan", planSchema);
