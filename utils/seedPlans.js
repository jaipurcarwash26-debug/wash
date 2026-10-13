const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Plan = require("../models/Plan");

// Load .env from project root
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const monthlyServices = [
  "Exterior Cleaning Every Day",
  "Total of 2 Interior Cleaning Sessions in 30 Days",
  "2 Full Deep Wash Every 30 Days",
  "tyre Polish Once in 30 Days",
  "Door-to-Door Service",
  "Customer Support",
];

const plans = [
  // =====================================================
  // ONE-TIME SERVICES
  // =====================================================

  {
    name: "Single Exterior Wash",

    price: 89,

    durationInDays: 1,

    description: "One-time exterior car wash.",

    services: [
      "Exterior Car Wash",
      "Dust & Dirt Removal",
      "Basic Exterior Cleaning",
      "Door-to-Door Service",
    ],
  },

  {
    name: "Interior + Exterior Wash",

    price: 129,

    durationInDays: 1,

    description: "Complete one-time interior and exterior car wash.",

    services: [
      "Exterior Car Wash",
      "Interior Cleaning",
      "Dust & Dirt Removal",
      "Basic Interior Cleaning",
      "Door-to-Door Service",
    ],
  },

  // =====================================================
  // MONTHLY SUBSCRIPTION PLANS
  // =====================================================

  {
    name: "Hatchback",

    price: 899,

    durationInDays: 30,

    description: "30-day regular car care plan for hatchback cars.",

    services: monthlyServices,
  },

  {
    name: "Sedan",

    price: 949,

    durationInDays: 30,

    description: "30-day regular car care plan for sedan cars.",

    services: monthlyServices,
  },

  {
    name: "SUV",

    price: 999,

    durationInDays: 30,

    description: "30-day regular car care plan for SUV cars.",

    services: monthlyServices,
  },

  {
    name: "Premium",

    price: 1099,

    durationInDays: 30,

    description: "30-day premium car care plan for premium vehicles.",

    services: monthlyServices,
  },
];

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    await Plan.deleteMany({});

    await Plan.insertMany(plans);

    console.log("Plans inserted successfully.");

    console.log("\n==============================");
    console.log("ONE-TIME SERVICES");
    console.log("==============================");
    console.log("Single Exterior Wash - ₹89");
    console.log("Interior + Exterior Wash - ₹139");

    console.log("\n==============================");
    console.log("MONTHLY PLANS");
    console.log("==============================");
    console.log("Hatchback - ₹899");
    console.log("Sedan - ₹949");
    console.log("SUV - ₹999");
    console.log("Premium - ₹1099");

    console.log("\n==============================");
    console.log("MONTHLY SERVICE SCHEDULE");
    console.log("==============================");
    console.log("Exterior Cleaning: Every day");
    console.log("Tyre Polish: 1 Times / 30 days");
    console.log("Interior Cleaning: 2 Times / 30 days");
    console.log("Full Deep Wash: 2 Time / 30 days");
    console.log("==============================\n");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Plan seeding failed:", error);

    process.exit(1);
  }
};

seedPlans();
