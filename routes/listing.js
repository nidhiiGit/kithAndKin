const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingControllers = require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingControllers.index))
.post(validateListing, wrapAsync(listingControllers.createListing));

//creating a form to create new list
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.route("/:id")
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingControllers.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.deleteList)
)
.get(wrapAsync(listingControllers.showListing));


//renders an update form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderUpdateForm)
);

module.exports = router;
