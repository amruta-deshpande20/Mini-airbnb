const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index route(show all hotels)
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/listing.ejs", { allListings });
  }),
);

//create route
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);

//update route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;

    // Ensure image is treated as an object with a url property
    if (typeof listing.image === "string") {
      listing.image = { url: listing.image };
    }

    await Listing.findByIdAndUpdate(id, { ...listing });
    res.redirect(`/listings/${id}`);
  }),
);

//New route(add a new place)
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route (show details of hotel by id)
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  }),
);

//delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

module.exports = router;
