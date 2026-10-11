const express = require("express");

const router = express.Router();

const trialController = require("../controllers/trialController");

// GET TRIAL PAGE

router.get("/book", trialController.showTrialForm);

// POST TRIAL FORM

router.post("/book", trialController.createTrialRequest);

module.exports = router;
