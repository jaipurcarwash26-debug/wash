const express = require("express");

const router = express.Router();

const subscriptionController = require("../controllers/subscriptionController");

router.get("/book", subscriptionController.showSubscriptionForm);

router.post("/book", subscriptionController.createSubscriptionRequest);

module.exports = router;
