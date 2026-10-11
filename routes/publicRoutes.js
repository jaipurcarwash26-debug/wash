const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Jaipur Car Wash",
  });
});

module.exports = router;
